import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children, allowedRole }) {
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
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userProfile?.userType !== allowedRole) {
    const fallbackPath =
      userProfile?.userType === "designer"
        ? "/designer/dashboard"
        : userProfile?.userType === "admin"
        ? "/admin"
        : userProfile?.userType === "customer"
        ? "/customer/home"
        : "/customer/login";
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}
