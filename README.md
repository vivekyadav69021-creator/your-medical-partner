# Your Medical Partner - Digital Health Companion

This is a professional, AI-powered health application built with **Next.js**, **React**, **Tailwind CSS**, and **Firebase**.

## 🚀 How to Maintain & Update This App (Future-Proof Guide)

Even if you stop using the prototyping tool, this code is 100% standard and portable. You own every line of it.

### 1. Local Development (On Your Computer)
To make changes on your own computer in the future:
1. **Install Node.js:** Download and install Node.js (v18 or higher) from [nodejs.org](https://nodejs.org/).
2. **Download Code:** Download your project files into a folder.
3. **Install Dependencies:** Open your terminal in that folder and run:
   ```bash
   npm install
   ```
4. **Run Dev Server:** Start the app locally:
   ```bash
   npm run dev
   ```
5. **Edit Code:** Use [Visual Studio Code](https://code.visualstudio.com/) to edit files. The app will update in real-time at `http://localhost:3000`.

### 2. Managing Your Backend
Your app's heart (Database, Auth, AI) is hosted on Firebase. You can manage it anytime at:
👉 **[Firebase Console](https://console.firebase.google.com/)**

Here you can:
- View and edit user data in **Firestore**.
- Manage registered users in **Authentication**.
- Check your website's performance in **App Hosting**.

### 3. Environment Variables
To keep your AI working locally, create a file named `.env.local` in the root folder and add your Gemini API Key:
```env
GEMINI_API_KEY=your_api_key_here
```

### 4. Tech Stack Used
- **Frontend:** Next.js 15 (App Router), React 19
- **Styling:** Tailwind CSS, ShadCN UI
- **AI Framework:** Genkit (Google's AI SDK)
- **Database/Auth:** Firebase
- **Icons:** Lucide React

## 📱 PWA Features
This app is configured as a **Progressive Web App**. It can be installed on iOS and Android devices directly from the browser, providing a native-like experience without needing the Play Store or App Store.

---
*Your Medical Partner is designed for longevity. As long as you have the code, you can deploy it to Vercel, Netlify, or any Cloud provider.*