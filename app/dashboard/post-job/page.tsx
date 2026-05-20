"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Save} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AsyncCreatableSelect from 'react-select/async-creatable'
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import TiptapEditor from "@/components/TiptapEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import AsyncSelect from "react-select/async";
import Selectt from "react-select";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
export default function PostJobPage() {
  const [jobForm, setJobForm] = useState<JobForm>({
    title: "",
    category: "",
    jobTitle: "",
    company: "",
    location: "",
    experience: "",
    salary: "",
    salary_max: "",
    currency: "",
    currencyCode: "INR",
    job_type:  [],
    workMode: "",
    description: "",
    requirements: "",
    benefits: "",
    skills: [],
    application_deadline: "",
    vacancies: "",
    isUrgent: false,
    isRemote: false,
    questions: [],
    website_apply: "",
  });
  const [CompanyName, setCompanyName] = useState("");
  const [postedJobs, setPostedJobs] = useState<PostedJob[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [websiteEnabled, setWebsiteEnabled] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [askQuestionEnabled, setAskQuestionEnabled] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [open, setOpen] = useState(false);
   const [isAdmin, setIsAdmin] = useState(false);
  //date validation
  const [deadlineInput, setDeadlineInput] = useState("");
  const [deadlineError, setDeadlineError] = useState("");
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);
  interface JobForm {
    title: string;
    category: string;
    jobTitle: string;
    company: string;
    location: string;
    experience: string;
    salary: string;
    salary_max: string;
    currency: string;
     currencyCode?: "INR" | "USD";
    currencyLabel?: string;
    job_type: string[];
    workMode: string;
    description: string;
    requirements: string;
    benefits: string;
    skills: string[];
    application_deadline: string;
    vacancies: string;
    isUrgent: boolean;
    isRemote: boolean;
    questions: string[];
      website_apply: string;
  }

  interface PostedJob {
    id: number;
    title: string;
    job_title: string;
    company: string;
    location_id: number;
    experience: string;
    salary: string;
    salary_max: string;
    job_type: string;
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
    location?: {
      id?: number;
      name: string;
    };
    created_at?: string;
    applicants?: number;
    apply_clicks?: number;
    questions?: string[];
    website_apply?: string;
  }

  interface DecodedToken {
    user_id: number | string;
    exp?: number;
    iat?: number;
  }

  const jobTypeOptions = [
  { value: "Full Time", label: "Full Time" },
  { value: "Part Time", label: "Part Time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
];

  const fetchPostedJobs = async () => {
    try {
      const token = localStorage.getItem("employeer_token");
      if (!token) return;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/job-list-view/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        console.error("Failed to fetch jobs");
        return;
      }
      const data = await response.json();
      // console.log("Here is the Job-list-view-data:",data)
      // console.log(data.category)
      setPostedJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

useEffect(() => {
  const role = localStorage.getItem("admin_role");

  if (role === "admin") {
    setIsAdmin(true);
  }
}, []);
  const handleSubmitJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const minSalary = Number(jobForm.salary);
    const maxSalary = Number(jobForm.salary_max);

    if (minSalary && maxSalary && minSalary > maxSalary) {
      toast.error("Minimum salary cannot be greater than maximum salary");
      return;
    }
    if (websiteEnabled) {
        if (!websiteUrl.trim()) {
          toast.error("Website Checkbox Enabled but URL is empty.");
          return;
        }
      }
     if (askQuestionEnabled) {
        if (questions.length === 0) {
          toast.error("Please add at least one question.");
          return;
        }
      }
    try {
      const token = localStorage.getItem("employeer_token");
      if (!token) {
        toast.error("You must be logged in to post a job.", {
          description: "Please log in to continue.",
        });
        return;
      }
      const payload = {

        title: jobForm.title,
        job_title:(jobForm.jobTitle),
        company: jobForm.company,
        category: jobForm.category,
        location: (jobForm.location),
        currency_id: parseInt(jobForm.currency),
        experience: jobForm.experience,
        salary: jobForm.salary,
        salary_max: jobForm.salary_max,
        job_type: jobForm.job_type,
        work_mode: jobForm.workMode,
        vacancies: parseInt(jobForm.vacancies) || "", // Ensure integer
        application_deadline: jobForm.application_deadline,
        description: jobForm.description,
        requirements: jobForm.requirements,
        benefits: jobForm.benefits,
        skills: jobForm.skills,
        is_urgent: jobForm.isUrgent,
        is_remote: jobForm.isRemote,
        status: "active",
        // questions: Array.isArray(jobForm.questions) ? jobForm.questions : [],
        questions: askQuestionEnabled ? questions : [],
        website_apply: websiteEnabled && websiteUrl.trim() !== ""
          ? websiteUrl
          : "",
      };
      console.log("Payload:", payload);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/job-postings/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send JWT token
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData?.website_apply?.length > 0) {
          toast.error(errorData.website_apply[0]);
          return;
        }
        else{
          toast.error("Failed to post job", {
            description: errorData.detail || "Unknown error. Please try again.",
          });
        return;
        }
      }

      const data = await response.json();
      // console.log("Job posted successfully:", data);
      setPostedJobs((prev) => [...prev, data]);
      setDeadlineInput("");
      setDeadlineDate(null);
      setDeadlineError("");
      toast.success("Job posted successfully!");
      await fetchPostedJobs();

      // Reset form
      setJobForm({
        title: "",
        category: "",
        jobTitle: "",
        company: "",
        location: "",
        experience: "",
        salary: "",
        salary_max: "",
        currency: "",
         currencyCode: "INR",
        job_type: [],
        workMode: "",
        description: "",
        requirements: "",
        benefits: "",
        skills: [],
        application_deadline: "",
        vacancies: "",
        isUrgent: false,
        isRemote: false,
        questions: [],
        website_apply: "",
      });
      setSelectedCategory("");
      setQuestions([]);
      setAskQuestionEnabled(false); // uncheck the checkbox
      setNewSkill("");
      setWebsiteUrl("");
      setWebsiteEnabled(false);
      setNewQuestion("");
    } catch (error) {
      console.error("Error submitting job:", error);
      toast.error("An error occurred while posting the job.", {
        description: "Please try again or check your internet connection.",
      });
    }
  };
  useEffect(() => {
    const run = async () => {
      try {
        const token = localStorage.getItem("employeer_token");
        if (!token) return;

        const decoded = jwtDecode<DecodedToken>(token);
        // console.log("DECODED:", decoded);
        // console.log("Employer ID:", decoded.user_id);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/companies/${decoded.user_id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!res.ok) {
          console.error("FETCH FAILED:", res.status);
          return;
        }

        const data = await res.json();
        // console.log("Applications:", data);
        setCompanyName(data.company_name);
        // console.log(data.company_name)
      } catch (err) {
        console.error("Error:", err);
      }
    };

    run();
  }, []);
  const loadCountryOptions = async (inputValue: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/locations/search/?q=${inputValue || ""}`,
      );

      const data = await res.json();

      return data.map((country: any) => ({
        label: country.name,
        value: country.name,
      }));
    } catch (error) {
      console.error("Error fetching countries:", error);
      return [];
    }
  };
  const getSelectedLocation = () => {
    if (!jobForm.location) return null;

    return {
      label: jobForm.location,
      value: jobForm.location,
    };
  };
  const getJobCategoryOptions = async (inputValue: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/jobs_category?q=${inputValue || ""}`,
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
  const getSelectedJobCategory = () => {
    if (!jobForm.category) return null;

    return {
      label: jobForm.category,
      value: jobForm.category,
    };
  };

  const getJobTitlesOptions = async (inputValue: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/jobs_title/?q=${inputValue || ""}`,
      );

      const data = await res.json();

      return data.map((title: any) => ({
        label: title.title,
        value: title.title,
      }));
    } catch (error) {
      console.error("Error fetching job titles:", error);
      return [];
    }
  };
  const getSelectedJobTitle = () => {
    if (!jobForm.jobTitle) return null;

    return {
      label: jobForm.jobTitle,
      value: jobForm.jobTitle,
    };
  };
  const getCurrencyOptions = async (inputValue: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/currencies`,
      );

      const data = await res.json();

      return data
        .filter(
          (curr: any) =>
            curr.code.toLowerCase().includes(inputValue.toLowerCase()) ||
            curr.name.toLowerCase().includes(inputValue.toLowerCase()),
        )
        .map((curr: any) => ({
          label: curr.code,
          value: String(curr.id),
          code: curr.code,
          name: curr.name,
          symbol: curr.symbol,
        }));
    } catch (error) {
      console.error("Error fetching currencies:", error);
      return [];
    }
  };

  
