# ✨ Dream Me — AI-Powered Career Guidance Portal

Dream Me is a premium, high-fidelity career discovery and development platform. It guides users through an intuitive, multi-phase interview to tag cognitive styles, recommend matching flagship or niche career fields, and generate customized learning roadmaps with curated resource documentation and masterclass video players.

---

## 🚀 Key Features

### 1. Conversational Discovery Interview (Phase 1)
*   **Dynamic LLM Prompts:** A conversational chat interface powered by **IBM Watsonx.ai** that asks personalized follow-up questions tailored to your hobbies, ambiguity tolerance, and problem-solving preferences.
*   **Multi-Line Text Area:** Supports typing detailed, formatted responses with standard messaging shortcuts (e.g., `Shift + Enter` inserts a newline, and `Enter` sends the message).
*   **Persistent Transcript Drawer:** Slide-out dialog overlay panel (`View Conversation`) in the header that lets users review their complete chat history at any point during later phases.

### 2. Semantic Career Matching (Phase 2)
*   **LLM Affinity Mapping:** Replaces local hardcoded formulas with semantic matching. The model assesses responses against 8 affinity vectors (Creation, Exploration, Analysis, Structure, Visual, Logic, Social, Helping Others).
*   **Niche Domains Support:** Expanded beyond tech to include Cinema & Filmmaking, Performing Arts & Music, Journalism, and custom niche domains. 
*   **Detailed Transparency:** Explains exactly *why* a user matched with a career, referencing specific quotes and evidence from their interview responses.

### 3. Timeline Development & Launchpads (Phase 3)
*   **Interactive Timelines:** Shows a 4-phase learning roadmap (Foundations, Core, Advanced, Portfolio) with milestones loaded locally for curated domains and generated dynamically by LLM for custom fields.
*   **Masterclass Resource:** Queries the YouTube v3 API to embed curated masterclass introduction videos matching selected careers.
*   **PDF Roadmap Exporter:** Instantly compiles and downloads high-fidelity PDF documents of user roadmaps using **jsPDF**.

### 4. Dual-Theme Premium Styling (Light & Dark)
*   **Eye-Comfort Rose Themes:** 
    *   **Light Mode:** Warm pastel blush/pink (`#fff2f5`) with a readable rose-burgundy text (`#2d0e14`) and rich magenta accent borders (`#ec4899`) that eliminate eyes vibration.
    *   **Dark Mode:** Deep midnight velvet rose (`#1e0915`) card layouts with glowing pink highlights (`#f472b6`) and high-contrast text (`#fff0f5`).
*   **One-Click Toggle:** Switch between themes smoothly using the header mode controller.

---

## 🛠️ Architecture & Stateless Design

The project is architected with a **fully stateless serverless backend**, making it lightweight, fast, and optimized for serverless host environments like Vercel:

*   **Stateless Connection Handling:** Outgoing Watsonx API calls trust the client-accumulated `answers` payload as the single source of truth. There are **no in-memory sessions** stored on the server, preventing history desyncs or resets in multi-container setups.
*   **Watsonx Chat API Integration:** Uses the model-agnostic `/ml/v1/text/chat` endpoint and **`ibm/granite-4-h-small`** model. Structured message lists (`[{role, content}]`) avoid custom Llama-specific template overrides and guarantee valid JSON structures.
*   **Rate Limiter & Backoff Retry:** Includes an in-process queue limiting calls to `2 requests per 1000ms` with exponential backoff retries to handle `HTTP 429` rate warning triggers gracefully.
*   **Smart-Mock Fallback:** If the external APIs are offline or request quotas are exhausted, the server automatically recovers by supplying intelligent mock profiles and local roadmap datasets.

---

## ⚙️ Setup & Installation

### 1. Prerequisites
Ensure you have **Node.js** (v18+) installed.

### 2. Clone and Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the project root and configure your access credentials:
```env
WATSONX_APIKEY=your_ibm_cloud_api_key
WATSONX_PROJECT_ID=your_watsonx_project_id
YOUTUBE_APIKEY=your_google_developer_youtube_v3_key
```

### 4. Run Locally
To run the project locally, start both the API mock server and the Vite dev server in separate terminal sessions:

*   **Terminal 1 (Backend Dev API):**
    ```bash
    npm run api
    ```
    *Runs the local serverless handler simulation at `http://localhost:3001`.*

*   **Terminal 2 (Vite Frontend):**
    ```bash
    npm run dev
    ```
    *Runs the client app at `http://localhost:5173`.*

*   **Production Compilation:**
    Verify code compilation and compile the production bundle in the `/dist` directory:
    ```bash
    npm run build
    ```

---

## 🌐 Deployment to Vercel

Since the project uses serverless function folder conventions (`/api`), it deploys to Vercel instantly without additional configuration:

1.  Push the codebase to a GitHub/GitLab repository.
2.  Import the repository into your **Vercel Dashboard**.
3.  Add the environment variables in Vercel under **Settings ➜ Environment Variables**:
    *   `WATSONX_APIKEY`
    *   `WATSONX_PROJECT_ID`
    *   `YOUTUBE_APIKEY`
4.  Click **Deploy**. Vercel will build the frontend assets and automatically expose the `/api/watsonx` and `/api/youtube` serverless endpoints.
5.  *Note:* If you modify or update environment variables later, trigger a **Redeploy** on Vercel to reload the environment variables inside your active function containers.
