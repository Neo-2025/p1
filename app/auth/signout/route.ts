import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // Sign out the user
  await supabase.auth.signOut();
  
  // Redirect to login page
  return NextResponse.redirect(new URL("/auth/login", req.url), {
    status: 302,
  });
} 