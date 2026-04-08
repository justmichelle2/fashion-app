import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children, allowedRole, loginPath = "/login", fallbackPath }) {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={loginPath} replace />;
  }

  if (allowedRole && userProfile?.userType !== allowedRole) {
    const roleFallback =
      fallbackPath ||
      (userProfile?.userType === "designer"
        ? "/designer/home"
        : userProfile?.userType === "admin"
        ? "/admin"
        : userProfile?.userType === "customer"
        ? "/customer/home"
        : loginPath);
    return <Navigate to={roleFallback} replace />;
  }

  return children;
}
