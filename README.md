<!-- AI USAGE COMMENT BLOCK
This file was reviewed with AI assistance. AI was used to draft and refine documentation wording,
and to summarize how the resume builder's backend routes, controllers, and frontend flow work together.
Final project-specific details should always be verified against the source code.
-->

# Resume Builder App

A lightweight, local-first desktop/web application that helps students create, tailor, and export professional resumes — without fighting formatting.

## Project Overview

Built for **CSC3100 – Web Development Final Project**. The goal is to shift the focus of resume building away from formatting and toward **content quality and per-application customization**.

Users can:

* Store jobs (with responsibilities), skills (with categories), certifications, and awards
* Select which items to include for each tailored resume
* Generate a clean web preview, a print-friendly layout, and an exportable PDF
* Get AI-powered suggestions on the content they enter via the Google Gemini API (using their own key)

---

## Features
## Features

### Resume Building

* Reusable "data library": add jobs, responsibilities, skills, certifications, and awards once
* Per-resume selection — pick which jobs/responsibilities/skills/certs/awards appear on each version
* Tailor a different resume for each job application from the same underlying data

### Data Management (CRUD via REST)

* Jobs (with detailed responsibilities)
* Skills (grouped by category)
* Certifications
* Awards
* Resumes (target role + selected items)

### AI-Powered Suggestions

* Uses the **Google Gemini API** (Free Tier suggested for development)
* Triggered after the user enters details for a section, returning suggested rewrites for clarity, professionalism, and impact
* Users supply their **own Gemini API key**, stored locally in the app's database — no key is bundled or deployed with the app

### Single Page Application (SPA)

* One `index.html`; views are shown/hidden via DOM manipulation in vanilla JS
* No frameworks (no React, no Vue, no SSR/MVC server-rendered templates)

### UI / UX & Accessibility

* Bootstrap 5 utility classes for layout, spacing, and color
* WCAG 2.1+ targets: semantic HTML, ARIA labels on form controls, alt text on images, keyboard navigation
* Lighthouse Accessibility score target **≥ 93** (screenshot included with submission)
* Responsive layout
* Custom branding: app name, favicon, and additional icons

### Resume Output

* Web preview rendered from selected items
* Print-friendly layout via a dedicated `@media print` stylesheet
* PDF export (browser print-to-PDF and/or Electron `webContents.printToPDF`)

### Desktop Packaging

* Wrapped as an **ElectronJS** desktop app so users can run it locally without standing up a separate server

---

## Tech Stack

### Frontend
* HTML5
* CSS3 + Bootstrap 5 (installed locally — no CDNs)
* Vanilla JavaScript (ES6+, no frameworks)

### Backend
* Node.js
* Express.js (RESTful API under `/api/`)

### Database
* SQLite (via `sqlite3` driver)

### AI Integration
* Google Generative AI SDK (`@google/generative-ai`) — Gemini API

### Desktop Shell
* Electron

### Configuration
* `dotenv` for development-time environment variables (`.env` is gitignored)

---

## Project Structure

```
Resume-Builder/
├── index.html                # SPA entry point
├── server.js                 # Express entry point (TODO)
├── electron.js               # Electron main process (TODO)
├── package.json
├── .gitignore
├── .env.example              # Template for required env vars (TODO)
├── README.md
├── AGENTS.md                 # Coding conventions for the project
├── dbResumes.db              # SQLite database (gitignored once created at runtime)
│
├── api/                      # Express route handlers (TODO)
│   ├── users.js
│   ├── resumes.js
│   ├── jobs.js
│   ├── responsibilities.js
│   ├── skills.js
│   ├── certifications.js
│   ├── awards.js
│   └── ai.js
│
├── db/                       # SQLite setup + schema (TODO)
│   ├── connection.js
│   └── schema.sql
│
├── public/                   # Static frontend assets
│   ├── js/
│   │   └── app.js
│   ├── css/                  # Custom CSS overrides (TODO)
│   ├── assets/
│   │   ├── css/bootstrap.min.css
│   │   ├── js/bootstrap.bundle.min.js
│   │   └── img/              # Logo, favicon, icons (TODO)
│   └── views/                # HTML partials loaded dynamically (TODO)
│
└── docs/
    ├── ai-usage.md           # Required AI documentation (TODO)
    └── lighthouse.png        # Accessibility score screenshot (TODO)
```

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/tgannod42/Resume-Builder.git
cd Resume-Builder
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables (development only)

