import { useCollection } from "react-firebase-hooks/firestore";
import { serverPOST } from "../../js/sendServerReq";
import useSWRImmutable from "swr/immutable";

import { app } from "../../../firebase.config";
import { query, collection, where, getFirestore } from "firebase/firestore";

export default function useAllChats(myUid) {
  const [fireResult, fireLoading, fireError] = useCollection(queryChatsOf(myUid));

  const uids = fireResult?.docs
    .map((chat) => chat.data().participants.find((uid) => uid !== myUid))
    .filter((uid) => typeof uid === "string");

  const key = uids?.length ? ["/api/get-users", ...uids] : null;
  const { data, isLoading: swrLoading, error: swrError } = useSWRImmutable(key, fetchUsersData);

  return {
    users: data,
    loading: fireLoading || swrLoading,
    error: fireError || swrError,
  };
}

async function fetchUsersData([path, ...uids]) {
  const res = await serverPOST(path, { uids }, { withAuth: false });
  return await res.json();
}

const chatsRef = collection(getFirestore(app), "chats");
const queryChatsOf = (uid) => query(chatsRef, where("participants", "array-contains", uid));

// todo: replace useSWRImmutable with a hook that uses localStorage while loading
