import { promises as fs } from "fs";
import path from "path";

const formatName = (name: string) =>
  name.trim().toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export async function GET() {
  try {
    const categories = ["boende", "upplevelse"];
    const images: { category: string; path: string; destination: string; place: string }[] = [];

    for (const category of categories) {
      const baseDir = path.join(process.cwd(), `public/NavImage/images/${category}`);
      const destinations = await fs.readdir(baseDir, { withFileTypes: true }).catch(() => []);
      for (const dest of destinations.filter(d => d.isDirectory())) {
        const destDir = path.join(baseDir, dest.name);
        const places = await fs.readdir(destDir, { withFileTypes: true }).catch(() => []);
        for (const place of places.filter(p => p.isDirectory())) {
          const placeDir = path.join(destDir, place.name);
          const files = await fs.readdir(placeDir).catch(() => []);
          for (const file of files) {
            images.push({
              category,
              path: `/NavImage/images/${category}/${formatName(dest.name)}/${formatName(place.name)}/${file}`,
              destination: formatName(dest.name),
              place: formatName(place.name),
            });
          }
        }
      }
    }

    return new Response(JSON.stringify(images), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify([]), { status: 500 });
  }
}
