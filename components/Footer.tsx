import Link from "next/link";
import BrandMark from "@/components/BrandMark";

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <Link href="/" className="logo">
                        <BrandMark size={32} />
                        <p>MlimaEvents</p>
                    </Link>
                    <p>
                        The gatherings around Mt Kenya, in one place. Concerts, weddings,
                        church, meetups and everything in between.
                    </p>
                </div>

                <div>
                    <p className="footer-label">The Mlima family</p>
                    <ul>
                        <li>
                            <a href="https://mlimalms.vercel.app/" target="_blank" rel="noreferrer">
                                MlimaLMS
                            </a>
                        </li>
                        <li>
                            <a href="https://mlimalink.vercel.app/" target="_blank" rel="noreferrer">
                                MlimaLink
                            </a>
                        </li>
                        <li>
                            <Link href="/">MlimaEvents</Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <p className="footer-label">On this site</p>
                    <ul>
                        <li>
                            <Link href="/#events">Browse events</Link>
                        </li>
                        <li>
                            <Link href="/events/create">Host an event</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <p className="footer-copy">© {new Date().getFullYear()} MlimaEvents · Nyeri, Kenya</p>
        </footer>
    );
};

export default Footer;
