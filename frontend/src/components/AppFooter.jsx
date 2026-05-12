import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import '../styles/AppFooter.css';

export default function AppFooter() {
    const [newsletterStatus, setNewsletterStatus] = useState('idle');
    const [newsletterMessage, setNewsletterMessage] = useState('');

    const footerLinks = {
        shop: [
            { text: 'Home', path: '/' },
            { text: 'Pre-orders', path: '/games/preorders' },
            { text: 'New Releases', path: '/' },
        ],
        support: [
            { text: 'Technical Support', path: '/support' },
            { text: 'Terms of Service', path: '/terms' },
            { text: 'Privacy Policy', path: '/privacy' },
        ]
    };

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;

        setNewsletterStatus('loading');
        setNewsletterMessage('');

        try {
            const response = await axios.post(
                'http://localhost:3000/api/newsletter/subscribe',
                { email }
            );

            if (response.data.success) {
                setNewsletterStatus('success');
                setNewsletterMessage('Thank you for subscribing!');
                e.target.reset();
            } else {
                setNewsletterStatus('error');
                setNewsletterMessage(response.data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Newsletter error:', error);

            if (error.response?.status === 409) {
                setNewsletterStatus('error');
                setNewsletterMessage('This email is already registered');
            } else {
                setNewsletterStatus('error');
                setNewsletterMessage('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <footer className="gamify-footer pt-5 pb-3">
            <div className="container">
                <div className="row gy-4">
                    <div className="col-lg-4 col-md-12">
                        <Link className="navbar-brand d-flex align-items-center gap-2 gamify-footer-brand fs-3 fw-bold text-decoration-none mb-3" to="/">
                            <img className="gamify-logo-footer" src="/img/gamify-logo-bw.png" alt="Gamify Logo" />
                        </Link>
                        <p className="gamify-footer-description">
                            Your ultimate gateway to the <strong>gaming world</strong>. From epic AAA blockbusters to hidden indie gems, find your next adventure across every platform.
                        </p>
                        <div className="d-flex gap-3 fs-4 gamify-socials">
                            <a href="https://facebook.com" className="gamify-social-link" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href="https://twitter.com" className="gamify-social-link" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                <i className="bi bi-twitter-x"></i>
                            </a>
                            <a href="https://discord.com" className="gamify-social-link" target="_blank" rel="noopener noreferrer" aria-label="Discord">
                                <i className="bi bi-discord"></i>
                            </a>
                            <a href="https://instagram.com" className="gamify-social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <i className="bi bi-instagram"></i>
                            </a>
                        </div>
                    </div>

                    <div className="col-lg-2 col-6">
                        <h5 className="gamify-footer-title mb-3">Shop</h5>
                        <ul className="nav flex-column gamify-footer-links">
                            {footerLinks.shop.map((link) => (
                                <li key={link.text} className="nav-item mb-2">
                                    <NavLink to={link.path} className="nav-link p-0">
                                        {link.text}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-lg-2 col-6">
                        <h5 className="gamify-footer-title mb-3">Support</h5>
                        <ul className="nav flex-column gamify-footer-links">
                            {footerLinks.support.map((link) => (
                                <li key={link.text} className="nav-item mb-2">
                                    <NavLink to={link.path} className="nav-link p-0">
                                        {link.text}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-lg-4 col-md-12">
                        <h5 className="gamify-footer-title mb-3">Subscribe to our newsletter!</h5>
                        <p className="small">Get updates on new releases and exclusive offers</p>

                        <form onSubmit={handleNewsletterSubmit} className="gamify-newsletter-group mb-3">
                            <div className="input-group">
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Your mail goes here..."
                                    aria-label="Email"
                                    required
                                    disabled={newsletterStatus === 'loading'}
                                />
                                <button
                                    className="gamify-btn-subscribe"
                                    type="submit"
                                    disabled={newsletterStatus === 'loading'}
                                >
                                    {newsletterStatus === 'loading' ? 'Joining...' : 'Join'}
                                </button>
                            </div>
                        </form>

                        {newsletterStatus === 'success' && (
                            <p className="gamify-newsletter-success mb-0">
                                <i class="bi bi-check-lg"></i> {newsletterMessage}
                            </p>
                        )}

                        {newsletterStatus === 'error' && (
                            <p className="gamify-newsletter-error mb-0">
                                <i class="bi bi-x-lg"></i> {newsletterMessage}
                            </p>
                        )}
                    </div>
                </div>

                <hr className="my-4 gamify-footer-divider" />

                <div className="row">
                    <div className="col-12 text-center small">
                        <p className="gamify-copyright">
                            &copy; {new Date().getFullYear()} Gamify Inc. All trademarks, service marks, and logos are the property of their respective owners.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}