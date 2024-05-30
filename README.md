# sift
### a decent way to watch anime
- no tracking/analytics
- no ads
- watch history
- sub/dub
<img width="1434" alt="image" src="https://github.com/skearya/sift/assets/77034153/8b406d82-6dd1-4aa3-b9c6-3f5be5ef47f1">

<details>
  <summary>more screenshots</summary>
  
  <h5 align="center">Anime info</h5>
  <img alt="image" src="https://github.com/skearya/sift/assets/77034153/b60a1ccd-16f1-4a7d-82e8-15cfd196b65d">
  <h5 align="center">Episode player</h5>
  <img alt="image" src="https://github.com/skearya/sift/assets/77034153/c3fea2bb-a7f0-47c8-a4b8-7f8872f69772">
</details>

# Info
- Full stack framework: [SvelteKit](https://kit.svelte.dev/)
- ORM: [Prisma](https://www.prisma.io/)
- Auth library: [Lucia](https://lucia-auth.com/)
- Video player: [Vidstack](https://www.vidstack.io/)
- TypeScript
- TailwindCSS

# Hosting
Video guide: https://youtu.be/w-v5Pm-gcy4
### Hosting with discord authentication 
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fskearya%2Fsift&env=PUBLIC_PROXY,DATABASE_URL,OWNER_ID,CLIENT_ID,CLIENT_SECRET,REDIRECT_URI&envDescription=more%20info%20in%20github%20readme&envLink=https%3A%2F%2Fgithub.com%2Fskearya%2Fsift%23hosting)
### Hosting with username/password authentication
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fskearya%2Fsift&env=PUBLIC_PROXY,DATABASE_URL,OWNER_USERNAME&envDescription=more%20info%20in%20github%20readme&envLink=https%3A%2F%2Fgithub.com%2Fskearya%2Fsift%23hosting)

`.env` details
```bash
PUBLIC_PROXY="url to an instance of https://github.com/Eltik/M3U8-Proxy"
DATABASE_URL="mysql db"

# needed for discord authentication (https://discord.com/developers)
OWNER_ID="discord owner id"
CLIENT_ID="discord app client id"
CLIENT_SECRET="discord app client secret"
REDIRECT_URI="<url where hosted>/oauth/discord"

# if you dont want to use discord auth you can use username+pass auth
OWNER_USERNAME="<account name>"
# you have to then create an account with this username
```

`/whitelist` with an admin account to whitelist other users

## Acknowledgments
- [Anify](https://github.com/Eltik/Anify) and [Eltik](https://github.com/eltik)
- [shadcn-svelte](https://www.shadcn-svelte.com/)
