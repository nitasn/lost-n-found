import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useCollection } from "react-firebase-hooks/firestore";
import { LoadingText } from "../../misc";
import { useAuth } from "../../../login-social/login";
import globalStyles from "../../../js/globalStyles";
import { primaryColor } from "../../../js/theme";
import { prettyDate } from "../../../js/utils";
import { useCallback, useLayoutEffect, useRef } from "react";
import queryConvo from "./queryConvo";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import BottomInputs from "./BottomInputs";
import ErrorWithHelpText from "./ErrorWithHelpText";

function useHideTabBar() {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ tabBarStyle: { maxHeight: 0, overflow: "hidden" } });
      return () => navigation.getParent()?.setOptions({ tabBarStyle: undefined });
    }, [])
  );
}

export default function ConvoScreen({ route, navigation }) {
  const [user] = useAuth();

  if (!user) {
    return <SimpleText text="Please Sign In in order to Chat" />;
  }

  const theirUid = route.params?.uid;
  if (!theirUid) {
    navigation.goBack();
    return null;
  }

  return <ConvoScreenAuthed myUid={user.uid} theirUid={theirUid} theirName={route.params?.name} />;
}

function ConvoScreenAuthed({ myUid, theirUid, theirName }) {
  useHideTabBar();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Chat with ${theirName}`,
    });
  }, [navigation, theirName]);

  const [value, loading, error] = useCollection(queryConvo(myUid, theirUid));

  if (loading) return <LoadingText text="Loading Chat..." />;
  if (error) return <ErrorWithHelpText text={`Error: ${error.message}`} />;

  const messages = value.docs;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={64}
      onStartShouldSetResponder={() => Keyboard.dismiss()}
    >
      <MessagesContainer messages={messages} myUid={myUid} />
      <BottomInputs myUid={myUid} theirUid={theirUid} />
    </KeyboardAvoidingView>
  );
}

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
