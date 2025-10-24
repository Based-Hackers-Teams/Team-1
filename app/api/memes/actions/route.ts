import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, meme_id, user_id, comment } = body;

    if (!action || !meme_id || !user_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Map action to the corresponding field to increment
    const field =
      action === "like"
        ? "likes"
        : action === "repost"
        ? "recasts"
        : action === "comment"
        ? "replies"
        : null;

    if (!field) {
      return NextResponse.json(
        { error: "Invalid action type" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc("increment_meme_counter", {
      meme_id: meme_id,
      counter_name: field,
    });

    if (error) {
      console.error("Error inserting interaction:", error);
      return NextResponse.json(
        { error: error.message || String(error) },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error in memes/actions:", error.message || error);
    return NextResponse.json(
      { error: error.message || String(error) },
      { status: 500 }
    );
  }
}
