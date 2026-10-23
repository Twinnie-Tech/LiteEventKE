import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import { formatEventDate, formatEventTime } from "@/lib/format";

interface Props {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}

const EventCard = ({ title, image, slug, location, date, time }: Props) => {
    return (
        <Link href={`/events/${slug}`} className="event-card">
            <div className="poster-wrap">
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 360px"
                        className="poster"
                    />
                ) : null}
            </div>

            <div className="card-body">
                <p className="title">{title}</p>

                <div className="datetime">
                    <div>
                        <MapPin size={14} />
                        <p>{location}</p>
                    </div>
                    <div>
                        <Calendar size={14} />
                        <p>{formatEventDate(date)}</p>
                    </div>
                    <div>
                        <Clock size={14} />
                        <p>{formatEventTime(time)}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
