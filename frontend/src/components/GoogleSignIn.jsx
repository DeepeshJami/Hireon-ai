import { GoogleLogin } from "@react-oauth/google";

export function GoogleSignIn() {
  return (
    <div className="hireon-google-btn flex items-center justify-center w-10 h-10 rounded-full shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white transition-all duration-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400/50">
      <GoogleLogin
        useOneTap
        theme="filled_blue"
        size="medium"
        shape="circle"
        width="40"
        onSuccess={({ credential }) => {
          localStorage.setItem("g_id_token", credential);
          window.location.reload();
        }}
        onError={() => alert("Google sign-in failed")}
      />
    </div>
  );
} 