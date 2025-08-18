"use client";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { useApp } from "../_providers/AppContextProvider";

export default function Assignment({ assignment, index }) {
  const [title, setTitle] = useState(assignment.title);
  const [dueDate, setDueDate] = useState(assignment.dueDate);
  const [completionStatus, setCompletionStatus] = useState(
    assignment.completed
  );
  const [editAssignment, setEditAssignment] = useState(false);
  const cancelAssignmentChanges = () => {};
  return (
    <li
      key={index}
      className="bg-white p-4 rounded shadow border-l-4 border-green-500"
    >
      <div>
        <p className="font-bold text-lg text-gray-800">{assignment.title}</p>

        <p className="text-sm text-gray-600 mt-1">{assignment.due}</p>
      </div>
      <button>Edit Assignment</button>
    </li>
  );
}
