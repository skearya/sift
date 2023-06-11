const consumet = 'https://api.consumet.org';
const providers = ['9anime', 'animefox', 'animepahe', 'enime', 'gogoanime', 'zoro'];

function convertForLibrary(provider: string): string {
	switch (provider) {
		case '9anime':
			return 'NineAnime';
		case 'animefox':
			return 'AnimeFox';
		case 'animepahe':
			return 'AnimePahe';
		case 'enime':
			return 'Enime';
		case 'gogoanime':
			return 'Gogoanime';
		case 'zoro':
			return 'Zoro';
		default:
			return provider;
	}
}

export { consumet, providers, convertForLibrary };
