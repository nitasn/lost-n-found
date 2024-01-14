import { LoadingText, ErrorMsg } from "../../misc";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import useAllChats from "../useAllChats";
import globalStyles from "../../../js/globalStyles";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../login-social/login";
import MsgPleaseSignIn from "./MsgSignInForChats";

export default function ChatsScreen() {
  const [user] = useAuth();

  if (!user) return <MsgPleaseSignIn />;

  return <ChatsScreenAuthed myUid={user.uid} />;
}

function ChatsScreenAuthed({ myUid }) {
  const { data: users, error, isLoading } = useAllChats(myUid);

  return (
    <>
      {isLoading && <LoadingText text="Loading Chats..." />}
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

function ChatListItem({ _id, name, profilePicUrl }) {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate("ConvoScreen", { uid: _id });
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
    borderRadius: profilePicSize,
  },
  contactName: {
    letterSpacing: 0.1,
  },
});
