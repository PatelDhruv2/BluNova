import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  return document.cookie.includes("jwt=");
};

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
}
