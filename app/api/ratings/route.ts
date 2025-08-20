import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const rating = await request.json();
    const ratingsPath = path.join(process.cwd(), 'data', 'ratings.json');
    let ratings: any[] = [];
    if (fs.existsSync(ratingsPath)) {
      ratings = JSON.parse(fs.readFileSync(ratingsPath, 'utf8'));
    }
    ratings.push(rating);
    fs.writeFileSync(ratingsPath, JSON.stringify(ratings, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    let message = "Unknown error";
    if (typeof error === "object" && error && "message" in error) {
      message = (error as any).message;
    }
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
