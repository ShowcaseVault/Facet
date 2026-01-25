import { NextResponse } from "next/server";

const GITHUB_BASE_URL = "https://api.github.com";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("perPage") || "30";

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    const url = `${GITHUB_BASE_URL}/users/${username}/repos?sort=updated&per_page=${perPage}&page=${page}`;
    
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
        // Handle GitHub API errors
        if (res.status === 403) {
            return NextResponse.json({ error: "GitHub API rate limit exceeded" }, { status: 403 });
        }
        return NextResponse.json({ error: "Failed to fetch from GitHub" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GitHub Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
