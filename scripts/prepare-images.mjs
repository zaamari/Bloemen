// Zet geselecteerde foto's uit /fotos om naar webklare JPEG's in /public/images.
// Draait de foto rechtop en verwijdert metadata (zoals locatie).
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const W = "fotos/WhatsApp Image 2026-10-25 at 17.36";
const H = "fotos/selectie/hero";

const map = {
  "hero/main.jpg": `${H}/IMG_3731.JPG`,
  "hero/evening.jpg": `${H}/IMG_3793.JPG`,
  "hero/detail.jpg": `${H}/IMG_3725.JPG`,

  "products/bordeaux-nuit-1.jpg": `${H}/IMG_3731.JPG`,
  "products/bordeaux-nuit-2.jpg": `${W}.45 (1).jpeg`,
  "products/bordeaux-nuit-3.jpg": `${H}/IMG_3725.JPG`,
  "products/coeur-dore-1.jpg": `${W}.47 (3).jpeg`,
  "products/coeur-dore-2.jpg": `${W}.46 (4).jpeg`,
  "products/coeur-dore-3.jpg": `${W}.46 (5).jpeg`,
  "products/champagne-perle-1.jpg": `${W}.46 (8).jpeg`,
  "products/champagne-perle-2.jpg": `${H}/IMG_3793.JPG`,
  "products/champagne-perle-3.jpg": `${W}.46 (10).jpeg`,
  "products/rouge-ivoire-1.jpg": `${W}.47 (1).jpeg`,
  "products/rouge-ivoire-2.jpg": `${W}.47 (2).jpeg`,
  "products/violette-royale-1.jpg": `${H}/IMG_3718.JPG`,
  "products/violette-royale-2.jpg": `${W}.42 (1).jpeg`,
  "products/sweet-heart-1.jpg": `${W}.45 (5).jpeg`,
  "products/sweet-heart-2.jpg": `${W}.46 (3).jpeg`,
  "products/miroir-champagne-1.jpg": `${W}.46 (1).jpeg`,
  "products/miroir-champagne-2.jpg": `${W}.46 (2).jpeg`,

  "gallery/cadeautas.jpg": `${W}.46.jpeg`,
  "gallery/duo-ferrero.jpg": `${W}.46 (7).jpeg`,
  "gallery/snoeptaarten.jpg": `${W}.46 (3).jpeg`,
  "gallery/ringschaal.jpg": `${W}.45 (4).jpeg`,
  "gallery/roze-rozen.jpg": `${W}.45 (2).jpeg`,
  "gallery/spiegel.jpg": `${W}.46 (1).jpeg`,
  "gallery/paars-tiara.jpg": `${W}.42.jpeg`,
  "gallery/bordeaux.jpg": `${W}.43.jpeg`,
  "gallery/rood-champagne.jpg": `${W}.47.jpeg`,
};

for (const [out, src] of Object.entries(map)) {
  const dest = path.join("public/images", out);
  mkdirSync(path.dirname(dest), { recursive: true });
  const info = await sharp(src).rotate().jpeg({ quality: 86, mozjpeg: true }).toFile(dest);
  console.log(`${dest}  ${info.width}x${info.height}`);
}
