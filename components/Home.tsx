"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search,
  ArrowRight,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
const slides = [
  {
    title: "Decode India’s largest talent pool",
    highlight: "AI ✨",
    points: [
      "10 crore+ registered jobseekers",
      "AI powered candidate matching",
      "Faster & smarter hiring",
    ],
  },
  {
    title: "Hire smarter with real-time insights",
    highlight: "Data 📊",
    points: [
      "Advanced hiring analytics",
      "Smart candidate filters",
      "Actionable market insights",
    ],
  },
  {
    title: "Build your employer brand",
    highlight: "Growth 🚀",
    points: [
      "Reach millions of candidates",
      "Showcase company culture",
      "Increase quality applications",
    ],
  },
];
const offers = [
  {
    title: "Job Posting",
    desc: "Receive applications and quickly connect with high-quality, relevant candidates.",
    action: "View plans",
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
  {
    title: "Resume Database (Resdex)",
    desc: "Access & attract from a pool of 10 crore+ jobseekers – all in real time!",
    action: "View plans",
    image: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
  },
  {
    title: "Expert Assist",
    desc: "Leave sourcing & shortlisting to our hiring experts, you focus on interviews.",
    action: "View plans",
    image: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
  },
  {
    title: "Employer Branding",
    desc: "Showcase your employer brand story to millions of relevant job seekers.",
    action: "Request callback",
    highlight: true,
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135789.png",
  },
  {
    title: "Talent Pulse",
    desc: "Future-proof your hiring strategy with a data-driven talent planning tool.",
    action: "Request callback",
    image: "https://cdn-icons-png.flaticon.com/512/4149/4149640.png",
  },
];

const faqs = [
  {
    q: "How can a recruiter sign up for a JobSeeker account?",
    a: "Recruiters can sign up by clicking on the Register button on the employer homepage and completing the registration process.",
  },
  {
    q: "How does pricing work for recruiter plans and job postings?",
    a: "JobSeeker offers flexible pricing tailored to your hiring needs. Pricing depends on the plan type (resume database access, job posting bundles), subscription duration, and additional features.",
  },
  {
    q: "What support, insight, and team collaboration features are offered?",
    a: "You get dedicated support, hiring insights, analytics dashboards, and team collaboration tools for recruiters.",
  },
  {
    q: "How secure is my recruiter account?",
    a: "We use enterprise-grade security, encrypted data storage, and role-based access control to keep accounts secure.",
  },
  {
    q: "How can I find the right candidates using JobSeeker?",
    a: "Use AI-powered search, smart filters, and resume database access to quickly find relevant candidates.",
  },
  {
    q: "What features are provided for bulk hiring?",
    a: "Bulk hiring tools include mass job posting, candidate shortlisting, pipeline tracking, and recruiter collaboration.",
  },
  {
    q: "How can recruiters promote employer branding?",
    a: "Employer branding solutions help you showcase company culture, reviews, and job highlights to attract top talent.",
  },
  {
    q: "Are there tips for writing effective job postings?",
    a: "Clear job titles, structured descriptions, realistic requirements, and salary transparency improve job visibility and responses.",
  },
];
export default function EmployerHome() {
  const [current, setCurrent] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <section className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-black text-white flex items-center">
        <div className="w-full relative overflow-hidden">
          {/* Slides */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="min-w-full px-6 sm:px-10 lg:px-24">
                <div className="max-w-xl space-y-6 text-center lg:text-left">
                  <p className="uppercase tracking-widest text-xs sm:text-sm text-gray-400">
                    Talent Decoded
                  </p>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                    {slide.title} <br />
                    with the power of{" "}
                    <span className="text-blue-400">{slide.highlight}</span>
                  </h1>

                  <ul className="space-y-2 text-gray-300 text-sm inline-block text-left">
                    {slide.points.map((p, i) => (
                      <li key={i}>✔ {p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={() =>
              setCurrent((current - 1 + slides.length) % slides.length)
            }
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={() => setCurrent((current + 1) % slides.length)}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full"
          >
            <ChevronRight />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  current === i ? "bg-blue-500" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
      <div>
        {/*Offer Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            {/* Heading */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                What JobSeeker offers
              </h2>
              <p className="text-gray-600 mt-2 max-w-xl mx-auto text-sm">
                We handle everything — from planning and branding to sourcing,
                so you can focus on hiring the best talent.
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl bg-white p-6 shadow-sm border 
              hover:shadow-md transition ${
                item.highlight
                  ? "bg-gradient-to-br from-yellow-50 to-white"
                  : ""
              }`}
                >
                  {/* Image Placeholder */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-28 w-full object-contain rounded-xl mb-5 bg-gradient-to-br from-indigo-50 to-purple-50 p-4"
                  />

                  <h3 className="font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4">{item.desc}</p>

                  <button className="text-blue-600 text-sm font-medium inline-flex items-center gap-1 hover:underline">
                    {item.action}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Help Card */}
              <div className="rounded-2xl bg-white p-6 shadow-sm border flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Need help?
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Let us help you find the right hiring solution.
                  </p>
                </div>

                <button className="bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium py-2 rounded-lg">
                  Connect with our expert
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-white py-20">
          <div className="max-w-4xl mx-auto px-4">
            {/* Heading */}
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Frequently asked questions
            </h2>

            {/* FAQ List */}
            <div className="divide-y border-t">
              {faqs.map((item, index) => {
                const isOpen = openIndex === index;

                return (
                  <div key={index} className="py-5">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex justify-between items-center text-left"
                    >
                      <span className="font-medium text-gray-900">
                        {item.q}
                      </span>
                      {isOpen ? (
                        <Minus className="w-5 h-5 text-gray-500" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-500" />
                      )}
                    </button>

                    {isOpen && (
                      <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-3xl">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
