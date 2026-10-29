import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

import { dismissAlert, subscribeToAlerts } from "../utils/showAlert";

const ALERT_STYLES = {
  info: {
    icon: "information-circle-outline",
    color: "#2d82b7",
    circle: "bg-blue-xlight",
  },
  success: {
    icon: "checkmark-circle-outline",
    color: "#3d8b42",
    circle: "bg-mint-xlight",
  },
  warning: {
    icon: "alert-circle-outline",
    color: "#e05578",
    circle: "bg-pink-xlight",
  },
  error: {
    icon: "close-circle-outline",
    color: "#e05578",
    circle: "bg-pink-xlight",
  },
};

// Exibe, um de cada vez, os avisos enviados com showAlert().
export function AlertHost() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => subscribeToAlerts(setAlerts), []);

  const alert = alerts[0];

  if (!alert) {
    return null;
  }

  const style = ALERT_STYLES[alert.type] ?? ALERT_STYLES.info;

  const cancelButton = alert.buttons.find(
    (button) => button.style === "cancel"
  );

  // Botões de ação primeiro; o de cancelar fica por último.
  const orderedButtons = [
    ...alert.buttons.filter((button) => button !== cancelButton),
    ...(cancelButton ? [cancelButton] : []),
  ];

  function handlePress(button) {
    dismissAlert(alert.id);
    button?.onPress?.();
  }

  function handleRequestClose() {
    // Voltar do Android equivale a cancelar, ou ao único botão do aviso.
    const fallbackButton =
      alert.buttons.length === 1 ? alert.buttons[0] : null;

    handlePress(cancelButton ?? fallbackButton);
  }

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleRequestClose}
    >
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <View
          className="w-full max-w-sm items-center rounded-3xl bg-white px-6 pb-6 pt-8"
          accessibilityViewIsModal
          accessibilityRole="alert"
        >
          <View
            className={`h-16 w-16 items-center justify-center rounded-full ${style.circle}`}
          >
            <Ionicons name={style.icon} size={32} color={style.color} />
          </View>

          <Text className="mt-4 text-center font-heading text-lg text-ink-dark">
            {alert.title}
          </Text>

          {alert.message ? (
            <Text className="mt-2 text-center font-body text-sm leading-5 text-ink-mid">
              {alert.message}
            </Text>
          ) : null}

          <View className="mt-6 w-full gap-3">
            {orderedButtons.map((button, index) => {
              const secondary = button.style === "cancel";

              return (
                <TouchableOpacity
                  key={`${button.text}-${index}`}
                  activeOpacity={0.8}
                  onPress={() => handlePress(button)}
                  className={`w-full items-center rounded-full py-4 ${
                    secondary ? "bg-offwhite" : "bg-pink-dark"
                  }`}
                  accessibilityRole="button"
                  accessibilityLabel={button.text}
                >
                  <Text
                    className={`font-headingMedium text-base ${
                      secondary ? "text-ink-mid" : "text-white"
                    }`}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}
