# Code Sherlock 🕵️‍♂️

**Your AI-Powered Code Review Assistant**

Code Sherlock helps you ship better code, faster. Our AI agent analyzes your code for correctness, security, and complexity, providing prioritized fixes to keep you moving.
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/16aab2ae-c7ee-4314-b504-045c0d1e0f00" />


## ✨ Features

- **🤖 Instant AI Analysis:** Get immediate feedback on your code for correctness, security vulnerabilities, and complexity.
- **🛡️ Security Focused:** The agent is trained to spot common security vulnerabilities before they make it to production.
- **📊 Prioritized Feedback:** Issues are automatically prioritized by severity (High, Medium, Low) so you know what to tackle first.
- **↔️ Side-by-Side Diff View:** Clearly visualize the suggested changes with a familiar diff interface.
- **💡 Smart Suggestions:** Receive intelligent, context-aware suggestions with explanations to improve code quality and maintainability.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **AI/ML:** [Genkit](https://firebase.google.com/docs/genkit)
- **UI:** [React](https://react.dev/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Deployment:** [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/FirebaseExtended/codelab-genkit-code-sherlock.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd codelab-genkit-code-sherlock
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Set up your environment variables:**
    Create a `.env` file in the root of the project and add your Gemini API key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
    ```env
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```
5.  **Run the development server:**
    ```sh
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

##  nasıl kullanılır

1.  Navigate to the [app page](http://localhost:9002/app).
2.  Enter a file name for context (e.g., `src/components/ui/button.tsx`).
3.  Paste your code or a code diff into the text area.
4.  Click "Review Code" and watch the AI agent analyze it in real-time.
5.  Review the prioritized list of issues and the suggested fixes.

## 📜 License

Distributed under the Apache 2.0 License. See `LICENSE` for more information.
