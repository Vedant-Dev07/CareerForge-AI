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
      // Delete GitHub connection and all related data
      await tx.gitHubConnection.delete({
        where: { studentProfileId: user.studentProfileId },
      });
    });

    return NextResponse.json({ success: true, message: "GitHub disconnected successfully" });
  } catch (error) {
    console.error("GitHub disconnect error:", error);
    return NextResponse.json(
      { error: "Failed to disconnect GitHub" },
      { status: 500 }
    );
  }
}
