import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/neon/client";

type User = { id: string; email: string; name?: string; image?: string; role?: "admin" | "seller" | "buyer" };
type Session = { user: User; expiresAt: Date };
type Profile = { id: string; user_id: string; full_name: string | null; avatar_url: string | null; role: "admin" | "seller" | "buyer"; membership_status: "free" | "member" };
type AuthContextType = {
  user: User | null; session: Session | null; profile: Profile | null; loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateRole: (newRole: "admin" | "seller" | "buyer") => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedSession = localStorage.getItem("session");
    const storedProfile = localStorage.getItem("profile");

    if (storedUser && storedSession) {
      setUser(JSON.parse(storedUser));
      setSession(JSON.parse(storedSession));
      if (storedProfile) setProfile(JSON.parse(storedProfile));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    try {
      const result = await supabase.auth.signup(email, password, fullName, role);
      if (result.error) return { error: new Error(result.error) };

      const u: User = { id: result.user.id, email: result.user.email, name: result.user.full_name, role: result.user.role };
      const s: Session = { user: u, expiresAt: new Date(Date.now() + 7 * 86400000) };

      setUser(u);
      setSession(s);
      localStorage.setItem("user", JSON.stringify(u));
      localStorage.setItem("session", JSON.stringify(s));

      // Fetch profile
      fetchProfile(u.id);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const fetchProfile = async (userId: string) => {
    const result = await supabase.from("profiles").select("*").eq("user_id", userId).execute();
    if (result.data && result.data.length > 0) {
      setProfile(result.data[0] as Profile);
      localStorage.setItem("profile", JSON.stringify(result.data[0]));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.login(email, password);
      if (result.error) return { error: new Error(result.error) };

      const u: User = { id: result.user.id, email: result.user.email, name: result.user.full_name, role: result.user.role };
      const s: Session = { user: u, expiresAt: new Date(result.expiresAt || Date.now() + 7 * 86400000) };

      setUser(u);
      setSession(s);
      localStorage.setItem("user", JSON.stringify(u));
      localStorage.setItem("session", JSON.stringify(s));

      if (result.profile) {
        setProfile(result.profile as Profile);
        localStorage.setItem("profile", JSON.stringify(result.profile));
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setProfile(null);
    localStorage.removeItem("user");
    localStorage.removeItem("session");
    localStorage.removeItem("profile");
  };

  const updateRole = async (newRole: "admin" | "seller" | "buyer") => {
    if (!user) return { error: new Error("Not authenticated") };
    try {
      const result = await supabase.auth.updateRole(user.id, newRole);
      if (result.error) return { error: new Error(result.error) };

      setProfile((prev) => (prev ? { ...prev, role: newRole } : null));
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (profile) localStorage.setItem("profile", JSON.stringify({ ...profile, role: newRole }));

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut, updateRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};