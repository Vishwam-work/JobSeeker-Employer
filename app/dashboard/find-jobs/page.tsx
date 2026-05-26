"use client";

import { useEffect, useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import AsyncSelect from "react-select/async";
import axios from "axios";
import {
  Search,
  Download,
  MapPin,
  Briefcase,
  Building2,
  Clock3,
} from "lucide-react";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Job {
  id?: number;
  title: string;
  job_title: string;
  company: string;
  category: string;
  location: string;
  currency_id: number;
  experience: string;
  salary: string;
  salary_max: string;
  job_type: string[];
  work_mode: string;
  vacancies: number;
  application_deadline: string;
  description: string;
  requirements: string;
  benefits: string;
  skills: string[];
  is_urgent: boolean;
  is_remote: boolean;
  status: string;
  questions: string[];
  website_apply: string;
}

export default function FindJobs() {
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isSearched, setIsSearched] = useState(false);

  //  FETCH JOBS
const fetchJobs = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("employeer_token");

    // START SCRAPING TASK
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/find-jobs/`,
      {
        keyword: keyword || "",
        category: selectedCategory?.value || "",
        location: selectedLocation?.label || "",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Task Response:", response.data);

    const taskId = response.data.task_id;

    // POLL TASK STATUS
    const checkStatus = async () => {
      try {
        const statusResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/task-status/${taskId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Task Status:", statusResponse.data);

        // COMPLETED
        if (statusResponse.data.status === "completed") {
          const jobs = statusResponse.data.data || [];

          setJobsData(jobs);

          setSearchResults(jobs);

          setIsSearched(true);

          setLoading(false);
        }

        // FAILED
        else if (statusResponse.data.status === "failed") {
          console.error("Task failed");

          setLoading(false);
        }

        // PENDING / PROCESSING
        else {
          setTimeout(checkStatus, 3000);
        }
      } catch (error) {
        console.error("Polling Error:", error);

        setLoading(false);
      }
    };

    // START POLLING
    checkStatus();
  } catch (error) {
    console.error("Fetch Jobs Error:", error);

    setLoading(false);
  }
};

  //  CATEGORY
  const getJobCategoryOptions = async (inputValue: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/jobs_category?q=${
          inputValue || ""
        }`
      );

      const data = await res.json();

      return data.map((category: any) => ({
        label: category.name,
        value: category.name,
      }));
    } catch (error) {
      console.error("Error fetching job categories:", error);
      return [];
    }
  };

  //  LOCATION 
  const loadLocationOptions = async (inputValue: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/locations/search/?q=${
          inputValue || ""
        }`
      );

      const data = await res.json();

      return data.map((location: any) => ({
        label: location.name,
        value: location.id,
      }));
    } catch (error) {
      console.error("Error fetching locations:", error);
      return [];
    }
  };

  //  SEARCH
  const handleSearch = async () => {
    setIsSearched(true);

    await fetchJobs();
  };

  //  DOWNLOAD
  const handleDownloadExcel = () => {
    if (searchResults.length === 0) return;

    const excelData = searchResults.map((job) => ({
      title: job.job_title,
      job_title: job.job_title,
      company: job.company,
      category: selectedCategory?.value || "",
      location: job.location,
      currency_id: job.currency_id,
      experience: job.experience,
      salary: job.salary|| "No Disclosed",
      salary_max: job.salary_max|| "No Disclosed",
      job_type: Array.isArray(job.job_type)
        ? job.job_type.join(", ")
        : job.job_type,
      work_mode: job.work_mode,
      vacancies: job.vacancies,
      application_deadline: job.application_deadline,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      skills: Array.isArray(job.skills) ? job.skills.join(", ") : "",
      is_urgent: job.is_urgent,
      is_remote: job.is_remote,
      website_apply: job.website_apply,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(fileData, "jobs.xlsx");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* SEARCH BOX */}
      <div className="bg-white rounded-3xl lg:rounded-full shadow-xl p-4 border border-gray-100">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          {/* CATEGORY */}
          <div className="w-full lg:w-[30%] lg:border-r border-gray-200 lg:pr-4">
            <AsyncCreatableSelect
              cacheOptions
              defaultOptions
              loadOptions={getJobCategoryOptions}
              placeholder="Enter category"
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value)}
              className="text-left"
              styles={{
                control: (base) => ({
                  ...base,
                  border: "none",
                  boxShadow: "none",
                  minHeight: "52px",
                  backgroundColor: "transparent",
                }),
                indicatorSeparator: () => ({
                  display: "none",
                }),
              }}
            />
          </div>

          {/* KEYWORD */}
          <div className="w-full lg:w-[30%] lg:border-r border-gray-200 lg:px-4">
            <input
              type="text"
              placeholder="Enter keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full h-[52px] outline-none text-gray-700 bg-transparent px-2"
            />
          </div>

          {/* LOCATION */}
          <div className="w-full lg:w-[25%] lg:px-2">
            <AsyncCreatableSelect
              cacheOptions
              defaultOptions
              loadOptions={loadLocationOptions}
              placeholder="Enter location"
              value={selectedLocation}
              onChange={(value) => setSelectedLocation(value)}
              className="text-left"
              styles={{
                control: (base) => ({
                  ...base,
                  border: "none",
                  boxShadow: "none",
                  minHeight: "52px",
                  backgroundColor: "transparent",
                }),
                indicatorSeparator: () => ({
                  display: "none",
                }),
              }}
            />
          </div>

          {/* BUTTON */}
          <div className="w-full lg:w-auto">
            <button
              onClick={handleSearch}
              className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl lg:rounded-full font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Search size={20} />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* DEFAULT UI */}
      {!isSearched && (
        <div className="mt-16 bg-white rounded-3xl shadow-md border border-gray-100 p-10 sm:p-14 text-center">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
              <Search size={42} className="text-blue-600" />
            </div>
          </div>

          <h2 className="mt-6 text-3xl sm:text-4xl font-bold text-[#1b1833]">
            Find Jobs
          </h2>

          <p className="mt-3 text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Search jobs by category, keyword, and location.
          </p>
        </div>
      )}

     {/* RESULTS */}
      {isSearched && (
        <>
          {loading ? (
            <div className="mt-10 text-center text-lg font-medium">
              Loading jobs...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="mt-16 bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
              {/* HEADER */}
              <div className="px-4 sm:px-6 py-5 border-b bg-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#1b1833]">
                      Search Results
                    </h2>

                    <p className="text-sm sm:text-base text-gray-500 mt-1">
                      Found{" "}
                      <span className="font-semibold text-gray-800">
                        {searchResults.length}
                      </span>{" "}
                      jobs
                    </p>
                  </div>

                  <div className="flex md:justify-end">
                    <button
                      onClick={handleDownloadExcel}
                      className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Download size={18} />
                      Download Excel
                    </button>
                  </div>
                </div>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px]">
                  <thead className="bg-[#f7f7fb]">
                    <tr>
                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        Job Title
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        Company
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        Location
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        Experience
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        Min Salary
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        Max Salary
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        Work Mode
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        Skills
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {searchResults.map((job, index) => (
                      <tr
                        key={job.id || index}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        {/* JOB TITLE */}
                        <td className="px-6 py-5">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {job.job_title }
                            </h3>
                          </div>
                        </td>

                        {/* COMPANY */}
                        <td className="px-6 py-5 text-gray-700">
                          {job.company}
                        </td>

                        {/* LOCATION */}
                        <td className="px-6 py-5 text-gray-700">
                          {job.location}
                        </td>

                        {/* EXPERIENCE */}
                        <td className="px-6 py-5 text-gray-700">
                          {job.experience}
                        </td>

                        {/* MIN SALARY */}
                        <td className="px-6 py-5">
                          <p className="font-semibold text-green-600">
                             {job.salary || "No Disclosed"}
                          </p>
                        </td>

                        {/* MAX SALARY */}
                        <td className="px-6 py-5">
                          <p className="font-semibold text-green-600">
                           {job.salary_max || "No Disclosed"}
                          </p>
                        </td>

                        {/* WORK MODE */}
                        <td className="px-6 py-5">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                              job.work_mode === "remote"
                                ? "bg-green-100 text-green-700"
                                : job.work_mode === "hybrid"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {job.work_mode || " "}
                          </span>
                        </td>

                        {/* SKILLS */}
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-2 max-w-[250px]">
                            {job.skills?.slice(0, 3).map((skill, i) => (
                              <span
                                key={i}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // NO RESULTS
            <div className="mt-16 bg-white rounded-3xl shadow-md border border-gray-100 p-10 sm:p-14 text-center">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
                  <Search size={42} className="text-red-500" />
                </div>
              </div>

              <h2 className="mt-6 text-3xl sm:text-4xl font-bold text-[#1b1833]">
                No Jobs Found
              </h2>

              <p className="mt-3 text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Try changing keyword, category, or location.
              </p>

              <button
                onClick={() => {
                  setKeyword("");
                  setSelectedCategory(null);
                  setSelectedLocation(null);
                  setSearchResults([]);
                  setIsSearched(false);
                }}
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-semibold"
              >
                Clear Search
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}