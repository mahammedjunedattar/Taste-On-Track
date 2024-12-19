// pages/refund-policy.js
import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Refund & Cancellation Policy</h1>

      <p className="mb-4">
        At [Your App Name], customer satisfaction is our priority. We strive to deliver the best experience possible. This policy outlines our approach to refunds and cancellations.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">1. Cancellation Policy</h2>
      <p className="mb-4">
        You may cancel your order under the following conditions:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>
          Orders can be canceled within 10 minutes of placement if the preparation process has not started.
        </li>
        <li>
          To cancel your order, please contact our support team immediately at +91-XXXXXXXXXX or via email at support@yourappname.com.
        </li>
      </ul>
      <p className="mb-4">
        If the cancellation is successful, you will receive a confirmation message.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">2. Refund Policy</h2>
      <p className="mb-4">
        Refunds are issued under the following conditions:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>If the order was canceled successfully within the allowed time frame.</li>
        <li>If the order could not be delivered due to unforeseen circumstances such as issues with the delivery partner or unavailability of items.</li>
        <li>If the delivered order does not match your placed order (e.g., incorrect items).</li>
      </ul>
      <p className="mb-4">
        Once a refund is approved, the amount will be credited to your original payment method within 7-10 business days.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">3. Non-Refundable Items</h2>
      <p className="mb-4">
        Refunds will not be provided in the following cases:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Change of mind after the preparation of food has started.</li>
        <li>Incorrect delivery address provided by the customer.</li>
        <li>Delays caused by unavoidable circumstances such as natural disasters or traffic issues.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">4. Contact Us</h2>
      <p className="mb-4">
        For cancellations, refunds, or any queries regarding this policy, please contact us:
      </p>
      <ul className="list-none pl-0 mb-4">
        <li>Email: junedattar82@gmail.com</li>
        <li>Phone: +91-8766747601</li>
        <li>Address: 1234 Service Lane, Customer City, India</li>
      </ul>
    </div>
  );
};

export default RefundPolicy;
