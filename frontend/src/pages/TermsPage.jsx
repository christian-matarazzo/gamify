import React from 'react';
import '../styles/CheckoutPage.css';

export default function TermsPage() {
    return (
        <div className="container py-5">
            <h2 className="gamify-cart-heading mb-4"><span>Terms of</span> Service</h2>

            <div className="row">
                <div className="col-lg-8">
                    <div className="gamify-checkout-section p-4">
                        <p className="text-secondary mb-3">Effective date: May 12, 2026</p>

                        <h5>Definitions</h5>
                        <p className="small text-secondary">"Service": Gamify website and services. "User": anyone using the Service. "License Key": a digital code delivered to unlock a product.</p>

                        <h5 className="mt-3">Purchases & Delivery</h5>
                        <p className="small text-secondary">Digital purchases are delivered immediately on-screen and by email. Check your delivery email carefully — contact support with your order ID if keys do not arrive.</p>

                        <h5 className="mt-3">Pricing & Taxes</h5>
                        <p className="small text-secondary">Prices display the chosen currency. You are responsible for applicable taxes or duties. Confirmed orders are charged at the displayed checkout price.</p>

                        <h5 className="mt-3">User Responsibilities</h5>
                        <p className="small text-secondary">Provide accurate information and keep account credentials secure. Resale or redistribution of License Keys is prohibited.</p>

                        <h5 className="mt-3">License & Restrictions</h5>
                        <p className="small text-secondary">Purchases grant a limited, non-transferable right to use the product. You may not copy, resell, or distribute keys.</p>

                        <h5 className="mt-3">Refunds & Cancellations</h5>
                        <p className="small text-secondary">Orders are generally non-refundable due to instant delivery. Exceptions (fraud, defective keys) are handled case-by-case — contact support.</p>

                        <h5 className="mt-3">Limitation of Liability</h5>
                        <p className="small text-secondary">The Service is provided "as is"; Gamify is not liable for indirect or consequential damages to the fullest extent permitted by law.</p>

                        <h5 className="mt-3">Governing Law</h5>
                        <p className="small text-secondary">These Terms are governed by applicable local law. Contact support first for disputes; unresolved matters follow local legal processes.</p>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="p-4 gamify-checkout-section">
                        <h6>Contact</h6>
                        <p className="small text-secondary">Email: <strong>support@gamify.example</strong><br />Hours: Mon–Fri 09:00–18:00 CET</p>

                        <h6 className="mt-3">FAQ</h6>
                        <p className="small"><strong>Where are my keys?</strong><br />They appear on the confirmation page and in your email.</p>
                        <p className="small"><strong>Refunds?</strong><br />Only in limited cases (fraud/defective keys). Contact support.</p>
                        <p className="small"><strong>Wrong email?</strong><br />Contact support immediately with order ID.</p>

                        <h6 className="mt-3">Change log</h6>
                        <p className="small text-secondary mb-0">v1.0 — Effective May 12, 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
