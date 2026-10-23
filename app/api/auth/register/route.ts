import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/database/user.model";
import { hashPassword } from "@/lib/password";
import { sessionCookieOptions, signSession, SESSION_COOKIE } from "@/lib/session";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const name = String(body.name || "").trim();
        const email = String(body.email || "").trim().toLowerCase();
        const password = String(body.password || "");

        if (name.length < 2) {
            return NextResponse.json({ message: "Enter your name." }, { status: 400 });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ message: "Use a password of at least 8 characters." }, { status: 400 });
        }

        await connectDB();

        const existing = await User.findOne({ email }).select("_id");

        if (existing) {
            return NextResponse.json({ message: "An account with that email already exists. Sign in instead." }, { status: 409 });
        }

        const user = await User.create({
            name,
            email,
            passwordHash: await hashPassword(password),
        });

        const token = await signSession({
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
        });

        const response = NextResponse.json({ message: "Account created" }, { status: 201 });
        response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());

        return response;
    } catch (error) {
        const message = error instanceof Error && error.message === "AUTH_SECRET is not set"
            ? "Sign-in is not configured yet."
            : "We could not create the account. The database may be unreachable.";

        return NextResponse.json({ message }, { status: 500 });
    }
}
