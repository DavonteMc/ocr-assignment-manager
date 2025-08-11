
export default function Course({ course }) {


    return (
        <div className="mb-6">
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
    )
}