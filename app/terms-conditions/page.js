// pages/terms-and-conditions.js
import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

      <p className="mb-4">
        Welcome to [Your App Name]! By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions.
        If you do not agree to these terms, please do not use our services.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">1. General</h2>
      <p className="mb-4">
        [Your App Name] is a platform for food delivery services. By using our platform, you acknowledge and accept these terms in full.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">2. User Responsibilities</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>You are responsible for maintaining the confidentiality of your account and password.</li>
        <li>You agree not to misuse our platform for unlawful or fraudulent purposes.</li>
        <li>Providing accurate delivery information is essential for order fulfillment.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">3. Orders and Payments</h2>
      <p className="mb-4">
        All orders must be paid for in full at the time of placement. We reserve the right to cancel orders if payment is not received.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">4. Cancellation and Refund Policy</h2>
      <p className="mb-4">
        Orders can be canceled within 5 minutes of placement for a full refund. No refunds will be provided after food preparation has started.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">5. Limitation of Liability</h2>
      <p className="mb-4">
        We are not responsible for delays caused by factors outside our control, such as weather or traffic conditions.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">6. Updates to Terms</h2>
      <p className="mb-4">
        We reserve the right to update these terms at any time. Please review them periodically for changes.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">7. Contact Us</h2>
      <p className="mb-4">
        If you have any questions about these terms, please contact us at:
      </p>
      <ul className="list-none pl-0 mb-4">
        <li>Email: junedattar82@gmail.com</li>
        <li>Phone: +91-8766747691</li>
        <li>Address: 1234 Food Street, Culinary City, India</li>
      </ul>
    </div>
  );
};

export default TermsAndConditions;
