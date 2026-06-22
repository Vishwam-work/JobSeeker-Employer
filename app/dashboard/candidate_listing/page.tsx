"use client";

import { useEffect, useState } from "react";
import { Phone, FileText, Mail, CheckSquare, ChevronDown, Bookmark,Check,MapPin ,ChevronLeft,ChevronRight,Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import Highlighter from "react-highlight-words";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
interface Candidate {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  phone_code?: string;
  current_role?: string;
  current_company?: string;
   gender: string;
   professional_summary: string;
  experience: string;
  current_salary: string;
  expected_salary?: string;
  current_currency?: 
  { 
    symbol_native: string,
    code: string,

  };
  notice_period?: string;

  city?: { name: string };
  state?: { name: string };
  country?: { name: string };
  profile_image?: string | null;
  resume?: string;

  skills?: { name: string }[];

  certifications?: {
    name: string;
    issuer?: string;
    year?: string | number;
  }[];

  educations?: {
    education?: string;
    course?: string;
    institution?: string;
    education_detail?: { name: string };
    course_detail?: { name: string };
    start_year?: string | number;
    end_year?: string | number;
    score_type?: string;
    percentage?: string | number;
  }[];

  experiences?: {
    designation?: string;
    company?: string;
    job_title?: string;
    category?: string;
    description?: string;
    start_date?: string | number;
    end_date?: string | number;
  }[];
}


export default function CandidatesPage() {
  const isSubscribed = false;
  const [savedProfiles, setSavedProfiles] = useState<number[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewedCandidateIds, setViewedCandidateIds] = useState<number[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [allCompanies, setAllCompanies] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchCompany, setSearchCompany] = useState("");
  const experienceList = [
  "fresher",
  "1-2",
  "3-5",
  "6-10",
  "10-15",
  "15-20",
  "20+",
];

const salaryRanges = [
  "0-3 LPA",
  "3-6 LPA",
  "6-10 LPA",
  "10-15 LPA",
  "15-20 LPA",
  "20+ LPA",
];
  const [states, setStates] = useState<
  { id: number; name: string }[]
  >([]);
  const [stateSearch, setStateSearch] = useState("");
const [degreeOptions, setDegreeOptions] = useState<
  { label: string; value: string }[]
>([]);
const [degreeSearch, setDegreeSearch] = useState("");
const [jobCategoryOptions, setJobCategoryOptions] = useState<
  { label: string; value: string }[]
>([]);
const [jobCategorySearch, setJobCategorySearch] = useState("");
  const [filters, setFilters] = useState({
    keywords: "",
    currentCompany: [] as string[], 
    locationSearch: "",
    locations: [] as string[],
    minExperience: "",
    maxExperience: "",
    minSalary: "",
    maxSalary: "",
    department: [] as string[],
    noticePeriod: [] as string[],
    gender: "",
    degree: [] as string[],
    degreeSearch: "",
    experience: [] as string[],
    salary: [] as string[],
  });
const [appliedFilters, setAppliedFilters] = useState(filters);
  //  Clear Filters function
const clearFilters = () => {
  const emptyFilters = {
    keywords: "",
    currentCompany: [],
    locationSearch: "",
    locations: [],
    minExperience: "",
    maxExperience: "",
    minSalary: "",
    maxSalary: "",
    department: [],
    noticePeriod: [],
    gender: "",
    degree: [],
    degreeSearch: "",
    experience: [],
    salary: [],
  };

  setFilters(emptyFilters);
  setAppliedFilters(emptyFilters);
  setSearch("");
  setPage(1);
};

  // Add this function above your component or inside the component

const getJobCategoryOptions = async (inputValue: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_MASTER}/jobs_category?q=${inputValue || ""}`
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
// Load categories when component mounts
useEffect(() => {
  const loadJobCategories = async () => {
    const options = await getJobCategoryOptions("");
    setJobCategoryOptions(options);
  };

  loadJobCategories();
}, []);
useEffect(() => {
  const fetchStates = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/states`
      );
      const data = await res.json();
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  fetchStates();
}, []);
// Use this exact function instead of your current loadCategories

