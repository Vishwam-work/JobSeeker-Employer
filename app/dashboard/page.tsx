"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CandidatesPage from "./candidate_listing/page";
import PostJobPage from "./post-job/page";
import ManageJobs from "./manage-jobs/page";
import Candidates from "./candidates/page";
import QuotaUsagePage from "@/app/dashboard/quota-usage/page";
import EmployerHeader from "@/components/Employerheader";
import EmployerFooter from "@/components/Employerfooter";
import {
  Users,
  Briefcase,
  Plus,
  UserCircle,
  BarChart3,
} from "lucide-react";

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState("post-job");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [salaryFilter, setSalaryFilter] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [jobTitleFilter, setJobTitleFilter] = useState("All");
  const [candidates, setCandidates] =useState<Candidate[]>([]);

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  currentRole: string;
  currentCompany: string;
  skills: string[];
  education: string;
  appliedFor: string;
  job_title?: string;
  appliedDate: string;
  status: string;
  expectedSalary?: string;
  resumeUrl?: string;
  profileImage?: string | null;
  summary?: string;
  workExperience: {
    company: string;
    role: string;
    duration: string;
    description?: string;
    category?: string;
    start_date?: string;
    end_date?: string;
  }[];

  educationDetails: {
    education: string;
    courd: string;
    institution: string;
    year: string;
    start_year?: string;
    end_year?: string;
    grade?: string;
    score_type?: string;
  }[];

  certifications: {
    name: string;
    issuer?: string;
    year?: string;
  }[];
  phoneCode?: string;
  qa?: CandidateQA[];
}

interface CandidateQA {
  question_index?: number;
  question_text?: string;
  answer_text?: string;
}


  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("employeer_token");
        if (!token) return;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/employer/applications/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          console.error("Failed to fetch employer applications");
          return;
        }
        const data = await res.json();
        console.log("Employer applications:", data);
        // Map API to UI candidate shape
        const mapped = (Array.isArray(data) ? data : []).map((app) => ({
          id: app.id,
          name: app.profile?.full_name || app.user_email || "Unknown",
          email: app.profile?.email || app.user_email,
          phone: app.profile?.phone || "Not provided",
          phoneCode: app.profile?.phone_code || "",

          location: [
            app.profile?.city,
            app.profile?.state,
            app.profile?.country,
          ]
            .filter(Boolean)
            .join(", "),
          experience: app.profile?.experience || "N/A",
          currentRole: "",
          currentCompany: "",
          skills: app.profile?.skills || [],
          education: "",
          appliedFor: app.job_title,
          appliedDate: app.applied_at,
          // status: app.application_status || "Under Review",
          status:
             app.application_status &&
             app.application_status !== "application_status"
             ? app.application_status
             : "Under Review",

          resumeUrl: app.profile?.resume
            ? `${process.env.NEXT_PUBLIC_URL}${app.profile.resume}`
            : "#",
          profileImage: null,
          summary: "",
          workExperience: app.profile?.experiences || [],
          educationDetails: app.profile?.educations || [],
          certifications: app.profile?.certifications || [],
          qa: app.answers || [],
        }));
        setCandidates(mapped);
        console.log("MAPPED:", mapped);
      } catch (e) {
        console.error("Failed to fetch employer applications", e);
      }
    };
    fetchApplications();
  }, []);

  const exportToExcel = async () => {
    const XLSX = await import("xlsx");

    const data = filteredCategories.map((c) => ({
      name: c.name || "",
      email: c.email || "",
      phone: `+${c.phoneCode}${c.phone}` || "",
      // phone: `${c.phone || ""}`,
      appliedFor: c.appliedFor || c.job_title || "",
      status: c.status || "",
      experience: c.experience || "",
      location: c.location || "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Candidates");

    XLSX.writeFile(wb, "filtered_candidates.xlsx");
  };

  const filteredCategories = candidates.filter((c) => {
    const nameMatch =
      c.name?.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      c.currentRole?.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      c.appliedFor?.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      c.skills?.some((skill) =>
      skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const statusMatch =
      statusFilter === "All" ||
      c.status?.toLowerCase() === statusFilter.toLowerCase();

    const locationMatch =
      locationFilter === "All" ||
      c.location?.toLowerCase() === locationFilter.toLowerCase();

    const jobTitleMatch =
      jobTitleFilter === "All" ||
      c.appliedFor?.toLowerCase() === jobTitleFilter.toLowerCase();

    const salary = parseInt(c.expectedSalary ?? "0", 10);
    const salaryMatch =
      salaryFilter === "All" ||
      (salaryFilter === "Below 20000" && salary < 20000) ||
      (salaryFilter === "20000-50000" && salary >= 20000 && salary <= 50000) ||
      (salaryFilter === "Above 50000" && salary > 50000);

    const expMatch =
      experienceFilter === "All" ||
      (experienceFilter === "Fresher" &&
        (c.experience?.toLowerCase().includes("fresher") ||
          c.experience?.includes("0"))) ||
      (experienceFilter === "1-3 Years" &&
        (c.experience?.includes("1") ||
          c.experience?.includes("2") ||
          c.experience?.includes("3"))) ||
      (experienceFilter === "3-5 Years" &&
        (c.experience?.includes("3") ||
          c.experience?.includes("4") ||
          c.experience?.includes("5"))) ||
      (experienceFilter === "5+ Years" &&
        (c.experience?.includes("5") ||
          c.experience?.includes("6") ||
          c.experience?.includes("7")));

    return (
      nameMatch &&
      statusMatch &&
      locationMatch &&
      salaryMatch &&
      expMatch &&
      jobTitleMatch
    );
  });


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
          {activeTab === "candidates" && (
            <Button onClick={exportToExcel} className="bg-green-600 text-white">
              Export Excel
            </Button>
          )}
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
      </div>
      <EmployerFooter />
    </div>
  );
}
