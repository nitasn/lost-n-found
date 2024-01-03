import { getAuth } from "firebase/auth";

/**
 * @param {string} path
 * @param {object} jsonBody
 */
export async function serverPOST(path, jsonBody, { withAuth = true } = {}) {
  const url = await _buildUrl(path, { withAuth });

  return await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jsonBody),
  });
}

/**
 * @param {string} path
 */
export async function serverGET(path, { withAuth = false } = {}) {
  const url = await _buildUrl(path, { withAuth });

  return await fetch(url);
}

async function _buildUrl(path, { withAuth = false } = {}) {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  const url = process.env.ServerUrl + path;

  if (!withAuth) return url;

  if (getAuth().currentUser == null) {
    throw new Error("Cannot send request with auth: user is not signed in.");
  }

  const token = await getAuth().currentUser.getIdToken();

  return `${url}?token=${token}`;
}
