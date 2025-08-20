import {NextResponse} from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    const albumsPath = path.join(process.cwd(), 'data', 'albums.json');
    const backlogPath = path.join(process.cwd(), 'data', 'backlog.json');
    let albums = [];
    let backlog = [];
    if (fs.existsSync(albumsPath)) {
      albums = JSON.parse(fs.readFileSync(albumsPath, 'utf8'));
    }
    if (fs.existsSync(backlogPath)) {
      backlog = JSON.parse(fs.readFileSync(backlogPath, 'utf8'));
    }
    // Find the next album without pickedAt
    let nextAlbum = albums.find((album: any) => !album.pickedAt);
    if (!nextAlbum) {
      // If no unpicked album, promote the first nomination from backlog
      if (backlog.length > 0) {
        const nomination = backlog.shift();
        nomination.pickedAt = new Date().toISOString();
        // Ensure nomination has an id
        if (!nomination.id) {
          nomination.id = 'album_' + Date.now();
        }
        albums.push(nomination);
        // Save updated albums and backlog
        fs.writeFileSync(albumsPath, JSON.stringify(albums, null, 2), 'utf8');
        fs.writeFileSync(backlogPath, JSON.stringify(backlog, null, 2), 'utf8');
        return NextResponse.json({success: true, album: nomination});
      } else {
        return NextResponse.json({success: false, error: 'No unpicked album or nomination found.'}, {status: 404});
      }
    } else {
      nextAlbum.pickedAt = new Date().toISOString();
      fs.writeFileSync(albumsPath, JSON.stringify(albums, null, 2), 'utf8');
      return NextResponse.json({success: true, album: nextAlbum});
    }
  } catch (error) {
    let message = "Unknown error";
    if (typeof error === "object" && error && "message" in error) {
      message = (error as any).message;
    }
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}
