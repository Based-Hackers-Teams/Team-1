**MemeForge** is a Farcaster Miniapp that lets users **create, share, and compete with memes** — directly on the Farcaster network.
Users can post memes, react to others, and climb the global leaderboard through community engagement.

---

##  Features

* 🧑‍🎨 **Trending Cast Feed** — A feed of casts currently trending on farcaster.
* 🪪 **Meme Creation** — Seamlessly remix casts in to relatable memes with an image library to choose from.
* ❤️ **Reactions** — react to memes you love.
* 🏆 **Leaderboard** — See the top meme creators ranked by total engagements.
* 🧩 **Miniapp SDK** — Built using the official Farcaster Miniapp SDK for a smooth in-app experience.
* 💾 **Supabase Backend** — Handles meme storage, user records, and leaderboard aggregation.

---

## Tech Stack

| Layer           | Technology                                                                       |
| --------------- | -------------------------------------------------------------------------------- |
| **Frontend**    | Next.js 14, TypeScript, Tailwind CSS                                |
| **Miniapp SDK** | @farcaster/miniapp-sdk
| **Backend**     | Supabase                                            
| **Storage**     | Supabase and cloudunary (for images)                                                    |
| **Deployment**  | Vercel                                                                           

---

## ⚙️ Project Structure

```
/app
 ├── api/
 │   ├── memes/route.ts         # Handles meme creation/fetching
 │   ├── users/route.ts         # Registers or fetches Farcaster users
 │   
 ├── components/                # UI Components
 ├── hooks/                     # Custom React hooks
 ├── lib/
 │   ├── supabase/              # Supabase client configs
 │   └── utils.ts               # Helper functions
```

---

##  Database Schema

**users**

| Column       | Type        | Description         |
| ------------ | ----------- | ------------------- |
| fid          | bigint (PK) | Farcaster user ID   |
| username     | text        | Farcaster username  |
| display_name | text        | User’s display name |
| pfp_url      | text        | Profile picture URL |
| score     | int                   | score that determines place on the leaderboard |

**memes**

| Column     | Type                    | Description     |
| ---------- | ----------------------- | --------------- |
| id         | uuid (PK)               | Meme ID         |
| creator_id | bigint (FK → users.fid) | Meme creator    |
| caption    | text                    | Meme caption    |
| image_url  | text                    | Meme image link |
| created_at | timestamp               | Time created    |
| likes         | int              | number of likes       |
| replies    | int    | number of replies      |
| recasts    | int | number of recasts     |


##  How It Works

1. When a user opens the miniapp, their Farcaster identity (`fid`, `username`, `pfpUrl`) is fetched via the Miniapp SDK.
2. The user is automatically added to the Supabase `users` table (if not already).
3. They can then **create a meme**, stored in the `memes` table.
4. Other users can **react**, and each reaction updates the **leaderboard**.

---

##   Roadmap (Post Hackathon Win)

1. Integration of pro neynar API key to get live trending casts
2. Live and functional leaderboard
3.  A richer and wider image library
4.  AI assisted captioning

##  Local Development

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/memeforge.git
cd memeforge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create a `.env.local` file with:

```bash
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
NEXT_PUBLIC_CLOUDINARY_CLOUD=<your_cloudinary_cloud_name>
NEXT_PUBLIC_CLOUDINARY_PRESET=<your_cloudinary_upload_preset>
```

### 4. Run the dev server

```bash
npm run dev
```

---

##  Deployment

Deploy seamlessly on **Vercel** — all environment variables can be added in the project dashboard.
Ensure your Supabase project URL and keys match those used locally.



