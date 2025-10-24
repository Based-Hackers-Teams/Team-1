import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Incoming body:", body);
    const { fid, username, pfp_url, display_name } = body;

    if (!fid || typeof fid !== "number") {
      return NextResponse.json(
        { error: "Missing or invalid fid", body },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .upsert(
        { fid, username, pfp_url, display_name },
        { onConflict: "fid" } 
      )
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error creating user:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
