import { Types } from 'mongoose';

export interface IAlbum {
  _id?: string;
  id?: string;
  title: string;
  artistIds: Types.ObjectId[];
  songIds: Types.ObjectId[];
  year: number;
  created: Date;
  updated: Date;
}
