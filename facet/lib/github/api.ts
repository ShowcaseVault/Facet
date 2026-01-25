const GITHUB_BASE_URL = "https://api.github.com";

/**
 * Fetch GitHub user profile
 */
export async function getGitHubUser(username: string) {
  const res = await fetch(`${GITHUB_BASE_URL}/users/${username}`);
  if (!res.ok) throw new Error("User not found");
  return res.json();
}

/**
 * Fetch GitHub user repositories with pagination
 */
export async function getGitHubUserRepos(
  username: string,
  page = 1,
  perPage = 10,
) {
  const res = await fetch(
    `${GITHUB_BASE_URL}/users/${username}/repos?sort=updated&per_page=${perPage}&page=${page}`,
  );
  if (!res.ok) throw new Error("Failed to fetch user repositories");
  return res.json();
}

/**
 * Fetch specific repository details
 */
export async function getGitHubRepo(owner: string, repo: string) {
  const res = await fetch(`${GITHUB_BASE_URL}/repos/${owner}/${repo}`);
  if (!res.ok) throw new Error("Repository not found");
  return res.json();
}

/**
 * Fetch repository readme (returns Base64)
 */
export async function getGitHubRepoReadme(owner: string, repo: string) {
  const res = await fetch(`${GITHUB_BASE_URL}/repos/${owner}/${repo}/readme`);
  if (!res.ok) throw new Error("Readme not found");
  return res.json();
}

/**
 * Fetch languages used in a repository
 */
export async function getGitHubRepoLanguages(owner: string, repo: string) {
  const res = await fetch(
    `${GITHUB_BASE_URL}/repos/${owner}/${repo}/languages`,
  );
  if (!res.ok) throw new Error("Failed to fetch languages");
  return res.json();
}
