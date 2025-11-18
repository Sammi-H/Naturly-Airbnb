import { db } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

interface Props {
  params: { id: string };
}

export async function GET(req: Request, { params }: Props) {
  try {
    const id = params.id;
    const listings = await db
      .collection("listings")
      .findOne({ _id: new ObjectId(id) });

    if (!listings) {
      return new Response("Listing not found", { status: 404 });
    }

    return new Response(JSON.stringify(listings), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
