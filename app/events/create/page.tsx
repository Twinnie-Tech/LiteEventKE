import { redirect } from "next/navigation";
import CreateEvent from "@/components/CreateEvent";
import { getSession } from "@/lib/current-user";

const CreateEventPage = async () => {
    const session = await getSession();

    if (!session) {
        redirect("/login?next=/events/create");
    }

    return <CreateEvent organizer={session.name} />;
};

export default CreateEventPage;
