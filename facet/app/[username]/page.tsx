import { notFound } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/shared/Sidebar";
import { RepoList } from "@/components/shared/RepoList";
import { getProfileByUsername, getUserCollections, getCollectionRepos } from "@/lib/supabase/queries";
import { getGitHubUser, getGitHubUserRepos } from "@/lib/github/api";

type Props = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ collection?: string; page?: string }>;
};

export default async function ProfilePage({ params, searchParams }: Props) {
  const { username } = await params;
  const { collection: collectionId, page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const itemsPerPage = 10;

  // 1. Try to fetch from Facet DB
  const profile = await getProfileByUsername(username);

  let collections: any[] = [];
  let repos: any[] = [];
  let totalReposCount = 0;
  let activeCollectionId = collectionId;
  let isFacetUser = !!profile;
  let displayName = username;
  let avatarUrl = "";
  let bio = "";

  if (isFacetUser && profile) {
    // --- AUTHENTICATED FACET USER ---
    displayName = profile.display_name || profile.github_username;
    avatarUrl = profile.avatar_url || "";
    bio = profile.bio || "";
    
    // Fetch collections
    collections = await getUserCollections(profile.id);
    
    // Determine active collection
    if (!activeCollectionId && collections.length > 0) {
      activeCollectionId = collections[0].id;
    }

    if (activeCollectionId) {
      const { data, count } = await getCollectionRepos(activeCollectionId, currentPage, itemsPerPage);
      repos = data;
      totalReposCount = count;
    }
  } else {
    // --- GITHUB FALLBACK USER ---
    try {
      const gitHubUser = await getGitHubUser(username);
      displayName = gitHubUser.name || gitHubUser.login;
      avatarUrl = gitHubUser.avatar_url;
      bio = gitHubUser.bio;
      totalReposCount = gitHubUser.public_repos;

      // Create a "fake" default collection for the UI
      collections = [{ id: "all", title: "All Public Repos", count: gitHubUser.public_repos }];
      activeCollectionId = "all";

      // Fetch public repos for the current page
      repos = await getGitHubUserRepos(username, currentPage, itemsPerPage);
    } catch (e) {
      return notFound();
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      {/* Sidebar Panel */}
      <Sidebar
        mode="view"
        collections={collections}
        activeCollectionId={activeCollectionId}
        className="w-64 flex-shrink-0"
      />

      {/* Main Content Panel */}
      <div className="flex-1 overflow-y-auto bg-background p-8">
        <div className="mx-auto max-w-4xl">
          {/* Profile Header */}
          <div className="mb-8 flex items-start gap-6">
             <img src={avatarUrl} alt={displayName} className="h-24 w-24 rounded-full border-4 border-muted" />
             <div>
                <h1 className="text-3xl font-bold">{displayName}</h1>
                <p className="text-muted-foreground">@{username}</p>
                {bio && <p className="mt-2 max-w-lg text-sm text-foreground/80">{bio}</p>}
                
                {!isFacetUser && (
                    <div className="mt-4 inline-block rounded-md bg-accent/20 px-3 py-1 text-xs text-accent-foreground">
                        Viewing GitHub Profile (Not yet on Facet)
                    </div>
                )}
             </div>
          </div>

          <div className="space-y-6">
             {repos.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      {collections.find(c => c.id === activeCollectionId)?.title || "Repositories"}
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {Math.ceil(totalReposCount / itemsPerPage) || 1}
                    </span>
                  </div>

                  <RepoList 
                    repos={repos} 
                    mode="view" 
                  />

                  {/* Pagination Controls */}
                  {totalReposCount > itemsPerPage && (
                    <div className="flex items-center justify-center gap-4 py-8">
                       <Link 
                        href={`?${new URLSearchParams({ 
                          ...(activeCollectionId && isFacetUser ? { collection: activeCollectionId } : {}), 
                          page: (currentPage - 1).toString() 
                        })}`}
                        className={cn(
                          "px-4 py-2 text-sm font-medium rounded-md border",
                          currentPage <= 1 ? "pointer-events-none opacity-50" : "hover:bg-accent"
                        )}
                       >
                         Previous
                       </Link>
                       <Link 
                        href={`?${new URLSearchParams({ 
                          ...(activeCollectionId && isFacetUser ? { collection: activeCollectionId } : {}), 
                          page: (currentPage + 1).toString() 
                        })}`}
                        className={cn(
                          "px-4 py-2 text-sm font-medium rounded-md border",
                          currentPage * itemsPerPage >= totalReposCount ? "pointer-events-none opacity-50" : "hover:bg-accent"
                        )}
                       >
                         Next
                       </Link>
                    </div>
                  )}
                </>
             ) : (
                <div className="text-center py-20 text-muted-foreground">
                    No repositories found in this collection.
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
