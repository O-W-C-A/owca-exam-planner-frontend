"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import api from "@/utils/axiosInstance";
import LoginForm from "./LoginForm";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import ToastMessage from "@/app/components/ToastMessage"; // Import ToastMessage component

export default function LoginPage() {
  const { fetchUser } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success" | "info";
  } | null>(null);
  const router = useRouter();

  // Function to get the redirect path based on the user's role
  const getRedirectPathFromRole = (role: string): string => {
    switch (role) {
      case "student":
        return "/dashboard/student/calendar";
      case "studentleader":
        return "/dashboard/studentleader/calendar";
      case "professor":
        return "/dashboard/professor/calendar";
      case "admin":
        return "/dashboard/admin";
      case "secretary":
        return "/dashboard/secretary";
      default:
        return "/dashboard"; // Default fallback
    }
  };

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get("authToken");
        const role = Cookies.get("role")?.toLowerCase();

        if (token && role) {
          // Redirect user if authenticated
          const redirectPath = getRedirectPathFromRole(role);
          router.push(redirectPath);
        }
      } catch (error) {
        // Error handling if authentication check fails
        setToast({
          message: "Authentication check failed. Please try again.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (login)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Attempt login with user credentials
      const res = await api.post("/auth/login", {
        email: formData.email,
        passwordHash: formData.password,
      });

      const authData = res.data;

      // Determine the correct role (handling case where student is a leader)
      const actualRole =
        authData.role.toLowerCase() === "student" && authData.isLeader === true
          ? "studentleader"
          : authData.role.toLowerCase();

      // Set cookies for authentication
      type SameSite = "Strict" | "Lax" | "None";

      const cookieOptions: {
        path: string;
        sameSite: SameSite;
        secure: boolean;
      } = {
        path: "/",
        sameSite: "Strict",
        secure: true,
      };

      // Set authentication-related cookies
      Cookies.set("authToken", authData.token, cookieOptions);
      Cookies.set("userId", String(authData.userId), cookieOptions);
      Cookies.set("role", actualRole, cookieOptions);

      // Additional cookies for student leaders
      if (actualRole === "studentleader") {
        if (authData.groupId) {
          Cookies.set("groupId", String(authData.groupId), cookieOptions);
        }
        if (authData.groupName) {
          Cookies.set("groupName", authData.groupName, cookieOptions);
        }
      }

      // Wait for user data to be loaded
      await fetchUser();

      // Redirect user based on their role
      const redirectPath = getRedirectPathFromRole(actualRole);
      router.push(redirectPath);

      // Show success toast message
      setToast({ message: "Login successful!", type: "success" });
    } catch (err) {
      // Error handling: show error toast message
      setToast({
        message: "Login failed. Please check your credentials and try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state (spinner)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Clear toast message
  const clearToast = () => setToast(null);

  return (
    <div>
      {/* ToastMessage notification */}
      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}
      <LoginForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        error={null} // Pass error state, if any
      />
    </div>
  );
}
