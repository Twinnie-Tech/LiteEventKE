export const SESSION_COOKIE = "mlima_session";

export type SessionUser = {
    userId: string;
    name: string;
    email: string;
};

type SessionPayload = SessionUser & { exp: number };

const encoder = new TextEncoder();

function secret() {
    const value = process.env.AUTH_SECRET;

    if (!value) {
        throw new Error("AUTH_SECRET is not set");
    }

    return value;
}

function bytesToBase64Url(bytes: Uint8Array) {
    let binary = "";

    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });

    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
}

async function hmac(value: string) {
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret()),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));

    return bytesToBase64Url(new Uint8Array(signature));
}

function safeEqual(left: string, right: string) {
    if (left.length !== right.length) {
        return false;
    }

    let difference = 0;

    for (let index = 0; index < left.length; index += 1) {
        difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
    }

    return difference === 0;
}

export function safeNextPath(value: string | null | undefined) {
    if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
        return "/events/create";
    }

    return value;
}

export async function signSession(user: SessionUser) {
    const payload: SessionPayload = {
        ...user,
        exp: Date.now() + 1000 * 60 * 60 * 24 * 14,
    };
    const body = bytesToBase64Url(encoder.encode(JSON.stringify(payload)));
    const signature = await hmac(body);

    return `${body}.${signature}`;
}

export async function readSession(token: string | undefined | null): Promise<SessionUser | null> {
    if (!token) {
        return null;
    }

    const [body, signature] = token.split(".");

    if (!body || !signature) {
        return null;
    }

    try {
        const expected = await hmac(body);

        if (!safeEqual(signature, expected)) {
            return null;
        }

        const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(body))) as SessionPayload;

        if (!payload.userId || !payload.email || !payload.name || payload.exp < Date.now()) {
            return null;
        }

        return {
            userId: payload.userId,
            name: payload.name,
            email: payload.email,
        };
    } catch {
        return null;
    }
}

export function sessionCookieOptions(maxAge = 60 * 60 * 24 * 14) {
    return {
        httpOnly: true,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge,
    };
}
