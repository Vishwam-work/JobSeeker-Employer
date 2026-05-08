"use client";

import { useEffect, useState } from "react";
import { Phone, FileText, Mail, CheckSquare, ChevronDown, Bookmark,Check  } from "lucide-react";
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
  const [searchCompany, setSearchCompany] = useState("");
  const experienceList = ["fresher","1-2", "3-5", "6-10", "10+"];
  const [filters, setFilters] = useState({
    hideProfiles: false,
    premiumOnly: false,
    keywords: "",
      currentCompany: [] as string[], 
    locationSearch: "",
    locations: [] as string[],
    minExperience: "",
    maxExperience: "",
    minSalary: "",
    maxSalary: "",
    designation: "",
    department: [] as string[],
    industry: [] as string[],
    noticePeriod: [] as string[],
    gender: "",
    professional_summary: "",
    minAge: "",
    maxAge: "",
    degree: [] as string[],
    college: [] as string[],
    
  });

  const clearFilters = () => {
    setFilters({
      hideProfiles: false,
      premiumOnly: false,
      keywords: "",
      currentCompany: [] as string[],
      locationSearch: "",
      locations: [],
      minExperience: "",
      maxExperience: "",
      minSalary: "",
      maxSalary: "",
      designation: "",
      department: [],
      industry: [],
      noticePeriod: [],
      gender: "",
      professional_summary: "",
      minAge: "",
      maxAge: "",
      degree: [],
      college: [],
    });
    setSearch("");
  };
const limit = 2;
const totalPages = Math.ceil(totalProfiles / limit);
  const formatSalary = (value: string | number) => {
  if (!value) return "-";
  return `₹ ${new Intl.NumberFormat("en-IN").format(Number(value))}`;
};
  const cleanSearch = search.trim().replace(/\s+/g, " ");

