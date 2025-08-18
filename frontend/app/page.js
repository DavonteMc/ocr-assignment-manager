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
  const { appUser } = useApp();

  if (!user || !isAuthenticated) {
    return <Login />;
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <header className="flex w-full justify-between px-3 py-1 items-center mb-8 shadow-md sticky top-0 z-50">
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

      <section className="max-w-3xl mx-auto p-3">
        <CourseUpload />
      </section>

      {appUser.courses.length > 0 && appUser.courses[0].assignments.length > 0 && (
        <section className="mt-8 p-6">
          {appUser.courses.map((course, index) => (
            <Course key={index} course={course} index={index} />
          ))}
        </section>
      )}
    </main>
  );
}
