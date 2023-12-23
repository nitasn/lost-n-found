import { StyleSheet, Text, View, TouchableOpacity, Button, Image } from "react-native";
import { useAuth } from "./login-state";
import globalStyles from "../js/globalStyles";

export default function SignInScreen() {
  const [userInfo, promptSignInWithGoogle, doSignOut] = useAuth();

  return (
    <View style={styles.container}>
      {!!userInfo ? (
        <>
          <Text>{userInfo.displayName}</Text>
          <Text>{userInfo.email}</Text>
          <Button title="Sign Out" onPress={doSignOut} />
        </>
      ) : (
        <TouchableOpacity style={styles.signInButton} onPress={promptSignInWithGoogle}>
          <Image style={styles.logo} source={require("../../assets/google-logo.png")} />
          <Text style={styles.buttonText}>Sign In with Google</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  signInButton: {
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 30,
    gap: 30,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    ...globalStyles.shadow_1,
  },
  logo: {
    width: 30,
    height: 30,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 18,
  },
});
