// Email capture + storage
import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/lib/db/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email?.trim().toLowerCase();

    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { message: "Valid email is required." },
        { status: 400 },
      );
    }

    const emailId = await createLead(trimmedEmail);

    return NextResponse.json(
      { message: "Email captured and stored!", id: emailId },
      { status: 200 },
    );
  } catch (error) {
  console.error("Error occurred while capturing email:", error);

  if (error instanceof Error && error.message === "DUPLICATE_EMAIL") {
    return NextResponse.json(
      { message: "This email is already on our list!" },
      { status: 200 }, 
    );
  }

  return NextResponse.json(
    { message: "Error occurred while capturing email" },
    { status: 500 },
  );
}
}
