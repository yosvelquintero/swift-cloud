export interface IDatabase {
  mongodb: {
    collections: {
      names: {
        albums: string;
        songs: string;
        artists: string;
        writers: string;
      };
      populates: {
        albums: string;
        songs: string;
        artists: string;
        featuringArtists: string;
        writers: string;
      };
      refs: {
        album: string;
        song: string;
        artist: string;
        writer: string;
      };
      localFields: {
        albumIds: string;
        songIds: string;
        artistIds: string;
        featuringArtistIds: string;
        writerIds: string;
      };
    };
  };
}
