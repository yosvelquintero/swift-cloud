import { Types } from 'mongoose';

export interface IAlbum {
  _id?: string;
  id?: string;
  title: string;
  artists: Types.ObjectId[];
  songs: Types.ObjectId[];
  year: number;
  created: Date;
  updated: Date;
}
