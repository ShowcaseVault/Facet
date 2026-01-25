import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && session?.user) {
      // Sync Profile
      const { user } = session;
      const githubUsername = user.user_metadata?.preferred_username || user.user_metadata?.user_name;
      
      if (githubUsername) {
         try {
           const { upsertProfile } = await import('@/lib/supabase/mutations');
           await upsertProfile(supabase, {
             id: user.id,
             github_username: githubUsername,
             display_name: user.user_metadata?.full_name || githubUsername,
             avatar_url: user.user_metadata?.avatar_url || "",
             bio: user.user_metadata?.bio || ""
           });
         } catch (syncError) {
           console.error("Profile sync failed in callback:", syncError);
         }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
