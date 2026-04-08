async function parseResponse(response) {
  const isJson = (response.headers.get("content-type") || "").includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (typeof payload === "object" && payload?.error) {
      const details = payload?.details ? Object.values(payload.details).join("\n") : "";
      const rawError = details ? `${payload.error}\n${details}` : payload.error;

      if (String(rawError).includes("auth/network-request-failed")) {
        throw new Error(
          "Firebase Authentication could not reach the network. Check your internet connection, firewall/proxy, and make sure localhost is authorized in Firebase Authentication settings."
        );
      }

      throw new Error(rawError);
    }

    const rawError = typeof payload === "string" ? payload : `HTTP ${response.status}`;

    if (String(rawError).includes("auth/network-request-failed")) {
      throw new Error(
        "Firebase Authentication could not reach the network. Check your internet connection, firewall/proxy, and make sure localhost is authorized in Firebase Authentication settings."
      );
    }

    throw new Error(rawError);
  }

  return payload;
}

function handleSignupFetchError(error, roleLabel) {
  console.error(`${roleLabel} signup error:`, error);

  if (error instanceof TypeError) {
    return new Error(
      `Unable to reach the ${roleLabel.toLowerCase()} signup service. Please make sure the backend server is running.`
    );
  }

  if (String(error?.message || "").includes("auth/network-request-failed")) {
    return new Error(
      "Firebase Authentication could not reach the network. Check your internet connection, firewall/proxy, and make sure localhost is authorized in Firebase Authentication settings."
    );
  }

  return error;
}

export async function signupCustomer(payload) {
  try {
    const response = await fetch("/api/customer/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return await parseResponse(response);
  } catch (error) {
    throw handleSignupFetchError(error, "Customer");
  }
}

export async function signupDesigner(payload) {
  try {
    const response = await fetch("/api/designer/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return await parseResponse(response);
  } catch (error) {
    throw handleSignupFetchError(error, "Designer");
  }
}
