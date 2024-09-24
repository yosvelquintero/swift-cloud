import { DeepReadonly } from 'ts-essentials';

import { IDatabase } from '../../types';

export const DATABASE: DeepReadonly<IDatabase> = {
  mongodb: {
    collections: {
      names: {
        albums: 'albums',
        songs: 'songs',
        artists: 'artists',
        writers: 'writers',
      },
      populates: {
        albums: 'albums',
        songs: 'songs',
        artists: 'artists',
        featuringArtists: 'featuringArtists',
        writers: 'writers',
      },
      refs: {
        album: 'Album',
        song: 'Song',
        artist: 'Artist',
        writer: 'Writer',
      },
      localFields: {
        albumIds: 'albumIds',
        songIds: 'songIds',
        artistIds: 'artistIds',
        featuringArtistIds: 'featuringArtistIds',
        writerIds: 'writerIds',
      },
    },
  },
};
