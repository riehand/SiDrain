"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const user = session?.user
    ? {
        id: parseInt(session.user.id),
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        address: session.user.address,
        phone: session.user.phone,
      }
    : null;

  const login = async (email, password) => {
    try {
      const result = await nextAuthSignIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // NextAuth v5 returns "CredentialsSignin" as the error type
        return { success: false, message: "Email atau password salah" };
      }

      // Wait briefly for session to update
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Email atau password salah" };
    }
  };

  const register = async (data) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        return { success: false, message: result.error };
      }

      // Auto login after register
      const loginResult = await nextAuthSignIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (loginResult?.error) {
        return { success: false, message: "Registrasi berhasil, tapi gagal login otomatis. Silakan login manual." };
      }

      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, message: "Terjadi kesalahan pada server" };
    }
  };

  const logout = async () => {
    await nextAuthSignOut({ redirect: false });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
