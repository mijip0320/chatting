"use client";
import React from "react";
import { Button } from "./ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function ChatHeader({ user }: { user: User | undefined }) {
  const router = useRouter();

  const handleLoginWithGithub = () => {
    //로그인 시 깃헙 계정과 연결
    const supabase = supabaseBrowser();

    supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: location.origin + "/auth/callback",
      },
    });
  };

  //로그아웃
  const handleLogout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="h-20">
      <div className="p-5 border-b flex items-center justify-between h-full">
        <div>
          <h1 className="text-xl font-bold">Daily Chat</h1>
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-green-500 rounded-full animation-pulse"></div>
            <h1 className="text-sm text-gray-400">2 online</h1>
          </div>
        </div>

        {user ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <Button onClick={handleLoginWithGithub}>Login</Button>
        )}
      </div>
    </div>
  );
}
