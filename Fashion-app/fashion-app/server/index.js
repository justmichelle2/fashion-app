import express from "express";
import cors from "cors";

const app = express();
const port = Number(process.env.PORT || 8787);

const firebaseApiKey = process.env.FIREBASE_API_KEY || "AIzaSyAXNSgViiorRBNB11VgZozq2fWNtZt8jig";
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "fashion-app-a5b92";

app.use(cors());
app.use(express.json());

const isValidEmail = (email) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
const hasMinPasswordLength = (password) => typeof password === "string" && password.length >= 6;

const buildValidationError = (details) => ({
  success: false,
  error: "Validation failed",
  details,
});

const mapFirebaseAuthError = (code) => {
  switch (code) {
    case "EMAIL_EXISTS":
      return { status: 409, message: "This email is already registered." };
    case "INVALID_EMAIL":
      return { status: 400, message: "Invalid email address." };
    case "WEAK_PASSWORD : Password should be at least 6 characters":
    case "WEAK_PASSWORD":
      return { status: 400, message: "Password must be at least 6 characters long." };
    default:
      return { status: 500, message: code || "Failed to create account." };
  }
};

const isNetworkFailure = (error) =>
  error?.code === "auth/network-request-failed" ||
  error?.name === "TypeError" ||
  /fetch failed|network request failed/i.test(String(error?.message || ""));

const buildNetworkFailureError = (message) => {
  const error = new Error(message);
  error.status = 503;
  return error;
};

async function createFirebaseAuthUser({ email, password }) {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );

    const payload = await response.json();

    if (!response.ok) {
      const code = payload?.error?.message;
      const mapped = mapFirebaseAuthError(code);
      const error = new Error(mapped.message);
      error.status = mapped.status;
      throw error;
    }

    return payload;
  } catch (error) {
    if (isNetworkFailure(error)) {
      throw buildNetworkFailureError(
        "Firebase Authentication could not reach the network. Check your internet connection, firewall/proxy, and make sure localhost is authorized in Firebase Authentication settings."
      );
    }

    throw error;
  }
}

function toFirestoreFields(profile) {
  const now = new Date().toISOString();

  const fields = {
    uid: { stringValue: profile.uid },
    email: { stringValue: profile.email },
    displayName: { stringValue: profile.displayName || "" },
    phone: { stringValue: profile.phone || "" },
    userType: { stringValue: profile.userType },
    createdAt: { timestampValue: now },
    updatedAt: { timestampValue: now },
  };

  if (profile.businessName) {
    fields.businessName = { stringValue: profile.businessName };
  }

  if (profile.location) {
    fields.location = { stringValue: profile.location };
  }

  return fields;
}

async function createFirestoreProfile({ idToken, profile }) {
  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/users/${profile.uid}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ fields: toFirestoreFields(profile) }),
      }
    );

    if (!response.ok) {
      const payload = await response.text();
      const error = new Error(payload || "Failed to save user profile.");
      error.status = 500;
      throw error;
    }
  } catch (error) {
    if (isNetworkFailure(error)) {
      throw buildNetworkFailureError(
        "Firebase Firestore could not reach the network while saving the profile. Check your internet connection, firewall/proxy, and that Firebase is reachable."
      );
    }

    throw error;
  }
}

async function signupHandler(req, res, role) {
  const {
    email = "",
    password = "",
    name = "",
    phone = "",
    businessName = "",
    location = "",
  } = req.body || {};

  const trimmedEmail = String(email).trim();
  const trimmedName = String(name).trim();
  const trimmedPhone = String(phone).trim();
  const trimmedBusinessName = String(businessName).trim();
  const trimmedLocation = String(location).trim();

  const details = {};

  if (!trimmedEmail) details.email = "Email is required.";
  else if (!isValidEmail(trimmedEmail)) details.email = "Email format is invalid.";

  if (!password) details.password = "Password is required.";
  else if (!hasMinPasswordLength(password)) details.password = "Password must be at least 6 characters long.";

  if (role === "customer") {
    if (!trimmedName) details.name = "Full name is required.";
  }

  if (role === "designer") {
    if (!trimmedName) details.fullName = "Full name is required.";
    if (!trimmedBusinessName) details.businessName = "Business name is required.";
  }

  if (Object.keys(details).length > 0) {
    return res.status(400).json(buildValidationError(details));
  }

  try {
    const authPayload = await createFirebaseAuthUser({
      email: trimmedEmail,
      password,
    });

    const profile = {
      uid: authPayload.localId,
      email: trimmedEmail,
      displayName: trimmedName,
      phone: trimmedPhone,
      userType: role,
      businessName: trimmedBusinessName,
      location: trimmedLocation,
    };

    await createFirestoreProfile({
      idToken: authPayload.idToken,
      profile,
    });

    return res.status(201).json({
      success: true,
      user: {
        uid: profile.uid,
        email: profile.email,
        userType: profile.userType,
      },
      message: `${role} account created successfully.`,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Failed to create account.",
    });
  }
}

app.post("/api/customer/signup", (req, res) => signupHandler(req, res, "customer"));
app.post("/api/designer/signup", (req, res) => signupHandler(req, res, "designer"));

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
