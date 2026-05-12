import { useState } from 'react';
import '../styles/CheckoutPage.css';

export default function SupportPage() {
  const [messageStatus, setMessageStatus] = useState('idle');
  const [messageText, setMessageText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessageStatus('sending');

    // This is a UI-only form in the starter project. It won't post to backend.
    setTimeout(() => {
      setMessageStatus('sent');
    }, 800);
  };

  return (
    <div className="container py-5">
      <h2 className="gamify-cart-heading mb-4"><span>Technical</span> Support</h2>

      <div className="row">
        <div className="col-lg-7 mb-4">
          <div className="gamify-checkout-section p-4">
            <h5 className="mb-3">Contact our support team</h5>
            <p className="text-secondary">Describe your issue and we'll get back to you within 24–48 hours.</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Your email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Subject</label>
                <input type="text" className="form-control" placeholder="Short summary" required />
              </div>

              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  rows={6}
                  placeholder="What happened? Include order id, screenshots or steps to reproduce."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="gamify-btn-primary" disabled={messageStatus === 'sending'}>
                {messageStatus === 'sending' ? 'Sending...' : 'Send message'}
              </button>

              {messageStatus === 'sent' && (
                <p className="mt-3 text-success">Thanks — your message was sent. We'll reply soon.</p>
              )}
            </form>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="gamify-checkout-section p-4">
            <h5>Support resources</h5>
            <ul className="list-unstyled mt-3">
              <li className="mb-2"><strong>Email:</strong> support@gamify.example</li>
              <li className="mb-2"><strong>Hours:</strong> Mon–Fri 9:00–18:00 CET</li>
              <li className="mb-2"><strong>Phone:</strong> +39 02 1234 5678</li>
            </ul>

            <hr />

            <h6>Frequently asked</h6>
            <div className="mt-3">
              <p className="mb-1"><strong>Where do I find my keys?</strong></p>
              <p className="small text-secondary">After purchase your license keys are shown on the confirmation page and emailed to you.</p>

              <p className="mb-1"><strong>Issue with an order?</strong></p>
              <p className="small text-secondary">Include your order ID and the email used to purchase in your message.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
