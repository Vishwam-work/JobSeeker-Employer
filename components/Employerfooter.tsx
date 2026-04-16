"use client";

import Link from "next/link";
import { Search } from "lucide-react";

export default function EmployerFooter() {
  return (
    <footer className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 text-gray-700 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo + About */}
        <div>
          <h2 className="text-xl font-bold mb-4">
            <Link href="/employer" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                jobseeker
              </span>
            </Link>
          </h2>

          <p className="text-sm text-gray-600">
            Connecting employers with skilled professionals to drive business
            growth. Hire the right talent, faster and smarter 🚀
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/employer/dashboard"
                className="hover:text-black transition"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/employer/account"
                className="hover:text-black transition"
              >
                Account
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-black transition">
                Pricing
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Email: support@jobseeker.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Address: Ahmedabad, India</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 mt-8 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} JobSeeker. All rights reserved.
      </div>
    </footer>
  );
}
