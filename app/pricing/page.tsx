"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import EmployerHeader from "@/components/Employerheader";
import EmployerFooter from "@/components/Employerfooter";
type BillingType = "monthly" | "yearly";

type Plan = {
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  description?: string;
  features: string[];
  buttonText: string;
  highlight?: boolean;
};

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingType>("monthly");
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_MASTER}/countries/`,
        );
        const data = await res.json();
        setCountries(data);
        console.log("Fetched countries:", data);

        // default first country select
        if (data.length > 0) {
          setSelectedCountry(data[0]);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const filteredCountries = countries.filter((country) =>
    `${country.currency_name} ${country.currency}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const plans: Plan[] = [
    {
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      description: "Best for personal use",
      features: ["Unlimited chats", "Basic templates", "Community support"],
      buttonText: "Get Started",
    },
    {
      name: "Chatbots",
      price: { monthly: 39, yearly: 390 },
      description: "Best for growing businesses",
      features: [
        "Unlimited bots",
        "Advanced templates",
        "Full editor access",
        "Priority support",
      ],
      buttonText: "Start Free Trial",
      highlight: true,
    },
    {
      name: "Communicator",
      price: { monthly: 15, yearly: 150 },
      description: "Per operator pricing",
      features: [
        "Live visitors",
        "Team notes",
        "Permissions",
        "Analytics",
        "Unlimited bots",
        "Advanced templates",
        "Full editor access",
        "Priority support",
      ],
      buttonText: "Start Free Trial",
    },
  ];

  return (
    <div>
      <EmployerHeader />
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Floating Background Blur Circles */}
          <div className="absolute top-[-100px] left-[-100px] w-72 h-72 bg-blue-400 opacity-30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-indigo-400 opacity-30 rounded-full blur-3xl animate-pulse" />

          <div className="relative max-w-4xl mx-auto text-center">
            {/* Animated Heading */}
            <motion.h1
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold leading-tight"
            >
              Simple Pricing for <br />
              <span className="text-yellow-300">Every Business</span>
            </motion.h1>

            {/* Animated Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-6 text-lg md:text-xl text-blue-100"
            >
              Flexible plans designed to grow with you. No hidden fees.
            </motion.p>
            {/* Currency Select */}
            <div className="mt-6 text-center relative max-w-sm mx-auto">
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white cursor-pointer"
              >
                {selectedCountry
                  ? `${selectedCountry.currency_name} (${selectedCountry.currency})`
                  : "Select Currency"}
              </div>

              {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search currency..."
                    className="w-full px-3 py-2 border-b border-gray-200 outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  {/* Options */}
                  <div className="max-h-60 overflow-y-auto">
                    {filteredCountries.map((country, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedCountry(country);
                          setIsOpen(false);
                          setSearch("");
                        }}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-left"
                      >
                        {country.currency_name} ({country.currency})
                      </div>
                    ))}

                    {filteredCountries.length === 0 && (
                      <div className="px-4 py-2 text-gray-500 text-sm">
                        No results found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mt-10"
            >
              <div className="inline-flex bg-gray-200 rounded-full p-1">
                {(["monthly", "yearly"] as BillingType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setBilling(type)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                      billing === type
                        ? "bg-white text-blue-600"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {type === "monthly" ? "Monthly" : "Annually"}
                  </button>
                ))}
              </div>
              {billing === "monthly" && <p className="mt-4 text-sm "></p>}

              {billing === "yearly" && <p className="mt-4 text-sm "></p>}
            </motion.div>
          </div>

          {/* PRICING CARDS */}
          <section className="px-4 pb-24">
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-white text-gray-900 rounded-2xl p-8 shadow-2xl transition hover:scale-105 ${
                    plan.highlight ? " " : ""
                  }`}
                >
                  <h3 className="text-xl font-semibold text-center">
                    {plan.name}
                  </h3>

                  <p className="text-center text-sm text-gray-500 mt-2">
                    {plan.description}
                  </p>

                  <div className="mt-6 text-center">
                    <span className="text-5xl font-bold">
                      {selectedCountry?.currency_symbol || "$"}
                      {plan.price[billing]}
                    </span>

                    <span className="text-gray-500 text-sm">
                      {billing === "monthly" ? " /mo" : " /yr"}
                    </span>
                  </div>

                  <button
                    className={`mt-6 mb-8 w-full rounded-lg py-3 text-sm font-medium transition ${
                      plan.highlight
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {plan.buttonText}
                  </button>

                  <ul className="space-y-3 text-sm text-gray-600">
                    {plan.features.map((feature, i) => (
                      <li key={i}>✔ {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold">Can I cancel anytime?</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Yes, you can cancel your subscription anytime from dashboard.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">Is there a free trial?</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Yes, we offer a 14-day free trial on paid plans.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">Do you offer refunds?</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Yes, refunds are available within the first 7 days.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 bg-blue-600 text-white rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold">Ready to get started?</h2>
            <p className="mt-3 text-blue-100">
              Start your free trial today. No credit card required.
            </p>
            <button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100">
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      <EmployerFooter />
    </div>
  );
}
