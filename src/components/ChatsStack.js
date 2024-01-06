import { useAuth } from "../login-social/login";
import ChatScreen from "./Chats/ChatScreen";
import { useCollection } from "react-firebase-hooks/firestore";
import queryAllChats from "./Chats/queryAllChats";
import { LoadingText } from "./misc";
import { FlatList, Text } from "react-native";

export default function ChatsStack() {
  const [user] = useAuth();
  const myUid = user?.uid;

  const [value, loading, error] = useCollection(queryAllChats(myUid));

  if (!user) {
    return <SimpleText text="Please Sign In in order to Chat" />;
  }

  if (loading) return <LoadingText text="Loading Chats..." />;
  if (error) return <ErrorMsg text={`Error: ${error.message}`} />;

  const chats = value.docs;

  if (!chats) {
    return <SimpleText text="You can 'Tap to Chat' on posts." />;
  }

  return (
    <FlatList
      data={chats}
      renderItem={({ item: doc }) => {
        return <Text>{JSON.stringify(doc.data())}</Text>;
      }}
      keyExtractor={(doc) => doc.id}
    />
  );
}

function SimpleText({ text }) {
  return <Text style={{ textAlign: "center", padding: 12 }}>{text}</Text>;
}

const ErrorMsg = ({ text }) => (
  <View style={{ padding: 12 }}>
    <Text>{text}</Text>
  </View>
);
