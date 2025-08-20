import * as fs from "fs";
import * as path from "path";
import { Album, Rating, BacklogAlbum } from "../types";

export class DataService {
  private static getDataPath(filename: string): string {
    return path.join(process.cwd(), 'data', filename);
  }

  // Read operations
  static readAlbums(): Album[] {
    try {
      const data = fs.readFileSync(this.getDataPath('albums.json'), 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading albums:', error);
      return [];
    }
  }

  static readRatings(): Rating[] {
    try {
      const data = fs.readFileSync(this.getDataPath('ratings.json'), 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading ratings:', error);
      return [];
    }
  }

  static readBacklog(): BacklogAlbum[] {
    try {
      const data = fs.readFileSync(this.getDataPath('backlog.json'), 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading backlog:', error);
      return [];
    }
  }

  // Write operations
  static writeBacklog(backlog: BacklogAlbum[]): void {
    try {
      const filePath = this.getDataPath('backlog.json');
      fs.writeFileSync(filePath, JSON.stringify(backlog, null, 2), 'utf8');
    } catch (error) {
      console.error('Error writing backlog:', error);
    }
  }

  static writeRatings(ratings: Rating[]): void {
    try {
      const filePath = this.getDataPath('ratings.json');
      fs.writeFileSync(filePath, JSON.stringify(ratings, null, 2), 'utf8');
    } catch (error) {
      console.error('Error writing ratings:', error);
    }
  }

  // Utility
  static generateCustomId(): string {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}