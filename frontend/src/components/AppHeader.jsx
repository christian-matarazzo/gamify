import { Link } from 'react-router-dom';
import '../styles/AppHeader.css';

export default function AppHeader() {

    const nav_links = [
        { text: 'Trending' },
        { text: 'Pre-orders' },
        { text: 'Blog' },
        { text: 'New Releases' },
        { text: 'Technical Support' },
    ];

    return (
        <header>
            <nav className="navbar navbar-expand-lg px-3 px-lg-4 gamify-navbar">
                <Link className="navbar-brand d-flex align-items-center gap-2 gamify-brand" to="/">
                    Gamify
                </Link>

                <button
                    className="navbar-toggler ms-auto me-2"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#gamifyNavCollapse"
                    aria-controls="gamifyNavCollapse"
                    aria-expanded="false"
                    aria-label="Menu"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-between" id="gamifyNavCollapse">
                    <ul className="navbar-nav mx-auto gap-1 gamify-links">
                        {nav_links.map((link) => (
                            <li key={link.text} className="nav-item">
                                <Link
                                    className="nav-link"
                                    to="/"
                                    data-bs-toggle="collapse"
                                    data-bs-target=".navbar-collapse.show"
                                >
                                    {link.text}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="d-flex align-items-center gap-2 gamify-actions">
                        <button className="gamify-icon-btn" aria-label="Search">
                            <i className="bi bi-search"></i>
                        </button>

                        <button className="gamify-icon-btn" aria-label="Cart">
                            <i className="bi bi-cart"></i>
                        </button>

                        <div className="gamify-divider d-none d-lg-block"></div>
                        <button className="gamify-btn-login">Log In</button>
                    </div>
                </div>
            </nav>
        </header>
    );
}