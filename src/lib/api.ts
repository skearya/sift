import ky from 'ky';

export const api = ky.create({ prefixUrl: 'https://api.anify.tv/', timeout: 15000 });

export const validCover = (url: string | undefined) =>
	url &&
	url !== 'https://simkl.in/episodes/null_c.jpg' &&
	url !== 'https://image.tmdb.org/t/p/w500null';

export function bestFallback(artwork: Artwork[]): string {
	let newImg = '';

	for (let i = 0; i < artwork.length; i++) {
		if (artwork[i].providerId == 'mal') {
			newImg = artwork[i].img;
			break;
		}
		if (artwork[i].providerId == 'anilist') {
			newImg = artwork[i].img;
			break;
		}
		if (artwork[i].providerId == 'anilist' && artwork[i].img.includes('large')) {
			newImg = artwork[i].img;
			break;
		}
		if (artwork[i].providerId == 'kitsu' && artwork[i].type == 'poster') {
			newImg = artwork[i].img;
			break;
		}
	}

	return newImg;
}

interface Artwork {
	img: string;
	type: string;
	providerId: string;
}
