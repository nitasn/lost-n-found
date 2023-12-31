import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";

import { useCollection } from "react-firebase-hooks/firestore";
import { ErrorText, LoadingText } from "../misc";
import { useAuth } from "../../login-social/login";
import globalStyles from "../../js/globalStyles";
import { primaryColor } from "../../js/theme";
import { prettyDate } from "../../js/utils";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import alerto from "../Alerto";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import queryConversation from "./queryConversation";
import sendMessage from "./sendMessage";

export default function ConversationScreen({ route }) {
  const [user] = useAuth();
  const myUid = user?.uid;

  const { uid } = route.params;

  const [value, loading, error] = useCollection(queryConversation(myUid, uid));

  const bottomTabBarHeight = useBottomTabBarHeight();

  if (!user) {
    return <SimpleText text="Please Sign In in order to Chat" />;
  }

  if (loading) return <LoadingText text="Loading Chat..." />;
  if (error) return <ErrorMsg text={`Error: ${error.message}`} />;

  const messages = value.docs;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={bottomTabBarHeight + 16}
      onStartShouldSetResponder={() => Keyboard.dismiss()}
    >
      <MessagesContainer messages={messages} myUid={myUid} />
      <BottomInputs myUid={myUid} theirUid={uid} />
    </KeyboardAvoidingView>
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
  const listRef = useRef();
  const scrollToEnd = () => listRef.current.scrollToEnd({ animated: true });
  return (
    <FlatList
      ref={listRef}
      style={styles.messagesContainer}
      onContentSizeChange={scrollToEnd} // for when there's a new message
      onLayout={scrollToEnd} // for when keyboard is revealed
      ListEmptyComponent={<SimpleText text="You haven't sent each other messages yet." />}
      data={messages}
      renderItem={({ item: doc, index }) => {
        const { text, timestamp, senderId } = doc.data();
        const glueNext =
          index < messages.length - 1 &&
          messages[index + 1].data().senderId === senderId &&
          messages[index + 1].data().timestamp - timestamp < 1000 * 60 * 2; // two minutes
        return (
          <MessageBubble
            text={text}
            timestamp={timestamp}
            byMe={senderId === myUid}
            glueNext={glueNext}
          />
        );
      }}
      keyExtractor={(doc) => doc.id}
    />
  );
}

function MessageBubble({ text, timestamp, byMe, glueNext }) {
  return (
    <>
      <View
        style={[
          styles.messageBubble,
          byMe && styles.messageBubbleByMe,
          glueNext && styles.messageBubbleGlueNext,
        ]}
      >
        <Text style={[styles.messageText, byMe && styles.messageTextByMe]}>{text}</Text>
        <Text style={[styles.messageTimestamp, byMe && styles.messageTimestampByMe]}>
          {prettyDate(timestamp.seconds * 1000)}
        </Text>
      </View>
    </>
  );
}

function BottomInputs({ myUid, theirUid }) {
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

  const onBtn = async () => {
    const msg = text.trim();
    if (!msg || sending) return;
    setSending(true);
    setInputText("");
    const error = await sendMessage(myUid, theirUid, msg);
    setSending(false);
    if (error) {
      setInputText(text); // tricky use of closures: that's the old `text`
      Keyboard.dismiss();
      console.log(error.message);
      return alerto(<ErrorMsg text={`Error: ${error.message}`} />);
    }
  };

  return (
    <View style={bottom.bottomRow}>
      <TextInput multiline style={bottom.input} ref={inputRef} onChangeText={setText} />
      <TouchableOpacity style={bottom.btnSend} onPress={onBtn} disabled={sending}>
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
    marginBottom: 10,
    maxWidth: "80%",
    ...globalStyles.shadow_1,

    backgroundColor: "#333333",
    alignSelf: "flex-start",
  },
  messageBubbleByMe: {
    backgroundColor: primaryColor,
    alignSelf: "flex-end",
  },
  messageBubbleGlueNext: {
    marginBottom: 2,
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
