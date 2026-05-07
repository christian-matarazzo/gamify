import "../styles/PopUp.css"

export default function PopUp({ onClose }) {
    return (
        <div className="overlay" onClick={onClose}>
            <div className="popup" onClick={(e) => e.stopPropagation()}>
                <button className="popup-x" onClick={onClose} aria-label="Close">✕</button>
                <h2>Welcome to <span>Gamify</span></h2>
                <p>Discover the best games, pre-order the most anticipated releases, and keep track of your wishlist. Use code below for <strong>10% off</strong> your first order <span className="promo-code">
                    <span className="promo-code-text">WELCOME10</span>
                </span></p>
                <button className="popup-close-btn" onClick={onClose}>
                    Start exploring
                </button>
            </div>
        </div>
    )
}