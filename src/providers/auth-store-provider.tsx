"use client";

import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { Profile } from "@/types/auth";
import { useEffect } from "react";

export default function AuthStoreProvider({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: Profile;
}) {
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      useAuthStore.getState().setUser(user);
      useAuthStore.getState().setProfile(profile);
    });
  });

  return <>{children}</>;
}
