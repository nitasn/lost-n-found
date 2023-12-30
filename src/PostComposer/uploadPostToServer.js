import { sleep } from "../js/utils";
import { getAuth } from "firebase/auth";

export async function uploadPostToServer({ type, title, text, region, picsUrls }) {
  const latLong = region && [region.latitude, region.longitude];

  console.log(JSON.stringify({
    type,
    title,
    text,
    latLong,
    picsUrls
  }, null, 2));

  const auth = getAuth();
  console.log(auth.currentUser);

  const token = await getAuth().currentUser.getIdToken();
  const res = await fetch(`${process.env.ServerUrl}/api/sign-up?token=${token}`);
  const json = await res.json();

  await sleep(1500);
  return true;
}
