import { db } from "../../lib/mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  console.log("🎯 Bookings API called - FÖRSTA RAD!");
  
  try {
    console.log("🎯 Inne i try-block!");
    
    // Hämta cookie
    const cookieHeader = req.headers.get("cookie") || "";
    console.log("🎯 Cookie header:", cookieHeader);
    
    const token = cookieHeader
      .split("; ")
      .find(row => row.startsWith("token="))
      ?.split("=")[1];
    
    console.log("🎯 Token received:", token ? "YES" : "NO");
    console.log("🎯 JWT_SECRET exists:", !!JWT_SECRET);
    
    if (!token) {
      console.log("🎯 Ingen token hittades!");
      return new Response(JSON.stringify({ error: "Inte auktoriserad" }), { status: 401 });
    }

    // Verifiera JWT
    let decoded;
    try {
      console.log("🎯 Försöker verifiera JWT...");
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      console.log("🎯 JWT verifierad! UserId:", decoded.userId);
    } catch (err) {
      console.log("🎯 JWT verification error:", err);
      return new Response(JSON.stringify({ error: "Inte auktoriserad. Logga in igen." }), { status: 401 });
    }

    const userId = decoded.userId;

    // Hämta data från frontend
    const { listingId, startDate, endDate, guests, totalPrice, paymentMethod, paid } = await req.json();
    
    if (!listingId || !startDate || !endDate) {
      return new Response(JSON.stringify({ error: "Fälten listingId, startDate och endDate krävs" }), { status: 400 });
    }

    // Spara bokning
    const result = await db.collection("bookings").insertOne({
      userId,
      listingId,
      startDate,
      endDate,
      guests,
      totalPrice,
      paymentMethod,
      paid: paid || false,
    });

    console.log("🎯 Bokning sparad! ID:", result.insertedId);
    return new Response(JSON.stringify({ bookingId: result.insertedId }), { status: 201 });

  } catch (err) {
    console.error("🎯 Error i bookings API:", err);
    return new Response(JSON.stringify({ error: "Misslyckades med bokningen" }), { status: 500 });
  }
}
