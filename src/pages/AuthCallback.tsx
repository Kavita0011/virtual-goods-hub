import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authClient } from "@/integrations/neon/client";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const next = searchParams.get("next") ?? "/dashboard";
      
      if (code) {
        const { error } = await authClient.signInWithOauth({
          code,
          redirectTo: `${window.location.origin}/auth/callback`,
        });
        
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
  }, [searchParams, navigate]);

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

