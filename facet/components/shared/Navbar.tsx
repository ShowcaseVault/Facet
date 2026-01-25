"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // ... existing auth check ...
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogin = async () => {
     // ... existing login ...
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/${searchQuery.trim()}`);
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex w-full h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
             <img src="/logo.png" alt="Facet Logo" className="h-8 w-8 object-contain" />
             <span className="hidden sm:inline-block">Facet</span>
          </Link>
        </div>

        {/* Search Bar - Center */}
        <div className="hidden md:flex flex-1 items-center justify-center max-w-md mx-4">
            <form onSubmit={handleSearch} className="w-full relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <Input 
                    type="search" 
                    placeholder="Search users..." 
                    className="w-full pl-9 bg-muted/50 focus:bg-background h-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {loading ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted"></div>
          ) : user ? (
            <div className="flex items-center gap-4">
               <Link href="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
               </Link>
               <div className="flex items-center gap-2">
                 {user.user_metadata?.avatar_url && (
                    <Link href={`/${user.user_metadata?.preferred_username || user.user_metadata?.user_name}`}>
                        <img 
                          src={user.user_metadata.avatar_url} 
                          alt="User" 
                          className="h-8 w-8 rounded-full border border-border transition-opacity hover:opacity-80 cursor-pointer" 
                        />
                    </Link>
                 )}
               </div>
               <Button onClick={handleLogout} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                 Sign Out
               </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="gap-2" size="sm">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
