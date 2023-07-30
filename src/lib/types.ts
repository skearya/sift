export interface Anime {
	id: string;
	malId: string;
	slug: string;
	kitsuId: string;
	tvdbId?: string;
	coverImage: string;
	bannerImage: string;
	trailer: string;
	status: string;
	season: string;
	title: Title;
	currentEpisode?: number;
	mappings: Mapping[];
	synonyms: string[];
	countryOfOrigin?: string;
	description: string;
	duration: number;
	color?: string;
	year?: number;
	rating: Rating;
	popularity: Rating;
	type: string;
	format: string;
	relations: Relation[];
	totalEpisodes: number;
	genres: string[];
	tags: string[];
	episodes: Episodes;
	averageRating?: number;
	averagePopularity?: number;
	artwork: Artwork[];
}

interface Artwork {
	img: string;
	type: string;
	providerId: string;
}

interface Episodes {
	data: Datum[];
	updatedAt: number | string;
}

interface Datum {
	episodes: Episode[];
	providerId: string;
}

interface Episode {
	id: string;
	img?: string;
	title: string;
	hasDub: boolean;
	number: number;
	isFiller: boolean;
}

interface Relation {
	id: number;
	data: Data;
	type: string;
}

interface Data {
	id: number;
	type: string;
	title: Title;
	format: string;
	status: string;
	coverImage: CoverImage;
	bannerImage?: string;
}

interface CoverImage {
	large: string;
}

interface Rating {
	mal: number;
	kitsu: number;
	anilist: number;
}

interface Mapping {
	id: string;
	providerId: string;
	similarity: number;
}

interface Title {
	native: string;
	romaji: string;
	english?: string;
}

export interface EpisodeData {
	providerId: string;
	episodes: Episode[];
}

export interface SourceInfo {
	sources: Source[];
	default?: string;
	subtitles: any[];
	intro: Intro;
	outro: Intro;
	headers: Headers;
}

interface Headers {
	Referer?: string;
}

interface Intro {
	end: number;
	start: number;
}

interface Source {
	url: string;
	quality: string;
}

export interface EpisodeCovers {
	episode: number;
	img: string;
}

export interface SeasonalData {
	trending: Anime[];
	popular: Anime[];
	top: Anime[];
	seasonal: Anime[];
	[x: string]: Anime[];
}

export interface MinifiedSeasonalData {
	trending: MinifiedAnime[];
	popular: MinifiedAnime[];
	top: MinifiedAnime[];
	seasonal: MinifiedAnime[];
	[x: string]: MinifiedAnime[];
}

export type MinifiedAnime = Pick<Anime, 'id' | 'coverImage' | 'title' | 'year'> & {
	fallback?: string;
};
