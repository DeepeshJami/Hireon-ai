import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from 'react-router-dom';

export function GoogleSignIn() {
  const navigate = useNavigate();
  return (
    <div className="hireon-google-btn inline-flex items-center justify-center rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 mt-2 transition-all duration-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400/50">
      <GoogleLogin
        useOneTap
        theme="filled_blue"
        size="large"
        shape="pill"
        width="240"
        onSuccess={({ credential }) => {
          localStorage.setItem("g_id_token", credential);
          navigate('/upload');
        }}
        onError={() => alert("Google sign-in failed")}
      />
    </div>
  );
} 