Copy `.env.example` to `.env` and fill in your dev key:

```
GEMINI_API_KEY=your_dev_key_here
PORT=3000
```

> `.env` is gitignored. End users supply their own Gemini key inside the app — no key ships with the build.

### 4. Run the app

Web mode (browser):

```bash
npm start
# then open http://localhost:3000
```

Desktop mode (Electron):

```bash
npm run electron
```

---

## API Overview

All routes live under `/api/` and follow the conventions in `AGENTS.md`:

* `GET` returns JSON arrays
* `POST` accepts JSON bodies for create
* `PUT` for updates (no PATCH)
* `DELETE` uses URL parameters for the primary key
* `GET` filters use query strings
* All inputs are validated; all DB calls use prepared statements

| Resource          | Endpoints                                                                 |
|-------------------|---------------------------------------------------------------------------|
| Users             | `GET/POST/PUT /api/users`, `DELETE /api/users/:id`                        |
| Resumes           | `GET/POST/PUT /api/resumes`, `DELETE /api/resumes/:id`                    |
| Jobs              | `GET/POST/PUT /api/jobs`, `DELETE /api/jobs/:id`                          |
| Responsibilities  | `GET/POST/PUT /api/responsibilities`, `DELETE /api/responsibilities/:id`  |
| Skills            | `GET/POST/PUT /api/skills`, `DELETE /api/skills/:id`                      |
| Certifications    | `GET/POST/PUT /api/certifications`, `DELETE /api/certifications/:id`      |
| Awards            | `GET/POST/PUT /api/awards`, `DELETE /api/awards/:id`                      |
| AI Suggestions    | `POST /api/ai/suggest` — body: `{ text, geminiKey, sectionType }`         |

---

## AI Usage Documentation

A full write-up lives in [`docs/ai-usage.md`](./docs/ai-usage.md), including:

* Summary of how generative AI was used during development
* The rules file (`AGENTS.md`) used to constrain AI-generated code
* MCP server / tool details (if any)
* Inline comments in the source where AI assistance was used

The Gemini API is also a runtime feature: users paste their own key into the app's settings to receive content suggestions on entered details.

---

## Environment & Security

* Development secrets go in `.env`; `.env` is in `.gitignore`
* No API key is committed or bundled with the application
* User-provided Gemini keys are stored only in the local SQLite database on the user's machine
* All SQL uses prepared statements (no string interpolation of user input)

---

## Accessibility

* WCAG 2.1+ targets
* Lighthouse Accessibility score target **≥ 93** (screenshot in `docs/lighthouse.png`)
* Semantic HTML, keyboard navigation, color-contrast compliant theme, ARIA labels on form controls, alt text on images

---

## Libraries & Attribution

All third-party libraries are stored locally — no CDNs.

A "Credits" / "Thank You" modal inside the app credits each library used:

* [Bootstrap 5](https://getbootstrap.com/)
* [Popper.js](https://popper.js.org/) (Bootstrap dependency)
* [Express](https://expressjs.com/)
* [sqlite3](https://github.com/TryGhost/node-sqlite3)
* [Google Generative AI SDK](https://github.com/google/generative-ai-js)
* [Electron](https://www.electronjs.org/)

---

## Submission Checklist

* [ ] All project files included
* [ ] Public GitHub repository link: https://github.com/tgannod42/Resume-Builder
* [ ] AI usage documentation (`docs/ai-usage.md`)
* [ ] Example resume PDF generated by the app
* [ ] Lighthouse accessibility screenshot (≥ 93)
* [ ] Special install/run instructions (this README)
* [ ] Statement on whether the project may be shared with future students
* [ ] Candid or AI-generated author image

---

## Author

**Trey Gannod**
