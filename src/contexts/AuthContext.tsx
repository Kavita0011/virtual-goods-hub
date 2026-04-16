import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/integrations/neon/client";
import { useNavigate } from "react-router-dom";
import type { User, Session } from "@neondatabase/auth";

type Profile = {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "admin" | "seller" | "buyer";
  membership_status: "free" | "member";
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await authClient.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = authClient.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data: { user: neonUser } } = await authClient.getUser(userId);
    if (neonUser) {
      setProfile({
        id: neonUser.id,
        user_id: neonUser.id,
        full_name: neonUser.name,
        avatar_url: neonUser.image,
        role: "buyer",
        membership_status: "free",
      });
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await authClient.signUp({
      email,
      password,
      options: {
        data: { name: fullName, role },
        emailRedirectTo: redirectTo,
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await authClient.signInWithPassword({
      email,
      password,
      options: {
        redirectTo,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await authClient.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
