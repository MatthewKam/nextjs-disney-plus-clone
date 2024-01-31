import { SearchResults } from "@/typings";

const apiURL = "https://api.themoviedb.org/3";

async function fetchFromTMDB(url: URL, cacheTime?: number) {
	url.searchParams.set("include_adult", "false");
	url.searchParams.set("include_video", "false");
	url.searchParams.set("sort_by", "popularity.desc");
	url.searchParams.set("language", "en-US");
	url.searchParams.set("page", "1");

	const options: RequestInit = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
		},
		next: {
			revalidate: cacheTime || 60 * 60 * 24, // 24 hours
		},
	};
	const response = await fetch(url.toString(), options);
	const data = (await response.json()) as SearchResults;
	return data;
}

export async function getUpcomingMovies() {
	const data = await fetchFromTMDB(new URL(`${apiURL}/movie/upcoming`));
	return data.results;
}

export async function getTopRatedMovies() {
	const data = await fetchFromTMDB(new URL(`${apiURL}/movie/top_rated`));
	return data.results;
}

export async function getPopularMovies() {
	const data = await fetchFromTMDB(new URL(`${apiURL}/movie/popular`));
	return data.results;
}

export async function getDiscoverMovies(id?: string, keywords?: string) {
	const urlString = `${apiURL}/discover/movie`;
	const url = new URL(urlString);
	keywords && url.searchParams.set("with_keywords", keywords);
	id && url.searchParams.set("with_genres", id);
	const data = await fetchFromTMDB(url);
	return data.results;
}

export async function getSearchedMovies(term: string) {
	const urlString = `${apiURL}/search/movie`;
	const url = new URL(urlString);
	url.searchParams.set("query", term);
	const data = await fetchFromTMDB(url);
	return data.results;
}
