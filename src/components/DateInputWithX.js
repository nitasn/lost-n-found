import { useState } from "react";
import { DatePickerModal } from "react-native-paper-dates";
import { Provider as PaperProvider, DefaultTheme as DefaultPaperTheme } from "react-native-paper";
import { colorSplash } from "../js/theme";
import TextInputWithX from "./TextInputWithX";

const themeForPaper = {
  colors: {
    ...DefaultPaperTheme.colors,
    primary: colorSplash,
  },
};

export default function DateInputWithX({ date, setDate, label }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TextInputWithX
        text={date ? formatDate(date) : ""}
        placeholder="DD/MM/YYYY"
        editable={false}
        onPress={() => setOpen(true)}
        label={label}
        onChangeText={(text) => !text && setDate(null)}
      />
      <PaperProvider theme={themeForPaper}>
        <DatePickerModal
          locale="en-GB"
          mode="single"
          visible={open}
          onDismiss={() => setOpen(false)}
          date={date}
          onConfirm={({ date }) => {
            setOpen(false);
            setDate(date);
          }}
          closeIcon="close"
        />
      </PaperProvider>
    </>
  );
}

function formatDate(date) {
  date = new Date(date);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0 :/
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
