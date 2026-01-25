import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-3.5rem)]">
        {/* We let the page render the sidebar because it needs data fetching logic tied to state */}
        {children}
    </div>
  );
}
