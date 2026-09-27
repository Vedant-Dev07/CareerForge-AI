import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.studentProfileId) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      // Delete LinkedIn profile and all related data
      await tx.linkedInProfile.delete({
        where: { studentProfileId: user.studentProfileId },
      });
    });

    return NextResponse.json({ success: true, message: "LinkedIn profile removed successfully" });
  } catch (error) {
    console.error("LinkedIn disconnect error:", error);
    return NextResponse.json(
      { error: "Failed to remove LinkedIn profile" },
      { status: 500 }
    );
  }
}
