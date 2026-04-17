"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function CitizenLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "citizen")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "citizen") return null;

  return (
    <div className="min-h-screen bg-gradient-main">
      <Sidebar role="citizen" />
      {/* pt-14 = mobile top bar height, pb-16 = mobile bottom nav height */}
      <main className="pt-16 pb-20 px-4 sm:px-6 lg:pt-0 lg:pb-0 lg:ml-64 lg:p-8 min-h-screen transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
