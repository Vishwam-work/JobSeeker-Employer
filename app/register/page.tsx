"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Users,
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
  Search,
  CheckCircle,
  Star,
  TrendingUp,
  Briefcase,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { result } from "lodash";



const OTP_EXPIRY_SECONDS = 60;


export default function EmployerRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [industrySearch, setIndustrySearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateSearch, setStateSearch] = useState("");
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [IsOtpVerified, setIsOtpVerified] = useState(false);
  // const isRegDisabled = currentStep === 2 && !IsOtpVerified;
  const router = useRouter();
  const [email, setemail] = useState("");
  const [showText, setShowText] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false);
  // Error states
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [otpError, setOtpError] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    // Company Information
    companyName: "",
    companyType: "",
    industry: "",
    companySize: "",
    website: "",
    description: "",

    // Contact Information
    contactPersonName: "",
    designation: "",
    email: email,
    phone: "",
    phoneCode: "",

    // Address Information
    address: "",
    countryId: "",
    stateId: "",
    cityId: "",
    pincode: "",

    // Account Information
    password: "",
    confirmPassword: "",

    // Agreements
    agreeTerms: false,
    agreeMarketing: false,
  });
  const companyTypes = [
    "Private Limited Company",
    "Public Limited Company",
    "Partnership",
    "Sole Proprietorship",
    "LLP",
    "Government",
    "NGO",
    "Startup",
  ];

  const industries = [
    "Information Technology",
    "Banking & Financial Services",
    "Healthcare",
    "Manufacturing",
    "Retail",
    "Education",
    "Real Estate",
    "Automotive",
    "Telecommunications",
    "Media & Entertainment",
    "Consulting",
    "Other",
  ];

  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees",
  ];

  const benefits = [
    {
      icon: Users,
      title: "Access to 10 Crore+ candidates",
      description: "Reach the largest talent pool in India",
    },
    {
      icon: TrendingUp,
      title: "AI-powered matching",
      description: "Get relevant candidate matches instantly",
    },
    {
      icon: Briefcase,
      title: "End-to-end recruitment",
      description: "From job posting to candidate onboarding",
    },
    {
      icon: Star,
      title: "Trusted platform",
      description: "Join 1 Lakh+ companies hiring successfully",
    },
  ];

  // const filteredIndustries = industries.filter((item) =>
  //   item.toLowerCase().includes(industrySearch.toLowerCase())
  // );

  // const filteredCountries = countries.filter((c) =>
  //   c.name.toLowerCase().includes(countrySearch.toLowerCase())
  // );

  interface FormData {
    // Company Information
    companyName: string;
    companyType: string;
    industry: string;
    companySize: string;
    website: string;
    description: string;

    // Contact Information
    contactPersonName: string;
    designation: string;
    email: string;
    phone: string;
    phoneCode: string;

    // Address Information
    address: string;
    countryId: string;
    stateId: string;
    cityId: string;
    pincode: string;

    // Account Information
    password: string;
    confirmPassword: string;

    // Agreements
    agreeTerms: boolean;
    agreeMarketing: boolean;
  }

  interface Country {
    id: string; // or number, depending on your API
    name: string;
    phonecode: string;
  }
  interface State {
    id: string; // or number, depending on your API
    name: string;
  }
  interface City {
    id: string; // or number, depending on your API
    name: string;
  }
  type FormErrors = {
  companyName?: string;
  companyType?: string;
  industry?: string;
  companySize?: string;
  description?: string;

  contactPersonName?: string;
  designation?: string;
  email?: string;
  phone?: string;
  address?: string;
  countryId?: string;
  stateId?: string;
  cityId?: string;
  pincode?: string;

  password?: string;
  confirmPassword?: string;
  agreeTerms?: string;
};
const validateStep = () => {
  let newErrors: any = {};

  if (currentStep === 1) {
   const companyName = formData.companyName?.trim();

    if (!companyName) {
      newErrors.companyName = "Company name is required";
    } else if (companyName.length < 3) {
      newErrors.companyName = "Minimum 3 characters required";
    }

    if (!formData.companyType)
      newErrors.companyType = "Select company type";

    if (!formData.industry)
      newErrors.industry = "Select industry";

    if (!formData.companySize)
      newErrors.companySize = "Select company size";

    if (!formData.description?.trim())
      newErrors.description = "Description is required";
  }

  if (currentStep === 2) {
   const name = formData.contactPersonName?.trim();

if (!name) {
  newErrors.contactPersonName = "Contact person name is required";
} else if (name.length < 3) {
  newErrors.contactPersonName = "Minimum 3 characters required";
}
    if (!formData.designation?.trim())
      newErrors.designation = "Designation is required";

    if (!email?.trim())
      newErrors.email = "Email is required";

    if (!IsOtpVerified)
      newErrors.email = "Please verify OTP";

    if (!formData.phone || formData.phone.length !== 10)
      newErrors.phone = "Enter valid 10 digit phone";

    if (!formData.address?.trim())
      newErrors.address = "Address is required";

    if (!formData.countryId)
      newErrors.countryId = "Select country";

    if (!formData.stateId)
      newErrors.stateId = "Select state";

    if (!formData.cityId)
      newErrors.cityId = "Select city";

      if (!formData.pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (formData.pincode.length !== 6) {
      newErrors.pincode = "Enter valid 6 digit pincode";
    }
      }

  if (currentStep === 3) {
    if (!formData.password) {
          newErrors.password = "password is required";
        } else if (formData.password.length !== 8) {
          newErrors.password = "Password must be 8 characters long";
        }
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm your password";

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    )
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.agreeTerms)
      newErrors.agreeTerms = "You must accept terms";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
const validateEmail = (value: string) => {
  if (!value) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Enter valid email";
  }
  return "";
};


