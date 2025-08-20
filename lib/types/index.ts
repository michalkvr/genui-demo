export interface Album {
  id: string;
  title: string;
  artist: string;
  genre?: string;
  coverUrl?: string;
  pickedAt?: string;
}

export interface Rating {
  albumId: string;
  user: string;
  score: number;
  comment?: string;
}

export interface BacklogAlbum {
  id: string;
  title: string;
  artist: string;
  genre?: string;
  coverUrl?: string;
}

export interface CommentWithRating {
  user: string;
  comment: string;
  score: number;
}

export interface AlbumRatingsResult {
  albumId: string;
  avg: number | null;
  count: number;
  comments: CommentWithRating[];
}