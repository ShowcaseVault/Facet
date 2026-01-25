import { SupabaseClient } from "@supabase/supabase-js";

export type Collection = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_public: boolean;
  position: number;
  created_at: string;
  count?: number; // Added count field
};

export type CollectionRepo = {
  id: string;
  collection_id: string;
  owner: string;
  repo_name: string;
  full_name: string;
  description: string | null;
  note: string | null;
  position: number;
  created_at: string;
};

export async function getUserCollections(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("collections")
    .select("*, collection_repos(count)")
    .eq("user_id", userId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  
  // Transform the response to flatten the count
  return data.map((collection: any) => ({
    ...collection,
    count: collection.collection_repos?.[0]?.count || 0
  })) as Collection[];
}

export async function getCollectionRepos(supabase: SupabaseClient, collectionId: string, page = 1, perPage = 10) {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error, count } = await supabase
    .from("collection_repos")
    .select("*", { count: "exact" })
    .eq("collection_id", collectionId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data: data as CollectionRepo[], count: count || 0 };
}

export async function getProfileByUsername(supabase: SupabaseClient, username: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .ilike("github_username", username)
    .single();

  if (error) return null; // Return null if not found
  return data;
}

export async function getAllUserRepoFullNames(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("collection_repos")
    .select("full_name, collections!inner(user_id)")
    .eq("collections.user_id", userId);

  if (error) throw error;
  return data.map((r: any) => r.full_name);
}
