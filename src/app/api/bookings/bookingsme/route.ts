import { db } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader.split("; ").find(r => r.startsWith("token="))?.split("=")[1];

    if (!token) return new Response(JSON.stringify({ error: "Inte auktoriserad" }), { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
      return new Response(JSON.stringify({ error: "Inte auktoriserad. Logga in igen." }), { status: 401 });
    }

    const bookings = await db.collection("bookings").find({ userId: decoded.userId }).toArray();
    return new Response(JSON.stringify(bookings), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Misslyckades med att hämta bokningar" }), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader.split("; ").find(r => r.startsWith("token="))?.split("=")[1];
    if (!token) return new Response(JSON.stringify({ error: "Inte auktoriserad" }), { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
      return new Response(JSON.stringify({ error: "Inte auktoriserad. Logga in igen." }), { status: 401 });
    }

    const url = new URL(req.url);
    const bookingId = url.searchParams.get("id");
    if (!bookingId) return new Response(JSON.stringify({ error: "Ingen bokning angiven" }), { status: 400 });

    // Se till att userId är string
    const result = await db.collection("bookings").deleteOne({
      _id: new ObjectId(bookingId),
      userId: decoded.userId
    });

    if (result.deletedCount === 0) return new Response(JSON.stringify({ error: "Bokning hittades inte" }), { status: 404 });

    return new Response(JSON.stringify({ message: "Bokning borttagen" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Misslyckades med att ta bort bokningen" }), { status: 500 });
  }
}


