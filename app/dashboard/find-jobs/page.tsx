"use client";

import { useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import AsyncSelect from "react-select/async";
import { Search, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const jobsData = [
  {
    title: "Flutter Developer",
    job_title: "Mobile App Developer",
    company: "AppVerse",
    category: "Mobile Development",
    location: "Germany",
    currency_id: 293,
    experience: "2-5 Years",
    salary: "70000",
    salary_max: "110000",
    job_type: ["full-time"],
    work_mode: "remote",
    vacancies: 2,
    application_deadline: "2026-07-25",
    description: "Develop cross-platform mobile applications.",
    requirements: "Flutter, Firebase, REST API",
    benefits: "Remote Work",
    skills: ["Flutter", "Dart", "Firebase"],
    is_urgent: true,
    is_remote: true,
    status: "active",
    questions: ["Explain Flutter widgets", "What is state management?"],
    website_apply: "https://example.com/flutter-job",
  },
  {
    title: "React Native Developer",
    job_title: "Mobile Engineer",
    company: "MobixSoft",
    category: "Mobile Development",
    location: "Canada",
    currency_id: 293,
    experience: "1-3 Years",
    salary: "65000",
    salary_max: "95000",
    job_type: ["full-time"],
    work_mode: "hybrid",
    vacancies: 3,
    application_deadline: "2026-07-30",
    description: "Build mobile apps using React Native.",
    requirements: "React Native, Redux",
    benefits: "Insurance",
    skills: ["React Native", "Redux", "JavaScript"],
    is_urgent: false,
    is_remote: false,
    status: "active",
    questions: ["Explain React Native lifecycle"],
    website_apply: "",
  },
  {
    title: "UI Designer",
    job_title: "Creative Designer",
    company: "DesignHub",
    category: "Design",
    location: "Australia",
    currency_id: 293,
    experience: "2 Years",
    salary: "45000",
    salary_max: "75000",
    job_type: ["full-time"],
    work_mode: "",
    vacancies: 1,
    application_deadline: "2026-08-05",
    description: "Design modern interfaces.",
    requirements: "Figma, Adobe XD",
    benefits: "Flexible Timing",
    skills: ["Figma", "UI Design"],
    is_urgent: true,
    is_remote: false,
    status: "active",
    questions: ["What is wireframing?"],
    website_apply: "https://example.com/ui-job",
  },
  {
    title: "UX Researcher",
    job_title: "UX Specialist",
    company: "PixelFlow",
    category: "Design",
    location: "United Kingdom",
    currency_id: 293,
    experience: "3-5 Years",
    salary: "60000",
    salary_max: "90000",
    job_type: ["full-time"],
    work_mode: "remote",
    vacancies: 2,
    application_deadline: "2026-08-10",
    description: "Research user experience patterns.",
    requirements: "UX Research, Analytics",
    benefits: "WFH",
    skills: ["UX", "Research", "Analytics"],
    is_urgent: false,
    is_remote: true,
    status: "active",
    questions: ["Explain UX process"],
    website_apply: "",
  },
  {
    title: "Data Scientist",
    job_title: "AI Engineer",
    company: "DataMind",
    category: "Data Science",
    location: "United States",
    currency_id: 293,
    experience: "3-6 Years",
    salary: "90000",
    salary_max: "140000",
    job_type: ["full-time"],
    work_mode: "hybrid",
    vacancies: 2,
    application_deadline: "2026-08-15",
    description: "Develop ML models.",
    requirements: "Python, ML",
    benefits: "Health Insurance",
    skills: ["Python", "Machine Learning", "TensorFlow"],
    is_urgent: true,
    is_remote: false,
    status: "active",
    questions: ["What is overfitting?"],
    website_apply: "https://example.com/ds-job",
  },
  {
    title: "Business Analyst",
    job_title: "Data Analyst",
    company: "InsightCorp",
    category: "Data Science",
    location: "Singapore",
    currency_id: 293,
    experience: "2-4 Years",
    salary: "55000",
    salary_max: "85000",
    job_type: ["full-time"],
    work_mode: "hybrid",
    vacancies: 3,
    application_deadline: "2026-08-20",
    description: "Analyze business data.",
    requirements: "SQL, Power BI",
    benefits: "Bonus",
    skills: ["SQL", "Power BI"],
    is_urgent: false,
    is_remote: false,
    status: "active",
    questions: ["Explain joins"],
    website_apply: "",
  },
  {
    title: "Finance Manager",
    job_title: "Accounts Head",
    company: "FinEdge",
    category: "Finance & Accounting",
    location: "Dubai",
    currency_id: 293,
    experience: "5+ Years",
    salary: "80000",
    salary_max: "130000",
    job_type: ["full-time"],
    work_mode: "",
    vacancies: 1,
    application_deadline: "2026-08-25",
    description: "Manage financial operations.",
    requirements: "Accounting, Taxation",
    benefits: "PF",
    skills: ["Accounting", "Finance"],
    is_urgent: true,
    is_remote: false,
    status: "active",
    questions: ["Explain balance sheet"],
    website_apply: "",
  },
  {
    title: "Accountant",
    job_title: "Junior Accountant",
    company: "MoneyCare",
    category: "Finance & Accounting",
    location: "India",
    currency_id: 293,
    experience: "1-2 Years",
    salary: "30000",
    salary_max: "50000",
    job_type: ["full-time"],
    work_mode: "",
    vacancies: 4,
    application_deadline: "2026-08-30",
    description: "Maintain financial records.",
    requirements: "Tally, GST",
    benefits: "Paid Leave",
    skills: ["Tally", "GST"],
    is_urgent: false,
    is_remote: false,
    status: "active",
    questions: ["Explain GST"],
    website_apply: "https://example.com/account-job",
  },
  {
    title: "HR Executive",
    job_title: "Recruitment Specialist",
    company: "TalentBridge",
    category: "Human Resources",
    location: "France",
    currency_id: 293,
    experience: "2 Years",
    salary: "40000",
    salary_max: "65000",
    job_type: ["full-time"],
    work_mode: "hybrid",
    vacancies: 2,
    application_deadline: "2026-09-05",
    description: "Handle recruitment process.",
    requirements: "Communication",
    benefits: "Bonus",
    skills: ["Recruitment", "HR"],
    is_urgent: false,
    is_remote: false,
    status: "active",
    questions: ["How do you hire candidates?"],
    website_apply: "",
  },
  {
    title: "HR Manager",
    job_title: "People Operations Manager",
    company: "HireSmart",
    category: "Human Resources",
    location: "Japan",
    currency_id: 293,
    experience: "4-6 Years",
    salary: "70000",
    salary_max: "110000",
    job_type: ["full-time"],
    work_mode: "remote",
    vacancies: 1,
    application_deadline: "2026-09-10",
    description: "Manage HR operations.",
    requirements: "HRMS, Leadership",
    benefits: "Remote Work",
    skills: ["HRMS", "Leadership"],
    is_urgent: true,
    is_remote: true,
    status: "active",
    questions: ["Explain HR policies"],
    website_apply: "https://example.com/hr-manager",
  },
];

export default function FindJobs() {
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState(jobsData);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isSearched, setIsSearched] = useState(false);
  const getJobCategoryOptions = async (inputValue: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/jobs_category?q=${inputValue || ""}`,
      );

      const data = await res.json();
      console.log("category", data);
      return data.map((category: any) => ({
        label: category.name,
        value: category.name,
      }));
    } catch (error) {
      console.error("Error fetching job categories:", error);
      return [];
    }
  };

  const loadLocationOptions = async (inputValue: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/locations/search/?q=${inputValue || ""}`,
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

  // Handle Search
  const handleSearch = () => {
    const filteredJobs = jobsData.filter((job) => {
      // Keyword Match
      const matchKeyword =
        keyword === "" ||
        job.title.toLowerCase().includes(keyword.toLowerCase()) ||
        job.job_title.toLowerCase().includes(keyword.toLowerCase()) ||
        job.company.toLowerCase().includes(keyword.toLowerCase()) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(keyword.toLowerCase()),
        );

      // Category Match
      const matchCategory =
        !selectedCategory ||
        job.category
          .toLowerCase()
          .includes(selectedCategory.value.toLowerCase());

      // Location Match
      const matchLocation =
        !selectedLocation ||
        job.location
          .toLowerCase()
          .includes(selectedLocation.label.toLowerCase());

      return matchKeyword && matchCategory && matchLocation;
    });

    setSearchResults(filteredJobs);
    setIsSearched(true);
  };

  const handleDownloadExcel = () => {
    if (searchResults.length === 0) return;

    const excelData = searchResults.map((job) => ({
      title: job.title,
      job_title: job.job_title,
      company: job.company,
      category: job.category,
      location: job.location,
      currency_id: job.currency_id,
      experience: job.experience,
      salary: job.salary,
      salary_max: job.salary_max,

      job_type: Array.isArray(job.job_type)
        ? job.job_type.join(", ")
        : job.job_type,

      work_mode: job.work_mode,
      vacancies: job.vacancies,
      application_deadline: job.application_deadline
        ? new Date(job.application_deadline).toLocaleDateString("en-GB")
        : "",
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,

      skills: Array.isArray(job.skills) ? job.skills.join(", ") : "",

      is_urgent: job.is_urgent,
      is_remote: job.is_remote,

      status: job.status,

      questions: Array.isArray(job.questions) ? job.questions.join(" | ") : "",

      website_apply: job.website_apply,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Search Results");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(fileData, "search-results.xlsx");
  };

  return (
    <div className="w-full max-w-6xl text-center">
      {/* Search Box */}
      <div className="bg-white rounded-3xl lg:rounded-full shadow-xl p-4 border border-gray-100">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          {/* Category Select */}
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

          {/* Keyword Input */}
          <div className="w-full lg:w-[30%] lg:border-r border-gray-200 lg:px-4">
            <input
              type="text"
              placeholder="Enter keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full h-[52px] outline-none text-gray-700 bg-transparent px-2"
            />
          </div>

          {/* Location Select */}
          <div className="w-full lg:w-[25%] lg:px-2">
            <AsyncSelect
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

          {/* Search Button */}
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

      {/* Default Empty UI */}
      {!isSearched && (
        <div className="mt-16 bg-white rounded-3xl shadow-md border border-gray-100 p-10 sm:p-14 text-center">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
              <Search size={42} className="text-blue-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="mt-6 text-3xl sm:text-4xl font-bold text-[#1b1833]">
            Find Jobs
          </h2>

          {/* Description */}
          <p className="mt-3 text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Search jobs by category, keyword, and location.
          </p>

          {/* Tags */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              "React Developer",
              "Flutter",
              "Python",
              "Node.js",
              "SEO",
              "UI/UX",
              "DevOps",
            ].map((tag, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {isSearched && (
        <>
          {searchResults.length > 0 ? (
            <div className="mt-16 bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-5 border-b bg-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left Content */}
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

                  {/* Right Button */}
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

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-[#f7f7fb]">
                    <tr>
                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        Category
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        Location
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        Company
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        Experience
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        Skills
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {searchResults.map((job, index) => (
                      <tr
                        key={index}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 text-gray-700">
                          {job.category}
                        </td>

                        <td className="px-6 py-4 text-gray-700">
                          {job.location}
                        </td>

                        <td className="px-6 py-4 text-gray-700">
                          {job.company}
                        </td>

                        <td className="px-6 py-4 text-gray-700">
                          {job.experience}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, i) => (
                              <span
                                key={i}
                                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
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
            // No Results UI
            <div className="mt-16 bg-white rounded-3xl shadow-md border border-gray-100 p-10 sm:p-14 text-center">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
                  <Search size={42} className="text-red-500" />
                </div>
              </div>

              {/* Title */}
              <h2 className="mt-6 text-3xl sm:text-4xl font-bold text-[#1b1833]">
                No Jobs Found
              </h2>

              {/* Description */}
              <p className="mt-3 text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                We couldn't find any jobs matching your search criteria. Try
                changing the keyword, category, or location to get better
                results.
              </p>

              {/* Actions */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setKeyword("");
                    setSelectedCategory(null);
                    setSelectedLocation(null);
                    setSearchResults([]);
                    setIsSearched(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
