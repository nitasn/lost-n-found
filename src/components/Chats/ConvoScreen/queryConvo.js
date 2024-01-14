import { collection, query, orderBy, getFirestore } from "firebase/firestore";
import { app } from '../../../../firebase.config'

export default function queryConvo(myUid, theirUid) {
  const firestore = getFirestore(app);
  const chatId = [myUid, theirUid].sort().join("_");

  const messagesRef = collection(firestore, `chats/${chatId}/messages`);
  return query(messagesRef, orderBy("timestamp", "asc"));
}
