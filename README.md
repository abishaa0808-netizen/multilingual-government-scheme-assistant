# National Multilingual Welfare Scheme Discovery Portal 🇮🇳

An inclusive, full-stack, enterprise-grade citizen welfare portal providing unified access to verified Central and State Government schemes across all 20 socio-economic sectors and 36 States & Union Territories of India.

Designed with accessibility, multilingual support in 11 languages, hands-free voice assistance, on-screen Indic virtual keyboard, autonomous RAG intelligence, and citizen authentication with one-time password (OTP) verification.

---

## 🌟 Key Features

1. **Gate Authentication & Identity Verification**:
   - Secure OTP verification via Email or 10-digit Mobile Number.
   - Built-in real live email dispatch (via Nodemailer SMTP / Resend) and SMS dispatch (via Twilio / Fast2SMS).
2. **11 Supported Indian Languages & English**:
   - English, हिन्दी (Hindi), বাংলা (Bengali), தமிழ் (Tamil), తెలుగు (Telugu), मराठी (Marathi), ગુજરાતી (Gujarati), ಕನ್ನಡ (Kannada), മലയാളം (Malayalam), ଓଡ଼ିଆ (Odia), and اردو (Urdu).
3. **Interactive Multilingual Virtual Keyboard**:
   - 1-click on-the-fly language switcher supporting all 11 languages.
   - Consonants, vowels, matras/signs, numerals, and direct search integration.
4. **Autonomous Voice Scheme Assistant**:
   - Hands-free speech recognition and speech synthesis in regional languages.
   - Intelligent natural language routing: Speaking queries like *"I want to see all the education related sector for college students"* automatically navigates and filters the scheme catalog.
5. **RAG-Powered AI Welfare Assistant**:
   - Multi-tool retrieval-augmented generation grounded in verified government data.
6. **Cross-Sector Scheme Discovery & Missing Schemes Finder**:
   - Uncover hidden entitlements in Healthcare, Social Security, and Energy.

---

## 💻 Step 1: Opening the Project in VS Code

1. Download or clone your repository to your computer.
2. Open **VS Code**, go to **File > Open Folder...**, and select this project directory.
3. Open a terminal in VS Code (`Ctrl + ~` on Windows/Linux or `Cmd + ~` on macOS).
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run the local development server:
   ```bash
   npm run dev
   ```
6. Open your browser to `http://localhost:3000`.

---

## 🐙 Step 2: Adding and Pushing to GitHub

1. Open your terminal in the project root directory.
2. Initialize git if not already initialized:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of National Welfare Scheme Portal"
   ```
3. Go to [GitHub.com](https://github.com) and create a **New Repository** (e.g. `welfare-schemes-portal`).
4. Link your local repository to GitHub and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```

---

## 🚀 Step 3: Deploying on Render (Free Public Web Service)

Render allows you to host this full-stack application online with a permanent public HTTPS URL (e.g., `https://your-app-name.onrender.com`) for anyone in the world to access.

### Method A: 1-Click Blueprint (Recommended)
1. Sign up / Log in to [Render.com](https://render.com).
2. Click **New +** > **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect `render.yaml` and configure:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Click **Apply**. Render will build and deploy your app with a live link!

### Method B: Manual Web Service Setup
1. On Render dashboard, click **New +** > **Web Service**.
2. Select **Build and deploy from a Git repository** and connect your GitHub repo.
3. Fill in the settings:
   - **Name**: `welfare-schemes-portal`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render will bind to this automatically)
5. Click **Deploy Web Service**. Once the build finishes, your live public URL is active!

---

## 📧 Step 4: Configuring Real Live Email OTP Delivery

To deliver real OTPs to actual email inboxes across the globe:

### Option A: Free Gmail SMTP (Easiest & Free)
1. In your Google Account, enable **2-Step Verification**.
2. Go to **Security > App passwords** (`myaccount.google.com/apppasswords`).
3. Generate a 16-character app password for "Mail".
4. Set the following environment variables (in `.env` locally or in the Render Dashboard under **Environment**):
   ```env
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-16-character-app-password"
   SMTP_FROM="National Schemes Portal <your-email@gmail.com>"
   ```

### Option B: Resend API (Modern & Free Tier)
1. Sign up at [Resend.com](https://resend.com) and get an API key.
2. Set in environment variables:
   ```env
   RESEND_API_KEY="re_123456789..."
   ```

---

## 📱 Step 5: Configuring Real Live Mobile SMS OTP Delivery

To deliver real OTPs to mobile phones via SMS:

### Option A: Twilio (Global SMS Delivery)
1. Create a free account at [Twilio.com](https://www.twilio.com).
2. Get your **Account SID**, **Auth Token**, and **Twilio Phone Number**.
3. Set in environment variables:
   ```env
   TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   TWILIO_AUTH_TOKEN="your_auth_token_here"
   TWILIO_PHONE_NUMBER="+1xxxxxxxxxx"
   ```

### Option B: Fast2SMS (Indian Numbers Instant Delivery)
1. Create a free account at [Fast2SMS.com](https://www.fast2sms.com).
2. Copy your API Key from the Dev API section.
3. Set in environment variables:
   ```env
   FAST2SMS_API_KEY="your_fast2sms_api_key_here"
   ```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, tsx
- **Build Tool**: Vite
- **Mail & SMS**: Nodemailer, Resend API, Twilio API, Fast2SMS
- **AI & RAG**: Google GenAI SDK, Meta Llama
- **Deployment**: Render, Vercel, Docker-ready
