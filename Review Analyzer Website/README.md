# ReviewInsight – Business Review Analyzer & Customer Support Platform
**Created by Vishapal Yadav**

This folder contains the complete, deployment-ready project files for your **ReviewInsight Business Review Analyzer & Support Suite**.

---

## 🌐 1. Live Public Deployed URL

Your website is deployed online with a permanent, secure HTTPS URL:
```text
https://ais-pre-xkb2cbnp2rxn76fg6xhhk7-627267135763.asia-east1.run.app
```

### Expected User Journey:
1. You share the link above via WhatsApp or email.
2. The recipient clicks the link on their mobile phone, tablet, or desktop.
3. The **Owner Login** screen opens directly.
4. The user enters the owner password: `21062006`.
5. The complete **ReviewInsight Business Suite** unlocks smoothly.
6. The user can paste customer reviews, view real-time 5-row analytics, and get 24/7 troubleshooting guidance via the floating support chatbot fixed at the bottom-right.

---

## 📲 2. How to Share on WhatsApp

1. Open WhatsApp on your phone or web browser.
2. Paste the link:
   ```text
   https://ais-pre-xkb2cbnp2rxn76fg6xhhk7-627267135763.asia-east1.run.app
   ```
3. Wait 2 seconds for WhatsApp to automatically load the rich preview card:
   - **Title:** ReviewInsight – Business Review Analyzer & Support
   - **Description:** Professional Business Review Analyzer, Real-Time Sentiment Analytics Dashboard & 24/7 Customer Support Chatbot by Vishapal Yadav
4. Add a friendly message:
   > *"Hi! Here is our Business Review Analyzer & Customer Support Portal: https://ais-pre-xkb2cbnp2rxn76fg6xhhk7-627267135763.asia-east1.run.app (Owner demo password: 21062006). Let me know what you think!"*
5. Tap **Send**!

---

## 🔒 3. Security & Password Protection

- **Server-Side Verification:** Unlike simple client-side scripts where the password is hardcoded and readable in browser developer tools, this project includes server-side authentication (`/api/auth/login` and serverless functions).
- **Environment Variables:** The password can be customized via the `OWNER_PASSWORD` environment variable without changing code.
- **Session Tokens:** Successful authentication generates a session token so the recipient stays logged in until they tap **Logout**.

---

## 💻 4. How to Save This Project Folder on Your Laptop

1. Copy the folder `Review Analyzer Website` to your computer (e.g. `Desktop/Review Analyzer Website` or `Documents`).
2. Inside, you will find:
   - `index.html` – Complete web application
   - `style.css` – Responsive styling and enterprise themes
   - `app.js` – Interactive client logic, NLP review analytics, and floating support chatbot
   - `server.js` – Express server with backend password checking
   - `netlify.toml` & `netlify/functions/login.js` – Netlify deployment config
   - `vercel.json` & `api/login.js` – Vercel deployment config
   - `package.json` – Dependencies and scripts
3. To test locally:
   - Option A: Simply double-click `index.html` in any web browser (Chrome, Safari, Edge).
   - Option B: Run `npm install` and `npm start` in your terminal to start the Node.js server at `http://localhost:3000`.

---

## 🚀 5. Free 1-Click Redeployment to Netlify or Vercel

If you ever wish to also host this on your personal Netlify or Vercel account:

### A. Netlify (Drag & Drop – No Git required)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Sign in or create a free Netlify account.
3. Drag and drop the `Review Analyzer Website` folder directly into the browser.
4. Netlify will publish your site in seconds and give you a free `your-site.netlify.app` HTTPS link!

### B. Vercel
1. Install Vercel CLI with `npm i -g vercel` or link your GitHub repository.
2. Run `vercel` inside `Review Analyzer Website`.
3. Follow the two prompts to deploy instantly to a free `your-site.vercel.app` HTTPS domain.
