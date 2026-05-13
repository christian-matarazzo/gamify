import React from 'react';
import '../styles/CheckoutPage.css';

export default function PrivacyPage() {
    return (
        <div className="container py-5">
            <h2 className="gamify-cart-heading mb-4"><span>Privacy</span> Policy</h2>

            <div className="row">
                <div className="col-lg-8">
                    <div className="gamify-checkout-section p-4">

                        <p className="text-secondary mb-3">Effective date: May 12, 2026</p>
                        <p className="small text-secondary mb-4">
                            Short summary: We collect only the information necessary to process orders and support customers.
                            We do not sell your personal data.
                        </p>

                        <div className="row">
                            {/* LEFT COLUMN */}
                            <div className="col-md-6">

                                <h5>What we collect</h5>
                                <p className="small text-secondary">
                                    Contact details, order metadata, and technical data (IP, device, cookies).
                                    Payment card details are handled exclusively by our payment providers.
                                </p>

                                <h5 className="mt-3">How we use data</h5>
                                <p className="small text-secondary">
                                    To process purchases, send order confirmations, provide support,
                                    prevent fraud, and comply with legal obligations.
                                </p>

                                <h5 className="mt-3">Data retention</h5>
                                <p className="small text-secondary">
                                    We retain order information for accounting and legal compliance.
                                    Support-related data is kept only as long as necessary.
                                </p>

                            </div>

                            <div className="col-md-6">

                                <h5>Third‑party services</h5>
                                <p className="small text-secondary">
                                    We rely on trusted providers for payments, hosting, analytics,
                                    and email delivery. They process data only as needed.
                                </p>

                                <h5 className="mt-3">Security</h5>
                                <p className="small text-secondary">
                                    We implement technical and organizational measures to protect your data
                                    from unauthorized access or disclosure.
                                </p>

                                <h5 className="mt-3">Children’s privacy</h5>
                                <p className="small text-secondary">
                                    Our services are not directed to children under 13.
                                    We do not knowingly collect personal information from minors.
                                </p>

                                <h5 className="mt-3">Changes to this policy</h5>
                                <p className="small text-secondary">
                                    We may update this Privacy Policy to reflect changes in our practices.
                                </p>

                            </div>
                        </div>

                        <p className="small text-secondary mt-4">
                            Last updated: May 12, 2026
                        </p>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="p-4 gamify-checkout-section">
                        <h6>Quick info</h6>
                        <p className="small mb-2">
                            <strong>Privacy requests:</strong> support@gamify.example
                        </p>

                        <h6 className="mt-3">Cookies</h6>
                        <p className="small text-secondary">
                            We use essential cookies for cart/session and optional analytics cookies.
                        </p>

                        <h6 className="mt-3">Legal links</h6>
                        <p className="small text-secondary mb-1"><a href="/terms">Terms of Service</a></p>
                        <p className="small text-secondary mb-1"><a href="/support">Support</a></p>

                        <h6 className="mt-3">Version</h6>
                        <p className="small text-secondary mb-0">v1.1 — May 12, 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
}