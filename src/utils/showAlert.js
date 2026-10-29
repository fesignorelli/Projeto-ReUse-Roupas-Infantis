// Fila de avisos exibidos pelo <AlertHost /> como modal. Mantém a mesma
// assinatura do Alert.alert, com um quarto parâmetro para o tipo do aviso.
let queue = [];
let nextId = 1;

// Pilha de hosts: só o último montado exibe os avisos. Assim um aviso
// disparado com outro modal aberto (como a câmera) aparece por cima dele.
let hosts = [];

function notify() {
  hosts.forEach((host, index) =>
    host(index === hosts.length - 1 ? queue : [])
  );
}

export function subscribeToAlerts(listener) {
  hosts = [...hosts, listener];
  notify();

  return () => {
    hosts = hosts.filter((host) => host !== listener);
    notify();
  };
}

export function dismissAlert(id) {
  queue = queue.filter((alert) => alert.id !== id);
  notify();
}

// type: "info" | "success" | "warning" | "error"
export function showAlert(title, message, buttons, { type = "info" } = {}) {
  queue = [
    ...queue,
    {
      id: nextId++,
      title,
      message,
      type,
      buttons:
        buttons && buttons.length > 0 ? buttons : [{ text: "OK" }],
    },
  ];

  notify();
}
