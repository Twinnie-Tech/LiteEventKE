"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const AuthForm = ({ mode, nextPath }: { mode: "login" | "register"; nextPath: string }) => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);
    const isRegister = mode === "register";

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setPending(true);
        setError("");

        const response = await fetch(isRegister ? "/api/auth/register" : "/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(isRegister ? { name, email, password } : { email, password }),
        });

        const result = await response.json().catch(() => ({ message: "Something went wrong." }));

        if (!response.ok) {
            setError(result.message || "Something went wrong.");
            setPending(false);
            return;
        }

        router.push(nextPath);
        router.refresh();
    };

    return (
        <section className="sheet">
            <p className="eyebrow">
                <span className="dot" />
                {isRegister ? "Create an account" : "Sign in to host"}
            </p>
            <h1>{isRegister ? "Join MlimaEvents." : "Sign in first."}</h1>
            <p className="lede">
                {isRegister
                    ? "An account lets you put a gathering on the mountain."
                    : "Hosting is for signed-in people. Sign in, then tell the mountain what is happening."}
            </p>

            <form className="stack-form" onSubmit={onSubmit}>
                {isRegister ? (
                    <label className="field">
                        Name
                        <input value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" />
                    </label>
                ) : null}

                <label className="field">
                    Email
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
                </label>

                <label className="field">
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        minLength={8}
                        autoComplete={isRegister ? "new-password" : "current-password"}
                    />
                </label>

                {error ? <p className="form-error">{error}</p> : null}

                <button className="btn-primary" type="submit" disabled={pending}>
                    {pending ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
                </button>
            </form>

            <p className="auth-switch">
                {isRegister ? "Already have an account?" : "New here?"}{" "}
                <Link href={`${isRegister ? "/login" : "/register"}?next=${encodeURIComponent(nextPath)}`}>
                    {isRegister ? "Sign in" : "Create an account"}
                </Link>
            </p>
        </section>
    );
};

export default AuthForm;
