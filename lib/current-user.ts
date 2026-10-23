import { cookies } from "next/headers";
import { readSession, SESSION_COOKIE, type SessionUser } from "@/lib/session";

export async function getSession(): Promise<SessionUser | null> {
    const cookieStore = await cookies();

    return readSession(cookieStore.get(SESSION_COOKIE)?.value);
}
