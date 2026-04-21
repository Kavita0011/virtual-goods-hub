import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const next = searchParams.get("next") ?? "/dashboard";
      
      if (token) {
        const { error } = await signIn(token, "oauth-token");
        
        if (!error) {
          navigate(next, { replace: true });
        } else {
          navigate("/auth", { replace: true });
        }
      } else {
        navigate("/auth", { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, navigate, signIn]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;