const loadCategories = async (inputValue: string) => {
  const token =
    localStorage.getItem("user_token") ||
    localStorage.getItem("employeer_token");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_MASTER}/categories/?q=${inputValue}`,
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    console.log("Categories API Response:", data);

    // Handle paginated response
    const results = Array.isArray(data)
      ? data
      : Array.isArray(data.results)
      ? data.results
      : [];

    return results.map((item: any) => ({
      label: item.name,
      value: item.name,
    }));
  } catch (error) {
    console.error("Error loading categories:", error);
    return [];
  }
};

// Load categories on mount
useEffect(() => {
  const fetchDegrees = async () => {
    const options = await loadCategories("");
    setDegreeOptions(options);
    console.log("Degree Options:", options);
  };

  fetchDegrees();
}, []);

  const formatNumber = (
  value: string | number,
  currency: string = "INR"
): string => {
  if (!value) return "";

  return new Intl.NumberFormat(
    currency === "INR" ? "en-IN" : "en-US"
  ).format(Number(String(value).replace(/,/g, "")));
};

  const cleanSearch = appliedFilters.keywords.trim().replace(/\s+/g, " ");
// Current Company filter options ke liye sabhi pages ka data fetch karo
useEffect(() => {
  const token = localStorage.getItem("employeer_token");
  if (!token) return;

  const fetchAllCompanies = async () => {
    try {
      let nextUrl = `https://jobseeker-backend-jy1y.onrender.com/employeer/api/profile-all/?page=1`;
      const companySet = new Set<string>();

      while (nextUrl) {
        const res = await fetch(nextUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        (data.results || []).forEach((candidate: Candidate) => {
          // Direct current_company
          if (candidate.current_company?.trim()) {
            companySet.add(candidate.current_company.trim());
          }

          // Fallback: current experience company
          const currentExp = candidate.experiences?.find(
            (exp) =>
              !exp.end_date ||
              String(exp.end_date).toLowerCase() === "present"
          );

          if (currentExp?.company?.trim()) {
            companySet.add(currentExp.company.trim());
          }
        });

        // Django REST Framework pagination next URL
        nextUrl = data.next;
      }

      setAllCompanies(
        Array.from(companySet).sort((a, b) =>
          a.localeCompare(b)
        )
      );
    } catch (error) {
      console.error("Error fetching companies:", error);
      setAllCompanies([]);
    }
  };

  fetchAllCompanies();
}, []);
// fetch with pagination
useEffect(() => {
  const token = localStorage.getItem("employeer_token");
  if (!token) return;

  setLoading(true);

  const params = new URLSearchParams();
  params.append("page", page.toString());

   // Keywords
  if (appliedFilters.keywords.trim()) {
    params.append("keywords", appliedFilters.keywords.trim());
  }

  // Location filter
if (appliedFilters.locations.length > 0) {
  appliedFilters.locations.forEach((location) => {
    params.append("location", location);
  });
}

  // current company
  appliedFilters.currentCompany.forEach((company) => {
    params.append("current_company", company);
  });

  // experience
 appliedFilters.experience.forEach((exp) => {
  params.append("experience", exp);
});

// Salary filter
appliedFilters.salary.forEach((sal) => {
  params.append("salary_range", sal);
});

  // department
  appliedFilters.department.forEach((dept) => {
    params.append("category", dept);
  });

  // gender
  if (appliedFilters.gender) {
    params.append("gender", appliedFilters.gender);
  }

  // degree
  appliedFilters.degree.forEach((degree) => {
  params.append("degree_course", degree);
});

  const url = `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/profile-all/?${params.toString()}`;

  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
  if (Array.isArray(data.results)) {
    setCandidates(data.results);
    setTotalProfiles(data.count || 0);

    const pageSize = data.results.length;

    setTotalPages(Math.ceil((data.count || 0) / pageSize));
  } else {
    setCandidates([]);
    setTotalProfiles(0);
    setTotalPages(1);
  }

  setLoading(false);
})
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
}, [page, appliedFilters]);

// Apply Filters button
const applyFilters = () => {
  setPage(1);
  setAppliedFilters({
    ...filters,
    keywords: search.trim(),
  });
};
  // Save profile function
useEffect(() => {
  fetchSavedProfiles();
}, []);

// Fetch saved profiles to identify which candidates have been saved and show bookmark icon accordingly
const fetchSavedProfiles = async () => {
  const token = localStorage.getItem("employeer_token");

  if (!token) return;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/saved-profiles-all/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

   const data = await res.json();

    const ids = data.results.map(
      (item: any) => item.profile.id
    );

    setSavedProfiles(ids);

        setSavedProfiles(ids);
      } catch (err) {
        console.error(err);
      }
    };

