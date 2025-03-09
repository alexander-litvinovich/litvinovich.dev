# Micro Landing Page

A modular, component-based personal landing page built with Astro, CSS, and TypeScript.

## ✨ Features

- **Astro-Powered**: Leveraging Astro's static site generation for blazing-fast performance
- **Humble PWA Setup**: Progressive Web App capabilities for offline access and better mobile experience
- **OpenGraph Image Generation**: Automatically generate dynamic social media preview images
- **Component-Driven**: Modular design with components controlled via props
- **TypeScript Integration**: Type-safe development experience
- **Responsive Design**: Looks great on all devices with clean, modern CSS

## 📦 Project Structure

```
/
├── src/
│   ├── components/       # Reusable UI components
│   ├── integrations/
│   │   └── og-images.ts  # OpenGraph image generation
│   ├── layouts/          # Page layouts
│   └── pages/            # Astro pages
└── astro.config.mjs      # PWA config
```

### OpenGraph Image Generation

This project uses a custom utility to generate OpenGraph images for social media previews. You can find the configuration in `src/integrations/og-images.ts`. The image template is located at `src/assets/og-template.svg`.

### PWA Configuration

The PWA setup includes a config for generating a basic manifest file. To customize or update app information edit `astro.config.mjs`.

### Edit texts in page files

```
pages/
├── index.astro        # Homepage
├── 404.astro          # For page not found
├── donate.astro       # secondary pages
└── offering.astro
```

## 💻 Development

Clone the repo, install dependencies, and run. Prerequisites Node.js 16+

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📜 License

### Code License

This project's code is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Media License

The graphics and images in this project cannot be redistributed without the author's permission.

The video for the "offering" page from "Muzzy in Gondoland" is owned by BBC corporation.

## 💰 Want your own custom micro landing page?

If you are looking for a unique and personalized website, but web technologies are not your thing, contact me so we can discuss your project and begin building something incredible for you.
