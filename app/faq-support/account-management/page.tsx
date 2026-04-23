"use client";

import { useState } from "react";
import Topics from "@/app/faq-support/topics/page";
import Form from "@/app/faq-support/form/page";
import EmployerHeader from "@/components/Employerheader";
import EmployerFooter from "@/components/Employerfooter";

export default function AccountManagementFAQPage() {
  const faqData = [
  {
    question: "How do I create an account?",
    answer:
      "Click on Sign Up, enter your details, verify your email address, and complete the registration process.",
  },
  {
    question: "How do I log in to my account?",
    answer:
      "Use your registered email and password on the login page to access your account.",
  },
  {
    question: "What should I do if I forget my password?",
    answer:
      "Click on Forgot Password on the login page and follow the reset instructions sent to your email.",
  },
  {
    question: "How can I update my account information?",
    answer:
      "Go to Account Settings from your dashboard to update personal details, email, and contact information.",
  },
  {
    question: "Can I change my registered email address?",
    answer:
      "Yes, you can update your email address from the account settings section.",
  },
  {
    question: "How do I deactivate my account?",
    answer:
      "You can deactivate your account from privacy or account settings if the option is available.",
  },
  {
    question: "How do I permanently delete my account?",
    answer:
      "Contact support or use the Delete Account option in settings to permanently remove your profile.",
  },
  {
    question: "Why is my account locked or suspended?",
    answer:
      "Accounts may be temporarily restricted due to suspicious activity, policy violations, or multiple failed login attempts.",
  },
];

  const [selectedFAQ, setSelectedFAQ] = useState(faqData[0]);

  return (
    <div>
      <EmployerHeader />
      <Topics />

      <div className="bg-[#f5f5f5] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-[350px_1fr] gap-8 bg-white p-6 rounded-md shadow-sm">
            <div className="border-r border-gray-200 pr-4">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Account Management FAQ
              </h2>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {faqData.map((faq, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFAQ(faq)}
                    className={`w-full text-left p-4 rounded-md border transition-all duration-200 ${
                      selectedFAQ.question === faq.question
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
            </div>

            <div className="pl-2">
              <h1 className="text-4xl font-semibold text-blue-700 mb-6">
                {selectedFAQ.question}
              </h1>

              <div className="text-gray-700 leading-8 text-lg bg-gray-50 rounded-md p-6 border border-gray-200">
                <p>{selectedFAQ.answer}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Form />
      <EmployerFooter />
    </div>
  );
}