# Resume Builder App

A local-first resume builder that helps students focus on content quality, tailoring, and fast export to PDF.

## Project Overview

This project was developed for **CSC3100 – Web Development Final Project**.

Users can:
- Store and manage jobs, responsibilities, skills, certifications, and awards.
- Select targeted content for each resume version.
- Generate a formatted resume preview and print/PDF output.
- Get AI writing suggestions after entering details in form fields/sections.

## Features

### Resume Creation
- Build resumes from saved profile data.
- Select jobs, responsibilities, skills, certifications, and awards per resume.
- Tailor content for different job applications.

### Data Management (CRUD)
- Jobs + responsibilities
- Skills
- Certifications
- Awards

### AI-Powered Suggestions
- Uses **Google Gemini API** through `@google/generative-ai`.
- Suggestions run after the user enters detail text (per-field/per-section workflow).
- The user’s Gemini API key is stored in app data for reuse.
- `dotenv` is used for local environment configuration.

### SPA + UI
- Single-page app with `index.html` at project root.
- Dynamic DOM updates using vanilla JavaScript.
- Bootstrap 5 UI (locally bundled; no CDN).

### Accessibility
- WCAG-focused semantic structure and keyboard-friendly controls.
- Responsive Bootstrap layout.

### Resume Output
- On-page preview.
- Print-optimized output.
- Export to PDF via browser print flow.

## Tech Stack

- **Frontend:** HTML5, Bootstrap 5, vanilla JavaScript (ES6+)
- **Backend/API:** Node.js + Express
- **Database:** SQLite (`dbResumes.db`)
- **Desktop Path:** Electron (included in project plan and grading path)
- **AI:** Google Gemini API via `@google/generative-ai`
- **Config:** `dotenv`

## Real Project Structure

```text
Resume-Builder/
├── index.html
├── server.js
├── package.json
├── dbResumes.db
├── db/
│   └── database.js
├── controllers/
├── routes/
└── public/
    ├── js/app.js
    └── assets/
        ├── css/bootstrap.min.css
        └── js/bootstrap.bundle.min.js
```

## Installation & Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` in project root:
   ```env
   GEMINI_API_KEY=your_api_key_here
   PORT=3000
   ```
3. Start the app:
   ```bash
   npm start
   ```
4. Open:
   ```
   http://localhost:3000
   ```

## Security Notes
- Do not commit API keys.
- `.env`, local databases, and `node_modules` are ignored.
- Users can provide and manage their Gemini key inside the application.

## Author

**Trey Gannod**
