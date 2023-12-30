import { sendPostRequestToServer } from "../js/sendServerReq";
import { addPostToGlobalState } from "../js/useAllPosts";

export async function uploadPostToServer({ type, title, text, region, picsUrls }) {
  const latLong = region && [region.latitude, region.longitude];

  const data = { type, title, text, latLong, picsUrls };
  const response = await sendPostRequestToServer("/api/upload-post", data, { withAuth: true });

  const didSuccessfullyUpload = response.ok;

  try {
    const post = await response.json();
    addPostToGlobalState(post);
  }
  catch {
    // mmm idk
  }

  return didSuccessfullyUpload;
}
