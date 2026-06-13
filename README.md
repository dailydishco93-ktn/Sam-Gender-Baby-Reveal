<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Sam Baby Reveal App

This contains everything you need to run your app locally and deploy it online.

## Run Locally

**Prerequisites:** Node.js (v20+ recommended)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Setup Environment Variables:
   Copy `.env.example` to `.env.local` and set the `GEMINI_API_KEY` to your Gemini API key:
   ```bash
   cp .env.example .env.local
   ```
3. Run the app:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 in your browser to view the app.

## Deployment

This repository includes a GitHub Action designed to automatically build and deploy your React app to **GitHub Pages**.

### Steps to Deploy:
1. Push your code to the `main` or `master` branch.
2. The GitHub Action (in `.github/workflows/deploy.yml`) will automatically trigger.
3. It will install dependencies, build the static files to `dist`, and deploy them to GitHub Pages.
4. Ensure you have **GitHub Pages** enabled in your repository settings:
   - Go to **Settings > Pages**.
   - Under **Build and deployment > Source**, select **GitHub Actions**.

## Ignored Files

The `.gitignore` has been updated to avoid committing:
- `node_modules/`, `dist/`, and other build artifacts.
- Environment variables like `.env` and `.env.local` (keeping `.env.example`).
- Editor config and temp files (`.vscode`, `.idea`, `.DS_Store`, `*.log`).
