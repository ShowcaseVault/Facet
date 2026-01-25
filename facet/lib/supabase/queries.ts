import { createClient } from "./server";

export type Collection = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_public: boolean;
  position: number;
  created_at: string;
};

export type CollectionRepo = {
  id: string;
  collection_id: string;
  owner: string;
  repo_name: string;
  full_name: string;
  note: string | null;
  position: number;
  created_at: string;
};

export async function getUserCollections(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("user_id", userId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Collection[];
}

export async function getCollectionRepos(collectionId: string, page = 1, perPage = 10) {
  const supabase = await createClient();
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

export async function getProfileByUsername(username: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("github_username", username)
    .single();

  if (error) return null; // Return null if not found
  return data;
}
