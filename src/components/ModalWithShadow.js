import { Modal, StyleSheet, View } from "react-native";

export default function ModalWithShadow({ visible, doClose, children }) {
  return (
    <Modal
      visible={visible}
      onRequestClose={doClose}
      animationType="fade"
      transparent={true}
    >
      <View style={styles.outerWrap}>
        <View style={styles.innerWrap}>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  outerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(80,80,80,0.5)",
  },
  innerWrap: {
    width: "90%",
    height: "90%",
  },
});
