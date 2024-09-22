# SwiftCloud

**The #1 app for Taylor Swifties!**

This is a NestJS project that provides a flexible API for song data, including songs, artists, writers, and albums. The API is built using MongoDB and is designed to be scalable and maintainable.

## Features

- **CRUD Operations**: Manage songs, artists, writers, and albums.
- **Advanced Queries**: Support complex queries for powerful frontend capabilities.
- **Normalized Database Schema**: Efficient data management with MongoDB.
- **Modular Architecture**: Easy to extend and maintain.
- **API Documentation**: Integrated Swagger UI for API exploration.
- **Validation and Error Handling**: Robust input validation and consistent error responses.

## Project setup

```bash
# install dependencies
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Import data

```bash
# import data
$ npm run import path/to/your/file.csv
```

### Normalization and Replacements in Names and Titles

During the import process of song data from the CSV file, several normalization steps are performed to ensure consistency and accuracy in the database. This involves cleaning up artist names, writer names, album titles, and song titles by removing footnotes, special characters, and unnecessary whitespace. Understanding these replacements is crucial for maintaining data integrity.

#### Replacements in Names

##### Removing Footnotes from Names

Footnotes often appear in names within square brackets, such as `[a]`, `[b]`, etc. These footnotes are removed to standardize artist and writer names.

Example:

- Original name: Taylor Swift[a]
- Normalized name: Taylor Swift

##### Normalizing Artist and Writer Names

- Line Breaks: Line breaks within names are replaced with spaces to handle multiline entries.
- Whitespace: Leading and trailing whitespace is removed.
- Splitting Names: Multiple names are split using commas, the word and, or the ampersand symbol &.

Example:

- Original name: Taylor Swift, Liz Rose

```plaintext
Taylor Swift
Max Martin
Shellback
```

- Normalized names: Taylor Swift, Max Martin, Shellback

### Replacements in Album Titles

#### Removing Footnotes from Titles

Album titles may include footnotes to indicate special types or editions. These footnotes are mapped to standardized album types and removed from the title.

- Footnote Mapping:
  - None ➔ none: SINGLE,
  - None[a] ➔ Album Type: REMIX
  - None[b] ➔ Album Type: PROMO
  - And so on.
- Example:
  - Original Title: None[a]
  - Normalized Title: None
  - Album Type: REMIX

#### Removing Line Breaks and Spaces

- Line Breaks: Line breaks within album titles are replaced with a separator (e.g.,`-`).
- Whitespace: Leading and trailing whitespace is removed.

Example:

- Original title:

```plaintext
Speak Now
(Deluxe edition)
```

- Normalized title: Speak Now - Deluxe edition

#### Replacements in Song Titles

Song titles undergo similar normalization steps as names and album titles:

- Removing Footnotes: Footnotes within song titles are removed.
- Line Breaks: Line breaks are replaced with spaces.
- Whitespace: Leading and trailing whitespace is removed.

Example:

- Original title:

```plaintext
I Don't Wanna Live Forever
```

- Normalized title: I Don't Wanna Live Forever

### Other Important Replacements

#### Replacing Special Characters

- Ampersands and Conjunctions: When splitting names, variations of `and`, `&` are standardized to ensure consistent parsing.

#### Normalizing Case

- Lowercasing: Album titles are converted to lowercase when matching against predefined mappings or types.

#### Removing Metadata Annotations

- Bracketed Metadata: Annotations or metadata within square brackets in names or titles are removed to clean up the data.

#### Album Types Mapping Details

Here is what each key-value pair represents:

- `none` ➔ `EAlbumType.SINGLE`
  - Indicates the song is released as a single without an associated album.
- `none[a]` ➔ `EAlbumType.REMIX`
  - Represents a remix version of a song.
- `none[b]` ➔ `EAlbumType.PROMO`
  - Denotes a promotional release.
- `none[c]` ➔ `EAlbumType.LIVE`
  - Signifies a live performance recording.
- `none[d]` ➔ `EAlbumType.SOUNDTRACK`
  - Indicates the song is part of a movie or game soundtrack.
- `none[e]` ➔ `EAlbumType.STANDARD`
  - Represents a standard album release.
- `none[f]` ➔ `EAlbumType.OTHER`
  - Covers any other album types not specifically categorized.

### Importance of Replacements

- **Data Consistency**: Ensures that all names and titles follow a uniform format, reducing discrepancies.
- **Accurate Matching**: Facilitates the correct identification of existing records in the database, preventing duplicates.
- **Clean Data**: Removes unnecessary annotations and footnotes that are not essential, leading to a cleaner dataset.
- **Improved Searchability**: Standardized data enhances search functionality and retrieval accuracy within the application.

## Resources

This project was built using the [NestJS](https://nestjs.com) framework. Below are some resources to help you get started with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Stay in touch

- Author - [Yosvel Quintero](https://x.com/yosvelquintero)

## License

SwiftCloud is [MIT licensed](https://opensource.org/licenses/MIT).
