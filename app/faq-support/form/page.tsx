"use client";
export default function Form() {

  return (
    <div className="bg-[#f3f3f3] min-h-screen">
      {/* Footer Support Section */}
      <div className="bg-[#18314f] py-16 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          {/* Contact Info */}
          <div className="text-white space-y-6">
            <h2 className="text-4xl font-light">Support Services</h2>

            <div className="space-y-3 text-lg leading-8 text-gray-200">
              <p>
                <span className="font-semibold text-white">Toll Free:</span>
                1800-000-0000
              </p>
              <p>
                <span className="font-semibold text-white">Working Hours:</span>
                9:00 AM to 6:30 PM
              </p>
              <p>
                <span className="font-semibold text-white">Working Days:</span>
                Monday to Saturday
              </p>
            </div>

            <div className="pt-6 text-gray-200 space-y-3">
              <p>Email: support@yourapp.com</p>
              <p>International Support: +91 9876543210</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-sm p-8 shadow-lg max-w-xl w-full mx-auto lg:ml-auto">
            <h2 className="text-3xl font-medium text-gray-800 mb-8">
              Report a Problem / Need Assistance
            </h2>

            <div className="space-y-5">
              <input
                type="text"
                placeholder="Enter Your Name"
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                placeholder="Enter Your Registered Email"
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="Enter Your Contact Number"
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-600">
                <option>Select Area of Concern</option>
                <option>Login Issue</option>
                <option>Application Issue</option>
                <option>Profile Update</option>
                <option>Payment Related</option>
              </select>

              <textarea
                rows={4}
                placeholder="Enter Your Feedback"
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-all duration-300">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
