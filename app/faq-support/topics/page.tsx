"use client";
 import Link from "next/link";
  import {
  UserCog,
  BriefcaseBusiness,
} from "lucide-react";
export default function Topics() {
  const topics = [
  {
    title: "Account Management",
    icon: <UserCog className="w-12 h-12 text-blue-600" />,
    slug: "account-management",
  },
  {
    title: "Job Posting",
    icon: <BriefcaseBusiness className="w-12 h-12 text-blue-600" />,
    slug: "job-posting",
  },
];

  return (
    <div className="bg-[#f3f3f3] ">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Browse Topics */}
         <div className="text-center ">
          <h2 className="text-4xl font-semibold text-blue-700 uppercase tracking-wide mb-10">
            Browse By Topic
          </h2>

          <div className="flex justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-5">
              {topics.map((topic, index) => (
                <Link href={`/faq-support/${topic.slug}`} key={index}>
                  <div className="bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex flex-col items-center justify-center min-h-[180px] hover:-translate-y-1 cursor-pointer w-full max-w-[180px]">
                    <div className="text-5xl mb-5">{topic.icon}</div>
                    <h3 className="text-gray-700 text-base font-medium text-center">
                      {topic.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}