"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface JobSection {
  id: number;
  section_title: string;
  section_description: string;
  title: string;
  description: string;
  employment_type: string;
  experience_required: string;
  company_name: string;
  image: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<JobSection[]>([]);
  const [sectionTitle, setSectionTitle] = useState<string>("");
  const [sectionDescription, setSectionDescription] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobSections();
  }, []);

  const fetchJobSections = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/job-sections", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.job_sections) {
          const jobSections = data.data.job_sections;
          setJobs(jobSections);

          // Set section title and description from first job section if available
          if (jobSections.length > 0) {
            setSectionTitle(jobSections[0].section_title);
            setSectionDescription(jobSections[0].section_description);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching job sections:", err);
    } finally {
      setLoading(false);
    }
  };

  // Color mapping for different job titles
  const getColorClass = (index: number) => {
    const colors = [
      "text-blue-600",
      "text-purple-600",
      "text-green-600",
      "text-orange-600",
      "text-pink-600",
      "text-teal-600",
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <section className="bg-white py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6">
        <div className="max-w-[95%] mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-r-2 border-b-pink-600"></div>
        </div>
      </section>
    );
  }

  if (jobs.length === 0) {
    return null; // Don't show section if no jobs
  }

  return (
    <section className="bg-white py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6">
      <div className="max-w-[95%] mx-auto">
        {/* Title and Tagline */}
        <div className="text-center mb-12 md:mb-16" data-aos="fade-up">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-gray-900 mb-4">
            {sectionTitle || "FEATURED JOBS"}
          </h2>
          <p className="text-gray-700 text-lg sm:text-xl md:text-2xl">
            {sectionDescription || "Know your worth and find the job that qualify your life."}
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" data-aos="fade-up">
          {jobs.map((job, index) => (
            <div
              key={job.id}
              className="bg-white rounded-lg p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow relative"
            >
              {/* Bookmark Icon - Top Left */}
              <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>

              {/* Job Image */}
              <div className="flex justify-center mb-3 mt-2">
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-green-50">
                  {job.image ? (
                    <img
                      src={job.image.startsWith('http') ? job.image : `http://localhost:8000${job.image}`}
                      alt={job.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Title */}
              <h3 className={`text-lg md:text-xl font-bold ${getColorClass(index)} mb-2 text-center`}>
                {job.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 text-center">
                {job.description}
              </p>

              {/* Job Details */}
              <div className="space-y-1.5 mb-0">
                <div className="flex items-center justify-center gap-2 text-gray-600 text-xs md:text-sm">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{job.employment_type || "Full Time"}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600 text-xs md:text-sm">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{job.experience_required || "2 Years"}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600 text-xs md:text-sm">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span>{job.company_name || "House of Code"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

