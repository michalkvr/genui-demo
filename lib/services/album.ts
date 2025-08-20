import { Album, Rating, BacklogAlbum, CommentWithRating, AlbumRatingsResult } from "../types";
import { DataService } from "./data";

export class AlbumService {
  static getCurrentWeekAlbum(): { album: Album | BacklogAlbum; isNomination: boolean } | null {
    const albums = DataService.readAlbums();
    const backlog = DataService.readBacklog();
    
    const currentAlbum = albums
      .filter(album => album.pickedAt)
      .sort((a, b) => new Date(b.pickedAt!).getTime() - new Date(a.pickedAt!).getTime())[0];
    
    const latestNomination = backlog.length > 0 ? backlog[backlog.length - 1] : null;

    let showAlbum = currentAlbum;
    let isNomination = false;
    
    if (latestNomination) {
      // If there is a nomination and either no album or the album is older than the nomination
      if (!currentAlbum || (currentAlbum && latestNomination.id && currentAlbum.pickedAt && 
          parseInt(latestNomination.id.split('_')[1]) > new Date(currentAlbum.pickedAt).getTime())) {
        showAlbum = latestNomination;
        isNomination = true;
      }
    }

    return showAlbum ? { album: showAlbum, isNomination } : null;
  }

  static getAlbumRatings(albumId: string): AlbumRatingsResult {
    const ratings = DataService.readRatings().filter(r => r.albumId === albumId);
    const avg = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length 
      : null;
    
    const comments: CommentWithRating[] = ratings
      .filter(r => r.comment)
      .map(r => ({
        user: r.user,
        comment: r.comment!,
        score: r.score
      }));

    return {
      albumId,
      avg,
      count: ratings.length,
      comments
    };
  }

  static getAlbumRatingsStats(albumId: string): { avg: number | null; count: number } {
    const ratings = DataService.readRatings().filter(r => r.albumId === albumId);
    const avg = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length 
      : null;
    
    return { avg, count: ratings.length };
  }

  static getBacklogAlbums(limit?: number): BacklogAlbum[] {
    const backlog = DataService.readBacklog();
    return limit ? backlog.slice(0, limit) : backlog;
  }

  static getAllRatings(): { ratings: Rating[]; albums: Album[] } {
    return {
      ratings: DataService.readRatings(),
      albums: DataService.readAlbums()
    };
  }

  static getAllComments(): { ratings: Rating[]; albums: Album[] } {
    return {
      ratings: DataService.readRatings(),
      albums: DataService.readAlbums()
    };
  }
}