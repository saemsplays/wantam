# ✊ Reject the Finance Bill 2025

A privacy-respecting, citizen-powered platform to object to Kenya's 2025 Finance Bill — built to empower public voices, pressure lawmakers, and defend human rights.

🚨 **Live site**: [rejectfinancebill2025.vercel.app](https://rejectfinancebill2025.vercel.app/)  
📲 **Android App**: Downloadable APK available on the site

---

## 🧭 What is this project?

**RejectFinanceBill25** is a civic tech platform enabling Kenyan citizens to **object to the Finance Bill 2025** in an effective, private, and verifiable way. It exists to:

- **Send objection letters** to Parliament via email with one click.
- **Track public participation** with real-time viewer and objection counts.
- **Raise awareness** about harmful sections of the bill.
- **Report injustice** through a built-in sidebar system (coming soon).
- **Respect privacy** by doing everything client-side — **no tracking**, **no data storage**.

This project is a response to widespread public outcry against the Finance Bill 2025, which many fear will entrench economic hardship and violate constitutional freedoms.

---

## 🛠️ Tech Stack

The project is built using modern web technologies:

- ⚡ **Vite** – ultra-fast frontend tooling
- ⚛️ **React** – component-based UI framework
- 🧠 **TypeScript** – static typing for safety
- 🎨 **Tailwind CSS** – utility-first styling
- 🧩 **shadcn/ui** – accessible, modern UI components
- 📦 **Supabase** – used for backend analytics (view and action counters)

---

## 🚀 Features

- 📧 **Objection Letter Generator**: Auto-opens user's email client with a prewritten objection to Parliament.
- 📊 **Live Activity Tracker**: Counts and displays real-time views and objection emails sent.
- 🎨 **Milestone-Triggered UI**: Page styling adapts as more users participate (e.g. colors change past 1000 objections).
- 🔍 **Incident Reporting Sidebar** *(Coming Soon)*: Enables reports of police abuse, abductions, or intimidation.
- 📱 **Mobile-first & App-ready**: Designed for Android, with an APK version available.

---

## 🧑‍💻 Local Development Guide

> Make sure you have **Node.js** and **npm** installed. It’s recommended to use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to manage Node versions.

### 1. Clone the Repository

```sh
git clone https://github.com/saemsplays/rejectfinancebill25.git
cd rejectfinancebill25
2. Install Dependencies
sh
Copy
Edit
npm install
3. Start the Dev Server
sh
Copy
Edit
npm run dev
This starts the app locally on http://localhost:5173 (or similar).

📦 Project Structure
bash
Copy
Edit
/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── lib/             # Utility functions
│   ├── pages/           # Core page views
│   ├── data/            # Static content & templates
│   └── main.tsx         # App entry point
├── index.html
├── tailwind.config.ts
├── package.json
└── tsconfig.json
📲 Android APK
This project is also available as a native Android app.
Users can download the APK directly from the live site.

Built using the PWA → APK method for offline-first performance and installability.

🛡️ Privacy First
We believe in civic tools that do not exploit or track users. All logic for objection emails, counters, and interactivity is executed in the browser.
There is no account, no login, and no analytics tracking beyond anonymous, opt-out counts.

🙌 Contributing
All forms of contribution are welcome:

Improve accessibility or responsive behavior

Add support for regional languages

Suggest alternate objection letter formats

Improve Supabase logic or animations

Refactor UI/UX for better performance

To contribute:

sh
Copy
Edit
# Fork and clone the repo
git clone https://github.com/YOUR_USERNAME/rejectfinancebill25.git
cd rejectfinancebill25

# Create a new branch for your fix/feature
git checkout -b my-feature-branch

# Make changes and commit
git commit -m "Add feature/fix"

# Push and open a Pull Request
git push origin my-feature-branch
📄 License
This project is open-source under the MIT License.

✊ Acknowledgments
Created by @saemsplays in solidarity with citizens defending constitutional and economic rights.
Inspired by the courage of everyday Kenyans standing up to systemic injustice.

“They tried to bury us. They didn’t know we were seeds.” 🌱
