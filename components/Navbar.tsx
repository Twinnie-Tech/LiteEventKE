import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import { getSession } from "@/lib/current-user";

const Navbar = async () => {
    const session = await getSession();

    return (
        <header>
            <nav>
                <Link href="/" className="logo">
                    <BrandMark />
                    <p>MlimaEvents</p>
                </Link>

                <ul>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/#events">Events</Link></li>
                    {session ? (
                        <>
                            <li><span className="nav-name">{session.name}</span></li>
                            <li>
                                <form action="/api/auth/logout" method="post">
                                    <button className="nav-quiet" type="submit">Sign out</button>
                                </form>
                            </li>
                        </>
                    ) : (
                        <li><Link href="/login?next=/events/create">Sign in</Link></li>
                    )}
                    <li><Link href="/events/create" className="nav-cta">Host an event</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
