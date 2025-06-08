# ✊ Reject Finance Bill 2025

A privacy-first civic platform empowering Kenyan citizens to formally object to the controversial Finance Bill 2025 through automated parliamentary submissions and real-time collective action tracking.

🌐 **Live Platform**: [rejectfinancebill2025.vercel.app](https://rejectfinancebill2025.vercel.app/)  
📱 **Android App**: Progressive Web App (PWA) installable on mobile devices

---

## 🎯 Project Mission

**RejectFinanceBill25** is a grassroots digital resistance tool designed to amplify citizen voices against Kenya's Finance Bill 2025. The platform enables:

- **Automated objection submissions** to Parliament with personalized, legally-formatted letters
- **Real-time participation tracking** showing collective citizen engagement 
- **Privacy-protected activism** with zero personal data collection or storage
- **Educational resources** about the bill's harmful provisions
- **Mobile-first accessibility** for widespread citizen participation

This project emerged from widespread public opposition to the Finance Bill 2025, which critics argue will deepen economic inequality, increase the tax burden on ordinary Kenyans, and undermine constitutional rights.

---

## ⚡ Key Features

### 📧 One-Click Parliamentary Objection
- Generates legally-formatted objection letters automatically
- Opens user's default email client with pre-filled recipient and content
- Includes proper parliamentary submission formatting
- Allows for personal customization before sending

### 📊 Live Engagement Dashboard
- Real-time counter of platform visitors
- Live tracking of objection emails sent
- Anonymous, privacy-respecting analytics
- Visual milestone celebrations (UI changes at participation thresholds)

### 🔒 Privacy-First Architecture
- **Zero data collection** - all processing happens client-side
- **No user tracking** or personal information storage
- **Anonymous participation** - no accounts or logins required
- **Open source transparency** - full code audit available

### 📱 Mobile-Optimized Experience
- Progressive Web App (PWA) functionality
- Installable on Android devices as native app
- Responsive design for all screen sizes
- Offline-capable core functionality

---

## 🛠️ Technology Stack

Built with modern, performant web technologies:

- **⚡ Vite** - Lightning-fast build tool and dev server
- **⚛️ React 18** - Component-based UI framework with hooks
- **🔷 TypeScript** - Type-safe JavaScript for reliability
- **🎨 Tailwind CSS** - Utility-first styling framework
- **🧩 shadcn/ui** - Accessible, customizable UI components
- **📊 Supabase** - Open-source backend for analytics (view/action counters only)
- **🚀 Vercel** - Edge deployment and hosting platform

---

## 🧑‍💻 Local Development

### Prerequisites
- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **yarn** package manager
- **Git** for version control

### Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/saemsplays/rejectfinancebill25.git
cd rejectfinancebill25

# 2. Install dependencies
npm install

# 3. Set up environment variables (if needed)
cp .env.example .env.local
# Edit .env.local with your Supabase credentials (for analytics)

# 4. Start development server
npm run dev

# 5. Open in browser
# Navigate to http://localhost:5173
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

---

## 📁 Project Structure

```
rejectfinancebill25/
├── public/                 # Static assets
│   ├── icons/             # App icons and favicons
│   └── manifest.json      # PWA manifest
├── src/
│   ├── components/        # Reusable React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── EmailButton.tsx
│   │   ├── Counter.tsx
│   │   └── Header.tsx
│   ├── lib/              # Utility functions
│   │   ├── utils.ts      # General utilities
│   │   └── supabase.ts   # Database client
│   ├── hooks/            # Custom React hooks
│   ├── data/             # Static content
│   │   └── objectionTemplate.ts
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── index.html
├── tailwind.config.ts
├── vite.config.ts
├── package.json
└── README.md
```

---

## 🤝 Contributing

We welcome contributions from developers, designers, and civic-minded individuals who want to strengthen digital democracy in Kenya.

### How to Contribute

1. **Fork the repository** on GitHub
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** with clear, descriptive commits
4. **Test thoroughly** to ensure functionality
5. **Submit a pull request** with detailed description

### Contribution Areas

- 🌐 **Internationalization**: Add Swahili, local language support
- ♿ **Accessibility**: Improve screen reader compatibility, keyboard navigation
- 📱 **Mobile UX**: Enhance mobile experience and PWA functionality
- 🔧 **Performance**: Optimize loading times and bundle size
- 📊 **Analytics**: Improve privacy-respecting engagement tracking
- 🎨 **Design**: UI/UX improvements and visual enhancements
- 📝 **Content**: Better objection letter templates and educational content

### Code Standards

- Use TypeScript for all new code
- Follow existing code style and formatting
- Write descriptive commit messages
- Include comments for complex logic
- Test on multiple devices and browsers

---

## 🚀 Deployment

The project is automatically deployed to Vercel on push to the main branch.

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to Vercel (requires Vercel CLI)
npx vercel --prod

# Or deploy to any static hosting service
# The built files will be in the `dist/` directory
```

---

## 🛡️ Privacy & Security

### Our Privacy Commitment

- **No personal data collection** - We don't store names, emails, or personal information
- **No tracking pixels** or third-party analytics
- **Client-side processing** - All objection letter generation happens in your browser
- **Anonymous engagement metrics** - Only aggregate, non-identifying counts
- **Open source transparency** - Full code available for security audit

### Security Measures

- No server-side user data storage
- HTTPS encryption for all communications
- Content Security Policy (CSP) headers
- Regular dependency security updates

---

## 📄 Legal & Ethics

### Disclaimer

This platform facilitates legitimate civic participation through official parliamentary channels. Users are responsible for their own email communications. The platform creators do not endorse any particular political position beyond supporting democratic participation and transparency.

### License

This project is open source under the **MIT License**. See [LICENSE](LICENSE) for full details.

---

## 🙏 Acknowledgments

- **Built by**: [@saemsplays](https://github.com/saemsplays) and the open source community
- **Inspired by**: Courageous Kenyan citizens defending constitutional rights
- **Powered by**: Open source technologies and democratic principles
- **Special thanks**: To every developer, designer, and citizen who contributed to this project

---

## 📞 Support & Contact

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/saemsplays/rejectfinancebill25/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/saemsplays/rejectfinancebill25/discussions)
- 📧 **General Inquiries**: Open an issue or discussion on GitHub

---

**"The ultimate measure of a man is not where he stands in moments of comfort and convenience, but where he stands at times of challenge and controversy."** - Martin Luther King Jr.

Together, we build the democracy we deserve. 🇰🇪
