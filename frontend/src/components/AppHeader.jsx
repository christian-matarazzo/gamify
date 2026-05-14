import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartSidebar from './CartSidebar';
import '../styles/AppHeader.css';

function AuthDropdown({ onClose }) {
    const [tab, setTab] = useState('login');
    const [loginData, setLoginData] = useState({ email: '', password: '', remember: false });
    const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', confirm: '' });
    const [recoverData, setRecoverData] = useState({ email: '' });
    const [showPassword, setShowPassword] = useState(false);

    function handleLogin(e) {
        e.preventDefault();
    }

    function handleRegister(e) {
        e.preventDefault();
    }

    function handleRecover(e) {
        e.preventDefault();
    }

    return (
        <div className="gamify-auth-dropdown">
            {tab !== 'recover' && (
                <div className="gamify-auth-tabs">
                    <button
                        className={`gamify-auth-tab ${tab === 'login' ? 'active' : ''}`}
                        onClick={() => setTab('login')}
                        type="button"
                    >
                        Log In
                    </button>
                    <button
                        className={`gamify-auth-tab ${tab === 'register' ? 'active' : ''}`}
                        onClick={() => setTab('register')}
                        type="button"
                    >
                        Register
                    </button>
                </div>
            )}

            {tab === 'login' && (
                <form className="gamify-auth-form" onSubmit={handleLogin}>
                    <div className="gamify-auth-field">
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            value={loginData.email}
                            onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="gamify-auth-field">
                        <label htmlFor="login-password">Password</label>
                        <div className="gamify-auth-password-wrap">
                            <input
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                value={loginData.password}
                                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                className="gamify-auth-eye"
                                aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                                onClick={() => setShowPassword(v => !v)}
                            >
                                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                            </button>
                        </div>
                    </div>
                    <div className="gamify-auth-row">
                        <label className="gamify-auth-check">
                            <input
                                type="checkbox"
                                checked={loginData.remember}
                                onChange={e => setLoginData({ ...loginData, remember: e.target.checked })}
                            />
                            <span>Remember me</span>
                        </label>
                        <button
                            type="button"
                            className="gamify-auth-link"
                            onClick={() => setTab('recover')}
                        >
                            Forgot password?
                        </button>
                    </div>
                    <button type="submit" className="gamify-auth-submit">
                        Log In
                    </button>
                    <p className="gamify-auth-footer">
                        No account?{' '}
                        <button type="button" className="gamify-auth-link" onClick={() => setTab('register')}>
                            Sign up
                        </button>
                    </p>
                </form>
            )}

            {tab === 'register' && (
                <form className="gamify-auth-form" onSubmit={handleRegister}>
                    <div className="gamify-auth-field">
                        <label htmlFor="reg-username">Username</label>
                        <input
                            id="reg-username"
                            type="text"
                            placeholder="GamerXYZ"
                            autoComplete="username"
                            value={registerData.username}
                            onChange={e => setRegisterData({ ...registerData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div className="gamify-auth-field">
                        <label htmlFor="reg-email">Email</label>
                        <input
                            id="reg-email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            value={registerData.email}
                            onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="gamify-auth-field">
                        <label htmlFor="reg-password">Password</label>
                        <div className="gamify-auth-password-wrap">
                            <input
                                id="reg-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                value={registerData.password}
                                onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                className="gamify-auth-eye"
                                aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                                onClick={() => setShowPassword(v => !v)}
                            >
                                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                            </button>
                        </div>
                    </div>
                    <div className="gamify-auth-field">
                        <label htmlFor="reg-confirm">Confirm Password</label>
                        <input
                            id="reg-confirm"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            value={registerData.confirm}
                            onChange={e => setRegisterData({ ...registerData, confirm: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="gamify-auth-submit">
                        Create Account
                    </button>
                    <p className="gamify-auth-footer">
                        Already have an account?{' '}
                        <button type="button" className="gamify-auth-link" onClick={() => setTab('login')}>
                            Log in
                        </button>
                    </p>
                </form>
            )}

            {tab === 'recover' && (
                <form className="gamify-auth-form" onSubmit={handleRecover}>
                    <button
                        type="button"
                        className="gamify-auth-back"
                        onClick={() => setTab('login')}
                        aria-label="Back"
                    >
                        <i className="bi bi-arrow-left"></i> Back
                    </button>
                    <div className="gamify-auth-recover-header">
                        <i className="bi bi-shield-lock gamify-auth-recover-icon"></i>
                        <p>Enter your email and we'll send you a link to reset your password.</p>
                    </div>
                    <div className="gamify-auth-field">
                        <label htmlFor="recover-email">Email</label>
                        <input
                            id="recover-email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            value={recoverData.email}
                            onChange={e => setRecoverData({ email: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="gamify-auth-submit">
                        Send Reset Link
                    </button>
                </form>
            )}
        </div>
    );
}

export default function AppHeader() {
    const [cartOpen, setCartOpen] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const authRef = useRef(null);

    const navLinks = [
        { text: 'Home', path: '/' },
        { text: 'Pre-orders', path: '/games/preorders' },
        { text: 'Blog', path: '/' },
        { text: 'Technical Support', path: '/support' },
    ];

    function handleNavClick() {
        const element = document.getElementById('gamifyNavCollapse');
        const bsCollapse = window.bootstrap?.Collapse?.getInstance(element);
        if (bsCollapse) bsCollapse.hide();
    }

    useEffect(() => {
        function handleClickOutside(e) {
            if (authRef.current && !authRef.current.contains(e.target)) {
                setAuthOpen(false);
            }
        }
        if (authOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [authOpen]);

    useEffect(() => {
        function handleEsc(e) {
            if (e.key === 'Escape') setAuthOpen(false);
        }
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);

    const { cart } = useCart();
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <>
            <header className='sticky-top'>
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
                                <button className="gamify-icon-btn" aria-label="Wishlist">
                                    <i className="bi bi-heart"></i>
                                </button>
                            </Link>
                            <div className="gamify-divider d-none d-lg-block"></div>

                            <div className="gamify-auth-wrapper" ref={authRef}>
                                <button
                                    className={`gamify-btn-login ${authOpen ? 'active' : ''}`}
                                    onClick={() => setAuthOpen(v => !v)}
                                    aria-expanded={authOpen}
                                    aria-haspopup="true"
                                >
                                    Log In
                                    <i className={`bi bi-chevron-${authOpen ? 'up' : 'down'} gamify-btn-login-chevron`}></i>
                                </button>
                                {authOpen && (
                                    <AuthDropdown onClose={() => setAuthOpen(false)} />
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    );
}