// OTP Timer
useEffect(() => {
  let interval: NodeJS.Timeout;

  if (isOtpOpen && timer > 0) {
    interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
  }

  if (timer === 0) {
    setCanResend(true);
  }

  return () => clearInterval(interval);
}, [isOtpOpen, timer]);
const handleResendOTP = async () => {
   console.log("Resend OTP clicked");
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_APP}/send_otp/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    console.log("API Status:", res.status);

    const data = await res.json();
    console.log("API Response:", data);

    if (!res.ok) {
      toast.error(data.error || "Failed to resend OTP");
      return;
    }

    toast.success("OTP Resent Successfully");
    setOtp("");
    setOtpError("");
    setTimer(60);
    setCanResend(false);

  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};

  // Fetch the Data from the MASTER DB
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL_MASTER}/countries/`)
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
      })
      .catch((err) => console.error("Country fetch error"));
  }, []);

  useEffect(() => {
    if (formData.countryId) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/states/?country_id=${formData.countryId}`
      )
        .then((res) => res.json())
        .then(setStates)
        .catch((err) => console.error("State fetch error"));
    }
  }, [formData.countryId]);

  useEffect(() => {
    if (formData.stateId) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/cities/?state=${formData.stateId}`
      )
        .then((res) => res.json())
        .then(setCities)
        .catch((err) => console.error("City fetch error"));
    }
  }, [formData.stateId]);

  const handleInputChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // console.log("Form Data:", formData);
  };

  const handleEmailChange = (value:string) => {
    setemail(value)
  };

 const handleNext = () => {
  const isValid = validateStep(); // 🔥 validation call

  if (!isValid) {
    setShowErrors(true); // errors show karo
    return;
  }

  setShowErrors(false);
  setCurrentStep((prev) => Math.min(prev + 1, 3));
};

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
    if(currentStep!=1){
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      toast.warning("Password must be at least 8 characters long");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }
    if (!formData.agreeTerms) {
      toast.warning("Please agree to the terms and conditions");
      return;
    }

    const payload = {
      company_name: formData.companyName,
      company_type: formData.companyType,
      industry: formData.industry,
      company_size: formData.companySize,
      website: formData.website,
      description: formData.description,
      contact_person_name: formData.contactPersonName,
      designation: formData.designation,
      phone: formData.phone,
      phone_code: formData.phoneCode,
      address: formData.address,
      country: formData.countryId,
      state: formData.stateId,
      city: formData.cityId,
      pincode: formData.pincode,
      agree_terms: formData.agreeTerms,
      agree_marketing: formData.agreeMarketing,
      password: formData.password,
      confirm_password: formData.confirmPassword,
      email: email,
      is_verified: true,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/employeer_register/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      const result = await response.json();
      // if(!result.ok()){
      //   toast.error(result.error);
      // }  
      toast.success("Registration successful ");

        setTimeout(() => {
          router.push("/employer/login");
        }, 1500);

    } catch (error) {
      console.error("Registration error:", error);
        toast.error("Registration failed");
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= step
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-600"
              }`}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${currentStep > step ? "bg-purple-600" : "bg-gray-200"
                }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const handlesendotp = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_APP}/send_otp/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to send OTP");
        return;
      }

      setIsOtpOpen(true);
      toast.success("OTP Sent Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/verify-otp/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Invalid OTP");
        return;
      }

      setIsOtpVerified(true);
      setIsOtpOpen(false);
      toast.success("OTP Verified Successfully!");
    } catch (err) {
      console.error("OTP Verification error");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                jobseeker
              </span>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                For Employers
              </span>
            </Link>
            <div className="text-sm text-gray-600 text-center sm:text-right">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Benefits */}
          <div className="order-2 lg:order-1">
            <div className="text-center lg:text-left mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Start hiring the best talent today
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Join 1 Lakh+ companies finding their perfect candidates on
                JobSeeker
              </p>
            </div>

            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-white rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">10Cr+</div>
                <div className="text-sm text-gray-600">Candidates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">1L+</div>
                <div className="text-sm text-gray-600">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">50L+</div>
                <div className="text-sm text-gray-600">Jobs Posted</div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="order-1 lg:order-2">
            <Card className="bg-white shadow-2xl border-0">
              <CardContent className="p-8 md:p-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Register Your Company
                  </h2>
                  <p className="text-gray-600">
                    Create your employer account to start hiring
                  </p>
                </div>

                {renderStepIndicator()}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Company Information */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Company Information
                      </h3>

                      <div>
                        <Label
                          htmlFor="companyName"
                          className="text-sm font-medium text-gray-700"
                        >
                          Company Name *
                        </Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) =>
                            handleInputChange("companyName", e.target.value)
                          }
                          placeholder="Enter your company name"
                          className="mt-1 h-12"
                          required
                        />
                          {showErrors && errors.companyName && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.companyName}
                            </p>
                          )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Company Type *
                          </Label>
                          <Select
                            value={formData.companyType}
                            onValueChange={(value) =>
                              handleInputChange("companyType", value)

                            }
                          >

                            <SelectTrigger className="mt-1 h-12">
                              <SelectValue placeholder="Select company type" />
                            </SelectTrigger>
                            <SelectContent>
                              {companyTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {showErrors && errors.companyType  && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.companyType }
                          </p>
                        )}
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Industry *
                          </Label>
                          <Select
                            value={formData.industry}
                            onValueChange={(value) =>
                              handleInputChange("industry", value)
                            }
                          >
                            <SelectTrigger className="mt-1 h-12">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {showErrors && errors.industry   && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.industry  }
                          </p>
                        )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Company Size *
                          </Label>
                          <Select
                            value={formData.companySize}
                            onValueChange={(value) =>
                              handleInputChange("companySize", value)
                            }
                          >
                            <SelectTrigger className="mt-1 h-12">
                              <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                            <SelectContent>
                              {companySizes.map((size) => (
                                <SelectItem key={size} value={size}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {showErrors && errors.companySize   && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.companySize  }
                          </p>
                        )}
                        </div>

                        <div>
                          <Label
                            htmlFor="website"
                            className="text-sm font-medium text-gray-700"
                          >
                            Website
                          </Label>

                          <Input
                            id="website"
                            value={formData.website || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              handleInputChange("website", value);
                            }}
                            placeholder="https://www.company.com"
                            className="mt-1 h-12"
                          />
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="description"
                          className="text-sm font-medium text-gray-700"
                        >
                          Company Description <span className="text-red-500">*</span>
                        </Label>

                        <Textarea
                          id="description"
                          value={formData.description || ""}
                          onChange={(e) => {
                            const value = e.target.value;

                            handleInputChange("description", value);

                            if (!value.trim()) {
                              setDescriptionError("Company description is required");
                            } else {
                              setDescriptionError("");
                            }
                          }}
                          rows={4}
                          placeholder="Tell us about your company..."
                          className="mt-1"
                          required
                        />
                         {showErrors && errors.description   && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.description  }
                          </p>
                         )}
                        {descriptionError && (
                          <p className="text-red-500 text-xs mt-1">{descriptionError}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Contact & Address Information */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Contact Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="contactPersonName"
                            className="text-sm font-medium text-gray-700"
                          >
                            Contact Person Name *
                          </Label>
                          <Input
                            id="contactPersonName"
                            value={formData.contactPersonName}
                            onChange={(e) =>
                              handleInputChange(
                                "contactPersonName",
                                e.target.value
                              )
                            }
                            placeholder="Enter contact person name"
                            className="mt-1 h-12"
                            required
                          />
                            {showErrors && errors.contactPersonName  && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.contactPersonName }
                            </p>
                          )}
                        </div>

                        <div>
                          <Label
                            htmlFor="designation"
                            className="text-sm font-medium text-gray-700"
                          >
                            Designation *
                          </Label>
                          <Input
                            id="designation"
                            value={formData.designation}
                            onChange={(e) =>
                              handleInputChange("designation", e.target.value)
                            }
                            placeholder="e.g., HR Manager"
                            className="mt-1 h-12"
                            required
                          />
                            {showErrors && errors.designation   && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.designation  }
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Email *</Label>

                          <div className="relative mt-1">
                            <Input
                              type="email"
                              disabled={IsOtpVerified}
                              value={email}
                              placeholder="Enter your email"
                              className={`h-12 pr-10 ${
                                errors.email
                                  ? "border-red-500 focus:ring-red-500"
                                  : IsOtpVerified
                                  ? "border-green-500 focus:ring-green-500"
                                  : ""
                              }`}
                              onChange={(e) => {
                                const value = e.target.value;

                                setemail(value);
                                setIsOtpVerified(false);
                                setIsOtpOpen(false);
                                setErrors((prev) => ({
                                  ...prev,
                                  email: validateEmail(value),
                                }));

                              }}
                            />

                            {/* Error */}
                            {errors.email && (
                              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                            )}

                            {/* Helper text */}
                            {!errors.email && !email && (
                              <p className="text-xs text-gray-500 mt-1">
                                Verify your email before continuing
                              </p>
                            )}

                            {!errors.email && email && (
                              <p className="text-xs text-gray-500 mt-1">
                                We'll send updates to this email
                              </p>
                            )}

                            {/* Verified icon */}
                            {IsOtpVerified && (
                              <CheckCircle className="absolute right-3 top-6 -translate-y-1/2 text-green-600 w-5 h-5" />
                            )}
                          </div>

                          {/* Verify Button */}
                          {!IsOtpVerified && !isOtpOpen && (
                            <Button
                              type="button"
                              className="mt-2"
                              disabled={!email || !!validateEmail(email)}
                              onClick={handlesendotp}
                            >
                              Verify Email OTP
                            </Button>
                          )}

                          {/* OTP Section */}
                          {isOtpOpen && !IsOtpVerified && (
                            <div className="mt-3">
                              <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={(value) => {
                                  setOtp(value);
                                  setOtpError("");
                                }}
                              >
                                <InputOTPGroup className="gap-3">
                                  {[0, 1, 2, 3, 4, 5].map((i) => (
                                    <InputOTPSlot
                                      key={i}
                                      index={i}
                                      className="w-10 h-10 text-lg border"
                                    />
                                  ))}
                                </InputOTPGroup>
                              </InputOTP>
                              <div className="flex items-center gap-2 mt-2 text-sm">
                                {!canResend ? (
                                  <span className="text-gray-500">
                                    Expired OTP in <span className="font-medium">{timer}s</span>
                                  </span>
                                ) : (
                                  <>
                                    <span className="text-gray-500">Didn't receive OTP?</span>
                                    <button
                                      type="button"
                                      onClick={handleResendOTP}
                                      className="text-blue-600 font-medium hover:underline"
                                    >
                                      Resend
                                    </button>
                                  </>
                                )}
                              </div>
                              {otpError && (
                                <p className="text-sm text-red-500 mt-1">{otpError}</p>
                              )}

                              <Button
                                type="button"
                                className="mt-3 bg-blue-600 text-white w-full"
                                onClick={handleVerifyOTP}
                              >
                                Verify OTP
                              </Button>
                            </div>
                          )}
                        </div>
                        <div>
                          <div>
                            <Label
                              htmlFor="phone"
                              className="text-sm font-medium text-gray-700"
                            >
                              Phone Number *
                            </Label>

                            <div className="flex gap-2 mt-1">

                              <input
                                className="w-20 h-10 lg:h-11 border rounded px-3 bg-gray-100 text-gray-700"
                                value={
                                  formData.phoneCode
                                    ? `+${formData.phoneCode}`
                                    : ""
                                }
                                readOnly

                              />

                              <Input
                                id="phone"
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={formData.phone}
                                onChange={(e) => {
                                  const value = e.target.value;

                                  if (!/^\d*$/.test(value)) return;

                                  if (value.length > 10) return;

                                  handleInputChange("phone", value);
                                  if (value.length > 0 && value.length < 10) {
                                    setPhoneError("Phone number must be 10 digits");
                                  } else {
                                    setPhoneError("");
                                  }
                                }}
                                className="flex-1 h-10 lg:h-11"
                                placeholder="Enter phone number"
                                maxLength={10}
                                required
                              />

                            </div>
                            {phoneError ? (
                                <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                              ) : showErrors && errors.phone ? (
                                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                              ) : showErrors && !formData.countryId ? (
                                <p className="text-red-500 text-sm mt-1">
                                  Please select country
                                </p>
                              ) : (
                                <p className="text-xs text-gray-500 mt-1">
                                </p>
                              )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="address"
                          className="text-sm font-medium text-gray-700"
                        >
                          Company Address *
                        </Label>
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          rows={3}
                          placeholder="Enter complete address"
                          className="mt-1"
                          required
                        />
                          {showErrors && errors.address   && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.address  }
                            </p>
                          )}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {/* Country Dropdown */}
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Country *
                          </Label>

                          <Popover
                            open={countryOpen}
                            onOpenChange={setCountryOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full mt-1 h-10 lg:h-11 border rounded px-3 flex items-center justify-between"
                              >
                                <span>
                                  {formData.countryId
                                    ? countries.find(
                                      (c) => c.id == formData.countryId
                                    )?.name
                                    : "Select country"}
                                </span>
                                <ChevronDown className="h-4 w-4 opacity-60" />
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent
                              align="start"
                              className="w-full p-0"
                            >
                              <Command>
                                <CommandInput
                                  placeholder="Search country..."
                                  value={countrySearch}
                                  onValueChange={setCountrySearch}
                                />

                                <CommandList className="max-h-60 overflow-y-auto">
                                  <CommandEmpty>No country found.</CommandEmpty>

                                  <CommandGroup>
                                    {countries
                                      .filter(
                                        (c) =>
                                          c.name
                                            .toLowerCase()
                                            .startsWith(
                                              countrySearch.toLowerCase()
                                            )
                                      )
                                      .map((country) => (
                                        <CommandItem
                                          key={country.id}
                                          value={country.name}
                                          onSelect={() => {
                                            handleInputChange(
                                              "countryId",
                                              country.id
                                            );
                                            handleInputChange(
                                              "phoneCode",
                                              country.phonecode
                                            );
                                            setCountryOpen(false);
                                          }}
                                        >
                                          {country.name}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                            {showErrors && errors.countryId   && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.countryId  }
                            </p>
                          )}
                        </div>

                        {/* State Dropdown */}
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            State *
                          </Label>

                          <Popover open={stateOpen} onOpenChange={setStateOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full mt-1 h-10 lg:h-11 border rounded px-3 flex items-center justify-between"
                              >
                                <span>
                                  {formData.stateId
                                    ? states.find((s) => s.id == formData.stateId)
                                      ?.name
                                    : "Select state"}
                                </span>
                                <ChevronDown className="h-4 w-4 opacity-60" />
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent
                              align="start"
                              className="w-full p-0"
                            >
                              <Command>
                                <CommandInput
                                  placeholder="Search state..."
                                  value={stateSearch}
                                  onValueChange={setStateSearch}
                                />

                                <CommandList className="max-h-60 overflow-y-auto">
                                  <CommandEmpty>No state found.</CommandEmpty>

                                  <CommandGroup>
                                    {states
                                      .filter((state) =>
                                        state.name
                                          .toLowerCase()
                                          .startsWith(stateSearch.toLowerCase())
                                      )
                                      .map((state) => (
                                        <CommandItem
                                          key={state.id}
                                          value={state.name}
                                          onSelect={() => {
                                            handleInputChange(
                                              "stateId",
                                              state.id.toString()
                                            );
                                            setStateOpen(false);
                                          }}
                                        >
                                          {state.name}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                            {showErrors && errors.stateId  && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.stateId }
                            </p>
                          )}
                        </div>

                        {/* City Dropdown */}
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            City *
                          </Label>

                          <Popover open={cityOpen} onOpenChange={setCityOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full mt-1 h-10 lg:h-11 border rounded px-3 flex items-center justify-between"
                              >
                                <span>
                                  {formData.cityId
                                    ? cities.find((c) => c.id == formData.cityId)
                                      ?.name
                                    : "Select city"}
                                </span>
                                <ChevronDown className="h-4 w-4 opacity-60" />
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent
                              align="start"
                              className="w-full p-0"
                            >
                              <Command>
                                <CommandInput
                                  placeholder="Search city..."
                                  value={citySearch}
                                  onValueChange={setCitySearch}
                                />

                                <CommandList className="max-h-60 overflow-y-auto">
                                  <CommandEmpty>No city found.</CommandEmpty>

                                  <CommandGroup>
                                    {cities
                                      .filter((city) =>
                                        city.name
                                          .toLowerCase()
                                          .startsWith(citySearch.toLowerCase())
                                      )
                                      .map((city) => (
                                        <CommandItem
                                          key={city.id}
                                          value={city.name}
                                          onSelect={() => {
                                            handleInputChange(
                                              "cityId",
                                              city.id.toString()
                                            );
                                            setCityOpen(false);
                                          }}
                                        >
                                          {city.name}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                            {showErrors && errors.cityId  && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.cityId }
                            </p>
                          )}
                        </div>
                      </div>
                        <div className="mt-4">
                          <Label
                            htmlFor="pincode"
                            className="text-sm font-medium text-gray-700"
                          >
                            Pincode *
                          </Label>
                          <Input
                            id="pincode"
                            value={formData.pincode}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              handleInputChange("pincode", value);
                            }}
                            placeholder="Enter pincode"
                             maxLength={6}
                            className="mt-1 h-12"
                            required
                          />
                        </div>
                      </div>
                        {showErrors && errors.pincode   && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.pincode  }
                            </p>
                          )}
                    </div>
                  )}

                  {/* Step 3: Account Setup */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Account Setup
                      </h3>

                      <div>
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium text-gray-700"
                        >
                          Password *
                        </Label>
                        <div className="mt-1 relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) =>
                              handleInputChange("password", e.target.value)
                            }
                            placeholder="Create a strong password"
                            className="pr-10 h-12"
                            required
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="confirmPassword"
                          className="text-sm font-medium text-gray-700"
                        >
                          Confirm Password *
                        </Label>
                        <div className="mt-1 relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              handleInputChange(
                                "confirmPassword",
                                e.target.value
                              )
                            }
                            placeholder="Confirm your password"
                            className="pr-10 h-12"
                            required
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="agreeTerms"
                            checked={formData.agreeTerms}
                            onCheckedChange={(checked) =>
                              handleInputChange("agreeTerms", Boolean(checked))
                            }
                            className="mt-1"
                          />
                          <label
                            htmlFor="agreeTerms"
                            className="text-sm text-gray-600 leading-relaxed"
                          >
                            I agree to the{" "}
                            <Link
                              href="/terms-and-conditions"
                              target="_blank"
                              className="text-blue-600 hover:underline"
                            >
                              Terms and Conditions
                            </Link>{" "}
                            and{" "}
                            <Link
                              href="/privacy-policy"
                              target="_blank"
                              className="text-blue-600 hover:underline"
                            >
                              Privacy Policy
                            </Link>
                          </label>
                        </div>

                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="agreeMarketing"
                            checked={formData.agreeMarketing}
                            onCheckedChange={(checked) =>
                              handleInputChange("agreeMarketing", Boolean(checked))
                            }
                            className="mt-1"
                          />
                          <label
                            htmlFor="agreeMarketing"
                            className="text-sm text-gray-600 leading-relaxed"
                          >
                            Send me updates about new features, hiring tips, and
                            promotional offers
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        className="h-12 px-6"
                      >
                        Previous
                      </Button>
                    )}

                    {currentStep < 3 ? (

                      <Button
                        type="button"
                        onClick={handleNext}
                        // disabled={!isStepValid()}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 px-6 ml-auto"
                      >
                        Next

                      </Button>

                    ) : (
                      <Button
                        // disabled={!isStepValid()}
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 px-6 ml-auto"
                      >
                        Create Account
                      </Button>
                    )}
                  </div>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Secure registration process</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    </div>
  );
}
