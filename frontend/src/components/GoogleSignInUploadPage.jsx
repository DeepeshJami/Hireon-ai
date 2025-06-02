import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export function GoogleSignInUploadPage() {
  const navigate = useNavigate();

  return (
    <div className="hireon-google-btn flex items-center rounded-full shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 transition-all duration-200 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800">
      <GoogleLogin
        useOneTap
        theme="outline"
        size="medium"
        shape="circle"
        width="auto"
        onSuccess={({ credential }) => {
          localStorage.setItem("g_id_token", credential);
          navigate("/upload");
          window.location.reload();
        }}
        onError={() => {
          alert("Google sign-in failed");
          window.location.reload();
        }}
      />
      {/* Optionally, add a Google icon and text for larger screens */}
      {/* <span className="hidden md:inline ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">Sign in with Google</span> */}
    </div>
  );
} 