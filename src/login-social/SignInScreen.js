import { StyleSheet, Text, View, TouchableOpacity, Button, Image } from "react-native";
import { useAuth } from "./login";
import globalStyles from "../js/globalStyles";
import ButtonInSplashColor from "../components/ButtonInSplashColor";

export default function SignInScreen() {
  const [user, promptSignInWithGoogle, doSignOut] = useAuth();

  return (
    <View style={styles.container}>
      {!user ? (
        <TouchableOpacity style={styles.signInButton} onPress={promptSignInWithGoogle}>
          <Image style={styles.logo} source={require("../../assets/google-logo.png")} />
          <Text style={styles.signInText}>Sign In with Google</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.userView}>
          <Image source={{ uri: user.photoURL }} style={styles.profilePic} />
          <Text>{user.displayName}</Text>
          <Text>{user.email}</Text>
          <ButtonInSplashColor title="Sign Out" onPress={doSignOut} style={styles.btnSignOut} />
        </View>
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
  signInText: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 18,
  },
  userView: {
    alignItems: "center",
    gap: 15,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginBottom: 5,
  },
  btnSignOut: {
    marginTop: 15,
  },
});
