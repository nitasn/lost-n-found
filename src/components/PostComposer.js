import { StyleSheet, View, Text, TouchableOpacity, Platform } from "react-native";
import { useEffect, useState } from "react";
import TextInputWithX from "./TextInputWithX";
import { Ionicons } from "@expo/vector-icons";
import globalStyles from "../js/globalStyles";
import alerto from "./Alerto";
import LocationInputWithX from "./LocationInputWithX";
import { BigButtonInSplashColor } from "./ButtonInSplashColor";
import DismissKeyboardView from "./DismissKeyboardView";
import { ScrollView } from "react-native-gesture-handler";
import PickPics from "./PickPics";

function SelectPostType({ type, setType }) {
  return (
    <View style={select.container}>
      <Text style={select.text}>I've</Text>
      <TouchableOpacity
        style={select.box}
        onPress={() => setType(type === "lost" ? "found" : "lost")}
      >
        <Text style={select.boxText}>{type}</Text>
        <Ionicons name="chevron-down" size={24} color="gray" />
      </TouchableOpacity>
    </View>
  );
}

const select = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 12,
  },
  text: {
    fontSize: 32,
    fontWeight: "600",
    marginRight: 12,
  },
  box: {
    padding: 12,
    paddingVertical: 6,
    ...globalStyles.veryThinBorder,
    borderRadius: 5,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    ...globalStyles.shadow_1,
  },
  boxText: {
    fontSize: 32,
    fontWeight: "600",
  },
});

export default function PostComposer({ navigation, route }) {
  // ensure valid type was passed
  useEffect(() => {
    if (!["lost", "found"].includes(route.params?.type)) {
      navigation.goBack();
    }
  }, [route.params]);

  const [postType, setPostType] = useState(route.params?.type);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [region, setRegion] = useState(null);
  const [images, setImages] = useState([]);

  if (Platform.OS === "web") {
    // match the browser url's query param 'type' to the postType state
    useEffect(() => {
      navigation.navigate("PostComposer", { type: postType });
    }, [postType]);
  }

  return (
    <ScrollView>
      <DismissKeyboardView>
        <SelectPostType type={postType} setType={setPostType} />
        <TextInputWithX
          initialText={title}
          label="Title *"
          onChangeText={setTitle}
          placeholder={`What have you ${postType}?`}
        />
        <TextInputWithX
          initialText={text}
          label="Details"
          onChangeText={setText}
          placeholder="Elaborate here..."
          multiline
        />
        <LocationInputWithX region={region} setRegion={setRegion} label={`${postType} around`} />

        <PickPics images={images} setImages={setImages} />

        <BigButtonInSplashColor
          title="Post"
          onPress={() => alerto({ message: "ma nish" })}
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
