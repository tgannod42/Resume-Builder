**Here’s a clean, professional **README.md** tailored to your assignment requirements. You can drop this straight into your GitHub repo and tweak names/details.

---

# Resume Builder App

A lightweight, local-first web application that helps students create, customize, and export professional resumes—without struggling with formatting.

## Project Overview

This project was developed for **CSC3100 – Web Development Final Project**. The goal is to shift the focus of resume building away from formatting and toward **content quality and customization**.

Users can:

* Store job experiences, skills, certifications, and awards
* Select specific items tailored to each job application
* Generate a clean, formatted resume (web + print/PDF)
* Receive AI-powered suggestions to improve content

---

##  Features

###  Resume Creation

* Build resumes dynamically from stored data
* Select which jobs, responsibilities, and skills to include
* Tailor resumes for different applications

###  Data Management (CRUD)

* Jobs (with detailed responsibilities)
* Skills (with categories)
* Certifications
* Awards

###  AI-Powered Suggestions

* Uses **Google Gemini API** (user-provided key)
* Reviews user-entered content
* Suggests improvements for clarity, professionalism, and impact

###  Single Page Application (SPA)

* Built with a single `index.html`
* Dynamic DOM updates (no page reloads)

###  UI/UX & Accessibility

* Clean, modern UI using **Bootstrap or Tailwind**
* Fully accessible (target Lighthouse score ≥ 93)
* Responsive design
* Custom branding (name, icons, favicon)

### 🖨 Resume Output

* Web-based preview
* Print-friendly layout
* Export to PDF

---

## 🛠 Tech Stack

### Frontend

* HTML5
* CSS3 (Bootstrap or Tailwind)
* Vanilla JavaScript (no frameworks)

### Backend

* Node.js
* Express.js (REST API)

### Database

* SQLite (local storage)

### AI Integration

* Google Gemini API (user-provided key)

---

## 📁 Project Structure

```
resume-builder/
│
├── frontend/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── db/
│   └── server.js
│
├── database/
│   └── sqlite.db
│
├── .env (ignored)
├── .gitignore
├── README.md
└── package.json
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-link>
cd resume-builder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```
GEMINI_API_KEY=your_api_key_here
```

> ⚠️ This file is ignored by Git and should not be committed.

### 4. Start the Server

```bash
node server.js
```

### 5. Open the App

Navigate to:

```
http://localhost:3000
```

---

## 🤖 AI Usage Documentation

AI was used in the following ways:

* Assisting with resume layout and print formatting
* Generating prompt structures for content improvement
* Debugging and refining backend/API logic

### Key Notes:

* All AI-generated code has been reviewed and understood
* Comments are included in the code where AI assistance was used
* Prompts and configurations are documented in `/docs/ai-usage.md`
* AI was used in the development of this README.md

---

## 🔐 Environment & Security

* API keys are stored in `.env`
* `.env` is included in `.gitignore`
* Users provide their own Gemini API key
* No sensitive data is committed to the repository

---

## ♿ Accessibility

* Designed with accessibility as a priority
* Tested using Lighthouse
* Target score: **93+**
* Includes:

  * Semantic HTML
  * Keyboard navigation
  * Color contrast compliance

---

## 📦 Libraries & Attribution

All external libraries are stored locally (no CDNs used).

A “Thank You” section is included in the app to credit:

* Bootstrap / Tailwind
* Any additional libraries used

---


## 👤 Author

**Trey Gannod**

