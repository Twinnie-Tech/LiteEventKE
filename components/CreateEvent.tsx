"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const CreateEvent = ({ organizer }: { organizer: string }) => {
    const router = useRouter();
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPending(true);
        setError("");

        const form = event.currentTarget;
        const data = new FormData(form);
        const tags = String(data.get("tags") || "")
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
        const agenda = String(data.get("agenda") || "")
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean);

        if (tags.length === 0 || agenda.length === 0) {
            setError("Add at least one tag and one agenda line.");
            setPending(false);
            return;
        }

        data.set("tags", JSON.stringify(tags));
        data.set("agenda", JSON.stringify(agenda));

        const response = await fetch("/api/events", {
            method: "POST",
            body: data,
        });
        const result = await response.json().catch(() => ({ message: "Could not create the event." }));

        if (!response.ok) {
            setError(result.message || "Could not create the event.");
            setPending(false);
            return;
        }

        router.push(`/events/${result.event.slug}`);
        router.refresh();
    };

    return (
        <section className="sheet">
            <p className="eyebrow">
                <span className="dot" />
                Host on MlimaEvents
            </p>
            <h1>Put your gathering on the mountain.</h1>
            <p className="lede">
                You are signed in as {organizer}. Tell people around Mt Kenya what is happening, where, and when.
            </p>

            <form className="field-grid two" onSubmit={onSubmit}>
                <label className="field span-2">
                    Event title
                    <input name="title" required maxLength={100} placeholder="Nyeri Jazz Night" />
                </label>

                <label className="field span-2">
                    Short overview
                    <input name="overview" required maxLength={500} placeholder="One or two sentences people will see first." />
                </label>

                <label className="field span-2">
                    Description
                    <textarea name="description" required maxLength={1000} rows={4} placeholder="What should people expect?" />
                </label>

                <label className="field">
                    Venue
                    <input name="venue" required placeholder="Outspan Hotel" />
                </label>

                <label className="field">
                    Town
                    <input name="location" required placeholder="Nyeri, Kenya" />
                </label>

                <label className="field">
                    Date
                    <input name="date" type="date" required />
                </label>

                <label className="field">
                    Time
                    <input name="time" type="time" required />
                </label>

                <label className="field">
                    Mode
                    <select name="mode" defaultValue="offline" required>
                        <option value="offline">In person</option>
                        <option value="online">Online</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </label>

                <label className="field">
                    Who it is for
                    <input name="audience" required placeholder="Everyone, students, founders" />
                </label>

                <label className="field span-2">
                    Tags
                    <input name="tags" required placeholder="Music, Weekend, Nyeri" />
                </label>

                <label className="field span-2">
                    Agenda
                    <textarea name="agenda" required rows={4} placeholder={"6:00 PM Doors\n7:00 PM First set\n9:00 PM Close"} />
                </label>

                <label className="field span-2">
                    Poster
                    <input name="image" type="file" accept="image/*" required />
                </label>

                <label className="field span-2">
                    Organizer name
                    <input name="organizer" required defaultValue={organizer} />
                </label>

                {error ? <p className="form-error span-2">{error}</p> : null}

                <div className="span-2">
                    <button className="btn-primary" type="submit" disabled={pending}>
                        {pending ? "Publishing…" : "Publish event"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default CreateEvent;
