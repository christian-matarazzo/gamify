import { useState } from 'react';
import '../styles/SupportPage.css';
import axios from 'axios';

export default function SupportPage() {
  const [messageStatus, setMessageStatus] = useState('idle');
  const [messageText, setMessageText] = useState('');

  const [email,setEmail] =useState("");
  const[subject, setSubject]= useState("");
  

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessageStatus('sending');

    try{
      await axios.post('http://localhost:3000/api/support',{
        email,
        subject,
        message: messageText,
      });

      setMessageStatus('sent');
      setEmail('');
      setSubject('');
      setMessageText('');
    } catch (error){
      console.log(error);
      setMessageStatus('error')
    }};

   

  return (
    <div className="container py-5">
      <h2 className="gamify-cart-heading mb-4"><span>Technical</span> Support</h2>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="gamify-support-section">
            <h5 className="mb-3 text-white">Contact our support team</h5>
            <p className="text-secondary mb-4">Describe your issue and we'll get back to you within 24–48 hours.</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="gamify-support-label">Your email</label>
                <input
                  type="email"
                  className="form-control gamify-support-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e)=> setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="gamify-support-label">Subject</label>
                <input
                  type="text"
                  className="form-control gamify-support-input"
                  placeholder="Short summary of the issue"
                  value={subject}
                  onChange={(e)=> setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="gamify-support-label">Message</label>
                <textarea
                  className="form-control gamify-support-input"
                  rows={6}
                  placeholder="What happened?"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="gamify-support-btn w-100" disabled={messageStatus === 'sending'}>
                {messageStatus === 'sending' ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</>
                ) : 'Send message'}
              </button>

              {messageStatus === 'sent' && (
                <div className="mt-3 text-success-gamify d-flex align-items-center">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Thanks — your message was sent. We'll reply soon.
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="gamify-support-section">
            <h5 className="text-white mb-3">Support resources</h5>
            <div className="mt-3">
              <div className="gamify-support-list-item">
                <strong>Email:</strong> <span className="ms-2">support@gamify.com</span>
              </div>
              <div className="gamify-support-list-item">
                <strong>Hours:</strong> <span className="ms-2">Our agents are active 24/7!</span>
              </div>
              <div className="gamify-support-list-item">
                <strong>Phone:</strong> <span className="ms-2">+39 02 1234 5678</span>
              </div>
            </div>

            <hr className="gamify-support-hr" />

            <h6 className="text-white mb-3">Frequently asked</h6>
            <div className="mt-3">
              <div className="mb-3">
                <span className="gamify-faq-question">Where do I find my keys?</span>
                <p className="gamify-faq-answer">After purchase your license keys are shown on the confirmation page and emailed to you.</p>
              </div>

              <div className="mb-3">
                <span className="gamify-faq-question">Issue with an order?</span>
                <p className="gamify-faq-answer">Include your order ID and the email used to purchase in your message.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}