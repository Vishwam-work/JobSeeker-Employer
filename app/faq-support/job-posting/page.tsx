"use client";

import { useState } from "react";
import Topics from "@/app/faq-support/topics/page";
import Form from "@/app/faq-support/form/page";
import EmployerHeader from "@/components/Employerheader";
import EmployerFooter from "@/components/Employerfooter";

export default function JobPostingFAQPage() {
  const faqData = [
  {
    question: "How do I post a job?",
    answer:
      "Go to your employer dashboard, click on Post a Job, fill in the required details, and publish the job listing.",
  },
  {
    question: "What details are required for job posting?",
    answer:
      "You should provide job title, description, skills, experience level, salary range, location, and employment type.",
  },
  {
    question: "Can I edit a job posting after publishing?",
    answer:
      "Yes, you can update job details anytime from the Manage Jobs section in your employer dashboard.",
  },
  {
    question: "How long does a job posting stay active?",
    answer:
      "Job postings remain active based on your selected duration or until you manually close the listing.",
  },
  {
    question: "Can I pause or close a job posting?",
    answer:
      "Yes, employers can pause, close, or reactivate job listings anytime from the dashboard.",
  },
  {
    question: "How can I view applicants for my job?",
    answer:
      "You can check all applicants from the Applications section linked to each posted job.",
  },
  {
    question: "Why is my job post not visible?",
    answer:
      "Your job may still be under review, inactive, expired, or missing required details.",
  },
  {
    question: "Can I post multiple jobs?",
    answer:
      "Yes, employers can create and manage multiple job postings simultaneously.",
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
              Job Posting FAQ
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