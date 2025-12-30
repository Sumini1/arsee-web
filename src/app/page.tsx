"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";

export default function Home() {
  const profile = useAuthStore((state) => state.profile);
  console.log(profile);
  return (
    <div className="bg-muted  flex  justify-center items-center h-screen flex-col space-y-4">
      <h1 className="text-3xl font-semibold text-foreground">
        Welcoome {profile.name}
      </h1>
      <Link href={profile.role === "admin" ? "/admin" : "/order"}>
        <Button className="bg-pink-500 hover:bg-pink-600">
          Access Dashboard
        </Button>
      </Link>
    </div>
  );
}
