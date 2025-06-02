import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

export function GoogleSignIn() {
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: ({ credential }) => {
      localStorage.setItem('g_id_token', credential);
      navigate('/upload');
      window.location.reload();
    },
    onError: () => {
      alert('Google sign-in failed');
      window.location.reload();
    },
    flow: 'implicit',
  });

  return (
    <button
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
      style={{ minWidth: 0 }}
      tabIndex={0}
      type="button"
      aria-label="Sign in with Google"
      onClick={() => login()}
    >
      <svg width="20" height="20" viewBox="0 0 48 48" className="mr-1">
        <g>
          <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.64 2.36 30.74 0 24 0 14.82 0 6.73 5.06 2.69 12.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/>
          <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.66 7.03l7.2 5.6C43.98 37.13 46.1 31.36 46.1 24.55z"/>
          <path fill="#FBBC05" d="M10.67 28.64A14.5 14.5 0 019.5 24c0-1.6.27-3.15.77-4.64l-7.98-6.2A23.94 23.94 0 000 24c0 3.77.9 7.34 2.49 10.44l8.18-5.8z"/>
          <path fill="#EA4335" d="M24 48c6.48 0 11.92-2.15 15.89-5.85l-7.2-5.6c-2.01 1.35-4.6 2.15-8.69 2.15-6.38 0-11.87-3.63-14.33-8.94l-8.18 5.8C6.73 42.94 14.82 48 24 48z"/>
          <path fill="none" d="M0 0h48v48H0z"/>
        </g>
      </svg>
      <span>Sign in with Google</span>
    </button>
  );
} 