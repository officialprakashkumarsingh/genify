# Genify - AI Web App Generator

🚀 **Ready to Deploy to Vercel!**

Genify is a powerful AI-powered web application generator that creates complete, production-ready web applications based on your descriptions. Built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

- 🤖 **AI-Powered Generation**: Uses advanced AI models to generate complete web applications
- 🎨 **10 Design Styles**: Choose from minimalistic, modern, professional, creative, and more
- ⚡ **Real-time Streaming**: Watch your code being generated in real-time
- 📱 **Mobile Optimized**: All generated applications are mobile-responsive
- 🔄 **Follow-up Editing**: Iteratively improve your generated applications with AI
- 👀 **Live Preview**: Preview your HTML applications instantly
- 📦 **Export as ZIP**: Download your complete project files
- 🚀 **One-click Deploy**: Deploy to Vercel with a single click
- 💻 **Syntax Highlighting**: Beautiful code display with proper formatting

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/genify)

### Option 1: One-Click Deploy
1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Deploy instantly!

### Option 2: Manual Deploy
1. Fork this repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your forked repository
5. Deploy!

## 🛠 Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/genify.git
cd genify
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Select an AI Model**: Choose from available models like GPT-4, Gemini, etc.
2. **Choose Design Style**: Pick from 10 different design aesthetics
3. **Describe Your App**: Enter a detailed description of what you want to build
4. **Generate**: Click "Generate Application" and watch the code stream in real-time
5. **Preview**: View your application in the built-in preview
6. **Iterate**: Use the follow-up feature to make changes and improvements
7. **Export**: Download your project as a ZIP file
8. **Deploy**: One-click deployment to Vercel

## Design Styles

- **Minimalistic**: Clean, simple design with lots of whitespace
- **Modern**: Contemporary design with bold typography
- **Professional**: Business-oriented, corporate aesthetic
- **Creative**: Artistic and expressive with vibrant colors
- **Dark Theme**: Dark background with light text
- **Retro**: Vintage-inspired design elements
- **Futuristic**: Sci-fi inspired with neon accents
- **Elegant**: Sophisticated and refined appearance
- **Playful**: Fun and colorful with rounded elements
- **Material Design**: Google Material Design principles

## API Configuration

The application uses an OpenAI-compatible API endpoint. The configuration is set in `src/lib/api.ts`:

- **Endpoint**: `https://longcat-openai-api.onrender.com/v1`
- **Models**: Supports various models including GPT-4, Gemini, and more

## Technologies Used

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix-like patterns
- **Code Highlighting**: React Syntax Highlighter
- **File Export**: JSZip
- **Icons**: Lucide React

## Deployment

### Deploy to Vercel

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Deploy with default settings

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue on GitHub or contact the development team.