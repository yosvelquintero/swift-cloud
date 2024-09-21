export interface IDatabase {
  mongodb: {
    collections: {
      names: {
        albums: string;
        artists: string;
        songs: string;
        writers: string;
      };
      refs: {
        album: string;
        artist: string;
        song: string;
        writer: string;
      };
    };
  };
}