useEffect(() => {
  fetchViewedProfiles();
}, []);

// Fetch viewed profiles to identify which candidates have been viewed and show blue eye icon accordingly
const fetchViewedProfiles = async () => {
  const token = localStorage.getItem("employeer_token");

  if (!token) return;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/view-profile/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch viewed profiles");
    }

    const data = await res.json();

    setViewedCandidateIds(data.profile_ids || []);
  } catch (err) {
    console.error(err);
  }
};

// Save profile function
const saveProfile = async (profileId: number) => {
  const token = localStorage.getItem("employeer_token");

  if (!token) {
    alert("Please login first");
    return;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/saved-profile/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profile: profileId,
        }),
      }
    );

    if (res.status === 400) {
      const data = await res.json();
      console.log(data.detail || "Already saved");
      return;
    }

    if (!res.ok) {
      throw new Error("Failed to save profile");
    }

    // direct id add
    setSavedProfiles((prev) => [...prev, profileId]);

    console.log("Profile saved successfully");
  } catch (err) {
    console.error("Error saving profile:", err);
  }
};

const removeSavedProfile = async (profileId: number) => {
  const token = localStorage.getItem("employeer_token");

  if (!token) return;

  try {
    //  find saved record
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/saved-profiles-all/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const savedData = await res.json();

    const record = savedData.results.find(
      (item: any) => item.profile.id === profileId
    );

    if (!record) {
      return;
    }

    // delete api
    const delRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/saved-profiles/${record.id}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!delRes.ok && delRes.status !== 204) {
      throw new Error("Failed to remove profile");
    }

    // state update
    setSavedProfiles((prev) =>
      prev.filter((id) => id !== profileId)
    );

    console.log("Profile removed");
  } catch (err) {
    console.error(err);
  }
};


// View profile function (blue eye icon) - store viewed profile in backend
const viewProfile = async (profileId: number) => {
  const token = localStorage.getItem("employeer_token");

  if (!token) return;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/view-profile/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profile: profileId,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to store viewed profile");
    }

    const data = await res.json();
    console.log("View profile response:", data);

    // backend se latest ids
    setViewedCandidateIds(data.profile_ids || []);

    console.log("Viewed profile stored");
  } catch (err) {
    console.error(err);
  }
};