// fetch with pagination
useEffect(() => {
  const token = localStorage.getItem("employeer_token");
  if (!token) return;

  setLoading(true);

  fetch(
    `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/profile-all/?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("API DATA:", data);

      // ✅ FIX HERE
      if (Array.isArray(data)) {
        setCandidates(data);
        setTotalProfiles(data.length);
      } else {
        setCandidates([]);
        setTotalProfiles(0);
      }

      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
}, [page]);

  // Save profile function


useEffect(() => {
  fetchSavedProfiles();
}, []);

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

    // only profile ids store karo
    const ids = data.map((item: any) => item.profile.id);

    setSavedProfiles(ids);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchViewedProfiles();
}, []);

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
    // pehle saved record find karo
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/saved-profiles-all/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const savedData = await res.json();

    const record = savedData.find(
      (item: any) => item.profile.id === profileId
    );

    if (!record) return;

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

    // backend se latest ids
    setViewedCandidateIds(data.profile_ids || []);

    console.log("Viewed profile stored");
  } catch (err) {
    console.error(err);
  }
};

// Date formatting with future date check
const formatDate = (date?: any) => {
  if (!date) return "";

  const parsed = dayjs(date);

  // ❗ future date check
  if (!parsed.isValid() || parsed.year() > dayjs().year()) {
    return "Invalid Date";
  }

  return parsed.format("DD/MM/YYYY");
};

// Filter candidates based on search and filters
  const filteredCandidates = candidates.filter((c) => {
    // 1. Global Search (Search Bar)
    const q = search.trim().toLowerCase();
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
    // 2. Specific Filters

    // Hide Profiles
    if (filters.hideProfiles && viewedCandidateIds.includes(c.id)) return false;

    // Premium Institute
    if (filters.premiumOnly) {
      const premiumKeywords = ["iit", "iim", "nit", "bits", "xlri", "isb", "iiit"];
      const isPremium = c.educations?.some((e) => // Use c.educations if available from API (check interface, used in detail view, so assumed exists in list OR detail)
        premiumKeywords.some((pk) => e.institution?.toLowerCase().includes(pk))
      );
      // If educations is not in list view item, this might fail or be false. 
      // Assuming 'profile-all' returns full nested objects as seen in CandidatesPage detail view logic.
      if (!isPremium) return false;
    }

    // Keywords
    if (filters.keywords) {
      const k = filters.keywords.toLowerCase();
      const hasKeyword =
        c.skills?.some((s) => s.name.toLowerCase().includes(k)) ||
        c.full_name.toLowerCase().includes(k) ||
        c.city?.name.toLowerCase().includes(k) ||
        c.state?.name.toLowerCase().includes(k) ||
        c.country?.name.toLowerCase().includes(k);
      if (!hasKeyword) return false;
    }

    // Current Company
      if (filters.currentCompany.length > 0) {
        const normalize = (val: any) =>
          val ? String(val).toLowerCase() : "";

        const matchesCompany = filters.currentCompany.some((company) => {
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
    if (filters.locations.length > 0) {
      const locMatch = filters.locations.some(loc =>
        c.city?.name.toLowerCase().includes(loc.toLowerCase()) ||
        c.state?.name.toLowerCase().includes(loc.toLowerCase())
      );
      if (!locMatch) return false;
    }
    if (filters.locationSearch) {
      const locS = filters.locationSearch.toLowerCase();
      const locSearchMatch =
        c.city?.name.toLowerCase().includes(locS) ||
        c.state?.name.toLowerCase().includes(locS);
      if (!locSearchMatch) return false;
    }

    // Experience
    const expVal = parseFloat(c.experience) || 0;
    if (filters.minExperience && expVal < parseFloat(filters.minExperience)) return false;
    if (filters.maxExperience && expVal > parseFloat(filters.maxExperience)) return false;

    // Salary
    const salVal = parseFloat(c.current_salary) || 0;
    if (filters.minSalary && salVal < parseFloat(filters.minSalary)) return false;
    if (filters.maxSalary && salVal > parseFloat(filters.maxSalary)) return false;

    // Designation
    if (filters.designation) {
      const des = filters.designation.toLowerCase();
      const matchesDes = c.current_role?.toLowerCase().includes(des) ||
        c.experiences?.some(ex => ex.designation?.toLowerCase().includes(des));
      if (!matchesDes) return false;
    }

    // Department (Search in rule)
    if (filters.department.length > 0) {
      const matchesDept = filters.department.some(dept =>
        c.current_role?.toLowerCase().includes(dept.toLowerCase())
      );
      if (!matchesDept) return false;
    }

    // Industry - Placeholder logic
    if (filters.industry.length > 0) {
      // checks against current company or role for now
      const matchesInd = filters.industry.some(ind =>
        c.current_role?.toLowerCase().includes(ind.toLowerCase()) ||
        c.current_company?.toLowerCase().includes(ind.toLowerCase())
      );
      if (!matchesInd) return false;
    }

    // Notice Period
    if (filters.noticePeriod.length > 0) {
      const matchesNP = filters.noticePeriod.some(np =>
        c.notice_period?.toLowerCase() === np.toLowerCase() ||
        c.notice_period?.toLowerCase().includes(np.toLowerCase())
      );
      if (!matchesNP) return false;
    }

    // Gender
    if (filters.gender) {
      if ((c as any).gender?.toLowerCase() !== filters.gender.toLowerCase()) return false;
    }

    // Age
    if (filters.minAge || filters.maxAge) {
      const age = (c as any).age ? parseInt((c as any).age) : 0;
      if (age > 0) {
        if (filters.minAge && age < parseInt(filters.minAge)) return false;
        if (filters.maxAge && age > parseInt(filters.maxAge)) return false;
      }
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:underline"
            >
              Clear all
            </button>
          </div>

          <hr className="mb-4" />

          {/* Gender*/}
          <details open className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by skill, keyword, company, designation..."
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
          </details>

          <hr className="mb-4" />

          {/* Current Company */}
          <div className="mb-4">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Current Company
            </Label>

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
          </div>

          <hr className="mb-4" />

          {/* Location */}
          <details open className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Location <span>⌃</span>
            </summary>

            <input
              placeholder="Search location"
              value={filters.locationSearch}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  locationSearch: e.target.value,
                });
              }}
              className="w-full border rounded px-2 py-1 mb-3 text-sm"
            />

            {[
              ["Hyderabad", "1,153"],
              ["Bengaluru", "1,111"],
              ["Pune", "516"],
              ["Chennai", "234"],
              ["Delhi", "500"],
              ["Mumbai", "600"],
            ].map(([city, count]) => (
              <label
                key={city}
                className="flex justify-between items-center mb-2 cursor-pointer"
              >
                <span className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.locations.includes(city)}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        locations: prev.locations.includes(city)
                          ? prev.locations.filter((c) => c !== city)
                          : [...prev.locations, city],
                      }))
                    }
                  />
                  {city}
                </span>
                <span className="text-gray-400 text-xs">{count}</span>
              </label>
            ))}
          </details>

          <hr className="mb-4" />

          {/* Experience */}
          <details open>
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Experience (Years) <span>⌃</span>
            </summary>

            <div className="flex items-center gap-2">
              <select
                value={filters.minExperience}
                onChange={(e) =>
                  setFilters({ ...filters, minExperience: e.target.value })
                }
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="">Min</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="8">8</option>
                <option value="10">10</option>
              </select>

              <span>to</span>

              <select
                value={filters.maxExperience}
                onChange={(e) =>
                  setFilters({ ...filters, maxExperience: e.target.value })
                }
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="">Max</option>
                <option value="2">2</option>
                <option value="5">5</option>
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="15">15+</option>
              </select>
            </div>
          </details>

          <hr className="mb-4" />

          {/* Salary  */}
          <details open className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Salary (INR-Lacs) <span>⌃</span>
            </summary>

            <div className="flex items-center gap-2">
              <select
                className="w-full border rounded px-2 py-2 text-sm"
                value={filters.minSalary}
                onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
              >
                <option value="">Min</option>
                <option value="0">0</option>
                <option value="3">3</option>
                <option value="6">6</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>

              <span>to</span>

              <select
                className="w-full border rounded px-2 py-2 text-sm"
                value={filters.maxSalary}
                onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
              >
                <option value="">Max</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="25">25</option>
                <option value="50">50+</option>
              </select>
            </div>
          </details>

          <hr className="mb-4" />

          {/* Current Designation*/}
          <details className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Current designation <span>⌄</span>
            </summary>

            <div className="relative">
              <input
                placeholder="Add designation"
                className="w-full border rounded px-3 py-2 text-sm"
                value={filters.designation}
                onChange={(e) => setFilters({ ...filters, designation: e.target.value })}
              />
              <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </details>

          <hr className="mb-4" />

          {/* Department & Role */}
          <details open className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Department and Role <span>⌃</span>
            </summary>

            <div className="max-h-40 overflow-y-auto">
              {[
                "Engineering - Software & QA",
                "Consulting",
                "IT & Information Security",
                "Project & Program Management",
                "Sales",
                "Marketing",
                "HR"
              ].map((name) => (
                <label
                  key={name}
                  className="flex justify-between items-center mb-2 cursor-pointer"
                >
                  <span className="flex gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.department.includes(name)}
                      onChange={() => setFilters(prev => ({
                        ...prev,
                        department: prev.department.includes(name)
                          ? prev.department.filter(d => d !== name)
                          : [...prev.department, name]
                      }))}
                    />
                    {name}
                  </span>
                </label>
              ))}
            </div>
          </details>

          <hr className="mb-4" />

          {/*  Industry  */}
          <details open>
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Industry <span>⌃</span>
            </summary>

            <div className="max-h-40 overflow-y-auto">
              {[
                "IT Services & Consulting",
                "Software Product",
                "Management Consulting",
                "Emerging Technologies",
                "Banking",
                "Healthcare"
              ].map((name) => (
                <label
                  key={name}
                  className="flex justify-between items-center mb-2 cursor-pointer"
                >
                  <span className="flex gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.industry.includes(name)}
                      onChange={() => setFilters(prev => ({
                        ...prev,
                        industry: prev.industry.includes(name)
                          ? prev.industry.filter(i => i !== name)
                          : [...prev.industry, name]
                      }))}
                    />
                    {name}
                  </span>
                </label>
              ))}
            </div>
          </details>
          <hr className="my-4" />

          {/* Notice Period*/}
          <details open className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-2">
              Notice period <span>⌃</span>
            </summary>

            {[
              "0 - 15 days",
              "1 month",
              "2 months",
              "3 months",
              "More than 3 months",
              "Serving Notice Period",
            ].map((label) => (
              <label
                key={label}
                className="flex justify-between items-center mb-2 cursor-pointer"
              >
                <span className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.noticePeriod.includes(label)}
                    onChange={() => setFilters(prev => ({
                      ...prev,
                      noticePeriod: prev.noticePeriod.includes(label)
                        ? prev.noticePeriod.filter(n => n !== label)
                        : [...prev.noticePeriod, label]
                    }))}
                  />
                  {label}
                </span>
              </label>
            ))}
          </details>

          <hr className="mb-4" />

          {/* Age  */}
          <details open className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-3">
              Age <span>⌃</span>
            </summary>

            <div className="flex items-center gap-2">
              <input
                placeholder="Min"
                className="w-full border rounded px-3 py-2 text-sm"
                value={filters.minAge}
                onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
              />
              <span>to</span>
              <input
                placeholder="Max"
                className="w-full border rounded px-3 py-2 text-sm"
                value={filters.maxAge}
                onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
              />
            </div>
          </details>

          <hr className="mb-4" />

          {/*  Degree / Course */}
          <details className="mb-4">
            <summary className="cursor-pointer font-medium flex justify-between mb-3">
              Degree/Course <span>⌄</span>
            </summary>
            {/* Expanded details could go here, for now keeping simple UI */}
            <div className="text-sm text-gray-500 italic">Select degrees (Coming soon)</div>
          </details>

          <hr className="mb-4" />

          {/* College Name  */}
          <details className="mb-2">
            <summary className="cursor-pointer font-medium flex justify-between mb-3">
              College name <span>⌄</span>
            </summary>
            {/* Expanded details for colleges */}
            <div className="text-sm text-gray-500 italic">Select colleges (Coming soon)</div>
          </details>
        </aside>

      {/* mobile filter */}
        <div
          className={`fixed inset-0 bg-black/40 z-50 md:hidden transition-transform ${showFilters ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="absolute right-0 w-3/4 max-w-xs h-full bg-white p-4 overflow-y-auto">
            <button
              onClick={() => setShowFilters(false)}
              className="mb-4 text-gray-500"
            >
              Close ✕
            </button>

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-xs text-blue-600 hover:underline"
              >
                Clear all
              </button>
            </div>

            {/* Hide Profiles */}
            <label className="flex items-center gap-2 font-medium mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hideProfiles}
                onChange={(e) => setFilters({ ...filters, hideProfiles: e.target.checked })}
              />
              Hide Viewed Profiles
            </label>

            <hr className="mb-4" />

            {/* Premium */}
            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.premiumOnly}
                onChange={(e) => setFilters({ ...filters, premiumOnly: e.target.checked })}
              />
              Premium Institute Candidates
            </label>

            <hr className="mb-4" />

            {/* Keywords */}
            <details className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between">
                Keywords <span>⌄</span>
              </summary>
              <div className="mt-2">
                <input
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="e.g. React, Java"
                  value={filters.keywords}
                  onChange={(e) => setFilters({ ...filters, keywords: e.target.value })}
                />
              </div>
            </details>

            <hr className="mb-4" />

            {/* Current Company */}
                     <div className="mb-4">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Current Company
            </Label>

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
          </div>

            <hr className="mb-4" />

            {/* Location */}
            <details open className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between mb-2">
                Location <span>⌃</span>
              </summary>

              <input
                placeholder="Search location"
                className="w-full border rounded px-2 py-1 mb-3 text-sm"
                value={filters.locationSearch}
                onChange={(e) => setFilters({ ...filters, locationSearch: e.target.value })}
              />

              {[
                ["Hyderabad", "1,153"],
                ["Bengaluru", "1,111"],
                ["Pune", "516"],
                ["Chennai", "234"],
              ].map(([city, count]) => (
                <label
                  key={city}
                  className="flex justify-between items-center mb-2 cursor-pointer"
                >
                  <span className="flex gap-2">
                    <input
                      type="checkbox"
                      checked={filters.locations.includes(city)}
                      onChange={() =>
                        setFilters((prev) => ({
                          ...prev,
                          locations: prev.locations.includes(city)
                            ? prev.locations.filter((c) => c !== city)
                            : [...prev.locations, city],
                        }))
                      }
                    />
                    {city}
                  </span>
                  <span className="text-gray-400">{count}</span>
                </label>
              ))}
            </details>

            <hr className="mb-4" />

            {/* Experience */}
            <details open>
              <summary className="cursor-pointer font-medium flex justify-between mb-2">
                Experience (Years) <span>⌃</span>
              </summary>

              <div className="flex items-center gap-2">
                <select
                  value={filters.minExperience}
                  onChange={(e) =>
                    setFilters({ ...filters, minExperience: e.target.value })
                  }
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="">Min</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="8">8</option>
                  <option value="10">10</option>
                </select>

                <span>to</span>

                <select
                  value={filters.maxExperience}
                  onChange={(e) =>
                    setFilters({ ...filters, maxExperience: e.target.value })
                  }
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="">Max</option>
                  <option value="2">2</option>
                  <option value="5">5</option>
                  <option value="8">8</option>
                  <option value="12">12</option>
                  <option value="15">15+</option>
                </select>
              </div>
            </details>

            <hr className="mb-4" />

            {/* Salary  */}
            <details open className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between mb-2">
                Salary (INR-Lacs) <span>⌃</span>
              </summary>

              <div className="flex items-center gap-2">
                <select
                  className="w-full border rounded px-2 py-2 text-sm"
                  value={filters.minSalary}
                  onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
                >
                  <option value="">Min</option>
                  <option value="0">0</option>
                  <option value="3">3</option>
                  <option value="6">6</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>

                <span>to</span>

                <select
                  className="w-full border rounded px-2 py-2 text-sm"
                  value={filters.maxSalary}
                  onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
                >
                  <option value="">Max</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="25">25</option>
                  <option value="50">50+</option>
                </select>
              </div>
            </details>

            <hr className="mb-4" />

            {/* Current Designation*/}
            <details className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between mb-2">
                Current designation <span>⌄</span>
              </summary>

              <div className="relative">
                <input
                  placeholder="Add designation"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={filters.designation}
                  onChange={(e) => setFilters({ ...filters, designation: e.target.value })}
                />
                <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </details>

            <hr className="mb-4" />

            {/* Department & Role */}
            <details open className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between mb-2">
                Department and Role <span>⌃</span>
              </summary>

              <div className="relative mb-3">
                <input
                  placeholder="Search department/role"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {[
                  "Engineering - Software & QA",
                  "Consulting",
                  "IT & Information Security",
                  "Project & Program Management",
                  "Sales",
                  "Marketing",
                  "HR"
                ].map((name) => (
                  <label
                    key={name}
                    className="flex justify-between items-center mb-2 cursor-pointer"
                  >
                    <span className="flex gap-2">
                      <input
                        type="checkbox"
                        checked={filters.department.includes(name)}
                        onChange={() => setFilters(prev => ({
                          ...prev,
                          department: prev.department.includes(name)
                            ? prev.department.filter(d => d !== name)
                            : [...prev.department, name]
                        }))}
                      />
                      {name}
                    </span>
                  </label>
                ))}
              </div>
            </details>
            <hr className="mb-4" />

            {/*  Industry  */}
            <details open>
              <summary className="cursor-pointer font-medium flex justify-between mb-2">
                Industry <span>⌃</span>
              </summary>

              <div className="max-h-40 overflow-y-auto">
                {[
                  "IT Services & Consulting",
                  "Software Product",
                  "Management Consulting",
                  "Emerging Technologies",
                  "Banking",
                  "Healthcare"
                ].map((name) => (
                  <label
                    key={name}
                    className="flex justify-between items-center mb-2 cursor-pointer"
                  >
                    <span className="flex gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.industry.includes(name)}
                        onChange={() => setFilters(prev => ({
                          ...prev,
                          industry: prev.industry.includes(name)
                            ? prev.industry.filter(i => i !== name)
                            : [...prev.industry, name]
                        }))}
                      />
                      {name}
                    </span>
                  </label>
                ))}
              </div>
            </details>
            <hr className="my-4" />

            {/* Notice Period*/}
            <details open className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between mb-2">
                Notice period <span>⌃</span>
              </summary>

              {[
                "0 - 15 days",
                "1 month",
                "2 months",
                "3 months",
                "More than 3 months",
                "Serving Notice Period",
              ].map((label) => (
                <label
                  key={label}
                  className="flex justify-between items-center mb-2 cursor-pointer"
                >
                  <span className="flex gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.noticePeriod.includes(label)}
                      onChange={() => setFilters(prev => ({
                        ...prev,
                        noticePeriod: prev.noticePeriod.includes(label)
                          ? prev.noticePeriod.filter(n => n !== label)
                          : [...prev.noticePeriod, label]
                      }))}
                    />
                    {label}
                  </span>
                </label>
              ))}
            </details>

            <hr className="mb-4" />

            {/* Gender*/}
            <details open className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between mb-3">
                Gender <span>⌃</span>
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
              </div>
            </details>

            <hr className="mb-4" />

            {/* Age  */}
            <details open className="mb-4">
              <summary className="cursor-pointer font-medium flex justify-between mb-3">
                Age <span>⌃</span>
              </summary>

            <div className="flex items-center gap-2">
              <input
                placeholder="Min"
                className="w-full border rounded px-3 py-2 text-sm"
                value={filters.minAge}
                onChange={(e) => setFilters({...filters, minAge: e.target.value})}
              />
              <span>to</span>
              <input
                placeholder="Max"
                className="w-full border rounded px-3 py-2 text-sm"
                value={filters.maxAge}
                onChange={(e) => setFilters({...filters, maxAge: e.target.value})}
              />
            </div>
          </details>
          </div>
        </div>

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
                {/* Checkbox */}
                {/* <input type="checkbox" className="mt-2 md:mt-0" /> */}

                {/* MAIN INFO */}
                <div className="flex-1 flex flex-col gap-2">

                {/* NAME */}
                <h3
                onClick={() => {
                  window.open(
                    `/dashboard/candidate_listing/candidate_detail/${c.id}`,
                    "_blank"
                  );

                  viewProfile(c.id);
                }}
                  className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 flex items-center gap-2"
                >

                  <span className="font-semibold">
                    <Highlight text={c.full_name} />
                  </span>
                </h3>

                {/* ROLE + COMPANY */}
                {(c.current_role || c.current_company) && (
                  <p className="text-sm text-gray-700">
                    <Highlight text={c.current_role || ""} />
                    {c.current_role && c.current_company && " at "}
                    <Highlight text={c.current_company || ""} />
                  </p>
                )}

                {/* EXPERIENCE + SALARY + LOCATION */}
                <div className="text-xs md:text-sm text-gray-600 flex flex-wrap gap-2 md:gap-3">
                  <span>
                    <Highlight text={c.experience} />
                  </span>

                  <span>
                    <Highlight text={formatSalary(c.current_salary)} />
                  </span>

                  {c.expected_salary && (
                    <span>
                      Expected:{" "}
                      <Highlight text={formatSalary(c.expected_salary)} />
                    </span>
                  )}

                  {c.notice_period && (
                    <span>Notice: <Highlight text={c.notice_period} /></span>
                  )}

                  <span>
                    <Highlight text={c.country?.name || ""} />,{" "}
                    <Highlight text={c.city?.name || ""} />,{" "}
                    <Highlight text={c.state?.name || ""} />

                  </span>
                </div>

                {/* SKILLS */}
                {c.skills && c.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {c.skills.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md"
                      >
                        <Highlight text={skill.name} />
                      </span>
                    ))}
                  </div>
                )}
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

                  {c.resume && (
                    <a
                      href={`${process.env.NEXT_PUBLIC_URL}${c.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-600 flex items-center gap-1 hover:underline"
                    >
                      <FileText size={14} /> View CV
                    </a>
                  )}
                </div>
              </div>
              );
              })}
              {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
            {/* Previous */}
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;

              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`w-10 h-10 rounded-lg border text-sm font-medium transition ${
                    page === pageNumber
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* Next */}
            <button
              onClick={() =>
                setPage((prev) =>
                  prev < totalPages ? prev + 1 : prev
                )
              }
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                page === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              Next
            </button>
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
          {/* BLURRED REST */}
          {/* <div className="relative">

            <div className="space-y-4 blur-sm opacity-40 select-none pointer-events-none grayscale">
              {filteredCandidates.slice(1, 3).map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4"
                >

                        <input type="checkbox" className="mt-2 md:mt-0" />


                        <div className="flex-1 flex flex-col gap-2">
                          <h3
                            onClick={() => {
                              setSelectedCandidate(c);

                              setViewedCandidateIds((prev) =>
                                prev.includes(c.id) ? prev : [...prev, c.id]
                              );
                            }}
                            className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 flex items-center gap-2"
                          >
                            {viewedCandidateIds.includes(c.id) && (
                              <CheckSquare size={16} className="text-blue-600" />
                            )}
                            <h3 className="font-semibold text-gray-900">
                              <Highlight text={c.full_name} />
                            </h3>
                          </h3>

                          
                          <div className="text-xs md:text-sm text-gray-600 flex flex-wrap gap-2 md:gap-3">
                            <span>
                              <Highlight text={c.experience} />
                            </span>
                            <span>
                              <Highlight text={formatSalary(c.current_salary)} />
                            </span>

                            {c.expected_salary && (
                              <span>
                                Expected:
                                <Highlight text={formatSalary(c.expected_salary)} />
                              </span>
                            )}
                            <span>
                              <Highlight text={c.city?.name} />,{" "}
                              <Highlight text={c.state?.name} />
                            </span>
                          </div>
                        </div>

                        
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

                          {c.resume && (
                            <a
                              href={`${process.env.NEXT_PUBLIC_URL}${c.resume}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-gray-600 flex items-center gap-1 hover:underline"
                            >
                              <FileText size={14} />  View CV
                            </a>
                          )}
                        </div>
                </div>
              ))}
            </div>

           
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-xl p-6 text-center w-[350px]">

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Unlock Full Access
                </h3>

                <p className="text-gray-500 mb-4">
                  Subscribe to our premium plan to view unlimited candidate profiles
                  and access contact details.
                </p>
                <Link href="/pricing">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-2 rounded-full">
                    View Subscription Plans
                  </Button>
                </Link>

              </div>
            </div>

          </div> */}

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
