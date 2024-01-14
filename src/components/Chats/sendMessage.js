import { doc, serverTimestamp, getFirestore, collection, runTransaction } from "firebase/firestore";
import { app } from '../../../firebase.config'

/**
 * @returns {Promise<null | Error>}
 */
export default async function sendMessage(myUid, theirUid, text) {
  const firestore = getFirestore(app);
  const chatId = [myUid, theirUid].sort().join("_");
  const chatPath = `chats/${chatId}`;
  const messagesPath = `${chatPath}/messages`;

  try {
    await runTransaction(firestore, async (transaction) => {
      const chatRef = doc(firestore, chatPath);
      const chat = await transaction.get(chatRef);

      if (!chat.exists()) {
        transaction.set(chatRef, { participants: [myUid, theirUid] });
      }

      const messagesRef = collection(firestore, messagesPath);

      transaction.set(doc(messagesRef), {
        senderId: myUid,
        receiverId: theirUid,
        text,
        timestamp: serverTimestamp(),
      });
    });

    return null;
  } 
  catch (error) {
    return error;
  }
}