// Filter candidates based on search and filters
  const filteredCandidates = candidates.filter((c) => {
    // 1. Global Search (Search Bar)
    const q = appliedFilters.keywords.trim().toLowerCase();
    let matchesSearch = true;
    if (q) {
      const matches = (value: any) =>
        value !== null &&
        value !== undefined &&
        String(value).toLowerCase().includes(q);

      matchesSearch =
        matches(c.full_name) ||
        matches(c.email) ||
        matches(c.current_role) ||
        matches(c.current_company) ||
        matches(c.experience) ||
        matches(c.current_salary) ||
        matches(c.expected_salary) ||
        matches(c.current_currency?.symbol_native) ||
        matches(c.gender) ||
        matches(c.professional_summary) ||
        matches(c.expected_salary) ||
        matches(c.notice_period) ||
        matches(c.city?.name) ||
        matches(c.state?.name) ||
        matches(c.country?.name) ||
        (c.skills?.some((s) =>
          (s?.name || s)?.toString().toLowerCase().includes(q)
        ) ?? false) ||
        (c.certifications?.some(
          (cert) =>
            matches(cert.name) || matches(cert.issuer) || matches(cert.year)
        ) ?? false) ||
        (c.educations?.some(
          (e) =>
            matches(e.education) ||
            matches(e.course) ||
            matches(e.institution) ||
            matches(e.start_year) || 
            matches(e.end_year) ||
            matches(e.score_type) ||
            matches(e.percentage) 
        ) ?? false) ||
        (c.experiences?.some(
          (ex) => matches(ex.designation) || matches(ex.company)
        ) ?? false);
    }
    // Current Company
      if (appliedFilters.currentCompany.length > 0) {
        const normalize = (val: any) =>
          val ? String(val).toLowerCase() : "";

        const matchesCompany = appliedFilters.currentCompany.some((company) => {
          const q = company.toLowerCase();

          if (normalize(c.current_company).includes(q)) return true;

          const currentExp = c.experiences?.find(
            (ex: any) =>
              !ex.end_date ||
              normalize(ex.end_date) === "present"
          );

          return normalize(currentExp?.company).includes(q);
        });

        if (!matchesCompany) return false;
      }

    // Location
   if (appliedFilters.locations.length > 0) {
  const stateMatch = appliedFilters.locations.some(
    (stateName) =>
      c.state?.name?.toLowerCase() ===
      stateName.toLowerCase()
  );

  if (!stateMatch) return false;
}

// Salary Filter
if (appliedFilters.salary.length > 0) {
  const salVal = Number(c.expected_salary || 0);

  const matchesSalary = appliedFilters.salary.some((range) => {
    if (range === "20+ LPA") {
      return salVal >= 20 * 100000;
    }

    const cleanedRange = range.replace(" LPA", "");
    const [min, max] = cleanedRange.split("-").map(Number);

    const minSalary = min * 100000;
    const maxSalary = max * 100000;

    return salVal >= minSalary && salVal <= maxSalary;
  });

  if (!matchesSalary) return false;
}
    // Department
    if (appliedFilters.department.length > 0) {
  const matchesDept = appliedFilters.department.some((dept) => {
    const selectedCategory = dept.toLowerCase();

    // Check all experiences.category
    const categoryMatch =
      c.experiences?.some(
        (exp) =>
          exp.category &&
          exp.category.toLowerCase() === selectedCategory
      ) ?? false;

    // Optional fallback: current role contains selected category
    const roleMatch =
      c.current_role?.toLowerCase().includes(selectedCategory) ?? false;

    return categoryMatch || roleMatch;
  });

  if (!matchesDept) return false;
}

    // Gender
    if (appliedFilters.gender) {
      if ((c as any).gender?.toLowerCase() !== appliedFilters.gender.toLowerCase()) return false;
    }

    return matchesSearch;
  });
  useEffect(() => {
  if (!candidates.length) return;

  const set = new Set<string>();

  const normalize = (val: any) =>
    val ? String(val).trim() : "";

  candidates.forEach((c) => {
    if (c.current_company) {
      set.add(normalize(c.current_company));
    } else {
      const currentExp = c.experiences?.find(
        (ex: any) =>
          !ex.end_date ||
          String(ex.end_date).toLowerCase() === "present"
      );

      if (currentExp?.company) {
        set.add(normalize(currentExp.company));
      }
    }
  });

  setAllCompanies(Array.from(set));
}, [candidates]);

// Toggle company filter
const toggleCompany = (company: string) => {
  const exists = filters.currentCompany.includes(company);

  if (exists) {
    setFilters({
      ...filters,
      currentCompany: filters.currentCompany.filter((c) => c !== company),
    });
  } else {
    setFilters({
      ...filters,
      currentCompany: [...filters.currentCompany, company],
    });
  }
};

// Highlight component for search terms
  type HighlightProps = {
    text?: string;
  };

  const Highlight = ({ text = "" }: HighlightProps) => {
    if (!cleanSearch) return <>{text}</>;

    return (
      <Highlighter
        highlightClassName="bg-yellow-200 px-1 rounded font-semibold"
        searchWords={cleanSearch.split(" ")}
        autoEscape={true}
        textToHighlight={String(text)}
      />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading candidates...
      </div>
    );
  }

  // Subscription check
// if (!isSubscribed) {
//   return (
//     <div className="flex items-center justify-center">
//       <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
//         <div className="grid md:grid-cols-2">
//           {/* Left Section */}
//           <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-6 md:p-8">
//             <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-[10px] font-semibold uppercase tracking-wider">
//               Premium Access
//             </span>

//             <h1 className="mt-4 text-2xl md:text-4xl font-bold leading-tight">
//               Unlock Full
//               <br />
//               Candidate Database
//             </h1>

//             <p className="mt-3 text-blue-100 text-sm md:text-base leading-relaxed">
//               Subscribe to access unlimited candidate profiles, resumes,
//               contact details, and advanced search filters.
//             </p>

