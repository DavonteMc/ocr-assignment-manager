"use client";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import CourseUpload from "./_components/course-upload";
import Course from "./_components/course";
import Login from "./_components/login";
import LogoutButton from "./_components/logout";
import { useApp } from "./_providers/AppContextProvider";

export default function HomePage() {
  const { user, isAuthenticated } = useAuth0();
  const [displayCourses, setDisplayCourses] = useState(true);
  const [displayCourseUpload, setDisplayCourseUpload] = useState(false);
  const { appUser } = useApp();

  if (!user || !isAuthenticated || !appUser) {
    return <Login />;
  }

  const selectedDisplay = "underline underline-offset-8 decoration-2";

  const handleDisplays = (displayType) => {
    if (displayType === "courses" && !displayCourseUpload) {
      return;
    } else if (displayType === "courses" && displayCourseUpload) {
      setDisplayCourses(true);
      setDisplayCourseUpload(false);
      return;
    } else if (displayType === "upload" && !displayCourses) {
      return;
    }
    setDisplayCourses(false);
    setDisplayCourseUpload(true);
  };

  const handleCourseUploadCompletion = () => {
    setDisplayCourseUpload(false);
    setDisplayCourses(true);
  };

  return (
    <main className="min-h-screen bg-gray-200 text-gray-900 font-sans">
      <header className="flex w-full justify-between bg-white px-3 py-1 items-center mb-8 shadow-md sticky top-0 z-50">
        <p className="text-[2.6vw] font-bold text-center text-blue-800">
          Assignment Manager
        </p>
        <div className="flex items-center space-x-4">
          <h1 className="text-[2vw] md:text-[1.5vw] font-bold">
            Welcome, {user.name}
          </h1>
          <LogoutButton />
        </div>
      </header>

      <section className="mx-auto flex items-center w-3/4">
        <button
          type="button"
          onClick={() => handleDisplays("courses")}
          className={`w-1/2 p-3 hover:scale-105 transition duration-300 ${
            displayCourses ? selectedDisplay : ""
          }`}
        >
          <h2 className={`text-3xl ${displayCourses ? selectedDisplay : ""}`}>
            Display Courses & Assignments
          </h2>
        </button>

        <button
          type="button"
          onClick={() => handleDisplays("upload")}
          className={`w-1/2 p-3 hover:scale-105 transition duration-300 ${
            displayCourseUpload ? selectedDisplay : ""
          }`}
        >
          <h2 className={` text-3xl ${displayCourseUpload ? selectedDisplay : ""}`}>
            Upload Assignments
          </h2>
        </button>
      </section>

      {displayCourses && appUser !== undefined && appUser !== null && (
        <section className="grid grid-cols-2 gap-8 mt-4 p-12">
          {appUser.courses.map((course, index) => (
            <Course key={index} course={course} index={index} />
          ))}
        </section>
      )}
      {displayCourseUpload && (
        <section className="flex mt-8 p-6 items-center justify-center">
          <CourseUpload onComplete={() => handleCourseUploadCompletion()} />
        </section>
      )}
    </main>
  );
}
