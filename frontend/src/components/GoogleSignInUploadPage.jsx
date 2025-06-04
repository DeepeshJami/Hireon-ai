

export function GoogleSignIn() {
  const navigate = useNavigate();
  return (
    <div className="hireon-google-btn flex items-center justify-center rounded-full shadow-md bg-white w-10 h-10 p-0 transition-all duration-300 hover:shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400/50 mx-auto">
      <GoogleLogin
        useOneTap
        theme="outline"
        size="medium"
        shape="circle"
        width="40"
        text=""
        onSuccess={({ credential }) => {
          localStorage.setItem("g_id_token", credential);
          navigate('/upload');
        }}
        onError={() => alert("Google sign-in failed")}
      />
    </div>
  );
} 