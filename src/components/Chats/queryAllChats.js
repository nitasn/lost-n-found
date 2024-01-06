import { query, collection, where, getFirestore, Query } from 'firebase/firestore';
import { app } from '../../../firebase.config'

/**
 * All conversations some user participates in.
 * @param {string} uid
 * @returns {Query}
 */
export default function queryAllChats(uid) {
  const firestore = getFirestore(app);
  const chatsRef = collection(firestore, "chats");

  return query(chatsRef, where("participants", "array-contains", uid));
}