# AnantaKatha — AI-Powered Storytelling Platform (Frontend)

AnantaKatha ("Endless Story") is a modern, full-stack platform where imagination meets AI. This repository contains the frontend React application built with Vite, Redux Toolkit, and Vanilla CSS.

## ✨ Features

- **AI Story Generation**: Seamless integration with Gemini and OpenAI to generate unique stories based on user prompts.
- **Story Customization**: Rewrite and refine stories using AI-driven customization tools.
- **Publishing Workflow**: Integrated drafting, submission, and admin-moderated publishing system.
- **User Dashboard**: Manage your personal library of stories, track views, and engage with the community.
- **Secure Authentication**: Robust JWT-based auth with session persistence and dual-token refresh strategy.
- **Responsive Design**: Premium, mobile-first UI with a focus on rich aesthetics and micro-animations.

## 🛠 Tech Stack

- **Framework**: [React 18](https://reactjs.org/) + [Vite 6](https://vitejs.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Styling**: Vanilla CSS (Modern CSS variables & Flexbox/Grid)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sahanikhushbu18-svg/anantakatha-frontend.git
   cd anantakatha-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📦 Project Structure

```
src/
├── api/          # Axios service modules
├── components/   # Reusable UI components
├── pages/        # Route-level page components
├── store/        # Redux store and slices
├── styles/       # Global CSS and themes
└── utils/        # Helper functions
```

## 🌐 Deployment

The frontend is optimized for deployment on **Cloudflare Pages**.

1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to Cloudflare Pages.
3. Ensure SPA routing by adding a `_redirects` file to the `public` folder with content: `/* /index.html 200`.

## 🔒 Security

- **JWT Storage**: Tokens are stored in `localStorage` with a robust refresh mechanism handled by Axios interceptors.
- **CSRF Protection**: All mutating requests include a CSRF token fetched from the backend.
- **Sanitization**: Inputs are validated client-side with Zod and sanitized server-side.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with care by the AnantaKatha Team.
