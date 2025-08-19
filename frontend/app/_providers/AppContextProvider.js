"use client";
import { useContext, createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth0 } from "@auth0/auth0-react";
import { prisma } from "@/lib/prisma";

const AppContext = createContext();

export default function AppContextProvider({ children }) {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [appUser, setAppUser] = useState({
    email: user ? user.email : "",
    name: user ? user.name : "",
    courses: [],
  });

  const fetchUserData = async () => {
    try {
      const res = await fetch(
        `/api/user?email=${encodeURIComponent(user.email)}`
      );
      const data = await res.json();
      setAppUser(data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Course Upload Function -------------------
  const saveCourseAndAssignments = async (courseName, assignments) => {
    const token = await getAccessTokenSilently();
    try {
      // Step 1: Create course (via your /api/courses route or directly)
      const courseRes = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseName, userEmail: appUser.email }),
      });

      const { course } = await courseRes.json();
      console.log("Created course:", course);
      // Step 2: Create assignments for the course

      if (assignments.length > 0) {
        await fetch("/api/assignments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ courseId: course.id, assignments }),
        });
      }

      // Step 3: Re-fetch updated user data or handle state update as needed
      fetchUserData();
      console.log("Course and assignments saved successfully");
    } catch (err) {
      console.error("Error saving course and assignments:", err);
    }
  };

  // Course Functions --------------------------------

  const saveCourseChanges = async (courseId, courseName) => {
    try {
      const token = await getAccessTokenSilently();

      await fetch("/api/courses", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId, courseName }),
      });

      // Fetch and update user state
      fetchUserData();
      console.log("Course changes saved successfully");
    } catch (error) {
      console.error("Error saving course changes:", error);
    }
  };

  const removeCourse = async (courseId) => {
    try {
      const token = await getAccessTokenSilently();

      await fetch(`/api/courses?courseId=${courseId}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      // Fetch and update user state
      fetchUserData();
      console.log("Course removed successfully");
    } catch (error) {
      console.error("Error removing course:", error);
    }
  };

  // Assignment Functions ----------------------------

  const saveAssignmentChanges = async (
    assignmentId,
    title,
    dueDate,
    completionStatus
  ) => {
    try {
      const token = await getAccessTokenSilently();
      console.log("Saving assignment changes:", {
        assignmentId,
        title,
        dueDate,
        completed: completionStatus,
      });
      await fetch("/api/assignments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assignmentId,
          title,
          dueDate,
          completed: completionStatus,
        }),
      });

      fetchUserData();
      console.log("Assignment changes saved successfully");
    } catch (error) {
      console.error("Error saving assignment changes:", error);
    }
  };

  const addAssignment = async (courseId, title, dueDate, completionStatus) => {
    try {
      const token = await getAccessTokenSilently();

      await fetch("/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId,
          title,
          dueDate,
          completed: completionStatus,
        }),
      });

      // Refresh user data state afterwards if needed
      fetchUserData();
      console.log("Assignment added successfully");
    } catch (error) {
      console.error("Error adding assignment:", error);
    }
  };

  const removeAssignment = async (assignmentId) => {
    try {
      const token = await getAccessTokenSilently();

      await fetch(`/api/assignments?assignmentId=${assignmentId}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      // Refresh user data state afterwards if needed
      fetchUserData();
      console.log("Assignment removed successfully");
    } catch (error) {
      console.error("Error removing assignment:", error);
    }
  };

  useEffect(() => {
    if (!user || !isAuthenticated) {
      return;
    }

    // Fetch user data from the database or create a new user if it doesn't exist
    const fetchUser = async () => {
      try {
        const token = await getAccessTokenSilently();

        await fetch("/api/user", {
          method: "POST",
          body: JSON.stringify({ email: user.email, name: user.name }),
          headers: { authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    //
    const fetchUserData = async () => {
      try {
        const res = await fetch(
          `/api/user?email=${encodeURIComponent(user.email)}`
        );
        const data = await res.json();
        setAppUser(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
    fetchUserData();
  }, [user, isAuthenticated]);

  return (
    <AppContext.Provider
      value={{
        appUser,
        saveCourseAndAssignments,
        saveCourseChanges,
        removeCourse,
        saveAssignmentChanges,
        addAssignment,
        removeAssignment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  return useContext(AppContext);
};
