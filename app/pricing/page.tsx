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
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20 px-4">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto">
          {/* HERO SECTION */}
          <div className="relative max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium border border-blue-200"
            >
              ✨ Transparent Pricing
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight"
            >
              Simple Pricing for
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Every Business
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Flexible plans designed to scale with your hiring needs.
              No hidden charges. Cancel anytime.
            </motion.p>

            {/* Currency Dropdown */}
            <div className="mt-8 relative max-w-sm mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                Select Currency
              </label>

              <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm cursor-pointer hover:border-blue-500 transition"
              >
                <span className="text-gray-700">
                  {selectedCountry
                    ? `${selectedCountry.currency_name} (${selectedCountry.currency})`
                    : "Select Currency"}
                </span>
                <span className="text-gray-400">⌄</span>
              </div>

              {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search currency..."
                    className="w-full px-4 py-3 border-b border-gray-100 outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <div className="max-h-60 overflow-y-auto">
                    {filteredCountries.map((country, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedCountry(country);
                          setIsOpen(false);
                          setSearch("");
                        }}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-left text-sm"
                      >
                        {country.currency_name} ({country.currency})
                      </div>
                    ))}

                    {filteredCountries.length === 0 && (
                      <div className="px-4 py-3 text-gray-500 text-sm">
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
              <div className="inline-flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                {(["monthly", "yearly"] as BillingType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setBilling(type)}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                      billing === type
                        ? "bg-blue-600 text-white shadow"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    {type === "monthly" ? "Monthly" : "Annually"}
                  </button>
                ))}
              </div>

              {billing === "yearly" && (
                <p className="mt-3 text-sm text-green-600 font-medium">
                  Save up to 20% with annual billing
                </p>
              )}
            </motion.div>
          </div>

          {/* PRICING CARDS */}
          <section className="mt-20">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className={`relative bg-white rounded-3xl border shadow-lg p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                    plan.highlight
                      ? "border-blue-500 ring-2 ring-blue-100"
                      : "border-gray-200"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-center text-gray-900">
                    {plan.name}
                  </h3>

                  <p className="text-center text-gray-500 mt-2 text-sm">
                    {plan.description}
                  </p>

                  <div className="mt-6 text-center">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">
                      {selectedCountry?.currency_symbol || "$"}
                      {plan.price[billing]}
                    </span>
                    <span className="text-gray-500 ml-1 text-sm">
                      {billing === "monthly" ? "/mo" : "/yr"}
                    </span>
                  </div>

                  <button
                    className={`mt-8 w-full py-3 rounded-xl font-semibold transition ${
                      plan.highlight
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {plan.buttonText}
                  </button>

                  <ul className="mt-8 space-y-3 text-sm text-gray-600">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-green-500 mt-0.5">✔</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </section>
      <EmployerFooter />
    </div>
  );
}
