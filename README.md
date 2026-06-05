 FlyPage

A sleek, premium, dark-grey documentation template built with **Vite**, **React (TypeScript)**, and **Vanilla CSS**. Designed to be fast, minimal, and incredibly easy to use.

## Features

- **Search**: Sidebar search to filter through your pages
- **Copy Utility**: One-click "Copy Page" and "Copy Code" buttons.
- **Fully Responsive**: Optimized for desktop, tablet, and mobile viewing.

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/FlyLabs-Dev/FlyPage.git
cd simple-docs
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## How to Add Content

Managing content is simple and doesn't require touching much code.

### Step 1: Create a Markdown file
Add a new `.md` file to the `public/docs/` directory (e.g., `public/docs/my-new-page.md`).

### Step 2: Register the page
Open `src/data/docs.ts` and add your page to the `docsMetadata` array:

```typescript
export const docsMetadata: DocMetadata[] = [
  // ... existing pages
  {
    id: 'my-new-page',
    title: 'My New Page',
    path: '/docs/my-new-page.md',
    icon: 'FileText' // Optional: Book, Palette, FileText, Component, Zap
  }
];
```

---

## Customization

### Theme Colors
All colors are managed via CSS variables in `src/App.css`. You can easily change the primary background or accent color:

```css
:root {
  --bg-primary: #121212;
  --bg-secondary: #1e1e1e;
  --accent-color: #ffffff; /* Change this to your brand color! */
  --text-main: #e1e1e1;
}
```

### Fonts
The template uses **Plus Jakarta Sans** for UI and **JetBrains Mono** for code. You can swap these out in the `@import` section at the top of `src/App.css`.

---

## Advanced Markdown Syntax

### Callouts (Admonitions)
Wrap your content in a blockquote and start with a tag:
```markdown
> [!INFO] Custom Title
> This is a beautifully styled information callout!
```
Supported tags: `[!INFO]`, `[!WARNING]`, `[!ERROR]`, `[!SUCCESS]`.

### Code Blocks
Standard Markdown code blocks automatically get a header with a language icon and a copy button:
\```javascript
console.log("Hello, World!");
\```

---

## Deployment

The easiest way to deploy is using **Vercel** or **Netlify**:

1. Push your code to GitHub.
2. Connect your repo to Vercel/Netlify.
3. Use the following build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

---

## License

This project is open-source and available under the [MIT License](LICENSE).
