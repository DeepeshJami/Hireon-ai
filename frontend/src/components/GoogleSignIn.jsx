import { GoogleLogin } from "@react-oauth/google";

export function GoogleSignIn() {
  return (
    <div className="hireon-google-btn inline-flex items-center justify-center rounded-xl shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 mt-2 transition-all duration-300 hover:shadow-xl hover:scale-105">
      <GoogleLogin
        useOneTap
        theme="filled_blue"
        size="large"
        shape="pill"
        width="240"
        onSuccess={({ credential }) => {
          localStorage.setItem("g_id_token", credential);
          window.location.reload();
        }}
        onError={() => alert("Google sign-in failed")}
      />
    </div>
  );
} 