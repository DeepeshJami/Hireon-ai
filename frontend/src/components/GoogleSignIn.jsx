import { GoogleLogin } from "@react-oauth/google";

export function GoogleSignIn() {
  return (
    <div className="flex items-center justify-center w-full max-w-xs mx-auto">
      <GoogleLogin
        useOneTap
        theme="outline"
        size="medium"
        shape="pill"
        width="180"
        onSuccess={({ credential }) => {
          localStorage.setItem("g_id_token", credential);
          window.location.reload();
        }}
        onError={() => alert("Google sign-in failed")}
      />
    </div>
  );
} 