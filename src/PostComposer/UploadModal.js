import { useEffect, useRef, useState } from "react";
import * as Progress from "react-native-progress";
import { primaryColor } from "../js/theme";
import uploadToCloudinary from "../js/uploadToCloudinary";
import { Button, ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sleep } from "../js/utils";
import "core-js/stable/array/with";
import ButtonInSplashColor, { MinimalButtonInSplashColor } from "../components/ButtonInSplashColor";
import { useNavigation } from "@react-navigation/native";

function UploadingItem({ text, status }) {
  const icon = {
    pending: <ActivityIndicator color={primaryColor} />,
    success: <Ionicons name="checkmark" size={24} color={primaryColor} />,
    failure: <Ionicons name="alert-circle-outline" size={24} color="tomato" />,
  }[status];

  return (
    <View style={styles.uploadingItem}>
      <View style={styles.uploadingItemIcon}>{icon}</View>
      <Text style={styles.uploadingItemText}>{text}</Text>
    </View>
  );
}

export default function UploadModal({ data, images, closeModal }) {
  const navigation = useNavigation();

  // the images will be uploaded to an external service
  const [imgUploads, setImgUploads] = useState(images.map(() => ({ url: "", status: "pending" })));
  // then the postBody will be uploaded to our server with links to the hosted images
  const [postBodyStatus, setPostBodyStatus] = useState("pending");

  useEffect(() => {
    async function startUploads() {
      let anyImgFailure = false;
      // this variable needs to exist becuase of closure issues with `imgUploads`

      for (let i = 0; i < images.length; i++) {
        if (i == 2) images[i].uri = null; // simulating failure
        const hostedUrl = await uploadToCloudinary(images[i].uri);
        if (!hostedUrl) anyImgFailure = true;
        setImgUploads((imgUploads) =>
          imgUploads.with(i, { url: hostedUrl, status: hostedUrl ? "success" : "failure" })
        );
      }
      if (anyImgFailure) {
        return setPostBodyStatus("failure");
      }
      const posted = await uploadPostToServer({ ...data, images });
      setPostBodyStatus(posted ? "success" : "failure");
    }
    startUploads();
  }, []);

  return (
    <>
      {{
        pending: <Text style={styles.title}>Uploading...</Text>,
        success: <Text style={styles.title}>Uploaded 😊</Text>,
        failure: <Text style={styles.title}>Not Uploaded 💔</Text>,
      }[postBodyStatus]}

      <View style={styles.uploadingItemsContainer}>
        {images.map((_, idx) => (
          <UploadingItem text={`Image #${idx + 1}`} status={imgUploads[idx].status} key={idx} />
        ))}
        <UploadingItem text="Post Body" status={postBodyStatus} />
      </View>


      {{
        pending: null,
        success: (
          <View style={styles.bottomActions}>
            <ButtonInSplashColor
              title="Go Back"
              onPress={() => {
                closeModal();
                navigation.goBack();
              }}
            />
          </View>
        ),
        failure: (
          <>
            <Text style={styles.errorMsg}>
              Oh no!{"\n"}Seems like we got a backend issue :/{"\n"}
              <Text style={{fontWeight: 'bold'}}>Please tap 'Retry', or try again later.</Text>
            </Text>
            <View style={[styles.failureActions, styles.bottomActions]}>
              <MinimalButtonInSplashColor title="Cancel" onPress={closeModal} />
              <ButtonInSplashColor
                title="Retry"
                onPress={() => {
                  closeModal();
                  // todo
                }}
              />
            </View>
          </>
        ),
      }[postBodyStatus]}
    </>
  );
}

async function uploadPostToServer(postData) {
  await sleep(1500);
  return true;
}

const styles = StyleSheet.create({
  uploadingItemsContainer: {
    gap: 12,
    marginTop: 16,
    marginBottom: 20,
  },
  uploadingItem: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  uploadingItemIcon: {
    position: "absolute",
  },
  uploadingItemText: {
    marginLeft: 32,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    marginBottom: 12,
  },
  bottomActions: {
    marginTop: 18,
  },
  errorMsg: {
    marginTop: 12,
    marginBottom: 6,
  },
  failureActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
