import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { generateProfessionalEvidence, getProfessionalEvidence } from "@/lib/professional-evidence";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.studentProfileId) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    // Try to get existing evidence
    const existingEvidence = await getProfessionalEvidence(user.studentProfileId);

    if (existingEvidence) {
      return NextResponse.json(existingEvidence);
    }

    // Generate new evidence if none exists
    const newEvidence = await generateProfessionalEvidence(user.studentProfileId);
    return NextResponse.json(newEvidence);
  } catch (error) {
    console.error("Professional evidence error:", error);
    return NextResponse.json(
      { error: "Failed to fetch professional evidence" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.studentProfileId) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    // Force regenerate evidence
    const evidence = await generateProfessionalEvidence(user.studentProfileId);
    return NextResponse.json(evidence);
  } catch (error) {
    console.error("Professional evidence generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate professional evidence" },
      { status: 500 }
    );
  }
}
