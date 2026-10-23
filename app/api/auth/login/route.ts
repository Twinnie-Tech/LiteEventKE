import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/database/user.model";
import { verifyPassword } from "@/lib/password";
import { sessionCookieOptions, signSession, SESSION_COOKIE } from "@/lib/session";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = String(body.email || "").trim().toLowerCase();
        const password = String(body.password || "");

        if (!email || !password) {
            return NextResponse.json({ message: "Enter your email and password." }, { status: 400 });
        }

        await connectDB();

        const user = await User.findOne({ email });

        if (!user || !(await verifyPassword(password, user.passwordHash))) {
            return NextResponse.json({ message: "That email and password do not match." }, { status: 401 });
        }

        const token = await signSession({
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
        });

        const response = NextResponse.json({ message: "Signed in" });
        response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());

        return response;
    } catch (error) {
        const message = error instanceof Error && error.message === "AUTH_SECRET is not set"
            ? "Sign-in is not configured yet."
            : "We could not sign you in. The database may be unreachable.";

        return NextResponse.json({ message }, { status: 500 });
    }
}
