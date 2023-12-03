import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Clip,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useAllPosts } from "../js/useAllPosts";
import { useContext, useMemo } from "react";
import globalStyles from "../js/globalStyles";
import { useNavigation } from "@react-navigation/native";
import { timeDeltaAsString } from "../js/utils";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import TypeContext from "../js/typeContext";
import { colorSplash } from "../js/theme";

async function getBaseUrl() {
  const url = await Linking.getInitialURL();
  // regex: go past the protocol (two forward slashes),
  // then advance til the first slash or question mark.
  return url?.match(/.*?\/\/[^\?\/]*/)?.[0] || "";
}

/** <hr /> */
function HR() {
  return <View style={styles.hr} />;
}

export default function ({ route }) {
  const { id } = route.params;
  const type = useContext(TypeContext);

  const getLinkToPost = async () => {
    return `${await getBaseUrl()}/${type}/item?id=${post._id}`;
  };

  const [posts] = useAllPosts();
  /** @type {import("./FeedPost").PostData} */
  const post = useMemo(() => posts.find((obj) => obj._id == id), [posts, id]);

  const navigation = useNavigation();
  const placeName = post.location.name?.trim();

  const viewPost = () => {};

  return (
    <ScrollView>
      <View style={styles.post}>
        <View style={styles.header}>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.text}>{post.text}</Text>
        </View>
        <View style={styles.imagesList}>
          {post.picsUrls.map((item, index) => {
            const isLast = index + 1 === post.picsUrls.length;
            return (
              <Pressable
                style={[
                  styles.imageWrapper,
                  isLast && styles.imageWrapper_lastChild,
                ]}
                onPress={viewPost}
                key={index}
              >
                <Image style={styles.image} source={{ uri: item }} />
              </Pressable>
            );
          })}
        </View>

        <HR />

        <View style={styles.contactRow}>
          <TouchableOpacity
            style={styles.contactImageAndName}
            onPress={() => Alert.alert("hi ma nish")}
          >
            <View style={styles.contactImageWRapper}>
              <Image
                style={styles.contactImage}
                source={{ uri: post.author.profilePicUrl }}
              />
            </View>
            <Text style={styles.contactName}>{post.author.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactChatBtn}
            onPress={() => Alert.alert("Chats Coming Soon...  ❤️")}
          >
            <Text style={styles.contactChatBtnText}>Tap to Chat</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.locationAndTime}>
          <Text>
            <Text>{prettyDistance(post.proximityInKm)}</Text>
            <Text>{placeName && ` • ${placeName}`}</Text>
          </Text>
          <Text>{timeDeltaAsString(post.date)}</Text>
        </View>
      </View>
      <ReportAndShare getLinkToPost={getLinkToPost} type={type} />
    </ScrollView>
  );
}

function ReportAndShare({ getLinkToPost, type }) {
  const doReport = async () => {
    const linkToPost = await getLinkToPost();
    const body = `\n\nLink to Post: ${linkToPost}`;
    const subject = "Report Post";
    const uri = `mailto:lost.n.found.nitsan@gmail.com?&subject=${subject}&body=${body}`;
    try {
      Linking.openURL(encodeURI(uri));
    } catch {
      Alert.alert(`Please write to lost.n.found.nitsan@gmail.com`);
    }
  };

  const doShare = async () => {
    const linkToPost = await getLinkToPost();
    const body = `Check this ${type} item out on lost-n-found-hub!\n\n${linkToPost}`;
    try {
      await Share.share({ message: body });
    } catch {
      const copied = await Clipboard.setStringAsync(linkToPost);
      const msgOk = "Link to Post was Copied to Clipboard";
      const msgErr = `Could not acess clipboard. Here's the link: ${linkToPost}`;
      Alert.alert(copied ? msgOk : msgErr);
    }
  };

  return (
    <View style={reportAndShareStyles.container}>
      <TouchableOpacity onPress={doReport}>
        <Text style={reportAndShareStyles.reportText}>Report Post</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={doShare} style={reportAndShareStyles.shareBtn}>
        <Text style={reportAndShareStyles.shareBtnText}>Share </Text>
        <BoldShareIcon color={colorSplash} />
      </TouchableOpacity>
    </View>
  );
}

function BoldShareIcon({ color }) {
  return (
    <View style={{ position: "relative", transform: [{ translateY: -1 }] }}>
      <Ionicons size={20} name="share-outline" color={color} />
      <Ionicons
        size={19}
        name="share-outline"
        color={color}
        style={{ position: "absolute" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  post: {
    margin: 10,
    borderRadius: 5,
    backgroundColor: "white",
    ...globalStyles.shadow_3,
  },
  header: {
    paddingHorizontal: 12,
    paddingTop: 20,
    paddingBottom: 8,
  },
  title: {
    marginBottom: 16,
    fontSize: 30,
    textTransform: "capitalize",
    fontWeight: "bold",
    letterSpacing: 1.1,
  },
  text: {},
  imagesList: {
    padding: 12,
  },
  imageWrapper: {
    ...globalStyles.shadow_2,
    borderRadius: 5,
    marginBottom: 12,
    width: "100%",
  },
  imageWrapper_lastChild: {
    marginBottom: 0,
  },
  image: {
    aspectRatio: 1,
    resizeMode: "cover",
    borderRadius: 5,
  },
  hr: {
    height: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 8,
  },
  locationAndTime: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    paddingTop: 6,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 12,
  },
  contactImageAndName: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  contactName: {
    textTransform: "capitalize",
    fontWeight: "bold",
    letterSpacing: 1.1,
    fontStyle: "italic"
  },
  contactImageWRapper: {
    ...globalStyles.shadow_2,
    borderRadius: 50 / 2,
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  contactChatBtn: {
    marginLeft: "auto",
    paddingVertical: 12,
    paddingHorizontal: 24,
    ...globalStyles.shadow_2,
    backgroundColor: colorSplash,
    borderRadius: 5,
  },
  contactChatBtnText: {
    color: "white",
  },
});

const reportAndShareStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  reportText: {
    textDecorationLine: "underline",
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  shareBtnText: {
    color: colorSplash,
    fontWeight: "bold",
  },
});

function prettyDistance(proximityInKm) {
  if (proximityInKm >= 10) {
    return `${proximityInKm.toFixed(0)} km away`;
  }
  if (proximityInKm >= 1) {
    return `${proximityInKm.toFixed(1)} km away`;
  }
  if (proximityInKm <= 0.1) {
    return "near you";
  }
  return `${proximityInKm.toFixed(2)} km away`;
}
