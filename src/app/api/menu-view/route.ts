import { NextResponse } from "next/server";
import { createClient } from "@/integrations/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cafeId = typeof body?.cafeId === "string" ? body.cafeId : "";

    if (!cafeId) {
      return NextResponse.json({ success: false, error: "cafeId is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("menu_views").insert({
      cafe_id: cafeId,
      referrer: request.headers.get("referer"),
      user_agent: request.headers.get("user-agent"),
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to record menu view";
    return NextResponse.json({ success: false, error: message }, { status: 200 });
  }
}