const formatNumber = (
  value: string | number,
  currency: "INR" | "USD" = "INR"
): string => {
  if (!value) return "";

  return new Intl.NumberFormat(
    currency === "INR" ? "en-IN" : "en-US"
  ).format(Number(value));
};
  const parseNumber = (value: string): string => {
    return value.replace(/,/g, "");
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !jobForm.skills.includes(newSkill.trim())) {
      setJobForm((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setJobForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim() && !jobForm.questions.includes(newQuestion.trim())) {
      const updated = [...jobForm.questions, newQuestion.trim()];
      setJobForm((prev) => ({ ...prev, questions: updated }));
      setQuestions(updated); // ✅ keep them in sync
      setNewQuestion("");
    }
  };

  const handleRemoveQuestion = (indexToRemove: number) => {
    const updated = jobForm.questions.filter(
      (_, index) => index !== indexToRemove,
    );
    setJobForm((prev) => ({ ...prev, questions: updated }));
    setQuestions(updated);
  };

const formatDeadline = (value: string) => {
   let input = value.replace(/\D/g, "");
    if (input.length > 8) input = input.slice(0, 8);
    let day = input.slice(0, 2);
    let month = input.slice(2, 4);
    let year = input.slice(4, 8);
    let error = "";

    // DAY FIX
    if (day.length === 1) {
      if (!["0", "1", "2", "3"].includes(day)) {
        day = "0" + day;
      }
    }

    if (day.length === 2) {
      let d = parseInt(day);
      if (d > 31) day = "31";
      if (d === 0) day = "01";
    }

    // MONTH FIX
    if (month.length === 1) {
      if (month !== "0" && month !== "1") {
        month = "0" + month;
      }
    }

    if (month.length === 2) {
      let m = parseInt(month);
      if (m > 12) month = "12";
      if (m === 0) month = "01";
    }

    const currentYear = dayjs().year();

    if (year.length === 4) {
      let y = parseInt(year);

      if (y < 1900) {
        error = "Year must be after 1900";
      }
    }

    // ✅ FULL DATE VALIDATION
    if (day.length === 2 && month.length === 2 && year.length === 4) {
      const d = parseInt(day);
      const m = parseInt(month);
      const y = parseInt(year);

      // Leap year check
      const isLeapYear =
        (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

      const daysInMonth = [
        31,
        isLeapYear ? 29 : 28, // Feb
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
      ];
      if (m >= 1 && m <= 12) {
        if (d > daysInMonth[m - 1]) {
          error = `Invalid day for month`;
        }
      }
      // Extra safety with dayjs
      const parsedCheck = dayjs(
        `${day}/${month}/${year}`,
        "DD/MM/YYYY",
        true
      );

      if (!parsedCheck.isValid()) {
        error = "Invalid date";
      }

      if (parsedCheck.isBefore(dayjs())) {
        error = "Past date not allowed";
      }
    }

    // ✅ FORMAT OUTPUT
    let formatted = day;
    if (month) formatted += "/" + month;
    if (year) formatted += "/" + year;

    const parsed = dayjs(formatted, "DD/MM/YYYY", true);
    return { formatted, parsed, error };
};
const calendarRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Post a New Job</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitJob} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Job Title *
              </Label>
              <Input
                id="title"
                value={jobForm.title}
                onChange={(e) =>
                  setJobForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="e.g., Senior Software Developer"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Job Category *</Label>
              <AsyncCreatableSelect
                required
                cacheOptions
                defaultOptions
                placeholder="e.g., Accounting"
                className="mt-1"
                isClearable
                loadOptions={getJobCategoryOptions}
                value={getSelectedJobCategory()}
                onChange={(selectedOption: any) => {
                  setSelectedCategory(String(selectedOption?.value || ""));
                  setJobForm((prev) => ({
                    ...prev,
                    category: String(selectedOption?.value || ""),
                    jobTitle: "",
                  }));
                }}
                menuPortalTarget={
                  typeof window !== "undefined" ? document.body : null
                }
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">
                Specific Job Title *
              </Label>

              <AsyncCreatableSelect
                required
                cacheOptions
                defaultOptions
                loadOptions={getJobTitlesOptions}
                value={getSelectedJobTitle()}
                placeholder="Search job title..."
                className="mt-1"
                onChange={(selected: any) => {
                  setJobForm((prev) => ({
                    ...prev,
                    jobTitle: selected?.value?.toString() || "",
                  }));
                }}
                isClearable
                menuPortalTarget={
                  typeof window !== "undefined" ? document.body : null
                }
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </div>

            <div>
              <Label htmlFor="company" className="text-sm font-medium">
                Company Name *
              </Label>
              <Input
                id="company"
                
                onChange={(e) =>
                  setJobForm((prev) => ({
                    ...prev,
                    company: e.target.value,
                  }))
                }
                placeholder="Enter company name"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Location *</Label>

              <AsyncSelect
                required
                cacheOptions
                defaultOptions
                loadOptions={loadCountryOptions}
                value={getSelectedLocation()}
                onChange={(selected: any) => {
                  setJobForm((prev) => ({
                    ...prev,
                    location: selected?.value || "",
                  }));
                }}
                isClearable
                placeholder="Search Location..."
              />
            </div>

            <div>
              <Label className="text-sm font-medium">
                Experience Required *
              </Label>
              <Select
                required
                value={jobForm.experience}
                onValueChange={(value) =>
                  setJobForm((prev) => ({ ...prev, experience: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                 <SelectContent>
                  <SelectItem value="fresher">Fresher</SelectItem>
                  <SelectItem value="1-2">1-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="salary" className="text-sm font-medium">
                Salary Range (Annual)
              </Label>
              <div className="flex gap-2 mt-1">
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  placeholder="Currency"
                  loadOptions={getCurrencyOptions}
                  value={
                    jobForm.currency
                      ? {
                          value: jobForm.currency,
                          label: jobForm.currencyLabel,
                        }
                      : null
                  }
                  onChange={(selectedOption: any) => {
                    setJobForm((prev) => ({
                      ...prev,
                      currency: selectedOption?.value || "",
                      currencyCode: selectedOption?.code || "INR",
                      currencyLabel: selectedOption?.label || "",
                    }));
                  }}
                  // isClearable
                  menuPortalTarget={
                    typeof window !== "undefined" ? document.body : null
                  }
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
                <Input
                  type="text"
                  id="salary"
                  value={formatNumber(jobForm.salary, jobForm.currencyCode)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    const allowedKeys = [
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                    ];

                    if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const rawValue = parseNumber(e.target.value);

                    if (!isNaN(Number(rawValue))) {
                      setJobForm((prev) => ({
                        ...prev,
                        salary: rawValue,
                      }));
                    }
                  }}
                  placeholder="Minimum Annual Salary"
                  className="flex-1"
                />-
                <Input
                  type="text"
                  id="salary_max"
                  value={formatNumber(jobForm.salary_max, jobForm.currencyCode)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    const allowedKeys = [
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                    ];

                    if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const rawValue = parseNumber(e.target.value);

                    if (!isNaN(Number(rawValue))) {
                      setJobForm((prev) => ({
                        ...prev,
                        salary_max: rawValue,
                      }));
                    }
                  }}
                  placeholder="Maximum Annual Salary"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Job Type *</Label>
              <Selectt
                required
                isMulti
                options={jobTypeOptions}
                value={jobTypeOptions.filter(option =>
                  jobForm.job_type.includes(option.value)
                )}
                onChange={(selectedOptions) =>
                  setJobForm((prev) => ({
                    ...prev,
                    job_type: selectedOptions.map((opt) => opt.value),
                  }))
                }
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Work Mode</Label>
              <Select
                value={jobForm.workMode}
                onValueChange={(value) =>
                  setJobForm((prev) => ({ ...prev, workMode: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select work mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Work from Office</SelectItem>
                  <SelectItem value="remote">Work from Home</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

           <div>
              <Label htmlFor="vacancies" className="text-sm font-medium">
                Number of Vacancies *
              </Label>

              <Input
                required
                id="vacancies"
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={jobForm.vacancies}
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^\d{0,5}$/.test(value)) {
                    setJobForm((prev) => ({
                      ...prev,
                      vacancies: value,
                    }));
                  }
                }}
                onKeyDown={(e) => {
                  const allowedKeys = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "Tab",
                  ];

                  if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="e.g., 5"
                className="mt-1"
              />
            </div>


            <div className="w-full">
              <label className="text-sm font-medium">Application Deadline *</label>

              <div className="relative mt-1">
                <input
                  required
                  type="text"
                  placeholder="DD/MM/YYYY"
                  maxLength={10}
                  value={deadlineInput}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (!raw) {
                      setDeadlineInput("");
                      setDeadlineError("");
                      setDeadlineDate(null);

                      setJobForm((prev) => ({
                        ...prev,
                        application_deadline: "",
                      }));
                      return;
                    }

                    const { formatted, parsed, error } = formatDeadline(raw);
                    setDeadlineInput(formatted);

                    if (error) {
                      setDeadlineError(error);
                      setDeadlineDate(null);
                      return;
                    }

                    if (formatted.length < 10) {
                      setDeadlineError("");
                      setDeadlineDate(null);
                      setJobForm((prev) => ({
                        ...prev,
                        application_deadline: "",
                      }));
                      return;
                    }

                    if (!parsed.isValid()) {
                      setDeadlineError("Invalid date");
                      setDeadlineDate(null);
                      return;
                    }

                    if (parsed.isBefore(dayjs(), "day")) {
                      setDeadlineError("Past date not allowed");
                      setDeadlineDate(null);
                      return;
                    }

                    setDeadlineError("");
                    setDeadlineDate(parsed.toDate());

                    setJobForm((prev) => ({
                      ...prev,
                      application_deadline: parsed.format("DD/MM/YYYY"),
                    }));
                  }}
                  className={`w-full h-[44px] px-3 pr-10 text-sm border rounded-md outline-none
                    ${
                      deadlineError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }
                  `}
                />

                {/* CALENDAR */}
                <div
  ref={calendarRef}
  className="absolute right-2 top-1/2"
>
  {/* ICON */}
  <button
    type="button"
    onClick={() => setOpen((prev) => !prev)}
  >
    <Calendar size={18} />
  </button>

  {/* Calendar (ON/OFF) */}
  {open && (
    <div className="absolute right-0 mt-2 z-50 bg-white shadow-lg rounded">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={
            jobForm.application_deadline
              ? dayjs(jobForm.application_deadline, "DD/MM/YYYY")
              : null
          }

          minDate={dayjs()} // ✅ only future dates allowed

          onChange={(newValue) => {
            if (!newValue) return;

            const formatted = newValue.format("DD/MM/YYYY");

            setDeadlineDate(newValue.toDate()); // optional (if using state)
            setDeadlineInput(formatted);        // optional (input sync)

            setJobForm((prev) => ({
              ...prev,
              application_deadline: formatted,
            }));

            setOpen(false); // auto close
          }}
        />
      </LocalizationProvider>
    </div>
  )}
</div>
              </div>

              {deadlineError && (
                <p className="text-red-500 text-xs mt-1">{deadlineError}</p>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Job Description *
            </Label>
            <div className="mt-1">
              <TiptapEditor
                value={jobForm.description}
                onChange={(value) =>
                  setJobForm((prev) => ({
                    ...prev,
                    description: value,
                  }))
                }
              />
            </div>
          </div>

          {/* Requirements */}
          <div>
            <Label htmlFor="requirements" className="text-sm font-medium">
              Requirements & Qualifications
            </Label>
            {/* <Textarea
              id="requirements"
              value={jobForm.requirements}
              onChange={(e) =>
                setJobForm((prev) => ({
                  ...prev,
                  requirements: e.target.value,
                }))
              }
              rows={4}
              placeholder="List the required skills, qualifications, and experience..."
              className="mt-1"
            /> */}
            <TiptapEditor
              value={jobForm.requirements || ""}
              onChange={(value) =>
                setJobForm((prev) => ({ ...prev, requirements: value }))
              }
            />
          </div>

          {/* Skills */}
          <div>
            <Label className="text-sm font-medium">Required Skills</Label>
            <div className="mt-1 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddSkill}
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {jobForm.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {skill}
                    <button
                      type="button"
                      className="ml-2 text-blue-600 hover:text-blue-800"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <Label htmlFor="benefits" className="text-sm font-medium">
              Benefits & Perks
            </Label>
            {/* <Textarea
              id="benefits"
              value={jobForm.benefits}
              onChange={(e) =>
                setJobForm((prev) => ({
                  ...prev,
                  benefits: e.target.value,
                }))
              }
              rows={3}
              placeholder="List the benefits, perks, and company culture highlights..."
              className="mt-1"
            /> */}
             <TiptapEditor
                value={jobForm.benefits || ""}
                onChange={(value) =>
                  setJobForm((prev) => ({ ...prev, benefits: value }))
                }
              />
          </div>
            {isAdmin && (
              <>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="add-website"
                    checked={websiteEnabled}
                    onCheckedChange={(checked) => {
                      setWebsiteEnabled(!!checked);

                      // Reset value when unchecked
                      if (!checked) setWebsiteUrl("");
                    }}
                  />
                  <Label htmlFor="add-website" className="text-sm">
                    Website URL
                  </Label>
                </div>

                {websiteEnabled && (
                  <div className="mt-4 w-full sm:w-3/5 lg:w-2/5">
                    <Input
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="Enter website URL..."
                    />
                  </div>
                )}
              </>
            )}

          {/* Checkboxes */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="urgent"
                checked={jobForm.isUrgent}
                onCheckedChange={(checked) =>
                  setJobForm((prev) => ({
                    ...prev,
                    isUrgent: checked === true,
                  }))
                }
              />
              <Label htmlFor="urgent" className="text-sm">
                Mark as urgent hiring
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remote"
                checked={jobForm.isRemote}
                onCheckedChange={(checked) =>
                  setJobForm((prev) => ({
                    ...prev,
                    isRemote: checked === true,
                  }))
                }
              />
              <Label htmlFor="remote" className="text-sm">
                Remote work available
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="ask-question"
                checked={askQuestionEnabled}
                onCheckedChange={(checked) => setAskQuestionEnabled(!!checked)}
              />
              <Label htmlFor="ask-question" className="text-sm">
                Ask Question
              </Label>
            </div>
          </div>
          {askQuestionEnabled && (
            <div className="mt-4 space-y-2 w-full sm:w-3/5 lg:w-2/5">
              <div className="flex gap-2">
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Enter a question..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddQuestion}
                  variant="outline"
                >
                  Add Question
                </Button>
              </div>

              {/* Show added questions */}
              <div className="flex flex-wrap gap-2">
                {questions.map((q, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                  >
                    {q}
                    <button
                      type="button"
                      className="ml-2 text-red-600 hover:text-red-800"
                      onClick={() => handleRemoveQuestion(index)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Post Job
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
