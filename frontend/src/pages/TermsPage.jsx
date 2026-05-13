import React from 'react';
import '../styles/TermsPage.css';

export default function TermsPage() {
  return (
    <div className="container py-5">
      <h2 className="gamify-cart-heading mb-4"><span>Terms of</span> Use</h2>
      <span className="gamify-terms-date">Effective date: May 12, 2026</span>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="gamify-terms-section">

            <p className="gamify-terms-section-title">1. Definitions</p>
            <p className="gamify-terms-body">
              <strong className="gamify-terms-strong">Service</strong> refers to the Gamify website, platform and associated services.{' '}
              <strong className="gamify-terms-strong">User</strong> means any individual accessing or purchasing through the Service.{' '}
              <strong className="gamify-terms-strong">License Key</strong> means a digital activation code delivered to unlock a product on a third-party platform.
            </p>

            <hr className="gamify-terms-divider" />

            <p className="gamify-terms-section-title">2. Acceptance of Terms</p>
            <p className="gamify-terms-body">
              By accessing or using the Service, you confirm that you are at least 18 years old (or have parental consent), have read these Terms in full, and agree to be bound by them. If you do not agree, you may not use the Service.
            </p>

            <hr className="gamify-terms-divider" />

            <p className="gamify-terms-section-title">3. Purchases &amp; Delivery</p>
            <p className="gamify-terms-body">
              All transactions are processed securely. Upon successful payment, your License Key is displayed immediately on the confirmation page and sent to the email address provided at checkout. Gamify is not responsible for delivery failures caused by incorrect email input. If your key does not arrive within 30 minutes, contact support with your order ID.
            </p>

            <hr className="gamify-terms-divider" />

            <p className="gamify-terms-section-title">4. Pricing &amp; Taxes</p>
            <p className="gamify-terms-body">
              All prices are displayed in the currency selected during checkout. Gamify reserves the right to change prices at any time; confirmed orders are charged at the price shown at checkout. You are solely responsible for any applicable taxes, duties, or import charges in your jurisdiction.
            </p>

            <hr className="gamify-terms-divider" />

            <p className="gamify-terms-section-title">5. User Responsibilities</p>
            <p className="gamify-terms-body">
              You agree to provide accurate and truthful information during registration and checkout. You are responsible for maintaining the security of your account credentials. Any unauthorized use must be reported immediately. Resale, sharing, or redistribution of License Keys is strictly prohibited.
            </p>

            <hr className="gamify-terms-divider" />

            <p className="gamify-terms-section-title">6. License &amp; Intellectual Property</p>
            <p className="gamify-terms-body">
              Each purchase grants you a limited, personal, non-transferable license to activate and use the associated product for personal purposes only. Gamify acts solely as a digital reseller. You may not copy, redistribute, or commercially exploit any License Key purchased through the Service.
            </p>

            <hr className="gamify-terms-divider" />

            <p className="gamify-terms-section-title">7. Refunds &amp; Cancellations</p>
            <p className="gamify-terms-body">
              Due to the instant and irreversible nature of digital delivery, all sales are generally final. Refunds may be issued at Gamify's discretion in cases of fraud or defective keys. Contact support within 7 days of purchase with your order ID.
            </p>

            <hr className="gamify-terms-divider" />

            <p className="gamify-terms-section-title">8. Prohibited Conduct</p>
            <p className="gamify-terms-body">
              You may not use the Service for fraudulent chargebacks, automated scraping, mass purchasing for resale, or any activity that violates applicable law. Gamify reserves the right to suspend accounts involved in such activities.
            </p>

            <hr className="gamify-terms-divider" />

            <p className="gamify-terms-section-title">9. Limitation of Liability</p>
            <p className="gamify-terms-body">
              The Service is provided "as is" without warranties of any kind. Gamify shall not be liable for indirect or consequential damages arising from use of the Service, to the fullest extent permitted by applicable law.
            </p>

            <hr className="gamify-terms-divider" />

            <p className="gamify-terms-section-title">10. Modifications to Terms</p>
            <p className="gamify-terms-body">
              Gamify may update these Terms at any time. Continued use of the Service after changes are published constitutes acceptance of the revised Terms.
            </p>

            <hr className="gamify-terms-divider" />

            <p className="gamify-terms-section-title">11. Governing Law</p>
            <p className="gamify-terms-body">
              These Terms are governed by applicable local law. Users are encouraged to contact support first for disputes. Unresolved matters shall be subject to the jurisdiction of competent local courts.
            </p>

          </div>
        </div>

        <div className="col-lg-4">
          <div className="gamify-terms-section">
            <p className="gamify-terms-sidebar-title">Contact</p>
            <div className="gamify-terms-contact-item"><strong>Email:</strong> <span className="ms-2">support@gamify.com</span></div>
            <div className="gamify-terms-contact-item"><strong>Phone:</strong> <span className="ms-2">+39 02 1234 5678</span></div>
            <div className="gamify-terms-contact-item"><strong>Hours:</strong> <span className="ms-2">24/7 active agents</span></div>

            <hr className="gamify-terms-divider" />

            <p className="gamify-terms-sidebar-title">FAQ</p>
            <span className="gamify-terms-faq-question">Where are my keys?</span>
            <p className="gamify-terms-faq-answer">They appear on the confirmation page and are emailed immediately after purchase.</p>
            <span className="gamify-terms-faq-question">Can I get a refund?</span>
            <p className="gamify-terms-faq-answer">Only in limited cases (fraud or defective keys). Contact support within 7 days.</p>
            <span className="gamify-terms-faq-question">Wrong email at checkout?</span>
            <p className="gamify-terms-faq-answer">Contact support immediately with your order ID before activating the key.</p>
            <span className="gamify-terms-faq-question">Can I resell my key?</span>
            <p className="gamify-terms-faq-answer">No. Resale or redistribution is strictly prohibited under these Terms.</p>
          </div>
        </div>
      </div>
    </div>
  );
}