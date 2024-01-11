import { LoadingText } from "../misc";
import { Button, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useAllChats from "./useAllChats";
import globalStyles from "../../js/globalStyles";
import { useNavigation } from "@react-navigation/native";

export default function ChatsScreen() {
  const [issue, conversations] = useAllChats();

  if (issue instanceof Error) return <ErrorMsg text={issue.message} />;
  if (issue === "loading") return <LoadingText text="Loading Chats..." />;
  if (issue === "no-user") return <SimpleText text="Please Sign In to Send Messages!" />;
  if (issue === "no-chats") return <SimpleText text="To chat, tap 'Tap to Chat' on any post!" />;

  return (
    <FlatList
      style={styles.chatsList}
      data={conversations}
      renderItem={({ item: chat }) => <ChatListItem {...chat} />}
      keyExtractor={(chat) => chat._id}
    />
  );
}

function SimpleText({ text }) {
  return <Text style={{ textAlign: "center", padding: 12 }}>{text}</Text>;
}

const ErrorMsg = ({ text }) => (
  <View style={{ padding: 12 }}>
    <Text>Error: {text}</Text>
  </View>
);

function ChatListItem({ _id, name, profilePicUrl }) {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate("ConversationScreen", { uid: _id });
  };

  return (
    <TouchableOpacity style={styles.chatListItem} onPress={onPress}>
      <Image style={styles.profilePic} source={{ uri: profilePicUrl }} />
      <Text style={styles.contactName}>{name}</Text>
    </TouchableOpacity>
  );
}
const profilePicSize = 40;

const styles = StyleSheet.create({
  chatsList: {
    padding: 12,
    gap: 12,
  },
  chatListItem: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
    alignItems: "center",
    ...globalStyles.shadow_1,
    borderRadius: 5,
    ...globalStyles.veryThinBorder,
  },
  profilePic: {
    width: profilePicSize,
    height: profilePicSize,
    borderRadius: profilePicSize / 2,
  },
  contactName: {
    letterSpacing: 0.1,
  }
});
