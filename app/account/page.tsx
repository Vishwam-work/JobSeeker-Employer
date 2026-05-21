"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmployerHeader from "@/components/Employerheader";
import EmployerFooter from "@/components/Employerfooter";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import AsyncSelect from "react-select/async";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
export default function EmployerAccountEdit() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    company_name: "",
    company_type: "",
    industry: "",
    company_size: "",
    website: "",
    description: "",
    contact_person_name: "",
    designation: "",
    phone_code: "",
    phone: "",
    address: "",
    country: "",
    countryLabel: "",
    state: "",
    city: "",
    pincode: "",
    company_logo: "",
  });
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<StateItem[]>([]);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [phoneError, setPhoneError] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  type FormData = {
    company_name: string;
    company_type: string;
    industry: string;
    company_size: string;
    website: string;
    description: string;
    contact_person_name: string;
    designation: string;
    phone: string;
    address: string;
    country: string;
    countryLabel: string;
    state: string;
    city: string;
    phone_code: string;
    pincode: string;
    company_logo: string;
  };
  type FormErrors = {
    company_name?: string;
    company_type?: string;
    industry?: string;
    company_size?: string;
    website?: string;
    description?: string;
    contact_person_name?: string;
    designation?: string;
    phone?: string;
    address?: string;
    country?: string;
    countryLabel?: string;
    state?: string;
    city?: string;
    pincode?: string;
    company_logo?: string;
  };
  type Country = {
    id: string | number;
    name: string;
    phonecode: string;
  };
  type StateItem = {
    id: string | number;
    name: string;
  };

  type CityItem = {
    id: string | number;
    name: string;
    stateId: number;
  };

  // ✅ Fetch Company
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const token = localStorage.getItem("employeer_token");
        if (!token) return;

        const decoded: any = jwtDecode(token);
        const userId = decoded?.user_id;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/company/${userId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const data = await response.json();
        console.log("Company Details:", data);
        setFormData({
          company_name: data.company?.company_name || "",
          company_type: data.company?.company_type || "",
          industry: data.company?.industry || "",
          company_size: data.company?.company_size || "",
          website: data.company?.website || "",
          description: data.company?.description || "",
          address: data.company?.address || "",
          pincode: data.company?.pincode || "",
          contact_person_name: data.contact_person_name || "",
          designation: data.designation || "",
          phone: data.phone || "",
          phone_code: data.phone_code || "",
          country: data.company?.country?.toString() || "",
          state: data.company?.state?.toString() || "",
          city: data.company?.city?.toString() || "",
          countryLabel: "",
          company_logo: data.company?.company_logo
            ? process.env.NEXT_PUBLIC_URL + data.company.company_logo
            : "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, []);

  console.log("Profile Data ---->After Fetch", formData);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL_MASTER}/countries/`)
      .then((res) => res.json())
      .then((data) => {
        // console.log("Country data:", data);
        setCountries(data);
      })
      .catch((err) => console.error(err));
  }, []);
  useEffect(() => {
    if (formData.country) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/states/?country_id=${formData.country}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setStates(data);
        })
        .catch((err) => console.error(err));
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.state) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/cities/?state=${formData.state}`,
      )
        .then((res) => res.json())
        .then(setCities)
        .catch((err) => console.error(err));
    }
  }, [formData.state]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    value?: string,
  ) => {
    if (typeof e === "string") {
      setFormData((prev) => ({
        ...prev,
        [e]: value ?? "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const validateStep = () => {
    let newErrors: any = {};

    const companyName = formData.company_name?.trim();

    if (!companyName) {
      newErrors.company_name = "Company name is required";
    } else if (companyName.length < 3) {
      newErrors.company_name = "Minimum 3 characters required";
    }

    if (!formData.company_type) newErrors.company_type = "Select company type";

    if (!formData.industry) newErrors.industry = "Select industry";

    if (!formData.company_size) newErrors.company_size = "Select company size";

    if (!formData.description?.trim())
      newErrors.description = "Description is required";

    const name = formData.contact_person_name?.trim();

    if (!name) {
      newErrors.contact_person_name = "Contact person name is required";
    } else if (name.length < 3) {
      newErrors.contact_person_name = "Minimum 3 characters required";
    }

    if (!formData.designation?.trim())
      newErrors.designation = "Designation is required";

    if (!formData.phone || formData.phone.length !== 10)
      newErrors.phone = "Enter valid 10 digit phone";

    if (!formData.address?.trim()) newErrors.address = "Address is required";

    if (!formData.country) newErrors.country = "Select country";

    if (!formData.state) newErrors.state = "Select state";

    if (!formData.city) newErrors.city = "Select city";

    if (!formData.pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (formData.pincode.length !== 6) {
      newErrors.pincode = "Enter valid 6 digit pincode";
    }

    console.log("Errors:", newErrors); // 🔥 debug

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // ✅ Update API
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const isValid = validateStep(); // 🔥 validation call
    console.log("Validation Errors:", isValid);
    if (!isValid) {
      setShowErrors(true); // errors show karo
      return;
    }

    try {
      const token = localStorage.getItem("employeer_token");
      const decoded: any = jwtDecode(token!);
      const userId = decoded?.user_id;

      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "company_logo") {
          form.append(key, value as string);
        }
      });

      if (selectedFile) {
        form.append("company_logo", selectedFile);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/company/${userId}/update/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        },
      );

      const data = await response.json();
      console.log(data);
      toast.success("Updated Successfully");
    } catch (err) {
      console.error(err);
    }
  };
  const getselectcountry = () => {
    const country = countries.find(
      (c) => c.id.toString() === formData.country.toString(),
    );

    return country
      ? {
          label: country.name,
          value: country.id.toString(),
          phonecode: country.phonecode,
        }
      : null;
  };
  const loadCountryOptionss = async (inputValue: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/countries/`,
      );

      const data = await res.json();

      return data
        .filter((c: any) =>
          c.name?.toLowerCase().includes(inputValue.toLowerCase()),
        )
        .map((c: any) => ({
          label: c.name,
          value: c.id.toString(),
          phonecode: c.phonecode,
        }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  const loadStateOptions = async (inputValue: string) => {
    const search = inputValue.toLowerCase();

    return states
      .filter((s) => {
        if (!s.name) return false;

        return s.name.toLowerCase().includes(search);
      })
      .map((s) => ({
        label: s.name,
        value: s.id.toString(),
      }));
  };
  const getSelectedState = () => {
    const state = states.find(
      (s) => s.id.toString() === formData.state.toString(),
    );

    return state
      ? {
          label: state.name,
          value: state.id.toString(),
        }
      : null;
  };
  const loadCityOptions = async (inputValue: string) => {
    const search = inputValue?.toLowerCase()?.trim() || "";

    return cities
      .filter((c) => {
        if (!c.name) return false;
        if (!search) return true;

        return c.name.toLowerCase().includes(search);
      })
      .map((c) => ({
        label: c.name,
        value: c.id.toString(),
      }));
  };
  const getSelectedCity = () => {
    const city = cities.find(
      (c) => c.id.toString() === formData.city.toString(),
    );

    return city
      ? {
          label: city.name,
          value: city.id.toString(),
        }
      : null;
  };
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
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <EmployerHeader />

      <div className="p-6 max-w-5xl mx-auto">
        <Card className="shadow-2xl">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-center">
              Edit Employer Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logo */}
              <div className="flex justify-center">
                {/* <Image
                  src={formData.company_logo || "/placeholder.png"}
                  alt="logo"
                  width={120}
                  height={120}
                  onClick={handleImageClick}
                  className="rounded-full cursor-pointer border"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                /> */}
                <div className="flex flex-col items-center w-28">
                  <Dialog
                    open={isImageDialogOpen}
                    onOpenChange={(open) => setIsImageDialogOpen(open)}
                  >
                    <DialogTrigger asChild>
                      {/* Only this div as trigger */}
                      <div className="relative w-28 h-28 cursor-pointer group">
                        {/* Border */}
                        <div className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-gray-200">
                          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                            {!selectedImage && !formData.company_logo && "Add"}
                          </div>
                        </div>

                        {/* Profile Image */}
                        <div className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden">
                          {selectedImage ? (
                            <img
                              src={URL.createObjectURL(selectedImage)}
                              className="w-24 h-24 rounded-full object-cover"
                              alt="Account Preview"
                            />
                          ) : formData.company_logo ? (
                            <img
                              src={formData.company_logo}
                              className="w-24 h-24 rounded-full object-cover"
                              alt="Company Logo"
                            />
                          ) : (
                            <User className="w-10 h-10 text-purple-600" />
                          )}
                        </div>

                        {/* Hover Overlay */}
                        <div
                          className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center
                                                    opacity-0 group-hover:opacity-100 transition"
                        >
                          <span className="text-white text-xs font-medium">
                            {selectedImage || formData.company_logo
                              ? "Update Photo"
                              : "Add Photo"}
                          </span>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-lg p-4 w-80">
                      <DialogHeader>
                        <DialogTitle>Update Profile Photo</DialogTitle>
                      </DialogHeader>
                      {selectedImage && (
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Preview"
                          className="w-24 h-24 rounded-full object-cover mx-auto mt-4"
                        />
                      )}
                      {/* File Input */}
                      <div className="flex flex-col gap-4">
                        {/* File Upload Button */}
                       <label className="block w-full max-w-full cursor-pointer">
                        <div className="flex flex-col items-center justify-center
                          w-full max-w-full overflow-hidden
                          border-2 border-dashed border-gray-300
                          rounded-xl p-4 sm:p-6
                          hover:border-purple-600 hover:bg-purple-50
                          transition duration-300"
                        >
                            <svg
                              className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 mb-2"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 16v4h16v-4M12 4v12m0 0l-4-4m4 4l4-4"
                              />
                            </svg>
                            <span className="text-sm font-medium text-gray-700 break-all text-center">
                              {selectedImage
                                ? selectedImage.name
                                : "Click to upload photo"}
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                              JPG, JPEG, PNG, WEBP — Max 1MB
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;

                              const allowedTypes = [
                                "image/jpeg",
                                "image/jpg",
                                "image/png",
                                "image/webp",
                              ];
                              if (!allowedTypes.includes(file.type)) {
                                setImageError(
                                  "Only JPG, JPEG, PNG, WEBP formats are allowed.",
                                );
                                return;
                              }

                              if (file.size > 1024 * 1024) {
                                setImageError(
                                  "Image size must be less than 1MB.",
                                );
                                return;
                              }

                              setImageError(null);
                              setSelectedImage(file);

                              // AUTO UPLOAD
                              const formData = new FormData();
                              formData.append("company_logo", file);

                              try {
                                const res = await fetch(
                                  `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/company/upload-company-logo/`,
                                  {
                                    method: "PATCH",
                                    headers: {
                                      Authorization: `Bearer ${localStorage.getItem("employeer_token")}`,
                                    },
                                    body: formData,
                                  },
                                );

                                if (res.ok) {
                                  const data = await res.json();

                                  const newImageUrl =
                                    process.env.NEXT_PUBLIC_API_URL_EMPLOYER +
                                    data.company_logo +
                                    "?t=" +
                                    Date.now();
                                  // update UI instantly
                                  setFormData((prev) => ({
                                    ...prev,
                                    company_logo: newImageUrl,
                                  }));
                                  // close dialog automatically
                                  setIsImageDialogOpen(false);
                                } else {
                                  const error = await res.json();
                                  setImageError(
                                    error?.error || "Upload failed",
                                  );
                                }
                              } catch (err) {
                                console.error(err);
                                setImageError("Network error");
                              }
                            }}
                          />
                        </label>

                        {/* Error */}
                        {imageError && (
                          <p className="text-red-500 text-xs text-center break-words">
                            {imageError}
                          </p>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Inputs */}
              <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl ">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                  Company Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Company Name */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                      Company Name
                    </label>
                    <input
                      name="company_name"
                      value={formData.company_name}
                      onChange={(e) => handleChange(e)}
                      placeholder="Enter company name"
                      className="input-style  border p-2 rounded"
                      required
                    />
                    {showErrors && errors.company_name && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.company_name}
                      </span>
                    )}
                  </div>

                  {/* Company Type */}
                  <div>
                    <Label className="text-sm font-medium text-gray-600 mb-1">
                      Company Type *
                    </Label>
                    <Select
                      value={formData.company_type}
                      onValueChange={(value) =>
                        handleChange("company_type", value)
                      }
                      required
                    >
                      <SelectTrigger className="input-style  border p-2 rounded">
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
                    {showErrors && errors.company_type && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.company_type}
                      </span>
                    )}
                  </div>
                  {/* Industry */}
                  <div>
                    <Label className="text-sm font-medium text-gray-600 mb-1">
                      Industry *
                    </Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => handleChange("industry", value)}
                      required
                    >
                      <SelectTrigger className="input-style  border p-2 rounded">
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
                    {showErrors && errors.industry && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.industry}
                      </span>
                    )}
                  </div>
                  {/* Company Size */}
                  <div>
                    <Label className="text-sm font-medium text-gray-600 mb-1">
                      Company Size *
                    </Label>
                    <Select
                      value={formData.company_size}
                      onValueChange={(value) =>
                        handleChange("company_size", value)
                      }
                      required
                    >
                      <SelectTrigger className="input-style  border p-2 rounded">
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
                    {showErrors && errors.company_size && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.company_size}
                      </span>
                    )}
                  </div>

                  {/* Contact Person */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                      Contact Person
                    </label>
                    <input
                      name="contact_person_name"
                      value={formData.contact_person_name}
                      onChange={handleChange}
                      placeholder="Full name"
                      className="input-style  border p-2 rounded"
                      required
                    />
                    {showErrors && errors.contact_person_name && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.contact_person_name}
                      </span>
                    )}
                  </div>

                  {/* Designation */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                      Designation
                    </label>
                    <input
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="HR / Manager"
                      className="input-style  border p-2 rounded"
                      required
                    />
                    {showErrors && errors.designation && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.designation}
                      </span>
                    )}
                  </div>

                  {/* Country */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                      Country
                    </label>

                    <AsyncSelect
                      cacheOptions
                      defaultOptions={countries.map((c) => ({
                        label: c.name ?? "",
                        value: c.id.toString(),
                        phonecode: c.phonecode,
                      }))}
                      loadOptions={loadCountryOptionss}
                      value={getselectcountry()}
                      onChange={(selected: any) => {
                        setSelectedCountry(selected);
                        setFormData((prev) => ({
                          ...prev,
                          country: selected?.value || "",
                          countryLabel: selected?.label || "",
                          phone_code: selected?.phonecode || "",
                          state: "",
                          city: "",
                        }));
                      }}
                      required
                      placeholder="Search Country..."
                    />
                    {showErrors && errors.country && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.country}
                      </span>
                    )}
                  </div>
                  {/* Phone */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                      Phone
                    </label>
                    <div className="flex gap-2 mt-1">
                      <input
                        className="w-20 h-10 text-center border rounded bg-gray-100"
                        value={
                          formData.phone_code ? `+${formData.phone_code}` : ""
                        }
                        onChange={(e) => handleChange(e)}
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

                          handleChange("phone", value);
                          if (value.length > 0 && value.length < 10) {
                            setPhoneError("Phone number must be 10 digits");
                          } else {
                            setPhoneError("");
                          }
                        }}
                        className="input-style  border p-2 rounded"
                        placeholder="Enter phone number"
                        maxLength={10}
                        required
                      />
                    </div>
                    {phoneError ? (
                      <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                    ) : showErrors && errors.phone ? (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    ) : showErrors && !formData.country ? (
                      <p className="text-red-500 text-sm mt-1">
                        Please select country
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1"></p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                      State
                    </label>

                    <AsyncSelect
                      cacheOptions
                      defaultOptions={states.map((s) => ({
                        label: s.name ?? "",
                        value: s.id.toString(),
                      }))}
                      loadOptions={loadStateOptions}
                      value={getSelectedState()}
                      onChange={(selected: any) => {
                        setSelectedState(selected);

                        setFormData((prev) => ({
                          ...prev,
                          state: selected?.value || "",
                          city: "",
                        }));
                      }}
                      placeholder="Search State..."
                      isDisabled={!formData.country}
                      required
                    />
                    {showErrors && errors.state && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.state}
                      </span>
                    )}
                  </div>

                  {/* City */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                      City
                    </label>

                    <AsyncSelect
                      cacheOptions
                      defaultOptions={cities.map((c) => ({
                        label: c.name ?? "",
                        value: c.id.toString(),
                      }))}
                      loadOptions={loadCityOptions}
                      value={getSelectedCity()}
                      onChange={(selected: any) => {
                        setSelectedCity(selected);

                        setFormData((prev) => ({
                          ...prev,
                          city: selected?.value || "",
                        }));
                      }}
                      placeholder="Search City..."
                      isDisabled={!formData.state}
                      required
                    />
                    {showErrors && errors.city && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.city}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                      Pin Code
                    </label>
                    <Input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Pin Code"
                      maxLength={6}
                      className="w-full border p-2 rounded"
                    />
                    {showErrors && errors.pincode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pincode}
                      </p>
                    )}
                  </div>
                  {/* Website */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                      Website
                    </label>
                    <input
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className="input-style  border p-2 rounded"
                    />
                  </div>
                </div>
              </div>
              <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full border p-2 rounded"
                  required
                />
                {showErrors && errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
                <label className="text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full border p-2 rounded"
                  required
                />
                {showErrors && errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
              <div className="text-center">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <EmployerFooter />
    </div>
  );
}
