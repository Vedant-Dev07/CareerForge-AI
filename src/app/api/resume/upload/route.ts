import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.studentProfileId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "Empty file uploaded" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const fileType = file.type === "application/pdf" ? "PDF" : 
                     file.name.endsWith(".docx") ? "DOCX" : null;

    if (!fileType) {
      return NextResponse.json({ error: "Unsupported file type. Please upload PDF or DOCX." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";

    try {
      if (fileType === "PDF") {
        const data = await pdfParse(buffer);
        extractedText = data.text;
      } else if (fileType === "DOCX") {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
      }
    } catch (error) {
      console.error("Extraction error:", error);
      return NextResponse.json({ error: "Unable to extract text from this resume. Please upload a readable PDF or DOCX file." }, { status: 400 });
    }
    
    if (!extractedText || extractedText.trim().length === 0) {
       return NextResponse.json({ error: "Unable to extract text from this resume. Please upload a readable PDF or DOCX file." }, { status: 400 });
    }

    // Determine target career from profile
    const profile = await prisma.studentProfile.findUnique({
      where: { id: user.studentProfileId },
      select: { targetCareerId: true },
    });

    const resume = await prisma.resume.create({
      data: {
        studentProfileId: user.studentProfileId,
        fileName: file.name,
        fileType,
        fileSize: file.size,
        extractedText: extractedText,
        targetCareerId: profile?.targetCareerId,
        status: "UPLOADED",
      },
    });

    return NextResponse.json({ resumeId: resume.id });
  } catch (error) {
    console.error("Resume upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