//             {/* Features */}
//             <div className="mt-5 space-y-2.5">
//               {[
//                 "Unlimited Profile Views",
//                 "Download Resumes",
//                 "Access Email & Phone",
//                 "Advanced Search Filters",
//                 "Save Unlimited Profiles",
//                 "Priority Support",
//               ].map((feature) => (
//                 <div key={feature} className="flex items-center gap-2">
//                   <div className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center">
//                     <Check className="w-3.5 h-3.5 text-green-300" />
//                   </div>
//                   <span className="text-sm">{feature}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right Section */}
//           <div className="p-6 md:p-8 flex flex-col justify-center bg-white">
//             <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//               Starting From
//             </p>

//             <div className="mt-2 flex items-end gap-1">
//               <span className="text-4xl font-bold text-gray-900">₹999</span>
//               <span className="text-base text-gray-500 mb-1">/month</span>
//             </div>

//             <p className="mt-2 text-sm text-gray-500">
//               Cancel anytime • Instant activation
//             </p>

//             <div className="my-5 border-t border-gray-200" />

//             <div className="space-y-3">
//               <Link href="/pricing" className="block">
//                 <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold">
//                   Upgrade Now
//                 </Button>
//               </Link>

//               <Link href="/pricing" className="block">
//                 <Button
//                   variant="outline"
//                   className="w-full h-11 rounded-xl text-sm font-semibold"
//                 >
//                   View All Plans
//                 </Button>
//               </Link>
//             </div>

