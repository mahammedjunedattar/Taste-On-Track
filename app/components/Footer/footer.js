// components/Footer.js
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto py-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and About Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">Taste-On-Track</h2>
            <p className="text-sm">
              Delivering delicious meals right to your doorstep. Your satisfaction is our priority.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms-conditions" className="hover:underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refundpolicy" className="hover:underline">
                  Refund/Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/Contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-semibold">Email:</span>{' '}
                <a href="mailto:support@yourappname.com" className="hover:underline">
                  junedattar82@gmail.com
                </a>
              </li>
              <li>
                <span className="font-semibold">Phone:</span> +91-8766747601
              </li>
              <li>
                <span className="font-semibold">Address:</span> 1234 Service Lane, Customer City, State
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          &copy; {new Date().getFullYear()} Your Company Name. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
