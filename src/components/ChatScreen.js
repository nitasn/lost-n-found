import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { getFirestore, collection, query, orderBy } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { app } from "../../firebase.config";
import { serverPOST } from "../js/sendServerReq";
import { ErrorText, LoadingText } from "./misc";
import { useAuth } from "../login-social/login";
import globalStyles from "../js/globalStyles";
import { primaryColor } from "../js/theme";
import { prettyDate } from "../js/utils";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import alerto from "./Alerto";

export default function ChatScreen({ theirUid }) {
  const [user] = useAuth();

  if (!user) {
    return <SimpleText text="Please Sign In in order to Chat" />;
  }

  const myUid = user.uid;

  const chatId = [myUid, theirUid].sort().join("_");
  const chatPath = `userChats/${chatId}/messages`;

  const messagesQuery = query(collection(getFirestore(app), chatPath), orderBy("timestamp", "asc"));

  const [value, loading, error] = useCollection(messagesQuery, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  if (loading) return <LoadingText text="Loading Chat..." />;
  if (error) return <ErrorMsg text="Could not load chat :/" />;

  const messages = value.docs || [];

  return (
    <View style={styles.screen} onStartShouldSetResponder={() => Keyboard.dismiss()}>
      <MessagesContainer messages={messages} myUid={myUid} />
      <BottomInputs theirUid={theirUid} />
    </View>
  );
}

const ErrorMsg = ({ text }) => (
  <View style={{ padding: 12 }}>
    <ErrorText text={text} />
    <View style={{ gap: 8 }}>
      <Text>If the error persists, please contact us at lost.n.found.nitsan@gmail.com</Text>
      <Text>We will help you out to reach this person!</Text>
    </View>
  </View>
);

function SimpleText({ text }) {
  return <Text style={{ textAlign: "center", padding: 12 }}>{text}</Text>;
}

function MessagesContainer({ messages, myUid }) {
  const ref = useRef();
  const scrollToEnd = () => ref.current.scrollToEnd({ animated: true });
  return (
    <FlatList
      ref={ref}
      style={styles.messagesContainer}
      onContentSizeChange={scrollToEnd} // for when there's a new message
      onLayout={scrollToEnd} // for when keyboard is fired/dismissed
      ListEmptyComponent={<SimpleText text="You havn't sent each other messages yet." />}
      data={messages}
      renderItem={({ item: doc, index }) => {
        const { text, timestamp, sender } = doc.data();
        return <MessageBubble text={text} timestamp={timestamp} byMe={sender === myUid} />;
      }}
      keyExtractor={(doc) => doc.id}
    />
  );
}

function MessageBubble({ text, timestamp, byMe }) {
  return (
    <>
      <View style={[styles.messageBubble, byMe && styles.messageBubbleByMe]}>
        <Text style={[styles.messageText, byMe && styles.messageTextByMe]}>{text}</Text>
        <Text style={[styles.messageTimestamp, byMe && styles.messageTimestampByMe]}>
          {prettyDate(timestamp)}
        </Text>
      </View>
    </>
  );
}

function BottomInputs({ theirUid }) {
  const [text, setText] = useState("");
  const inputRef = useRef();
  const [sending, setSending] = useState(false);

  const setInputText = (text) => {
    if (Platform.OS === "web") {
      inputRef.current.value = text;
    } else {
      inputRef.current.setNativeProps({ text });
    }
  };

  const onSend = async () => {
    const msg = text.trim();
    if (!msg || sending) return;
    setSending(true);
    setInputText("");
    const res = await serverPOST("/api/send-msg", { text: msg, to_uid: theirUid });
    setSending(false);
    if (!res.ok) {
      setInputText(text);
      return alerto(<ErrorMsg text="Couldn't Send Message" />);
    }
  };

  return (
    <View style={bottom.bottomRow}>
      <TextInput multiline style={bottom.input} ref={inputRef} onChangeText={setText} />
      <TouchableOpacity style={bottom.btnSend} onPress={onSend} disabled={sending}>
        <Ionicons color={primaryColor} size={24} name="send" />
      </TouchableOpacity>
    </View>
  );
}

const bottom = StyleSheet.create({
  bottomRow: {
    flexDirection: "row",
    marginTop: "auto",
  },
  input: {
    minHeight: 40,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 14,
    paddingRight: 48,
    borderRadius: 5,
    color: "black",
    margin: 12,
    marginTop: 0,
    ...globalStyles.noInputOutline,
    ...globalStyles.veryThinBorder,
    ...globalStyles.shadow_1,
    backgroundColor: "hsl(0, 0%, 84%)",
    flex: 1,
  },
  btnSend: {
    position: "absolute",
    right: 24,
    bottom: 19,
  },
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  messagesContainer: {
    margin: 12,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 5,
    maxWidth: "80%",
    marginBottom: 8,
    ...globalStyles.shadow_1,

    backgroundColor: "#333333",
    alignSelf: "flex-start",
  },
  messageBubbleByMe: {
    backgroundColor: primaryColor,
    alignSelf: "flex-end",
  },
  messageText: {
    color: "white",
  },
  messageTextByMe: {
    color: "white",
  },
  messageTimestamp: {
    opacity: 0.5,
    paddingTop: 4,

    color: "hsl(0, 0%, 73%)",
    alignSelf: "flex-start",
  },
  messageTimestampByMe: {
    color: "hsl(0, 0%, 93%)",
    alignSelf: "flex-end",
  },
});
