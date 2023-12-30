import { StyleSheet, Platform } from "react-native";
import { useEffect, useState, useRef } from "react";
import TextInputWithX from "../components/TextInputWithX";
import alerto from "../components/Alerto";
import LocationInputWithX from "../components/LocationInputWithX";
import { BigButtonInSplashColor } from "../components/ButtonInSplashColor";
import DismissKeyboardView from "../components/DismissKeyboardView";
import { ScrollView } from "react-native-gesture-handler";
import PickPics from "../components/PickPics";
import SelectPostType from "./SelectPostType";
import UploadModal from "./UploadModal";

export default function PostComposer({ navigation, route }) {
  // ensure valid type was passed
  useEffect(() => {
    if (!["lost", "found"].includes(route.params?.type)) {
      navigation.goBack();
    }
  }, [route.params]);

  const [type, setType] = useState(route.params?.type);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [region, setRegion] = useState(null);
  const [images, setImages] = useState([]);

  if (Platform.OS === "web") {
    // match the browser url's query param 'type' to the type state
    useEffect(() => {
      navigation.navigate("PostComposer", { type: type });
    }, [type]);
  }

  const pageRef = useRef();

  const onPostClick = () => {
    // if (!title.trim()) {
    //   pageRef.current.scrollTo({ y: 0, animate: true });
    //   return alerto({
    //     title: "Your Post's Missing a Title",
    //     message: `What have you ${type}?\n` + `E.g. "Brown Boots" or "Keychain" etc.`,
    //   });
    // }
    const data = { type, title, text, region };
    alerto((closeAlerto) => <UploadModal data={data} images={images} closeModal={closeAlerto} />);
  };

  return (
    <ScrollView ref={pageRef}>
      <DismissKeyboardView>
        <SelectPostType type={type} setType={setType} />
        <TextInputWithX
          initialText={title}
          label="Title *"
          onChangeText={setTitle}
          placeholder={`What have you ${type}?`}
        />
        <TextInputWithX
          initialText={text}
          label="Details"
          onChangeText={setText}
          placeholder="Elaborate here..."
          multiline
        />
        <LocationInputWithX region={region} setRegion={setRegion} label={`${type} around`} />

        <PickPics images={images} setImages={setImages} />

        <BigButtonInSplashColor
          title="Upload Post"
          onPress={onPostClick}
          iconName="send"
          style={styles.btnGo}
        />
      </DismissKeyboardView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  btnGo: {
    marginTop: 24,
    marginBottom: 20,
  },
});
