import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readSession, safeNextPath, SESSION_COOKIE } from "@/lib/session";

export async function proxy(request: NextRequest) {
    const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value);

    if (!session) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.search = "";
        loginUrl.searchParams.set("next", safeNextPath(request.nextUrl.pathname));

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/events/create"],
};
