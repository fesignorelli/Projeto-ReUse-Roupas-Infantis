import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

import { readImageFile } from "../utils/webImage";

// Permite arrastar e soltar uma imagem sobre a View que recebe a ref.
// Só tem efeito na web: no celular não existe arrastar arquivos.
export function useImageDrop({ onImage, onError }) {
  const dropRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  // Mantém os callbacks atuais sem recriar os listeners a cada render.
  const callbacksRef = useRef({ onImage, onError });
  callbacksRef.current = { onImage, onError };

  useEffect(() => {
    const element = dropRef.current;

    if (Platform.OS !== "web" || !element?.addEventListener) {
      return undefined;
    }

    // dragenter/dragleave disparam também nos filhos; o contador evita
    // que o destaque pisque ao passar sobre eles.
    let dragDepth = 0;

    function hasFiles(event) {
      return Array.from(event.dataTransfer?.types ?? []).includes("Files");
    }

    function handleDragEnter(event) {
      if (!hasFiles(event)) {
        return;
      }

      event.preventDefault();
      dragDepth += 1;
      setDragging(true);
    }

    function handleDragOver(event) {
      if (!hasFiles(event)) {
        return;
      }

      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    }

    function handleDragLeave() {
      dragDepth = Math.max(0, dragDepth - 1);

      if (dragDepth === 0) {
        setDragging(false);
      }
    }

    async function handleDrop(event) {
      event.preventDefault();
      dragDepth = 0;
      setDragging(false);

      const file = event.dataTransfer?.files?.[0];

      try {
        const image = await readImageFile(file);

        callbacksRef.current.onImage?.(image);
      } catch (error) {
        callbacksRef.current.onError?.(error);
      }
    }

    element.addEventListener("dragenter", handleDragEnter);
    element.addEventListener("dragover", handleDragOver);
    element.addEventListener("dragleave", handleDragLeave);
    element.addEventListener("drop", handleDrop);

    return () => {
      element.removeEventListener("dragenter", handleDragEnter);
      element.removeEventListener("dragover", handleDragOver);
      element.removeEventListener("dragleave", handleDragLeave);
      element.removeEventListener("drop", handleDrop);
    };
  }, []);

  return { dropRef, dragging };
}
