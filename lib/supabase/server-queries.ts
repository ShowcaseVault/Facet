import { createClient } from "./server";
import { 
  getUserCollections as getUserCollectionsBase,
  getCollectionRepos as getCollectionReposBase,
  getProfileByUsername as getProfileByUsernameBase,
  getAllUserRepoFullNames as getAllUserRepoFullNamesBase
} from "./queries";

export async function getUserCollections(userId: string) {
  const supabase = await createClient();
  return getUserCollectionsBase(supabase, userId);
}

export async function getCollectionRepos(collectionId: string, page = 1, perPage = 10) {
  const supabase = await createClient();
  return getCollectionReposBase(supabase, collectionId, page, perPage);
}

export async function getProfileByUsername(username: string) {
  const supabase = await createClient();
  return getProfileByUsernameBase(supabase, username);
}

export async function getAllUserRepoFullNames(userId: string) {
  const supabase = await createClient();
  return getAllUserRepoFullNamesBase(supabase, userId);
}
