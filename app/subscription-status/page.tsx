"use client";
import EmployerHeader from "@/components/Employerheader";
import EmployerFooter from "@/components/Employerfooter";

export default function SubscriptionStatusPage() {
  return (
    <>
    <EmployerHeader />
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          <div>
            <h1 className="text-3xl font-semibold text-orange-500 mb-6">
              Subscription Status
            </h1>

            <div className="text-sm text-gray-700 mb-6 space-y-2">
              <p>
                <span className="font-semibold">View:</span> Active/Inactive Status
              </p>
              <p>The amount mentioned below is inclusive of all taxes.</p>
            </div>

            <div className="border border-gray-300 bg-white rounded-lg overflow-hidden mb-10">
              <div className="bg-gray-100 border-b border-gray-300 p-4">
                <h2 className="font-semibold text-gray-800 mb-2">
                  Transaction Details
                </h2>

                <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                  <span>ID: 2526-593665</span>
                  <span>Date: 30-Mar-26</span>
                  <span>Amount Paid: Rs. 0</span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Product Description
                </h3>

                <div className="flex items-center justify-between border border-blue-200 rounded-lg bg-blue-50 px-4 py-4">
                  <div>
                    <h4 className="font-medium text-blue-700">Free Job Posting</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      From 30-Mar-26 to 29-Mar-27
                    </p>
                  </div>

                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-blue-500 text-white font-semibold px-4 py-3">
                Contact us for Customer Support
              </div>

              <div className="p-4 text-sm text-gray-700 leading-7 space-y-5">
                <div>
                  <p className="font-semibold">India, Europe & USA Clients:</p>
                  <p>Toll Free: 1800 102 5558</p>
                  <p>Email: support@yourapp.com</p>
                </div>

                <div>
                  <p className="font-semibold">Middle East, Africa & SEA:</p>
                  <p>Mobile: +91 98183 17555</p>
                  <p>Email: international@yourapp.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <EmployerFooter />
    </>
  );
}