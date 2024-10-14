import { WebView } from "react-native-webview";
import { Button, StyleSheet, View } from "react-native";
import Constants from "expo-constants";

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <style>
    html, body {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }
  </style>
</body>
  <iframe
    width="100%"
    height="100%"
    style="border:0; position: absolute; top: 0; left: 0;"
    loading="lazy"
    allowfullscreen
    referrerpolicy="no-referrer-when-downgrade"
    src="https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API_KEY}
        &q=givat-shmuel">
  </iframe>
</html>
`;

export default function ({ doClose }) {
  return (
    <>
      <WebView style={styles.container} originWhitelist={["*"]} source={{ html }} />

      <View style={{ marginBottom: 12 }}>
        <Button title="close" onPress={doClose} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
