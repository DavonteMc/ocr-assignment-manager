"use client";
import { useContext, createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth0 } from "@auth0/auth0-react";
import { prisma } from "@/lib/prisma";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth0();

  const [appUser, setAppUser] = useState({
    email: user ? user.email : "",
    name: user ? user.name : "",
    courses: [],
  });

  // Course Upload Function -------------------
  const saveCourseAndAssignments = async (courseName, assignments) => {
    try {
      // Prisma transaction is used to ensure that both the course and assignments are created
      // If any part fails, the whole transaction is rolled back
      const updatedUser = await prisma.$transaction(async (tx) => {
        // tx is the transaction client
        const course = await tx.course.create({
          data: {
            courseName,
            user: { connect: { email: appUser.email } },
          },
        });

        const assignmentsData = assignments.map((a) => ({
          title: a.title,
          dueDate: a.dueDate,
          courseId: course.id,
        }));

        // Batch-create assignments
        await tx.assignment.createMany({ data: assignmentsData });

        // Return the updated user with courses and assignments
        return await tx.user.findUnique({
          where: { email: appUser.email },
          include: {
            courses: { include: { assignments: true } },
          },
        });
      });

      setAppUser({
        email: updatedUser.email,
        name: updatedUser.name,
        courses: updatedUser.courses || [],
      });
    } catch (error) {
      console.error("Error saving course and assignments:", error);
    }
  };

  // Course Functions --------------------------------

  const saveCourseChanges = async (courseId, courseName) => {
    try {
      const updatedUser = await prisma.$transaction(async (tx) => {
        const course = await tx.course.update({
          where: { id: courseId },
          data: {
            courseName: courseName,
            user: { connect: { email: appUser.email } },
          },
        });

        return await tx.user.findUnique({
          where: { email: appUser.email },
          include: {
            courses: { include: { assignments: true } },
          },
        });
      });

      setAppUser({
        email: updatedUser.email,
        name: updatedUser.name,
        courses: updatedUser.courses || [],
      });
    } catch (error) {
      console.error("Error saving course changes:", error);
    }
  };

  const removeCourse = async (courseId) => {
    try {
      // Delete the course (related assignments will be deleted if schema uses CASCADE on delete)
      await prisma.course.delete({
        where: { id: courseId },
      });

      // Fetch the updated user data including courses and assignments
      const updatedUser = await prisma.user.findUnique({
        where: { email: appUser.email },
        include: {
          courses: { include: { assignments: true } },
        },
      });

      setAppUser({
        email: updatedUser.email,
        name: updatedUser.name,
        courses: updatedUser.courses || [],
      });
    } catch (error) {
      console.error("Error removing course:", error);
    }
  };

  // Assignment Functions ----------------------------

  const handleAssignmentTitleChange = (assignmentId, e) => {};

  const handleAssignmentDueChange = (assignmentId, e) => {};

  const handleAssignmentStatus = (assignmentId, e) => {};

  const saveAssignmentChanges = (assignmentId) => {};

  const addAssignment = (assignmentId) => {};

  const removeAssignment = (assignmentId) => {};

  useEffect(() => {
    if (!user || !isAuthenticated) {
      return;
    }

    // Fetch user data from the database or create a new user if it doesn't exist
    const fetchUser = async () => {
      try {
        const userData = {
          email: user.email,
          name: user.name,
        };

        await prisma.user.upsert({
          where: { email: user.email },
          create: userData,
          update: userData,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    //
    const fetchUserData = async () => {
      try {
        const userWithData = await prisma.user.findUnique({
          where: { email: user.email },
          include: {
            courses: {
              include: {
                assignments: true,
              },
            },
          },
        });
        if (!userWithData) {
          console.error("User not found in database");
          return;
        }
        setAppUser({
          email: userWithData.email,
          name: userWithData.name,
          courses: userWithData.courses || [],
        });
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
        setAppUser,
        saveCourseAndAssignments,
        handleCourseNameChange,
        saveCourseChanges,
        addCourse,
        removeCourse,
        handleAssignmentTitleChange,
        handleAssignmentDueChange,
        handleAssignmentStatus,
        saveAssignmentChanges,
        addAssignment,
        removeAssignment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  return useContext(AppContext);
};
