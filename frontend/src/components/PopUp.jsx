import "../styles/PopUp.css"

export default function PopUp({ onClose }) {

    const handleSubmit = (e) => {
        e.preventDefault()
        const email = e.target.email.value
        console.log(email)
    }

    return (
        <div className="overlay" onClick={onClose}>
            <div className="popup" onClick={(e) => e.stopPropagation()}>
                <button className="popup-x" onClick={onClose} aria-label="Close">✕</button>
                <h2>Welcome to <span>Gamify</span></h2>
                <p>
                    Use the code below for <strong>10% off</strong> your first order:
                    <span className="promo-code">
                        <span className="promo-code-text">WELCOME10</span>
                    </span>
                </p>

                <p>
                    <strong className="gamify-wantmore">Want more?</strong> Join the Gamify community for early access to deals,
                    exclusive discounts, and updates on the most anticipated releases.
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Be part of our community!"
                        className="popup-input"
                        required
                    />

                    <button
                        type="submit"
                        className="popup-submit-btn"
                    >
                        Join Gamify!
                    </button>
                    <button
                        type="button"
                        className="popup-skip"
                        onClick={onClose}
                    >
                        No thanks, maybe later
                    </button>
                </form>
            </div>
        </div>
    )
}