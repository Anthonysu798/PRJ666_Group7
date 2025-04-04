import { useRouter } from "next/router";
import { useEffect } from "react";

// Helper function to handle logout
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Middleware to check if user is authenticated
export function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();

    useEffect(() => {
      try {
        // Check for token in localStorage
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user) {
          handleLogout();
          router.replace("/login");
          return;
        }

        // Verify token expiration
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        if (tokenData.exp * 1000 < Date.now()) {
          handleLogout();
          router.replace("/login");
          return;
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        handleLogout();
        router.replace("/login");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
}

// Middleware to check if user is admin
export function withAdminAuth(WrappedComponent) {
  return function AdminAuthenticatedComponent(props) {
    const router = useRouter();

    useEffect(() => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user) {
          handleLogout();
          router.replace("/login");
          return;
        }

        // Verify token expiration
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        if (tokenData.exp * 1000 < Date.now()) {
          handleLogout();
          router.replace("/login");
          return;
        }

        if (user.role !== "admin") {
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Admin auth verification failed:", error);
        handleLogout();
        router.replace("/login");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
}
