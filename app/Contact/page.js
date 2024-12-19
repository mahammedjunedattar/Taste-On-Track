// pages/contact.js
import React from 'react';

const Contact = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="mb-4">
        We value your feedback and are here to assist with any questions or concerns you may have. Reach out to us through the following contact channels:
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Customer Support</h2>
      <p className="mb-4">For any inquiries or assistance, feel free to contact our customer support team:</p>
      <ul className="list-none pl-0 mb-4">
        <li>
          <span className="font-semibold">Email:</span>{' '}
          <a href="mailto:support@yourappname.com" className="text-blue-500 hover:underline">
            support@yourappname.com
          </a>
        </li>
        <li>
          <span className="font-semibold">Phone:</span> +91-8766747601
        </li>
        <li>
          <span className="font-semibold">WhatsApp:</span>{' '}
          <a
            href="https://wa.me/8766747601"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chat with us on WhatsApp
          </a>
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Office Address</h2>
      <p className="mb-4">
        You can also visit our office at the following address:
      </p>
      <p className="mb-4">
        <strong>Your Company Name</strong> <br />
        1234 Service Lane <br />
        Customer City, State, PIN Code <br />
        India
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Business Hours</h2>
      <ul className="list-none pl-0 mb-4">
        <li>
          <span className="font-semibold">Monday to Friday:</span> 9:00 AM - 6:00 PM
        </li>
        <li>
          <span className="font-semibold">Saturday:</span> 10:00 AM - 4:00 PM
        </li>
        <li>
          <span className="font-semibold">Sunday:</span> Closed
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Get in Touch</h2>
      <p className="mb-4">
        We’re here to help! Feel free to reach out to us for any support or queries.
      </p>
    </div>
  );
};

export default Contact;
