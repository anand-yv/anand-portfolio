# Anand Yadav - Portfolio

A modern, production-quality developer portfolio showcasing backend-strong full-stack engineering expertise. Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## 🚀 Features

- **Modern Design**: Clean, professional SaaS-style interface
- **Dark/Light Mode**: System-aware theme switching
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **SEO Optimized**: Comprehensive metadata and semantic HTML
- **Static Generation**: Fast loading, zero server costs
- **Type-Safe**: Full TypeScript implementation
- **Accessible**: WCAG-compliant components and navigation

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Theming**: next-themes
- **Icons**: Lucide React
- **Deployment**: Vercel (static export)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

## 🏃 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd anand-portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
```

The static files will be generated in the `out/` directory.

## 📝 Editing Content

All portfolio content is stored in TypeScript files in the `src/data/` directory:

### Personal Information

Edit `src/data/personal.ts`:
- Name, title, location
- Email, GitHub, LinkedIn URLs
- Bio text
- Resume PDF path (if available)

### Projects

Edit `src/data/projects.ts`:
- Add/remove/modify project objects
- Each project includes:
  - Title, description, technologies
  - Category (backend/fullstack/frontend)
  - GitHub and live URLs
  - Key highlights

### Experience

Edit `src/data/experience.ts`:
- Add work experience entries
- Include company, position, dates
- Description bullets
- Technologies used

### Skills

Edit `src/data/skills.ts`:
- Add/remove skills
- Categorize (backend/frontend/database/tools)
- Optional proficiency level

### Education

Edit `src/data/education.ts`:
- Add education entries
- Institution, degree, field
- Dates and description

## 🎨 Customization

### Colors & Theme

Edit `src/app/globals.css`:
- Modify CSS variables for colors
- Adjust light/dark theme values
- Customize spacing and typography

### Components

All components are in `src/components/`:
- `sections/` - Page sections (Hero, About, Projects, etc.)
- `ui/` - Reusable UI components (ProjectCard, Timeline, etc.)
- `layout/` - Layout components (Navbar, ThemeToggle)

### Styling

- Use Tailwind utility classes in components
- Modify shadcn/ui components directly (they're copied, not installed)
- Global styles in `globals.css`

## 📁 Project Structure

```
anand-portfolio/
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── layout.tsx     # Root layout with theme
│   │   ├── page.tsx       # Home page
│   │   └── globals.css    # Global styles
│   ├── components/        # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── sections/      # Page sections
│   │   └── layout/        # Layout components
│   ├── data/              # Portfolio content
│   │   ├── personal.ts
│   │   ├── projects.ts
│   │   ├── experience.ts
│   │   ├── skills.ts
│   │   └── education.ts
│   ├── lib/               # Utilities
│   │   ├── utils.ts
│   │   └── theme-provider.tsx
│   └── types/             # TypeScript types
│       └── index.ts
├── components.json        # shadcn config
├── next.config.ts         # Next.js config
└── package.json
```

## 🚀 Deployment

### Vercel (Recommended - Free)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial portfolio"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"

3. **Configure Build Settings** (if needed):
   - Build Command: `npm run build`
   - Output Directory: `out`
   - Install Command: `npm install`

4. **Custom Domain** (optional):
   - Add your domain in Vercel dashboard
   - Update DNS records as instructed

### Other Static Hosts

Since this is a static export, you can deploy to any static host:

- **Netlify**: Drag and drop the `out/` folder
- **GitHub Pages**: Push `out/` to `gh-pages` branch
- **AWS S3 + CloudFront**: Upload `out/` to S3 bucket
- **Any static host**: Upload the `out/` directory

## 🔧 Configuration

### Static Export

Already configured in `next.config.ts`:
```typescript
output: "export",
images: {
  unoptimized: true,
},
```

### Metadata

Update SEO metadata in `src/app/layout.tsx`:
- Title, description
- Open Graph tags
- Twitter card
- Update URLs with your domain

## 📱 Features Explained

### Theme Switching

- Uses `next-themes` for theme management
- Supports light, dark, and system (OS preference)
- Persists choice in localStorage
- No hydration mismatches

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Flexible grid layouts
- Touch-friendly navigation

### Performance

- Static generation = instant loads
- Minimal JavaScript
- Optimized fonts and images
- Code splitting automatic

## 🐛 Troubleshooting

### Build Errors

- **TypeScript errors**: Check `src/types/index.ts` matches data structure
- **Import errors**: Verify all dependencies installed (`npm install`)
- **Image errors**: Ensure images in `public/` or use unoptimized mode

### Theme Issues

- **Hydration warnings**: Already handled with `suppressHydrationWarning`
- **Theme not switching**: Check `ThemeProvider` in layout.tsx

### Styling Issues

- **Tailwind not working**: Check `tailwind.config` (if using v3) or `globals.css` (v4)
- **Dark mode not working**: Verify CSS variables in `globals.css`

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://www.typescriptlang.org)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Anand Yadav**
- Location: Mumbai, Maharashtra, India
- GitHub: [@anandyadav](https://github.com/anandyadav)
- LinkedIn: [Anand Yadav](https://linkedin.com/in/anandyadav)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Fonts from [Geist](https://vercel.com/font)

---

**Note**: Remember to update all placeholder content (email, GitHub, LinkedIn, company names, etc.) with your actual information before deploying!
