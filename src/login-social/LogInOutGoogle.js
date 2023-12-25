import { StyleSheet, Text, View, TouchableOpacity, Button, Image } from "react-native";
import { useAuth } from "./login";
import globalStyles from "../js/globalStyles";
import ButtonInSplashColor from "../components/ButtonInSplashColor";

export default function LogInOutGoogle() {
  const [user, promptSignInWithGoogle, doSignOut] = useAuth();

  return !user ? (
    <TouchableOpacity style={styles.signInButton} onPress={promptSignInWithGoogle}>
      <Image style={styles.logo} source={require("../../assets/google-logo.png")} />
      <Text style={styles.signInText}>Sign In with Google</Text>
    </TouchableOpacity>
  ) : (
    <View style={styles.container}>
      <View style={styles.userView}>
        <View style={styles.row}>
          <Image source={{ uri: user.photoURL }} style={styles.profilePic} />
          <Text style={styles.displayName}>{user.displayName}</Text>
        </View>
        <ButtonInSplashColor title="Sign Out" onPress={doSignOut} style={styles.btnSignOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    ...globalStyles.shadow_1,
    borderRadius: 5,
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
    alignSelf: "stretch",
  },
  logo: {
    width: 30,
    height: 30,
  },
  signInText: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 18,
  },
  userView: {
    // alignItems: "center",
    gap: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginBottom: 5,
  },
  displayName: {
    letterSpacing: 0.1,
  },
  btnSignOut: {
    marginTop: 5,
  },
});
