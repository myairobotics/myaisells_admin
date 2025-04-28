"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Business, Profile } from "@/types/auth";
import { usePathname, useRouter } from "next/navigation";
import Loader from "@/components/Molecules/Loader";

interface AuthContextType {
  profile: Business | null;
  setProfile: (profile: Business | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const handleSetProfile = (newProfile: Business | null) => {
    setProfile(newProfile);
    if (newProfile) {
      sessionStorage.setItem("profile", JSON.stringify(newProfile));
      setIsAuthenticated(true);
    }
  };
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Business | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedProfile = sessionStorage.getItem("profile");
    const token = sessionStorage.getItem("token");

    const publicRoutes = ["/auth/signin"];

    if (!token && !publicRoutes.includes(pathname)) {
      router.push("/auth/signin");
    } else if (token && publicRoutes.includes(pathname)) {
      router.push("/");
    }
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, [pathname, router]);
  if (isLoading) {
    return <Loader />;
  }

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("profile");
    setProfile(null);
    setIsAuthenticated(false);
    window.location.href = "/auth/signin";
  };

  return (
    <AuthContext.Provider
      value={{ profile, setProfile: handleSetProfile, isAuthenticated, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
