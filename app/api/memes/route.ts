import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Incoming body:", body);
    const { text, image_url, cast_hash, creator_id } = body;

    if (!creator_id || typeof creator_id !== "number") {
      return NextResponse.json(
        { error: "Missing or invalid fid", body },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("memes")
      .insert([{ text, image_url, cast_hash, creator_id }])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error creating meme:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const mine = url.searchParams.get("mine") === "true";
    const fidParam = url.searchParams.get("fid");

    // Fetch memes (latest first) with built-in engagement counts
    const { data: memes, error: memesError } = await supabase
      .from("memes")
      .select(
        "id, text, image_url, cast_hash, creator_id, created_at, likes, replies, recasts"
      )
      .order("created_at", { ascending: false })
      .limit(200);

    if (memesError) throw memesError;

    // If mine filter requested, filter by fidParam or return empty
    let filtered = memes || [];
    if (mine) {
      const fid = fidParam ? Number(fidParam) : null;
      if (!fid) {
        return NextResponse.json({ memes: [] });
      }
      filtered = (filtered as any[]).filter((m) => m.creator_id === fid);
    }

    // Load creators for the memes
    const creatorIds = Array.from(
      new Set((filtered as any[]).map((m) => m.creator_id))
    );
    let creatorsMap: Record<number, any> = {};
    if (creatorIds.length > 0) {
      const { data: usersData } = await supabase
        .from("users")
        .select("fid, username, pfp_url, display_name")
        .in("fid", creatorIds);
      usersData?.forEach((u: any) => {
        creatorsMap[u.fid] = u;
      });
    }

    const payload = (filtered as any[]).map((m) => ({
      id: m.id,
      text: m.text,
      image_url: m.image_url,
      cast_hash: m.cast_hash,
      creator_id: m.creator_id,
      created_at: m.created_at,
      creator: creatorsMap[m.creator_id] || null,
      likes: m.likes || 0,
      replies: m.replies || 0,
      recasts: m.recasts || 0,
    }));

    return NextResponse.json({ memes: payload });
  } catch (error: any) {
    console.error("Error listing memes:", error.message || error);
    return NextResponse.json(
      { error: error.message || String(error) },
      { status: 500 }
    );
  }
}
