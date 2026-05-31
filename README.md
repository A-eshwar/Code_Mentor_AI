# Code Mentor AI 💻

Code Mentor AI is an intelligent, modern web application designed to act as your personal Data Structures and Algorithms (DSA) tutor and general programming assistant. It leverages the power of Google's Gemini AI to provide intuitive explanations, solve coding challenges, and guide you through software engineering concepts.

## Features ✨

- **Smart Dashboard:** Ask any coding question and receive beautifully formatted, markdown-rendered explanations.
- **Dedicated Tutorials Reader:** Learn core DSA concepts (Arrays, Linked Lists, Trees, etc.) in an immersive, distraction-free reading mode.
- **Interactive Playground:** Paste LeetCode problems or describe your coding challenge, select your preferred programming language, and get a generated solution.
- **Persistent Chat History:** Seamlessly jump back into recent chats directly from the sidebar.
- **Curated Resources:** Quick access to top learning platforms like GeeksforGeeks, LeetCode, and HackerRank.
- **Modern Glassmorphic UI:** A sleek, dark-mode aesthetic with frosted glass elements and fluid micro-animations.

## Technologies Used 🛠️

- **Frontend:** HTML5, Vanilla CSS (Glassmorphism), Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **AI Integration:** `@google/genai` (Gemini 2.5 Flash)
- **Markdown Parsing:** Marked.js

## Running Locally 🚀

1. **Clone the repository:**
   ```bash
   git clone https://github.com/A-eshwar/Code_Mentor_AI.git
   cd Code_Mentor_AI
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
4. **Start the server:**
   ```bash
   npm start
   ```
5. **Open in Browser:**
   Navigate to `http://localhost:3000`.
