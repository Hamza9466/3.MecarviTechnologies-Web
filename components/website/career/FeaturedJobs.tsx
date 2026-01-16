import Image from "next/image";

const featuredJobs = [
  {
    id: 1,
    title: "LARAVEL DEVELOPMENT",
    description: "Explain your requirements by selecting your preferred service and get quotation for your order. We'll be there if you need any consultation",
    employmentType: "Full Time",
    experience: "2 Years",
    company: "House of Code",
    image: "/assets/images/8jc9fH3B63sSTdln1747924955.png",
    titleColor: "text-blue-600",
  },
  {
    id: 2,
    title: "LARAVEL DEVELOPMENT",
    description: "Explain your requirements by selecting your preferred service and get quotation for your order. We'll be there if you need any consultation",
    employmentType: "Full Time",
    experience: "2 Years",
    company: "House of Code",
    image: "/assets/images/kNN4g6hmCmM5HZvO1747642029.png",
    titleColor: "text-purple-600",
  },
  {
    id: 3,
    title: "PRODUCTION",
    description: "Digital Print Operator",
    employmentType: "Full Time",
    experience: "2 Years",
    company: "House of Code",
    image: "/assets/images/8jc9fH3B63sSTdln1747924955.png",
    titleColor: "text-green-600",
  },
  {
    id: 4,
    title: "PRODUCTION",
    description: "Digital Print Operator",
    employmentType: "Full Time",
    experience: "2 Years",
    company: "House of Code",
    image: "/assets/images/kNN4g6hmCmM5HZvO1747642029.png",
    titleColor: "text-orange-600",
  },
  {
    id: 5,
    title: "SOFTWARE DEVELOPMENT UPDATE",
    description: "Explain your requirements by selecting your preferred service and get quotation for your order. We'll be there if you need any consultation",
    employmentType: "Full Time",
    experience: "2 Years",
    company: "House of Code",
    image: "/assets/images/8jc9fH3B63sSTdln1747924955.png",
    titleColor: "text-pink-600",
  },
  {
    id: 6,
    title: "PRODUCTION",
    description: "Digital Print Operator",
    employmentType: "Full Time",
    experience: "2 Years",
    company: "House of Code",
    image: "/assets/images/kNN4g6hmCmM5HZvO1747642029.png",
    titleColor: "text-teal-600",
  },
];

export default function FeaturedJobs() {
  return (
    <section className="bg-white py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6">
      <div className="max-w-[95%] mx-auto">
        {/* Title and Tagline */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            FEATURED JOBS
          </h2>
          <p className="text-gray-700 text-lg sm:text-xl md:text-2xl">
            Know your worth and find the job that qualify your life.
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredJobs.map((job) => (
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
                  <Image
                    src={job.image}
                    alt={job.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Job Title */}
              <h3 className={`text-lg md:text-xl font-bold ${job.titleColor} mb-2 text-center`}>
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
                  <span>{job.employmentType}</span>
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
                  <span>{job.experience}</span>
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
                  <span>{job.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

