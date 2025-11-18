import { db } from "../../../lib/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
export async function POST(req: Request) {
  console.log("🎯 JWT_SECRET i login:", JWT_SECRET);

  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Missing input for email/password" }), { status: 400 });
  }

  try {
    const user = await db.collection("users").findOne({ email });
    if (!user) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });

    const isMatching = await bcrypt.compare(password, user.password);
    if (!isMatching) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET!,
      { expiresIn: "1h" }
    );

    console.log("🎯 Token genererad:", token);

    return new Response(JSON.stringify({ message: "Login successful" }), {
      status: 200,
      headers: {
        "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`,
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
