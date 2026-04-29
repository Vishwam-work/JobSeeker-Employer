"use client";

import { PackageOpen } from "lucide-react";
import EmployerHeader from "@/components/Employerheader";
import EmployerFooter from "@/components/Employerfooter";
export default function ManageQuotaPage() {
  return (
    <>
    <EmployerHeader />
    <div className="min-h-screen bg-[#f5f5f5] px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-12">
          Manage Quota
        </h1>

        <div className="flex flex-col items-center justify-center text-center min-h-[70vh]">
          <div className="bg-white shadow-sm rounded-full p-8 mb-8 border border-gray-100">
            <PackageOpen className="w-24 h-24 text-gray-400" />
          </div>

          <h2 className="text-4xl font-semibold text-gray-800 mb-4">
            No active subscription found!
          </h2>

          <p className="text-lg text-gray-500 max-w-2xl leading-8">
            Looks like you don’t have any active subscription for your account.
            Reach out to support for assistance or subscription details.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300">
              Contact Support
            </button>

            <button className="border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-xl font-medium text-gray-700 transition-all duration-300">
              View Plans
            </button>
          </div>
        </div>
      </div>
    </div>
    <EmployerFooter />
    </>
  );
}