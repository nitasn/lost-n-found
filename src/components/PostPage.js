import {
  View,
  Text,
  StyleSheet, Image,
  ScrollView,
  TouchableOpacity, Share,
  Platform
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useAllPosts } from "../ts/posts";
import { useContext, useMemo } from "react";
import globalStyles from "../js/globalStyles";
import { timeDeltaAsString } from "../js/utils";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import TypeContext from "../js/typeContext";
import { primaryColor } from "../js/theme";
import { prettyDistance } from "../js/utils";
import ButtonInSplashColor from "./ButtonInSplashColor";
import alerto from "./Alerto";

function openUrlExternally(url) {
  if (Platform.OS == "web") {
    window.open(url, "_blank");
  } else {
    Linking.openURL(url);
  }
}

/** <hr /> */
function HR() {
  return <View style={styles.hr} />;
}

function linkToGoogleMapsAt(latLong) {
  if (!latLong) return "";
  const [lat, long] = latLong;
  return `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;
}

export default function PostPage({ route }) {
  const { id } = route.params;
  const type = useContext(TypeContext);

  const { allPosts } = useAllPosts();
  /** @type {import("./FeedPost").PostData} */
  const post = useMemo(() => allPosts.find((obj) => obj._id == id), [allPosts, id]);

  // todo if no post, redirect to 404 or say post not found... and fetchPosts...

  const linkToPost = `${process.env.ServerUrl}/${type}/item?id=${post._id}`;

  const linkToGoogleMaps = linkToGoogleMapsAt(post.location?.latLong);

  const MaybeLinkToMaps = ({ children }) => {
    if (!linkToGoogleMaps) return children;
    return (
      <TouchableOpacity style={styles.location} onPress={() => openUrlExternally(linkToGoogleMaps)}>
        {children}
        {!!linkToGoogleMaps && (
          <View style={styles.iconShowLocation}>
            <Ionicons name="navigate-circle" color={primaryColor} size={19} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const placeName = post.location?.name?.trim();

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
              <View
                style={[styles.imageWrapper, isLast && styles.imageWrapper_lastChild]}
                key={index}
              >
                <Image style={styles.image} source={{ uri: item }} />
              </View>
            );
          })}
        </View>

        <HR />

        <View style={styles.contactRow}>
          <View style={styles.contactImageAndName}>
            <View style={styles.contactImageWRapper}>
              {/* todo if no profilePicUrl, use generic figure image */}
              <Image style={styles.contactImage} source={{ uri: post.author.profilePicUrl }} />
            </View>
            <Text style={styles.contactName}>{post.author.name}</Text>
          </View>
          <ButtonInSplashColor
            title="Tap to Chat"
            style={styles.btnToChat}
            onPress={() =>
              alerto({
                title: "I'm building that",
                message: "Chats feature coming soon... ❤️",
              })
            }
          />
        </View>

        <View style={styles.locationAndTime}>
          <MaybeLinkToMaps>
            <Text>
              {[placeName, post.proximityInKm != undefined && prettyDistance(post.proximityInKm)]
                .filter((x) => x)
                .join(" • ") || "Unspecified Location"}
            </Text>
          </MaybeLinkToMaps>
          <Text style={styles.time}>{timeDeltaAsString(post.date)}</Text>
        </View>
      </View>
      <ReportAndShareRow linkToPost={linkToPost} type={type} />
    </ScrollView>
  );
}

function ReportAndShareRow({ linkToPost, type }) {
  const doReport = async () => {
    const body = `\n\nLink to post:\n${linkToPost}`;
    const subject = "Report Post";
    const uri = `mailto:lost.n.found.nitsan@gmail.com?&subject=${subject}&body=${body}`;
    try {
      t = r;
      await Linking.openURL(encodeURI(uri));
    } catch {
      alerto({
        title: "Couldn't Launch Mail App",
        message: "Please write an email to lost.n.found.nitsan@gmail.com",
      });
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

      if (couldCopy) {
        alerto({
          title: "Link Copied to Clipboard",
          message: "This post's URL was copied to clipboard :)",
        });
      } else {
        alerto({
          title: "Please Share the URL",
          message: `Please share the this page's URL (it is ${linkToPost})`,
        });
      }
    }
  };

  return (
    <View style={styles.reportAndShare}>
      <TouchableOpacity onPress={doReport}>
        <Text style={styles.reportText}>Report Abuse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={doShare} style={styles.shareBtn}>
        <Text style={styles.shareBtnText}>Share </Text>
        <BoldShareIcon color={primaryColor} />
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
  location: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconShowLocation: {
    marginLeft: 4,
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
    color: primaryColor,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
