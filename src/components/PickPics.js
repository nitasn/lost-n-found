import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Text, FlatList, Pressable, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import globalStyles from "../js/globalStyles";
import Label from "./Label";
import BottomDrawer, { BottomDrawerMethods } from "react-native-animated-bottom-drawer";
import MenuItem from "./MenuItem";
import alerto from "./Alerto";

/**
 * @typedef {Object} ImageAsset
 * @property {string} uri
 * @property {number} width
 * @property {number} height
 * @property {string} base64
 */

export default function PickPics({ images, setImages }) {
  const [cameraPerm, requestCameraPerm] = ImagePicker.useCameraPermissions();
  const [libraryPerm, requestLibraryPerm] = ImagePicker.useMediaLibraryPermissions();

  /** @type {{ current: BottomDrawerMethods }} */
  const bottomDrawerRef = useRef();

  /** @type {{current: FlatList }} */
  const imagesListRef = useRef();

  const scrollToEndOfImagesList = () => {
    imagesListRef.current.scrollToEnd({ animated: true });
  };

  /**
   * @param {'Camera' | 'ImageLibrary'} source
   */
  const selectImgFrom = async (source) => {
    if (source === "Camera" && !cameraPerm.granted) {
      const { status } = await requestCameraPerm();
      if (status !== "granted") {
        return alerto({
          title: "Missing Camera Permissions",
          message:
            "To add photos from your camera, " +
            "please go to 'settings' and grant the app camera permissions ❤️",
        });
      }
    }

    if (source === "ImageLibrary" && !libraryPerm.granted) {
      const { status } = await requestLibraryPerm();
      if (status !== "granted") {
        return alerto({
          title: "Missing Image Library Permissions",
          message:
            "To add photos from your image library, " +
            "please go to 'settings' and grant the app image library permissions ❤️",
        });
      }
    }

    const launchImgPicker = {
      Camera: ImagePicker.launchCameraAsync,
      ImageLibrary: ImagePicker.launchImageLibraryAsync,
    }[source];

    const results = await launchImgPicker({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // todo should i use 0.2? i need to comprare the results.
      base64: true,
    });

    bottomDrawerRef.current.close();

    if (!results.canceled && results.assets) {
      setImages((currentImages) => [...currentImages, ...results.assets]);
    }
  };

  const ImgPlaceholder = (
    <TouchableOpacity
      style={[styles.imageWrapper, images.length || styles.imageWrapper_first]}
      onPress={() => bottomDrawerRef.current.open()}
    >
      <Image style={styles.image} source={require("../../assets/doodly-lines-bg.jpeg")} />
      <View style={styles.overlayView}>
        <Image style={styles.icon} source={require("../../assets/add-from-camera.png")} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.component}>
      <Label text="Photos" />
      <FlatList
        style={styles.images}
        ref={imagesListRef}
        data={images}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={images.length < 4 && ImgPlaceholder}
        renderItem={({ item, index }) => (
          <Pressable style={[styles.imageWrapper, index || styles.imageWrapper_first]}>
            <Image style={styles.image} source={{ uri: item.uri }} />
          </Pressable>
        )}
        keyExtractor={(url, idx) => `${idx}|${url}`}
        onContentSizeChange={scrollToEndOfImagesList}
      />

      <BottomDrawer ref={bottomDrawerRef} gestureMode="content" initialHeight={240}>
        <View style={styles.bottomDrawer}>
          <Text style={styles.bottomDrawerTitle}>Add Photo</Text>
          <MenuItem
            iconName="camera-outline"
            text="From Camera"
            onPress={() => selectImgFrom("Camera")}
          />
          <MenuItem
            iconName="image-outline"
            text="From Gallery"
            onPress={() => selectImgFrom("ImageLibrary")}
          />
        </View>
      </BottomDrawer>
    </View>
  );
}

const styles = StyleSheet.create({
  component: {},
  images: {},
  imageStyle: {
    width: 150,
    height: 150,
  },
  imageWrapper: {
    borderRadius: 5,
    marginRight: 12,
    marginVertical: 12,
    ...globalStyles.shadow_2,
  },
  imageWrapper_first: {
    marginLeft: 12,
  },
  image: {
    width: 225,
    height: 225,
    resizeMode: "cover",
    borderRadius: 5,
  },
  overlayView: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  touchable: {
    alignItems: "center",
  },
  icon: {
    width: 55,
    height: 55,
  },
  bottomDrawer: {
    gap: 12,
    paddingHorizontal: 24,
  },
  bottomDrawerTitle: {
    textAlign: "center",
    margin: 12,
    fontSize: 24,
  },
});
