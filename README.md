# 🧠 MindMirror AI - Emotional Wellness Platform

A complete, production-ready AI-powered emotional wellness platform with authentication, sentiment analysis, and beautiful UI.

## ✨ Features

### 🔐 Authentication System
- **Login** - Secure user authentication
- **Signup** - Account creation with password validation
- **Forgot Password** - Password reset flow
- **Protected Routes** - Secure dashboard access
- **Session Management** - Remember me functionality

### 🎯 Core Features
- **Real-Time Sentiment Analysis** - Dynamic emotional analysis (NOT fake 50%)
- **4 Key Metrics** - Stress, Motivation, Confidence, Emotional Balance
- **Emotional State Detection** - Burnout, Stressed, Thriving, Positive, Balanced, etc.
- **AI Recommendations** - Personalized suggestions based on your emotions
- **History Tracking** - View past analyses with interactive charts
- **Data Export** - Download your history as JSON

### 🎨 UI/UX
- **Premium Minimal Design** - Clean, professional SaaS aesthetic
- **Glassmorphism Cards** - Modern frosted glass effects
- **Dark/Light Mode** - Full theme support
- **Fully Responsive** - Mobile, tablet, desktop optimized
- **Smooth Animations** - Framer Motion transitions

### 📊 Analytics
- **Mood Trend Chart** - Line chart showing emotional patterns
- **Emotional Distribution** - Pie chart of current state
- **Productivity & Focus** - Bar chart tracking performance

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📖 How to Use

### First Time Setup
1. Open http://localhost:3000
2. Click "Sign up" to create an account
3. Fill in username, email, and password
4. Password must have:
   - At least 8 characters
   - One uppercase letter
   - One lowercase letter
   - One number
   - One special character

### Using the App
1. **Login** with your credentials
2. **Dashboard** - Enter your feelings and click "Analyze"
3. **View Results** - See your emotional metrics and recommendations
4. **History** - Track your emotional journey with charts
5. **Export** - Download your data anytime

## 🧪 Test Account

You can create a test account:
- Email: test@example.com
- Password: Test@123
- Username: testuser

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **React Router** - Navigation
- **React Icons** - Icon library
- **localStorage** - Data persistence

## 📁 Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── MetricCard.jsx
│   ├── Layout.jsx
│   └── ProtectedRoute.jsx
├── pages/          # Page components
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── ForgotPassword.jsx
│   ├── Dashboard.jsx
│   └── History.jsx
├── contexts/       # React contexts
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── services/       # Business logic
│   ├── authService.js
│   └── sentimentService.js
└── App.jsx         # Main app component
```

## 🎨 Color Palette

- **Primary Purple**: #7B2CBF (buttons, accents)
- **Background Light**: #F9FAFB
- **Background Dark**: #111827
- **Card Light**: #FFFFFF
- **Card Dark**: #1F2937

## 🔒 Security Features

- Password validation with strength requirements
- Email validation
- Protected routes (requires authentication)
- Session persistence
- Secure logout

## 🌐 Deployment

### Netlify
1. Build: `npm run build`
2. Drag `dist` folder to Netlify
3. Done!

### Vercel
1. Connect GitHub repo
2. Auto-deploy on push

## 📝 License

MIT

## 👨‍💻 Author

Built with ❤️ using React + Vite

---

**Note**: This is a client-side application using localStorage. For production use with real users, consider adding a backend API for secure data storage.
