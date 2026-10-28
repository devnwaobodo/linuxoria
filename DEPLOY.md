# Deploying Linuxoria (free)

## 1. Run it locally
    npm install
    npm run dev          # http://localhost:4321
Needs Node 22.23.4 or newer (`node -v`). On Arch: `sudo pacman -S nodejs npm`.

## 2. Put the code on GitHub
    sudo pacman -S git github-cli
    gh auth login
    git init && git add . && git commit -m "Initial Linuxoria site"
    gh repo create linuxoria --public --source=. --push

## 3. Host it on Cloudflare Pages (free)
1. Sign up at dash.cloudflare.com.
2. Workers & Pages > Create > Pages > Connect to Git. Authorize GitHub and pick the repo.
3. Framework preset: Astro. Build command: `npm run build`. Output directory: `dist`.
4. Environment variables: `NODE_VERSION` = `22.23.4`.
5. Save and Deploy. You get a free address like https://linuxoria.pages.dev.
Every `git push` to main rebuilds and publishes the site.

## 4. Custom domain (later, about the price of a .com per year)
Pages project > Custom domains > Set up a domain. Then add an environment variable
`SITE_URL` = https://yourdomain.com and redeploy, so the sitemap and canonical tags use it.

## 5. After it is live
Submit https://yourdomain.com/sitemap-index.xml in Google Search Console.

## Optional: email signup
Set `PUBLIC_EMAIL_FORM_ACTION` (see `.env.example`) to your email provider's form URL to show the signup block on the results page.
