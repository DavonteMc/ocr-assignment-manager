"use client";

import { useState } from "react";
import CourseUpload from "./_components/course-upload";

export default function HomePage() {
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

  

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900 font-sans">
      <section className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-6 text-blue-800">
          OCR Assignment Processor
        </h1>
        <CourseUpload courses={courses} setCourses={setCourses}/>
      </section>

      {courses.length > 0 && courses[0].assignments.length > 0 && (
        <section className="mt-8">

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
