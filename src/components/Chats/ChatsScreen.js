import { LoadingText, ErrorMsg } from "../misc";
import { Button, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useAllChats from "./useAllChats";
import globalStyles from "../../js/globalStyles";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../login-social/login";

export default function ChatsScreen() {
  const [user] = useAuth();

  if (!user) return <SimpleText text="Please Sign In to Send Messages!" />;

  return <ChatsScreenAuthed myUid={user.uid} />;
}

function ChatsScreenAuthed({ myUid }) {
  const { users, error, loading } = useAllChats(myUid);

  return (
    <>
      {loading && <LoadingText text="Loading Chats..." />}
      {error && <ErrorMsg text={error.message} />}
      <FlatList
        style={styles.chatsList}
        data={users}
        renderItem={({ item: user }) => <ChatListItem {...user} />}
        keyExtractor={(user) => user._id}
      />
    </>
  );
}

function SimpleText({ text }) {
  return <Text style={{ textAlign: "center", padding: 12 }}>{text}</Text>;
}

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
const profilePicSize = 36;

const styles = StyleSheet.create({
  chatsList: {
    padding: 12,
  },
  chatListItem: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
    alignItems: "center",
    ...globalStyles.shadow_1,
    borderRadius: 5,
    ...globalStyles.veryThinBorder,
    marginBottom: 12,
  },
  profilePic: {
    width: profilePicSize,
    height: profilePicSize,
    borderRadius: profilePicSize / 2,
  },
  contactName: {
    letterSpacing: 0.1,
  },
});
