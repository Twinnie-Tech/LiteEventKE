import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getSession } from "@/lib/current-user";
import { safeNextPath } from "@/lib/session";

const RegisterPage = async ({ searchParams }: { searchParams: Promise<{ next?: string }> }) => {
    const session = await getSession();
    const nextPath = safeNextPath((await searchParams).next);

    if (session) {
        redirect(nextPath);
    }

    return <AuthForm mode="register" nextPath={nextPath} />;
};

export default RegisterPage;
