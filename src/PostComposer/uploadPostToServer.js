import { sleep } from "../js/utils";

export async function uploadPostToServer({ type, title, text, region, picsUrls }) {
  const latLong = region && [region.latitude, region.longitude];

  console.log(JSON.stringify({
    type,
    title,
    text,
    latLong,
    picsUrls
  }, null, 2));

  await sleep(1500);
  return true;
}
