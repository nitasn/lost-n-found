import { getAuth } from "firebase/auth";

/**
 * @param {string} path
 * @param {object} jsonBody
 */
export async function serverPOST(path, jsonBody, { withAuth = true } = {}) {
  const [url, headers] = await _buildReq(path, { withAuth });

  return await fetch(url, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonBody),
  });
}

/**
 * @param {string} path
 */
export async function serverGET(path, { withAuth = false } = {}) {
  const [url, headers] = await _buildReq(path, { withAuth });

  return await fetch(url, {
    method: "GET",
    headers,
  });
}

async function _buildReq(path, { withAuth } = {}) {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  const url = process.env.ServerUrl + path;
  const headers = {};

  if (withAuth) {
    const user = getAuth().currentUser;

    if (!user) {
      throw new Error("Cannot send request with auth: user is not signed in.");
    }

    const token = await user.getIdToken();
    headers["Authorization"] = `Bearer ${token}`;
  }

  return [url, headers];
}
