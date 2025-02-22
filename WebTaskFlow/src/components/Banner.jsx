import React from "react";

const bannerConfig = {
  logo: "TaskFlow.ai",
  logoImage: "../public/logo.svg",
  title: "AI-Powered Task Management System",
  authors: [
    {
      name: "Debopriyo Roy",
      github: "https://github.com/deca109",
    },
    {
      name: "Shweta Rani Sahoo",
      github: "https://github.com/Shwetarani45005",
    },
    {
      name: "Aniket Roy",
      github: "https://github.com/Aniket200000",
    },
  ],
  description:
    "An intelligent task management and allocation system that uses AI to recommend the best employee for each task based on skills, performance, and workload.",
  repo_url: "ErikSimson/",
  github: "https://github.com/deca109/Taskflow.ai",
  license: "MIT",
};

const Banner = () => {
  const { logo, logoImage, title, authors, description, github, license } = bannerConfig;

  return (
    <div className="bottom-0 w-full bg-white rounded-lg text-gray-800 p-3 sm:p-4 md:p-6 shadow-lg border-t border-indigo-600 radius-tl-3xl mt-12 border-radius-3xl mt-4 sm:mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 text-center md:text-left">
        {/* Logo and Description Section */}
        <div>
          <div className="flex items-center mb-1 sm:mb-2 justify-center md:justify-start">
            <img
              src={logoImage} 
              alt="Logo"
              className="h-6 sm:h-8 w-auto mr-2" 
            />
            <h1 className="text-xl sm:text-2xl md:text-3xl text-indigo-600 font-bold">
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                {logo}
              </a>
            </h1>
          </div>
          <h2 className="text-sm sm:text-base md:text-xl font-semibold">{title}</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 hidden sm:block">
            {description}
          </p>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium">License: {license}</p>
        </div>

        {/* Authors Section */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold">Project Authors</h3>
          <div className="flex flex-col space-y-1 sm:space-y-2 mt-1 sm:mt-2">
            {authors.map((author, index) => (
              <a
                key={index}
                href={author.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-indigo-600 hover:underline"
              >
                {author.name}
              </a>
            ))}
          </div>
        </div>

        {/* Links Section */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold">Links</h3>
          <div className="flex flex-col space-y-1 sm:space-y-2 mt-1 sm:mt-2">
            <a href={github} className="text-xs sm:text-sm text-indigo-600 hover:underline">
              Source Code
            </a>
            <a
              href={`${github}#readme`}
              className="text-xs sm:text-sm text-indigo-600 hover:underline"
            >
              Documentation
            </a>
            <a
              href={`${github}/issues/new`}
              className="text-xs sm:text-sm text-indigo-600 hover:underline"
            >
              Report an Issue
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
