import { SupabaseClient } from "@supabase/supabase-js";

export async function createCollection(supabase: SupabaseClient, title: string, description?: string, isPublic: boolean = true) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("User must be logged in");

  const { data, error } = await supabase
    .from("collections")
    .insert([
      {
        user_id: user.id,
        title,
        description,
        is_public: isPublic,
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export type NewRepoData = {
  collection_id: string;
  owner: string;
  repo_name: string;
  full_name: string; // e.g. "owner/repo"
  description?: string;
  note?: string;
  position?: number;
};

export async function addRepoToCollection(supabase: SupabaseClient, repoData: NewRepoData) {
  const { data, error } = await supabase
    .from("collection_repos")
    .insert([repoData])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
       throw new Error("This repository is already in the collection.");
    }
    throw error;
  }
  return data;
}

export async function deleteCollection(supabase: SupabaseClient, collectionId: string) {
  const { error } = await supabase
    .from("collections")
    .delete()
    .eq("id", collectionId);

  if (error) throw error;
}

export async function updateCollection(supabase: SupabaseClient, collectionId: string, updates: { title?: string; description?: string }) {
  const { data, error } = await supabase
    .from("collections")
    .update(updates)
    .eq("id", collectionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeRepoFromCollection(supabase: SupabaseClient, repoId: string) {
  const { error } = await supabase
    .from("collection_repos")
    .delete()
    .eq("id", repoId);

  if (error) throw error;
}

export async function updateRepoNote(supabase: SupabaseClient, repoId: string, note: string) {
  const { data, error } = await supabase
    .from("collection_repos")
    .update({ note })
    .eq("id", repoId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function upsertProfile(supabase: SupabaseClient, profileData: {
  id: string;
  github_username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
}) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(profileData, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function reorderCollections(supabase: SupabaseClient, updates: { id: string; position: number }[]) {
  const { error } = await supabase
    .from("collections")
    .upsert(updates, { onConflict: 'id', ignoreDuplicates: false })
    .select('id, position');

  if (error) throw error;
}

export async function reorderRepos(supabase: SupabaseClient, updates: { id: string; position: number }[]) {
  const { error } = await supabase
    .from("collection_repos")
    .upsert(updates, { onConflict: 'id', ignoreDuplicates: false })
    .select('id, position');

  if (error) throw error;
}
