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
  Platform,
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
import { prettyDistance } from "../js/utils";
import ButtonInSplashColor from "./ButtonInSplashColor";

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

function linkToGoogleMapsAt(location) {
  if (!location?.lat || !location?.long) return "";
  return `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.long}`;
}

export default function PostPage({ route }) {
  const { id } = route.params;
  const type = useContext(TypeContext);

  const [posts] = useAllPosts();
  /** @type {import("./FeedPost").PostData} */
  const post = useMemo(() => posts.find((obj) => obj._id == id), [posts, id]);

  const linkToPost = `${process.env.ServerUrl}/${type}/item?id=${post._id}`;

  const linkToGoogleMaps = linkToGoogleMapsAt(post.location);

  const ViewOrTouchable = (props) => {
    if (linkToGoogleMaps) {
      return <TouchableOpacity onPress={() => Linking.openURL(linkToGoogleMaps)} {...props} />;
    }
    return <View {...props} />;
  };

  const placeName = post.location.name?.trim();

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
              <View style={[styles.imageWrapper, isLast && styles.imageWrapper_lastChild]} key={index}>
                <Image style={styles.image} source={{ uri: item }} />
              </View>
            );
          })}
        </View>

        <HR />

        <View style={styles.contactRow}>
          <View style={styles.contactImageAndName}>
            <View style={styles.contactImageWRapper}>
              <Image style={styles.contactImage} source={{ uri: post.author.profilePicUrl }} />
            </View>
            <Text style={styles.contactName}>{post.author.name}</Text>
          </View>
          <ButtonInSplashColor
            title="Tap to Chat"
            style={styles.btnToChat}
            onPress={() => alert("Chats Coming Soon...  ❤️")}
          />
        </View>

        <ViewOrTouchable style={styles.locationAndTime}>
          <Text>
            {prettyDistance(post.proximityInKm)} {placeName && `• ${placeName}`}
          </Text>
          {!!linkToGoogleMaps && (
            <View style={styles.iconShowLocation}>
              <Ionicons name="navigate-circle" color={colorSplash} size={19} />
            </View>
          )}
          <Text style={styles.time}>{timeDeltaAsString(post.date)}</Text>
        </ViewOrTouchable>
      </View>
      <ReportAndShareRow linkToPost={linkToPost} type={type} />
    </ScrollView>
  );
}

function ReportAndShareRow({ linkToPost, type }) {
  const doReport = async () => {
    const body = `\n\nLink to Post: ${linkToPost}`;
    const subject = "Report Post";
    const uri = `mailto:lost.n.found.nitsan@gmail.com?&subject=${subject}&body=${body}`;
    try {
      Linking.openURL(encodeURI(uri));
    } catch {
      alert(`Please write to lost.n.found.nitsan@gmail.com`);
    }
  };

  const doShare = async () => {
    const body = `Yo check out this item on Lost-it!\n${linkToPost}`;
    try {
      if (Platform.OS === "web") {
        await navigator.share({ text: body });
      } else {
        await Share.share({ message: body });
      }
    } catch (err) {
      console.error("could not share, using copy-to-clipboard fallback", err);

      const couldCopy = await Clipboard.setStringAsync(linkToPost);
      const msgOk = "Link to this page was Copied to Clipboard :)";
      const msgErr = `Please share the link to this page :)\n\n${linkToPost}`;

      // todo use my alerts library
      alert(couldCopy ? msgOk : msgErr);
    }
  };

  return (
    <View style={styles.reportAndShare}>
      <TouchableOpacity onPress={doReport}>
        <Text style={styles.reportText}>Report Abuse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={doShare} style={styles.shareBtn}>
        <Text style={styles.shareBtnText}>Share </Text>
        <BoldShareIcon color={colorSplash} />
      </TouchableOpacity>
    </View>
  );
}

function BoldShareIcon({ color }) {
  return (
    <View style={{ position: "relative", transform: [{ translateY: -1.5 }] }}>
      <Ionicons size={20} name="share-outline" color={color} />
      <Ionicons size={19} name="share-outline" color={color} style={{ position: "absolute" }} />
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
    alignItems: "center",
    padding: 12,
    paddingTop: 6,
  },
  iconShowLocation: {
    marginLeft: 4,
    transform: [{ translateY: -0.5 }],
  },
  time: {
    marginLeft: "auto",
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
    flex: 1,
  },
  contactName: {
    textTransform: "capitalize",
    fontWeight: "700",
    letterSpacing: 0.1,
    flexShrink: 1,
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
  btnToChat: {
    marginLeft: "auto",
  },
  reportAndShare: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 7,
    paddingHorizontal: 15,
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
    textDecorationLine: "underline",
  },
});
