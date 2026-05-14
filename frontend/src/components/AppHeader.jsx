import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartSidebar from './CartSidebar';
import '../styles/AppHeader.css';

export default function AppHeader() {

    const [cartOpen, setCartOpen] = useState(false);

    const navLinks = [
        { text: 'Home', path: '/' },
        { text: 'Pre-orders', path: '/games/preorders' },
        { text: 'Blog', path: '/' },
        { text: 'Technical Support', path: '/support' },
    ];

    function handleNavClick() {
        const element = document.getElementById('gamifyNavCollapse');
        const bsCollapse = Collapse.getInstance(element);
        if (bsCollapse) bsCollapse.hide();
    }

    const { cart } = useCart();
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <>
            <header>
                <nav className="navbar navbar-expand-lg px-3 px-lg-4 gamify-navbar">
                    <Link className="navbar-brand d-flex align-items-center gap-2 gamify-brand" to="/">
                        <img className="gamify-logo" src="/img/gamify-logo-main.png" alt="Gamify Logo" />
                    </Link>

                    <button
                        className="navbar-toggler ms-auto ms-3"
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
                            {navLinks.map((link) => (
                                <li key={link.text} className="nav-item">
                                    <NavLink
                                        className="nav-link"
                                        to={link.path}
                                        onClick={handleNavClick}
                                    >
                                        {link.text}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>

                        <div className="d-flex align-items-center gap-2 gamify-actions">
                            <Link to="/search">
                                <button className="gamify-icon-btn" aria-label="Search">
                                    <i className="bi bi-search"></i>
                                </button>
                            </Link>
                            <button
                                className="gamify-icon-btn position-relative"
                                aria-label="Cart"
                                onClick={() => setCartOpen(true)}
                            >
                                <i className="bi bi-cart"></i>
                                {cartCount > 0 && (
                                    <span className="gamify-cart-badge">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </button>
                            <Link to="/wishlist">
                                <button className="gamify-icon-btn" aria-label="Cart">
                                    <i className="bi bi-heart"></i>
                                </button>
                            </Link>
                            <div className="gamify-divider d-none d-lg-block"></div>
                            <button className="gamify-btn-login">Log In</button>
                        </div>
                    </div>
                </nav>
            </header>

            <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    );
}