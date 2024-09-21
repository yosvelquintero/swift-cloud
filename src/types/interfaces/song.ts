import { Types } from 'mongoose';

export interface IPlay {
  month: Date;
  count: number;
}

export interface ISong {
  _id?: string;
  id?: string;
  title: string;
  artists: Types.ObjectId[];
  writers: Types.ObjectId[];
  albums: Types.ObjectId[];
  year: number;
  plays: IPlay[];
  created: Date;
  updated: Date;
}