//             <p className="mt-4 text-xs text-gray-400 text-center md:text-left">
//               Trusted by recruiters across India.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
  return (
    <div className="min-h-screen">
      <div className="p-4 md:hidden flex justify-between items-center">
        <button
          onClick={() => setShowFilters(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Filters
        </button>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 p-4">
        {/* LEFT FILTERS */}
        <aside className="hidden md:block col-span-3 bg-white rounded-xl p-4 shadow-sm h-fit max-h-screen overflow-y-auto sticky top-4">
          <div className="mb-4">
            {/* Top Row */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="font-semibold text-sm text-gray-900">Filters</h3>

              <button
                onClick={clearFilters}
                className="text-xs text-blue-600 hover:underline whitespace-nowrap"
              >
                Clear all
              </button>
            </div>

            {/* Apply Button */}
            <button
              onClick={applyFilters}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium text-sm transition"
            >
              Apply Filters
            </button>
          </div>

          <hr className="mb-4" />

          {/* Gender*/}
          <details className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between">
              Gender <span><ChevronDown className="w-4 h-4" /></span>
            </summary>

            <div className="flex gap-3">
              <button
                onClick={() => setFilters({ ...filters, gender: filters.gender === 'Male' ? '' : 'Male' })}
                className={`border rounded-full px-4 py-1 text-sm ${filters.gender === 'Male' ? 'bg-blue-100 border-blue-200' : 'hover:bg-gray-50'}`}>
                Male
              </button>
              <button
                onClick={() => setFilters({ ...filters, gender: filters.gender === 'Female' ? '' : 'Female' })}
                className={`border rounded-full px-4 py-1 text-sm ${filters.gender === 'Female' ? 'bg-blue-100 border-blue-200' : 'hover:bg-gray-50'}`}>
                Female
              </button>
              <button
                onClick={() => setFilters({ ...filters, gender: filters.gender === 'Other' ? '' : 'Other' })}
                className={`border rounded-full px-4 py-1 text-sm ${filters.gender === 'Other' ? 'bg-blue-100 border-blue-200' : 'hover:bg-gray-50'}`}>
                Other
              </button>

            </div>
          </details>

          <hr className="mb-4" />

          {/* Keywords */}
          <details className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between">
              Keywords <span><ChevronDown className="w-4 h-4" /></span>
            </summary>

            <div className="mt-2">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value); // only update input value
                  setFilters((prev) => ({
                    ...prev,
                    keywords: value, // store in filters
                  }));
                }}
                placeholder="Search by skill, keyword, company, designation..."
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
          </details>

          <hr className="mb-4" />

          {/* Current Company */}
          <details className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between">
              Current Company <span><ChevronDown className="w-4 h-4" /></span>
            </summary>

            {/* Search */}
            <input
              type="text"
              placeholder="Search company"
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
              className="w-full border rounded px-2 py-2 text-sm mb-2"
            />

            {/* List */}
            <div className="max-h-48 overflow-y-auto">
              {allCompanies
                .filter((company) =>
                  company.toLowerCase().includes(searchCompany.toLowerCase())
                )
                .map((company) => {
                  const checked = filters.currentCompany.includes(company);

                  return (
                    <div
                      key={company}
                      className="flex items-center justify-between mb-2"
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCompany(company)}
                        />
                        <label className="text-sm text-gray-700">
                          {company}
                        </label>
                      </div>

                      {/* Optional count (agar data ho to) */}
                      {/* <span className="text-xs text-gray-400">123</span> */}
                    </div>
                  );
                })}
            </div>
          </details>

          <hr className="mb-4" />

          {/* Location */}
          <details className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between">
              Location <span><ChevronDown className="w-4 h-4" /></span>
            </summary>

            {/* Search State */}
            <input
              type="text"
              placeholder="Search state"
              value={stateSearch}
              onChange={(e) => setStateSearch(e.target.value)}
              className="w-full border rounded px-2 py-2 mb-3 text-sm"
            />

            {/* State List */}
            <div className="max-h-48 overflow-y-auto">
              {states
                .filter((state) =>
                  state.name
                    .toLowerCase()
                    .includes(stateSearch.toLowerCase())
                )
                .map((state) => (
                  <label
                    key={state.id}
                    className="flex items-center gap-2 mb-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.locations.includes(state.name)}
                      onChange={() =>
                        setFilters((prev) => ({
                          ...prev,
                          locations: prev.locations.includes(state.name)
                            ? prev.locations.filter(
                                (item) => item !== state.name
                              )
                            : [...prev.locations, state.name],
                        }))
                      }
                    />
                    <span className="text-sm text-gray-700">
                      {state.name}
                    </span>
                  </label>
                ))}
            </div>
          </details>

          <hr className="mb-4" />

          {/* Experience */}
          <details className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Experience (Years) <span><ChevronDown className="w-4 h-4" /></span>
            </summary>

            <div className="space-y-2">
              {experienceList.map((range) => (
                <label
                  key={range}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.experience.includes(range)}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        experience: prev.experience.includes(range)
                          ? prev.experience.filter((item) => item !== range)
                          : [...prev.experience, range],
                      }))
                    }
                  />
                  <span className="text-sm text-gray-700">{range}</span>
                </label>
              ))}
            </div>
          </details>

          <hr className="mb-4" />

          {/* Salary */}
          <details className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Salary (INR-Lacs) <span><ChevronDown className="w-4 h-4" /></span>
            </summary>

            <div className="space-y-2">
              {salaryRanges.map((range) => (
                <label
                  key={range}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.salary.includes(range)}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        salary: prev.salary.includes(range)
                          ? prev.salary.filter((item) => item !== range)
                          : [...prev.salary, range],
                      }))
                    }
                  />
                  <span className="text-sm text-gray-700">{range}</span>
                </label>
              ))}
            </div>
          </details>

          <hr className="mb-4" />

          {/* Department & Role */}
          <details className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Department & Role <span><ChevronDown className="w-4 h-4" /></span>
            </summary>

            {/* Search Box */}
            <input
              type="text"
              placeholder="Search category"
              value={jobCategorySearch}
              onChange={(e) => setJobCategorySearch(e.target.value)}
              className="w-full border rounded px-2 py-2 text-sm mb-3"
            />

            {/* Category List */}
            <div className="max-h-48 overflow-y-auto">
              {jobCategoryOptions
                .filter((option) =>
                  option.label
                    .toLowerCase()
                    .includes(jobCategorySearch.toLowerCase())
                )
                .map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 mb-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.department.includes(option.value)}
                      onChange={() =>
                        setFilters((prev) => ({
                          ...prev,
                          department: prev.department.includes(option.value)
                            ? prev.department.filter(
                                (item) => item !== option.value
                              )
                            : [...prev.department, option.value],
                        }))
                      }
                    />
                    <span className="text-sm text-gray-700">
                      {option.label}
                    </span>
                  </label>
                ))}
            </div>
          </details>

          <hr className="mb-4" />

          {/*  Degree / Course */}
          <details className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-3">
              Degree <span><ChevronDown className="w-4 h-4" /></span>
            </summary>

            {/* Search Box */}
            <input
              type="text"
              placeholder="Search degree"
              value={degreeSearch}
              onChange={(e) => setDegreeSearch(e.target.value)}
              className="w-full border rounded px-2 py-2 text-sm mb-3"
            />

            {/* Degree List */}
            <div className="max-h-48 overflow-y-auto">
              {degreeOptions
                .filter((option) =>
                  option.label
                    .toLowerCase()
                    .includes(degreeSearch.toLowerCase())
                )
                .map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 mb-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.degree.includes(option.value)}
                      onChange={() =>
                        setFilters((prev) => ({
                          ...prev,
                          degree: prev.degree.includes(option.value)
                            ? prev.degree.filter(
                                (item) => item !== option.value
                              )
                            : [...prev.degree, option.value],
                        }))
                      }
                    />
                    <span className="text-sm text-gray-700">
                      {option.label}
                    </span>
                  </label>
                ))}
            </div>
          </details>
        </aside>



      {/* mobile filter */}



        {!selectedCandidate ? (
          <main className="col-span-12 md:col-span-9 space-y-4">

            {/* FIRST 1 CANDIDATE */}
               {filteredCandidates.length > 0 ? (
               <>
              {filteredCandidates.map((c) => {

               const isSaved = savedProfiles.includes(c.id);

                return (
                <div
                    key={c.id}
                    className="relative bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4"
                  >
                    {viewedCandidateIds.includes(c.id) && (
                    <div className="absolute top-0 left-0 z-20 group">

                      {/* Blue corner triangle */}
                      <div className="w-0 h-0 border-t-[35px] border-t-blue-700 border-r-[35px] border-r-transparent" />

                      {/* White Tick */}
                      <Check
                        size={14}
                        className="absolute top-1 left-1 text-white font-bold stroke-[3]"
                      />

                      {/* Hover Tooltip */}
                      <div className="absolute left-2 top-8 hidden group-hover:block">
                        <div className="bg-white border border-gray-300 shadow-lg px-3 py-2 text-xs rounded whitespace-nowrap text-gray-700">
                          Profile viewed by you
                        </div>
                      </div>

                    </div>
                  )}

                {/* MAIN INFO */}
                <div className="flex-1 flex flex-col gap-2">

                {/* NAME */}
               <Link
                  href={`/dashboard/candidate_listing/candidate_detail/${c.id}`}
                  target="_blank"
                  onClick={() => viewProfile(c.id)}
                >
                  <h3 className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 flex items-center gap-2">
                    <span className="font-semibold">
                      <Highlight text={c.full_name} />
                    </span>
                  </h3>
                </Link>

               {/* Candidate Details Section */}
                <div className="mt-4 space-y-3 text-sm text-gray-700">

                  {/* Top Info Row */}
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    {c.experience && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <Highlight
                          text={
                            c.experience.charAt(0).toUpperCase() +
                            c.experience.slice(1)
                          }
                        />
                      </span>
                    )}

                    {c.current_salary && (
                      <span className="flex items-center gap-1">
                        <Highlight
                          text={`${c.current_currency?.symbol_native || ""}${formatNumber(
                            c.current_salary,
                            c.current_currency?.code
                          )}`}
                        />
                      </span>
                    )}
                    -
                      {c.expected_salary && (
                      <span className="flex items-center gap-1">
                        <Highlight
                          text={`${c.current_currency?.symbol_native || ""}${formatNumber(
                            c.expected_salary,
                            c.current_currency?.code
                          )}`}
                        /> / yr
                      </span>
                    )}

                    {(c.city?.name || c.state?.name) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <Highlight text={c.city?.name || ""} />
                        {c.city?.name && c.state?.name && ","}
                        <Highlight text={c.state?.name || ""} />
                      </span>
                    )}
                  </div>

                  {/* Current Role */}
                  {c.current_role && (
                    <div className="grid grid-cols-[140px_1fr] gap-2">
                      <span className="font-medium text-gray-600">Current</span>
                      <span className="text-gray-900">
                        <Highlight text={c.current_role} />
                        {c.current_company && (
                          <>
                            {" "}at <Highlight text={c.current_company} />
                          </>
                        )}
                      </span>
                    </div>
                  )}

                  {/* Notice Period */}
                  {c.notice_period && (
                    <div className="grid grid-cols-[140px_1fr] gap-2">
                      <span className="font-medium text-gray-600">Notice Period</span>
                      <span className="text-gray-900">
                        <Highlight text={c.notice_period} />
                      </span>
                    </div>
                  )}

                  {/* Preferred Location */}
                  {(c.country?.name || c.city?.name || c.state?.name) && (
                    <div className="grid grid-cols-[140px_1fr] gap-2">
                      <span className="font-medium text-gray-600">Current Location</span>
                      <span className="text-gray-900">
                        <Highlight
                          text={[
                            c.city?.name,
                            c.state?.name,
                            c.country?.name,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        />
                      </span>
                    </div>
                  )}

                  {/* Professional Summary */}
                  {c.professional_summary && (
                    <div className="grid grid-cols-[140px_1fr] gap-2">
                      <span className="font-medium text-gray-600">
                      Summary
                      </span>

                      <div
                        className="text-gray-700 leading-relaxed prose max-w-none
                          [&_ul]:list-disc [&_ul]:pl-6
                          [&_ol]:list-decimal [&_ol]:pl-6
                          [&_li]:mb-1"
                        dangerouslySetInnerHTML={{
                          __html: c.professional_summary || "",
                        }}
                      />
                    </div>
                  )}

                  {/* Key Skills */}
                {c.skills && (
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <span className="font-medium text-gray-600">Key Skills</span>
                    <span className="text-gray-900 leading-relaxed">
                      <Highlight
                        text={
                          Array.isArray(c.skills)
                            ? c.skills.map((skill: { name: string }) => skill.name).join(" | ")
                            : typeof c.skills === "string"
                            ? c.skills
                            : ""
                        }
                      />
                    </span>
                  </div>
                )}

                </div>

                <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  isSaved
                    ? removeSavedProfile(c.id)
                    : saveProfile(c.id)
                }
                className={`flex items-center gap-2 self-end ${
                  isSaved
                    ? "text-green-600"
                    : "text-gray-400 hover:text-green-500"
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 transition-all duration-300 ${
                    isSaved
                      ? "fill-green-500 drop-shadow-[0_0_6px_rgba(34,197,94,0.8)]"
                      : ""
                  }`}
                />

                <span className="text-sm font-medium">
                  {isSaved ? "Saved" : "Save"}
                </span> 
                </Button>
              </div>


                {/* RIGHT ACTION PANEL */}
                <div className="flex md:flex-col items-center md:items-center justify-between md:justify-center gap-2 md:gap-3 md:w-52 w-full border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4">
                  <img
                    src={
                      c.profile_image
                        ? `${process.env.NEXT_PUBLIC_URL}${c.profile_image}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          c.full_name
                        )}`
                    }
                    alt={c.full_name}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border"
                  />

                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Mail size={14} /> <Highlight text={c.email} />
                  </p>
                </div>
              </div>
              );
              })}
             {/* Pagination */}
          <div className="flex items-center justify-center mt-8 px-4 py-3">

            <div className="flex items-center gap-2">
              {/* Previous */}
              <button
                disabled={page === 1}
                onClick={() => {
                  const newPage = Math.max(page - 1, 1);
                  console.log("Previous Page:", newPage);
                  setPage(newPage);
                }}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Current Page */}
              <p className="text-sm text-gray-500">
              Page <span className="font-medium text-gray-900">{page}</span> of{" "}
              <span className="font-medium text-gray-900">{totalPages}</span>
            </p>

              {/* Next */}
              <button
                disabled={page >= totalPages}
                onClick={() => {
                  const newPage = page + 1;
                  console.log("Next Page:", newPage);
                  setPage(newPage);
                }}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
            </>
          ) : (
            <div className="flex items-center justify-center w-full py-12">
              <div className="bg-white border rounded-2xl shadow-sm p-10 text-center max-w-sm w-full">
                {/* Icon */}
                <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-6a2 2 0 012-2h4M7 7h10M5 21h14"
                    />
                  </svg>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900">
                  No Candidates Found
                </h3>

                {/* Subtitle */}
                <p className="text-sm text-gray-500 mt-2">
                  Try adjusting your filters or search criteria
                </p>

              </div>
            </div>
          )}
          <div className="h-16" />

        </main>
        ) : (
          /*DETAIL VIEW  */
          <main className="col-span-12 md:col-span-9">
          </main>
        )}
      </div>
    </div>
  );
}
