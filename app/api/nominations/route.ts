import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const nomination = await request.json();
    const backlogPath = path.join(process.cwd(), 'data', 'backlog.json');
    let backlog: any[] = [];
    if (fs.existsSync(backlogPath)) {
      backlog = JSON.parse(fs.readFileSync(backlogPath, 'utf8'));
    }
    backlog.push(nomination);
    fs.writeFileSync(backlogPath, JSON.stringify(backlog, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    let message = "Unknown error";
    if (typeof error === "object" && error && "message" in error) {
      message = (error as any).message;
    }
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

