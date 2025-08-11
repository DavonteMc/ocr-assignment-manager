"use client";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import CourseUpload from "./_components/course-upload";
import Login from "./_components/login";
import LogoutButton from "./_components/logout";

export default function HomePage() {
  const { user } = useAuth0();
  const [courses, setCourses] = useState([
    {
      className: "",
      assignments: [{}],
    },
  ]);

  const [course, setCourse] = useState({
    className: "",
    assignments: [],
  });

  if (!user) {
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
        <CourseUpload courses={courses} setCourses={setCourses} />
      </section>

      {courses.length > 0 && courses[0].assignments.length > 0 && (
        <section className="mt-8 p-6">
          {courses.map((course, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {course.className}
              </h3>
              <ul className="space-y-3">
                {course.assignments.map((assignment, i) => (
                  <li
                    key={i}
                    className="bg-white p-4 rounded shadow border-l-4 border-green-500"
                  >
                    <p className="font-bold text-lg text-gray-800">
                      {assignment.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {assignment.due}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
