# ByPass Ai - Handover & Setup Guide (v7.0)

Welcome to the **ByPass Ai** package. This guide outlines what files are in this workspace, how to host and deploy the system, and includes a **Master AI Setup Prompt** that you can copy and paste into any AI coding assistant to automate the entire installation and deployment process.

---

## 📦 What to Hand Over to the Buyer
Zip the entire contents of this folder (`D:\Lovable\ByPass Ai Updated`), which contains:
1. **Chrome Extension**: The root files (`manifest.json`, `background.js`, `sidepanel.html`, `sidepanel.css`, `theme.css`, assets, security scripts, etc.).
2. **`admin-dashboard/`**: The Next.js 14 web app for managing license keys, logs, and devices.
3. **`vercel-api/`**: The Node.js serverless API designed for Vercel, handling license validation, check-ins, and database queries.
4. **`supabase/`**: Contains the SQL database schemas and migrations.
5. **`scripts/` & `obfuscation/`**: Build utilities and development helper scripts.

---

## 🛠️ Step-by-Step Manual Deployment Guide

### 1. Database Setup (Supabase)
1. Sign up for a free account at [Supabase](https://supabase.com/).
2. Create a new project.
3. Navigate to the **SQL Editor** in the Supabase console.
4. Open the SQL file located in `supabase/schema.sql` in this project.
5. Copy the SQL content, paste it into the editor, and click **Run**. This will create all required tables (`licenses`, `devices`, `logs`, `broadcasts`) and trigger functions automatically.

### 2. Backend Hosting (Vercel API)
1. Sign up for a free account at [Vercel](https://vercel.com/).
2. Click **Add New ➔ Project** and import the `vercel-api` subfolder (or upload it to a GitHub repository and import it).
3. Configure the following **Environment Variables** in the Vercel project settings:
   - `SUPABASE_URL`: Your Supabase Project URL (found in project settings).
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase secret service role key (JWT bypass enabled).
   - `ADMIN_API_KEY`: A secret key of your choice to protect administrative endpoints.
4. Click **Deploy**. Vercel will output a deployment domain (e.g., `my-bypass-api.vercel.app`).

### 3. Admin Dashboard Hosting (Vercel Next.js)
1. In Vercel, click **Add New ➔ Project** and import the `admin-dashboard` subfolder.
2. Configure the following **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: The Vercel API deployment domain you created in Step 2 (e.g., `https://my-bypass-api.vercel.app`).
   - `NEXT_PUBLIC_ADMIN_API_KEY`: The `ADMIN_API_KEY` you configured in Step 2.
3. Click **Deploy**. This will host your administrative panel web app.

### 4. Chrome Extension Configuration
1. Open `extension-config.js` in the extension files.
2. Update the `BYPASS_API_URL` to match your Vercel API domain (e.g., `https://my-bypass-api.vercel.app`).
3. Load the folder unpacked in **`chrome://extensions/`** in Google Chrome.

---

## 🤖 Master AI Assistant Prompt for the Buyer

*Copy and paste the entire block below into your AI coding assistant (like Gemini, Claude, Cursor, etc.) along with your project repository link or code folder:*

```markdown
You are an expert full-stack developer. I have purchased the source code for the "ByPass Ai" Chrome Extension and Licensing System.

I want you to help me configure, host, and deploy the entire project step-by-step. I have uploaded the files to this folder/repository.

The codebase consists of:
1. A Chrome Extension (root directory files, including manifest.json, background.js, theme.css, sidepanel.html/js/css).
2. A Next.js Admin Dashboard (under /admin-dashboard) to create and edit licenses (days, months, custom minutes).
3. A Vercel API server (under /vercel-api) serving as the license validation backend.
4. Supabase schemas (under /supabase).

Here is my target hosting info:
- My GitHub Repository: [PASTE YOUR GITHUB REPO URL HERE]
- My Supabase Project: [PASTE YOUR SUPABASE PROJECT URL/CREDENTIALS HERE IF AVAILABLE, OR WE WILL SETUP STEP-BY-STEP]
- My Vercel account is ready.

Please perform the following tasks:
1. Scan the project files in this workspace to understand the codebase.
2. Read the SQL files in `/supabase/` and guide me on how to run them in the Supabase SQL editor (or automate if CLI is active). Explain what tables, constraints, and trigger functions are being set up.
3. Help me create/update the environment variable templates (`.env` and `.env.local` files) for `/admin-dashboard` and `/vercel-api`. List all environment keys needed for Supabase and the Admin API secrets.
4. Modify `extension-config.js` in the Chrome extension files to point to my new Vercel API URL.
5. Guide me through importing `/vercel-api` and `/admin-dashboard` into Vercel, pointing out exactly what configurations, root directories, and environment variables I need to paste in the Vercel dashboard.
6. Verify that the Next.js admin dashboard compiles successfully by running a local build command (`npm run build` or equivalent) inside `/admin-dashboard` and debugging any dependency issues.
7. Test the extension's load integrity (checking manifest.json compatibility and script entry points).

Explain every step clearly and tell me what console commands to run or what to click on Supabase/Vercel. Do not take shortcuts; implement the build checks completely.
```
