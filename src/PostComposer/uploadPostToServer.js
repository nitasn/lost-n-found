import { serverPOST } from "../js/sendServerReq";
import { addPostToGlobalState } from "../ts/posts";

export async function uploadPostToServer({ type, title, text, region, picsUrls }) {
  const latLong = region && [region.latitude, region.longitude];

  const data = { type, title, text, latLong, picsUrls };
  const response = await serverPOST("/api/upload-post", data, { withAuth: true });

  const didSuccessfullyUpload = response.ok;

  if (didSuccessfullyUpload) {
    response.json().then(addPostToGlobalState);
  }

  return didSuccessfullyUpload;
}
