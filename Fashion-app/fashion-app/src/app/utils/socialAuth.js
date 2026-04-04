import { signInWithPopup, signInWithRedirect } from "firebase/auth";

export async function signInWithPopupOrRedirect(auth, provider, options = {}) {
  const { redirectStateKey } = options;

  try {
    return { mode: "popup", result: await signInWithPopup(auth, provider) };
  } catch (error) {
    const code = error?.code || "";
    const canFallback =
      code === "auth/popup-blocked" ||
      code === "auth/popup-closed-by-user" ||
      code === "auth/cancelled-popup-request" ||
      code === "auth/operation-not-supported-in-this-environment";

    if (!canFallback) {
      throw error;
    }

    if (redirectStateKey) {
      sessionStorage.setItem(redirectStateKey, "1");
    }

    await signInWithRedirect(auth, provider);
    return { mode: "redirect" };
  }
}
