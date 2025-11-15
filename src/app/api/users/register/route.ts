import { db } from "../../../lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Missing input in e-mail/password" }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await db.collection("users").insertOne({ email, password: hashedPassword });
    return new Response(JSON.stringify({ message: "User registered", userId: result.insertedId }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to register user" }), { status: 500 });
  }
}
