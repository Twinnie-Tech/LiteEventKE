"use client";

import { IEvent } from "@/database";
import { FormEvent, useMemo, useState } from "react";
import { Calendar, MapPin, Search, Sparkles, Users } from "lucide-react";
import ExploreBtn from "./ExploreBtn";
import EventCard from "./EventCard";
import { formatEventDate, formatEventTime } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";

interface Props {
    events: IEvent[];
    unavailable?: boolean;
}

const COUNTIES = [
    "Nyeri",
    "Kirinyaga",
    "Murang'a",
    "Meru",
    "Embu",
    "Laikipia",
    "Tharaka-Nithi",
    "Nyandarua",
];

const KINDS = [
    "Concerts",
    "Weddings",
    "Church",
    "Hackathons",
    "Meetups",
    "Seminars",
    "Birthdays",
    "Conferences",
    "Sports",
    "Festivals",
];

const EventsSection = ({ events, unavailable = false }: Props) => {
    const [activeTag, setActiveTag] = useState<string>("All");
    const [query, setQuery] = useState("");

    const allTags = useMemo(() => {
        const tagSet = new Set<string>();

        events.forEach((event) => {
            event.tags?.forEach((tag) => tagSet.add(tag));
        });

        return ["All", ...Array.from(tagSet)];
    }, [events]);

    const filteredEvents = useMemo(() => {
        const needle = query.trim().toLowerCase();

        return events.filter((event) => {
            const tagMatch = activeTag === "All" || event.tags?.includes(activeTag);
            const haystack = [event.title, event.location, event.organizer, ...(event.tags ?? [])]
                .join(" ")
                .toLowerCase();
            const queryMatch = !needle || haystack.includes(needle);

            return tagMatch && queryMatch;
        });
    }, [activeTag, events, query]);

    const featured = events[0];
    const upcoming = events[1];
    const towns = new Set(events.map((event) => event.location).filter(Boolean)).size;

    const onSearch = (event: FormEvent) => {
        event.preventDefault();
        document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            <section className="hero">
                <div className="hero-copy">
                    <p className="eyebrow">
                        <span className="dot" />
                        Events around Mt Kenya
                    </p>

                    <h1>
                        See what&apos;s on.
                        <span>Show up together.</span>
                    </h1>

                    <p className="lede">
                        Concerts, weddings, church services, hackathons and weekend meetups
                        across Nyeri, Kirinyaga, Meru, Embu and the ridges around them.
                    </p>

                    <form className="search-bar" onSubmit={onSearch}>
                        <Search size={18} />
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Nyeri, a wedding, a meetup..."
                            aria-label="Search events"
                        />
                        <button type="submit">Search</button>
                    </form>

                    <div className="cta-row">
                        <ExploreBtn />
                        <Link href="/events/create" className="btn-ghost">
                            Host an event
                        </Link>
                    </div>

                    <ul className="hero-points">
                        <li>Free to browse</li>
                        <li>Book with your email</li>
                        <li>Made for the mountain</li>
                    </ul>
                </div>

                <div className="hero-stage">
                    {featured ? (
                        <Link href={`/events/${featured.slug}`} className="stage-card stage-main">
                            <div className="stage-photo">
                                {featured.image ? (
                                    <Image
                                        src={featured.image}
                                        alt=""
                                        fill
                                        sizes="380px"
                                        className="object-cover"
                                    />
                                ) : null}
                            </div>
                            <div className="stage-copy">
                                <p>{featured.location}</p>
                                <strong>{featured.title}</strong>
                                <span>
                                    {formatEventDate(featured.date)} · {formatEventTime(featured.time)}
                                </span>
                            </div>
                        </Link>
                    ) : (
                        <div className="stage-card stage-main stage-empty">
                            <Sparkles size={18} />
                            <p>Your next gathering</p>
                            <strong>Nyeri · Meru · Kirinyaga</strong>
                            <span>Weddings, church, concerts and meetups will land here.</span>
                        </div>
                    )}

                    <div className="stage-float">
                        <span className="dot" />
                        <div>
                            <p>{events.length ? "Around the mountain" : unavailable ? "Can't reach Atlas" : "Just getting started"}</p>
                            <strong>
                                {events.length
                                    ? `${events.length} ${events.length === 1 ? "event" : "events"} listed`
                                    : unavailable
                                    ? "Allow this IP in Network Access"
                                    : "Be the first to host"}
                            </strong>
                        </div>
                    </div>

                    {upcoming ? (
                        <div className="stage-next">
                            <p>Up next</p>
                            <strong>{upcoming.title}</strong>
                            <span>{upcoming.location}</span>
                        </div>
                    ) : null}
                </div>
            </section>

            <div className="marquee" aria-hidden>
                <div className="marquee-track">
                    {[...KINDS, ...KINDS].map((kind, index) => (
                        <span key={`${kind}-${index}`}>{kind}</span>
                    ))}
                </div>
            </div>

            <section id="events" className="events-block">
                <div className="section-head">
                    <div>
                        <p className="eyebrow">Featured</p>
                        <h2>Happening around the mountain</h2>
                    </div>
                    <p className="section-note">
                        {events.length} events · {towns} {towns === 1 ? "town" : "towns"}
                    </p>
                </div>

                <div className="county-row">
                    {COUNTIES.map((county) => (
                        <button
                            key={county}
                            type="button"
                            className={query.toLowerCase() === county.toLowerCase() ? "tag-pill is-active" : "tag-pill"}
                            onClick={() => {
                                setActiveTag("All");
                                setQuery((current) =>
                                    current.toLowerCase() === county.toLowerCase() ? "" : county
                                );
                            }}
                        >
                            {county}
                        </button>
                    ))}
                </div>

                <div className="tag-row">
                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => setActiveTag(tag)}
                            className={activeTag === tag ? "tag-pill is-active" : "tag-pill"}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <ul className="events">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event, index) => (
                            <li
                                key={event._id?.toString()}
                                className="event-item"
                                style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
                            >
                                <EventCard {...event} />
                            </li>
                        ))
                    ) : (
                        <li className="empty-events">
                            <p>
                                {unavailable
                                    ? "Events can't load yet. MongoDB Atlas is blocking this network. In Atlas, open Network Access and add your current IP address."
                                    : events.length === 0
                                    ? "No gatherings are listed yet. When a host adds one, it will show up here."
                                    : "Nothing matches that around the mountain yet."}
                            </p>
                            {events.length > 0 ? (
                                <button
                                    type="button"
                                    className="btn-ghost"
                                    onClick={() => {
                                        setQuery("");
                                        setActiveTag("All");
                                    }}
                                >
                                    Clear filters
                                </button>
                            ) : null}
                        </li>
                    )}
                </ul>
            </section>

            <section className="story-grid">
                <article>
                    <p className="eyebrow">How it works</p>
                    <h2>From a rumour to a full room.</h2>
                    <ol>
                        <li>
                            <span>1</span>
                            <div>
                                <strong>Look around</strong>
                                <p>Filter by town or the kind of gathering you actually want.</p>
                            </div>
                        </li>
                        <li>
                            <span>2</span>
                            <div>
                                <strong>Save your spot</strong>
                                <p>Leave your email so the host knows you are coming.</p>
                            </div>
                        </li>
                        <li>
                            <span>3</span>
                            <div>
                                <strong>Show up</strong>
                                <p>Time, place and the people are already in one card.</p>
                            </div>
                        </li>
                    </ol>
                </article>

                <div className="audience-grid">
                    <article>
                        <Users size={18} />
                        <h3>Guests</h3>
                        <p>Find the wedding, concert or meetup you would have heard about too late.</p>
                    </article>
                    <article>
                        <Calendar size={18} />
                        <h3>Hosts</h3>
                        <p>Put a service, conference or celebration in front of people nearby.</p>
                    </article>
                    <article>
                        <MapPin size={18} />
                        <h3>Communities</h3>
                        <p>Churches, campuses and groups keep their people on the same calendar.</p>
                    </article>
                </div>
            </section>
        </>
    );
};

export default EventsSection;
