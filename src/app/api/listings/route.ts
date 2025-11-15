import { db } from "../../lib/mongodb";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");

  try {
    const query = category ? { category } : {};
    const listings = await db.collection("listings").find(query).toArray();

    return new Response(JSON.stringify(listings), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return new Response(JSON.stringify([]), { status: 200 });
  }
}