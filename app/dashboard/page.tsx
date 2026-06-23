"use client";

import { useState, useEffect } from "react";
import CandidatesPage from "./candidate_listing/page";
import PostJobPage from "./post-job/page";
import ManageJobs from "./manage-jobs/page";
import Candidates from "./candidates/page";
import QuotaUsagePage from "@/app/dashboard/quota-usage/page";
import FindJobs from "./find-jobs/page";
import EmployerHeader from "@/components/Employerheader";
import EmployerFooter from "@/components/Employerfooter";
import {
  Users,
  Briefcase,
  Plus,
  UserCircle,
  BarChart3,
  Search,
} from "lucide-react";

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState("post-job");
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
  const role = localStorage.getItem("admin_role");
  if (role === "admin") {
    setIsAdmin(true);
  }
}, []);


  const tabs = [
    { id: "post-job", label: "Post a Job", icon: Plus ,component: <PostJobPage />},
    { id: "manage-jobs", label: "Manage Jobs", icon: Briefcase, component: <ManageJobs /> },
     { id: "candidates", label: "Candidates", icon: Users ,component: <Candidates />},
    {
    id: "profiles",
    label: "Profiles",
    icon: UserCircle,
    component: <CandidatesPage />,
  },
    {
    id: "quota",
    label: "Quota Usage",
    icon: BarChart3,
    component: <QuotaUsagePage />,
  },
  ...(isAdmin
    ? [
      {id: "find-jobs", label: "Find Jobs", icon: Search, component: <FindJobs /> ,  }
   ]
    : []),

  //    ...(!isAdmin
  //   ? [

  //  ]
  //   : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployerHeader/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to your Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your job postings and find the perfect candidates
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
          <div className="flex border-b">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Post Job Tab */}
        {activeTab === "post-job" && (
          <PostJobPage />
        )}

        {/* Manage Jobs Tab */}
        {activeTab === "manage-jobs" && (
          <ManageJobs />
        )}

        {/* Candidates Tab */}
        {activeTab === "candidates" && (
         <Candidates/>
        )}

        {activeTab === "profiles" && (
        <CandidatesPage/>
         )}

         {activeTab === "quota" && (
        <QuotaUsagePage />
         )}

         {isAdmin && activeTab === "find-jobs" && (
          <FindJobs />
        )}
      </div>
      <EmployerFooter />
    </div>
  );
}
