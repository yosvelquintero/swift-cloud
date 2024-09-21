import { DeepReadonly } from 'ts-essentials';

import { IDatabase } from '@app/types';

export const DATABASE: DeepReadonly<IDatabase> = {
  mongodb: {
    collections: {
      names: {
        albums: 'dev.albums',
        artists: 'dev.artists',
        songs: 'dev.songs',
        writers: 'dev.writers',
      },
      populates: {
        albums: 'albums',
        artists: 'artists',
        songs: 'songs',
        writers: 'writers',
      },
      refs: {
        album: 'Album',
        artist: 'Artist',
        song: 'Song',
        writer: 'Writer',
      },
    },
  },
};
