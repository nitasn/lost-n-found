import { useEffect, useState } from "react";
import * as Progress from "react-native-progress"; // todo delete this and svg
import { primaryColor } from "../js/theme";
import uploadToCloudinary from "../js/uploadToCloudinary";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import "core-js/stable/array/with";
import ButtonInSplashColor, { MinimalButtonInSplashColor } from "../components/ButtonInSplashColor";
import { useNavigation } from "@react-navigation/native";
import { uploadPostToServer } from "./uploadPostToServer";

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

  const startUploads = async () => {
    /**
     * README: Closure Intricacies.
     * 
     * After the `startUploads` promise is kicked, it updates the state a few times;
     * Hence, when it accesses pieces of the state, it's STALE STATE FROM AN OLD RENDER.
     * 
     * To overcome this, I've used a few techniques here:
     * 
     * 1. Created an additional local variable: `picsUrls`.
     * 2. Passed functions to state-setters wherever possible.
     */
    
    // local copy to avoid closure issues
    let picsUrls = imgUploads.map((obj) => obj.url);


    // set every upload with status 'failure' to 'pending'
    {
      setImgUploads(imgUploads.map((obj) => 
        obj.status === 'failure' ? { ...obj, status: 'pending' } : obj
      ));
      
      if (postBodyStatus === 'failure') {
        setPostBodyStatus('pending');
      }
    }

    // attempt to upload all images sequentially
    for (let i = 0; i < images.length; i++) {
      if (picsUrls[i]) continue; // skip if already uploaded

      const url = await uploadToCloudinary(images[i].uri);
      setImgUploads((imgUploads) => 
        imgUploads.with(i, { url, status: url ? "success" : "failure" })
      );
      picsUrls[i] = url;
    }

    // if any image hasn't got a url, we can't upload the post
    if (picsUrls.findIndex((url) => !url) !== -1) {
      return setPostBodyStatus("failure");
    }

    const posted = await uploadPostToServer({ ...data, picsUrls });
    setPostBodyStatus(posted ? "success" : "failure");
  }

  useEffect(() => {
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
                onPress={startUploads}
              />
            </View>
          </>
        ),
      }[postBodyStatus]}
    </>
  );
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
