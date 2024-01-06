import { collection, query, orderBy, getFirestore } from "firebase/firestore";
import { app } from '../../../firebase.config'

export default function queryConversation(uid_a, uid_b) {
  const firestore = getFirestore(app);
  const chatId = [uid_a, uid_b].sort().join("_");

  const messagesRef = collection(firestore, `chats/${chatId}/messages`);
  return query(messagesRef, orderBy("timestamp", "asc"));
}
