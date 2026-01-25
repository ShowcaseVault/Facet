"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

export function HeroSection() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [user, setUser] = React.useState<any>(null);
  const supabase = createClient();

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/${username.trim()}`);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center px-4 py-24 text-center md:py-32">
        {/* Logo / Branding Placeholder */}
        <div className="mb-8 flex items-center justify-center">
            <img src="/logo.png" alt="Facet Logo" className="h-25 w-25 object-contain drop-shadow-xl" />
        </div>

      <h1 className="mb-6 max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
        Showcase Your GitHub Journey
      </h1>
      
      <p className="mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
        Facet turns your chaotic repository list into a curated portfolio. 
        Group your projects, add context, and tell your story.
      </p>

      <form onSubmit={handleSearch} className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
        <Input
          type="text"
          placeholder="GitHub username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="h-11"
        />
        <Button type="submit" size="lg" className="h-11">
          View Profile
        </Button>
      </form>
      
      {!user && (
        <div className="mt-8 text-sm text-muted-foreground">
          or <Link href="/login" className="underline hover:text-primary">Login to create your own</Link>
        </div>
      )}
    </section>
  );
}
