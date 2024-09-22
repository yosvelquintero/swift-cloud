import { Types } from 'mongoose';

export interface IPlay {
  month: Date;
  count: number;
}

export interface ISong {
  _id?: string;
  id?: string;
  title: string;
  albumIds: Types.ObjectId[];
  artistIds: Types.ObjectId[];
  featuringArtistIds: Types.ObjectId[];
  writerIds: Types.ObjectId[];
  year: number;
  plays: IPlay[];
  created: Date;
  updated: Date;
}
