import { create } from "lume/deps/sharp.ts";

const WIDTH = 1200;
const HEIGHT = 600;
const PADDING = 60;
const GAP = 24;
const IMAGES_WIDTH = 620;
const IMAGES_HEIGHT = HEIGHT - PADDING * 2;
const MAX_IMAGES = 3;

/** Find the paintings to show on the card for this page */
function getPaintings(data) {
  const paintings = data.search.pages("type=painting");

  if (data.type === "painting") {
    return data.painting ? [data.painting] : [];
  }

  if (data.type === "category") {
    const fileNames = (data.paintings ?? []).map((name) => name.normalize("NFC"));
    return paintings
      .filter((p) => fileNames.includes((p.page.src.path.split("/").pop() + p.page.src.ext).normalize("NFC")))
      .map((p) => p.painting);
  }

  return paintings.map((p) => p.painting);
}

/** Resize a painting to fit the box and return it as an embeddable data URL */
async function loadImage(path, maxWidth, maxHeight) {
  try {
    const file = await Deno.readFile(Deno.cwd() + decodeURI(path));
    const { data, info } = await create(file)
      .resize(maxWidth, maxHeight, { fit: "inside" })
      .jpeg({ quality: 85 })
      .toBuffer({ resolveWithObject: true });
    const base64 = btoa(Array.from(data, (byte) => String.fromCharCode(byte)).join(""));
    return { src: `data:image/jpeg;base64,${base64}`, width: info.width, height: info.height };
  } catch {
    return undefined;
  }
}

export default async function (data) {
  const paths = getPaintings(data).filter(Boolean).slice(0, MAX_IMAGES);
  const slotWidth = Math.floor((IMAGES_WIDTH - GAP * (paths.length - 1)) / Math.max(paths.length, 1));
  const images = (await Promise.all(paths.map((path) => loadImage(path, slotWidth, IMAGES_HEIGHT)))).filter(Boolean);
  const hasImages = images.length > 0;

  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        alignItems: "center",
        gap: PADDING,
        padding: PADDING,
        backgroundColor: data.background_color || "#1fbfaf",
        color: "black",
        fontFamily: "inter",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, height: "100%" }}>
        <div style={{ fontSize: hasImages ? 64 : 88, fontWeight: 700, lineHeight: 1.1 }}>
          {data.title}
        </div>
        {data.title !== data.sitetitle && (
          <div style={{ fontSize: 32, borderTop: "6px dashed black", paddingTop: 20 }}>
            {data.sitetitle}
          </div>
        )}
      </div>
      {hasImages && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: GAP, width: IMAGES_WIDTH, height: IMAGES_HEIGHT }}>
          {images.map((image) => (
            <img src={image.src} width={image.width} height={image.height} />
          ))}
        </div>
      )}
    </div>
  );
}
