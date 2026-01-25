import { notFound } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/shared/Sidebar";
import { RepoList } from "@/components/shared/RepoList";
import { getProfileByUsername, getUserCollections, getCollectionRepos, getAllUserRepoFullNames } from "@/lib/supabase/server-queries";
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

  // Initialize data variables
  let collections: any[] = [];
  let repos: any[] = [];
  let totalReposCount = 0;
  let activeCollectionId = collectionId;
  let displayName = username;
  let avatarUrl = "";
  let bio = "";
  let categorizedRepoNames: string[] = [];

  // 1. Fetch GitHub User Data (Directly from GitHub API)
  let gitHubUser: any = null;
  try {
    gitHubUser = await getGitHubUser(username);
  } catch (e) {
    return notFound();
  }

  displayName = gitHubUser.name || gitHubUser.login;
  avatarUrl = gitHubUser.avatar_url;
  bio = gitHubUser.bio || "";
  totalReposCount = gitHubUser.public_repos;

  // 2. Check if registered on Facet
  const profile = await getProfileByUsername(username);
  let isFacetUser = !!profile;

  if (isFacetUser && profile) {
    const [userCollections, allCategorized] = await Promise.all([
      getUserCollections(profile.id),
      getAllUserRepoFullNames(profile.id)
    ]);
    
    categorizedRepoNames = allCategorized;
    displayName = profile.display_name || displayName;
    avatarUrl = profile.avatar_url || avatarUrl;
    bio = profile.bio || bio;
    
    // Combine virtual "Other" collection with DB collections
    collections = [
      ...userCollections,
      { id: "all", title: "All Public Repos", count: Math.max(0, gitHubUser.public_repos - categorizedRepoNames.length) }
    ];
  } else {
    // Just the virtual "All" collection for non-Facet users
    collections = [{ id: "all", title: "All Public Repos", count: gitHubUser.public_repos }];
  }

  // 3. Determine active collection and fetch repos
  if (!activeCollectionId && collections.length > 0) {
    activeCollectionId = collections[0].id;
  }
  
  if (!activeCollectionId) {
    activeCollectionId = "all";
  }

  if (activeCollectionId === "all") {
    if (isFacetUser) {
        // Fetch more to ensure we have enough after filtering (up to 100 for a healthy mix)
        const allGitHubRepos = await getGitHubUserRepos(username, 1, 100);
        const filtered = allGitHubRepos.filter((r: any) => !categorizedRepoNames.includes(r.full_name));
        totalReposCount = filtered.length;
        
        // Paginate local filtered array
        const start = (currentPage - 1) * itemsPerPage;
        repos = filtered.slice(start, start + itemsPerPage);
    } else {
        repos = await getGitHubUserRepos(username, currentPage, itemsPerPage);
        totalReposCount = gitHubUser.public_repos;
    }
  } else {
    const { data, count } = await getCollectionRepos(activeCollectionId, currentPage, itemsPerPage);
    repos = data;
    totalReposCount = count;
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
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">
                        {collections.find(c => c.id === activeCollectionId)?.title || "Repositories"}
                      </h2>
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {Math.ceil(totalReposCount / itemsPerPage) || 1}
                      </span>
                    </div>
                    {collections.find(c => c.id === activeCollectionId)?.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {collections.find(c => c.id === activeCollectionId)?.description}
                      </p>
                    )}
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
                    No repositories found.
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
