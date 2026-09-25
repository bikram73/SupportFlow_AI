# Deploying SupportFlow AI on Netlify

This project is fully configured for seamless deployment on **Netlify**, including static frontend hosting and Netlify Serverless Functions for the backend Gemini AI API endpoints.

---

## Quick Deployment Steps

### 1. Push Code to GitHub / Git Provider
Ensure your latest codebase (including `netlify.toml`, `netlify/functions/`, and `public/_redirects`) is pushed to a repository on GitHub, GitLab, or Bitbucket.

### 2. Connect Repository to Netlify
1. Log in to [Netlify App](https://app.netlify.com/).
2. Click **Add new site** > **Import an existing project**.
3. Select your Git provider (e.g. **GitHub**) and authorize access.
4. Select your `supportflow-ai` repository.

### 3. Verify Build Settings
Netlify will automatically detect the settings in `netlify.toml`. Verify the following fields:
* **Build command:** `npm run build`
* **Publish directory:** `dist`
* **Functions directory:** `netlify/functions`

### 4. Configure Environment Variables
1. Under **Site Configuration** (or during deployment setup), go to **Environment variables**.
2. Add the following environment variable:
   * `GEMINI_API_KEY`: Your Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 5. Deploy Site
Click **Deploy site**. Netlify will compile the React Vite application and build the Serverless Functions. Once completed, your application will be live on your `.netlify.app` domain!

---

## Configured Netlify Architecture

* **`netlify.toml`**: Configures build commands, publish directory (`dist`), Node environment (`v20`), and rewrites `/api/*` requests to Netlify Serverless Functions.
* **`public/_redirects`**: Client-side routing fallback rule (`/* /index.html 200`) so SPA route changes refresh seamlessly.
* **`netlify/functions/api.ts`**: Express serverless wrapper using `serverless-http` powering `/api/analyze-ticket`, `/api/analyze-batch`, `/api/sample-tickets`, and `/api/generate-samples`.
* **Client Fallback Resilience**: Built-in client-side rule classification fallback ensuring instant functionality even if serverless API keys or functions are delayed.
