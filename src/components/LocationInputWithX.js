import { Modal } from "react-native";
import { useState } from "react";
import LocationChooser from "./LocationChooser";
import TextInputWithX from "./TextInputWithX";

function latLongToText({ latitude, longitude }) {
  const N_S = latitude >= 0 ? "N" : "S";
  const E_W = longitude >= 0 ? "E" : "W";

  const lat = Math.abs(latitude).toFixed(4);
  const long = Math.abs(longitude).toFixed(4);

  return `${lat}° ${N_S}, ${long}° ${E_W}`;
}

/**
 * @param {{ region: import("./FeedStack").Region | null }}
 */
export default function LocationInputWithX({ region, setRegion, label }) {
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);

  return (
    <>
      <TextInputWithX
        text={region ? latLongToText(region) : ""}
        placeholder="Choose Location..."
        editable={false}
        onPress={() => setModalVisible(true)}
        label={label}
        onChangeText={(text) => !text && setRegion(null)}
      />

      <Modal visible={modalVisible} onRequestClose={closeModal} animationType="slide">
        <LocationChooser doClose={closeModal} region={region} setRegion={setRegion} />
      </Modal>
    </>
  );
}
