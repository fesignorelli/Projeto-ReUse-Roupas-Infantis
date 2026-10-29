const MAX_IMAGE_SIDE = 1200;
const JPEG_QUALITY = 0.8;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Imagem inválida."));
    image.src = src;
  });
}

// Na web a foto é salva como data URL no Async Storage (localStorage),
// que tem pouco espaço. Por isso a imagem é reduzida antes de salvar.
export async function resizeImageForWeb(src) {
  const image = await loadImage(src);

  const scale = Math.min(
    1,
    MAX_IMAGE_SIDE / Math.max(image.width, image.height)
  );

  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(image, 0, 0, width, height);

  return {
    uri: canvas.toDataURL("image/jpeg", JPEG_QUALITY),
    width,
    height,
  };
}

export async function readImageFile(file) {
  if (!file?.type?.startsWith("image/")) {
    throw new Error("O arquivo precisa ser uma imagem.");
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    return await resizeImageForWeb(objectUrl);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
