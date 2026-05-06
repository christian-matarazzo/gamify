import { Link } from 'react-router-dom';
import '../styles/AppFooter.css';

export default function AppFooter() {
    const footer_links = {
        shop: [
            { text: 'Trending', to: '/' },
            { text: 'Pre-orders', to: '/' },
            { text: 'New Releases', to: '/' },
        ],
        support: [
            { text: 'Technical Support', to: '/' },
            { text: 'Terms of Service', to: '/' },
            { text: 'Privacy Policy', to: '/' },
        ]
    };

    return (
        <footer className="gamify-footer bg-dark text-light pt-5 pb-3">
            <div className="container">
                <div className="row gy-4">
                    <div className="col-lg-4 col-md-12">
                        <Link className="navbar-brand d-flex align-items-center gap-2 gamify-footer-brand fs-3 fw-bold text-decoration-none text-white mb-3" to="/">
                            Gamify
                        </Link>
                        <p className="gamify-footer-description text-secondary">
                            Your ultimate gateway to the <strong>gaming world</strong>. From epic AAA blockbusters to hidden indie gems, find your next adventure across every platform.
                        </p>
                        <div className="d-flex gap-3 fs-4 gamify-socials">
                            <a href="https://facebook.com" className="text-light gamify-social-link" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href="https://twitter.com" className="text-light gamify-social-link" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                <i className="bi bi-twitter-x"></i>
                            </a>
                            <a href="https://discord.com" className="text-light gamify-social-link" target="_blank" rel="noopener noreferrer" aria-label="Discord">
                                <i className="bi bi-discord"></i>
                            </a>
                            <a href="https://instagram.com" className="text-light gamify-social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <i className="bi bi-instagram"></i>
                            </a>
                        </div>
                    </div>

                    <div className="col-lg-2 col-6">
                        <h5 className="gamify-footer-title mb-3">Shop</h5>
                        <ul className="nav flex-column gamify-footer-links">
                            {footer_links.shop.map((link) => (
                                <li key={link.text} className="nav-item mb-2">
                                    <Link to={link.to} className="nav-link p-0 text-secondary">{link.text}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-lg-2 col-6">
                        <h5 className="gamify-footer-title mb-3">Support</h5>
                        <ul className="nav flex-column gamify-footer-links">
                            {footer_links.support.map((link) => (
                                <li key={link.text} className="nav-item mb-2">
                                    <Link to={link.to} className="nav-link p-0 text-secondary">{link.text}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-lg-4 col-md-12">
                        <h5 className="gamify-footer-title mb-3">Subscribe to our newsletter!</h5>
                        <p className="text-secondary small">Get updates on new releases and exclusive offers</p>
                        <div className="input-group mb-3 gamify-newsletter-group">
                            <input
                                type="email"
                                className="form-control bg-transparent text-white border-secondary"
                                aria-label="Email"
                            />
                            <button className="btn btn-primary gamify-btn-subscribe" type="button">Join</button>
                        </div>
                    </div>
                </div>

                <hr className="my-4 border-secondary gamify-footer-divider" />

                <div className="row">
                    <div className="col-12 text-center text-secondary small">
                        <p className="gamify-copyright">
                            &copy; {new Date().getFullYear()} Gamify Inc. All trademarks, service marks, and logos are the property of their respective owners.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}