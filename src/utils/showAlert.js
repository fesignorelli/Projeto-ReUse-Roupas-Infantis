import { Alert, Platform } from "react-native";

// No react-native-web o Alert.alert não faz nada. Na web usamos
// window.alert/window.confirm, mantendo os callbacks dos botões.
export function showAlert(title, message, buttons) {
  if (Platform.OS !== "web") {
    Alert.alert(title, message, buttons);
    return;
  }

  const text = [title, message].filter(Boolean).join("\n\n");

  if (!buttons || buttons.length === 0) {
    window.alert(text);
    return;
  }

  if (buttons.length === 1) {
    window.alert(text);
    buttons[0].onPress?.();
    return;
  }

  const cancelButton = buttons.find(
    (button) => button.style === "cancel"
  );

  const confirmButton = buttons.find(
    (button) => button !== cancelButton
  );

  if (window.confirm(text)) {
    confirmButton?.onPress?.();
  } else {
    cancelButton?.onPress?.();
  }
}
