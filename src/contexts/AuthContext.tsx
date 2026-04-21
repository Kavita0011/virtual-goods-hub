import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/neon/client";

type User = {
  id: string;
  email: string;
  name?: string;
  image?: string;
};

type Session = {
  user: User;
  expiresAt: Date;
};

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
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const storedSession = localStorage.getItem("session");
      
      if (storedUser && storedSession) {
        const parsedUser = JSON.parse(storedUser);
        const parsedSession = JSON.parse(storedSession);
        setUser(parsedUser);
        setSession(parsedSession);
        fetchProfile(parsedUser.id);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data) {
      setProfile(data as Profile);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    try {
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existingUser) {
        return { error: new Error("Email already registered") };
      }

      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          email,
          password_hash: password,
          full_name: fullName,
          role: role as "admin" | "seller" | "buyer",
        })
        .maybeSingle();

      if (createError) {
        return { error: createError.error as Error };
      }

      if (newUser) {
        await supabase.from("profiles").insert({
          user_id: newUser.id,
          full_name: fullName,
          role: role as "admin" | "seller" | "buyer",
        });
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password_hash", password)
        .maybeSingle();

      if (error || !data) {
        return { error: new Error("Invalid email or password") };
      }

      const user: User = {
        id: data.id,
        email: data.email,
        name: data.full_name,
        image: data.avatar_url,
      };

      const session: Session = {
        user,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      setUser(user);
      setSession(session);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("session", JSON.stringify(session));
      fetchProfile(user.id);

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