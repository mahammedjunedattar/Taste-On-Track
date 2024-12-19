// pages/privacy-policy.js
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        Your privacy is important to us. This Privacy Policy outlines how [Your App Name] collects, uses, and protects your personal information.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">1. Information We Collect</h2>
      <p className="mb-4">
        We may collect the following types of information:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Personal identification information (name, email address, phone number, etc.)</li>
        <li>Order details, payment information, and delivery addresses</li>
        <li>Usage data, such as pages visited, time spent on the app, and IP addresses</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">2. How We Use Your Information</h2>
      <p className="mb-4">
        We use the information we collect to:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Process and fulfill orders</li>
        <li>Improve user experience and app performance</li>
        <li>Send promotional emails or notifications</li>
        <li>Ensure compliance with legal obligations</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">3. Sharing Your Information</h2>
      <p className="mb-4">
        We do not sell or rent your personal information to third parties. However, we may share your information with:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Service providers, such as payment processors or delivery partners</li>
        <li>Law enforcement or regulatory authorities if required by law</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">4. Security of Your Information</h2>
      <p className="mb-4">
        We implement industry-standard security measures to protect your personal information from unauthorized access or disclosure. However, no system can guarantee complete security.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">5. Cookies and Tracking</h2>
      <p className="mb-4">
        Our app uses cookies to enhance user experience and track website performance. You can manage cookie preferences through your browser settings.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">6. Your Rights</h2>
      <p className="mb-4">
        You have the right to access, update, or delete your personal information. Contact us to exercise these rights.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">7. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. Please check this page periodically for any changes.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">8. Contact Us</h2>
      <p className="mb-4">
        If you have any questions or concerns about this Privacy Policy, please contact us:
      </p>
      <ul className="list-none pl-0 mb-4">
      <li>Email: junedattar82@gmail.com</li>
        <li>Phone: +91-8766747601</li>
        <li>Address: 1234 Privacy Lane, Secure City, India</li>
      </ul>
    </div>
  );
};

export default PrivacyPolicy;
