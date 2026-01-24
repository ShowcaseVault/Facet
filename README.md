# Facet — A Better Way to Showcase Your GitHub Work

GitHub is an excellent platform for hosting code, but it’s not built for **organizing and presenting your work in a meaningful way**. As your repository count grows, your profile becomes a long chronological list that doesn’t reflect your focus, interests, or strengths.

**Facet solves this by adding a lightweight, curated layer on top of GitHub.**  
It lets you group your repositories into collections that reflect your interests and the stories behind your projects — making it easier for recruiters, interviewers, and collaborators to understand what you care about and what you’ve built.

---

## The Problem

GitHub profiles are difficult to navigate when you have multiple projects.  
There is no way to:

- Group related repos
- Show which domains you specialize in
- Highlight your best work in a clean way
- Provide context or notes for each project
- Organize repos by skill, interest, or learning path

This makes it hard for others to quickly understand your strengths or your project journey.

---

## The Solution

**Facet adds a curated presentation layer on top of GitHub’s public data.**

Instead of forcing users to scroll through a long list of repositories, Facet lets them:

- Create **collections** (e.g., “AI Systems”, “Backend Tools”, “Mobile Projects”)
- Add repos to collections using a simple repo picker
- Add short notes explaining the purpose and key takeaways of each repo
- Share a clean public profile link that shows their work the way they want

Facet does **not** host code or modify GitHub repositories.  
It only uses GitHub as the source of truth and displays the repos in an organized way.

---

## Core Logic

1. **User signs in with GitHub (read-only)**  
   Facet uses GitHub OAuth to authenticate users without needing write access.

2. **Fetch public repositories**  
   Facet reads the user’s public repos via GitHub REST APIs.

3. **Create collections**  
   Users group repos into collections that reflect their interests and skills.

4. **Add notes & order repos**  
   Users add context and arrange repos in the order they want them to appear.

5. **Public showcase page**  
   Anyone can view the user’s curated profile and collections.

---

## Tech Stack

Facet is built using a **resource-efficient stack** that is optimized for cost and simplicity:

### Frontend
- **Next.js (React)**  
  Handles UI, routing, and server-side rendering.

### Backend & Database
- **Supabase**  
  Handles authentication, database, and security.

### Hosting
- **Vercel (Free Tier)**  
  Hosts the frontend and serverless functions.

### External Data Source
- **GitHub REST API**  
  Used only for reading public repo information.

---

## Why Facet Matters

### For Developers
- Showcase work with intention
- Build a clean, story-driven portfolio
- Highlight skills and interests clearly
- Avoid relying on GitHub’s default repo list

### For Recruiters & Interviewers
- Quickly understand a candidate’s focus
- See relevant projects grouped by topic
- Gain context without needing to open every repo

### For Everyone
- A simple, public way to present ideas
- A clean alternative to raw GitHub profiles
- A structured view of your project journey

---
## License

This project is licensed under the **MIT License**.

© 2026 [ShowcaseVault](https://github.com/ShowcaseVault).  
Designed and developed by [Vishal Sigdel](https://github.com/Page-Vishal)[Page-Vishal].


