import type { AstroIntegration } from "astro";
import fs from "fs-extra";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface OGImagesOptions {
  template?: string;
  outputDir?: string;
  defaultTitle?: string;
}

export default function ogImages(
  options: OGImagesOptions = {}
): AstroIntegration {
  const {
    template = path.join(__dirname, "../../assets/og-template.svg"),
    outputDir = "public/og-images",
    defaultTitle = "Alexander Litvinovich",
  } = options;

  return {
    name: "astro-og-images",
    hooks: {
      "build:start": async () => {
        const pagesDir = path.join(process.cwd(), "src/pages");
        const layoutsDir = path.join(process.cwd(), "src/layouts");
        const publicPath = path.join(process.cwd(), outputDir);

        // Ensure the public directory exists
        await fs.ensureDir(publicPath);

        // Read the template SVG
        const templateContent = await fs.readFile(template, "utf-8");

        // Function to find title in layout files
        async function findTitleInLayouts(pageContent: string) {
          // Look for layout imports
          const layoutImports = pageContent.match(
            /import\s+(\w+Layout)\s+from\s+["']@\/layouts\/(\w+Layout)["']/g
          );
          if (!layoutImports) return null;

          for (const importLine of layoutImports) {
            const layoutName = importLine.match(
              /from\s+["']@\/layouts\/(\w+Layout)["']/
            )![1];
            const layoutPath = path.join(layoutsDir, `${layoutName}.astro`);

            try {
              const layoutContent = await fs.readFile(layoutPath, "utf-8");
              const titleMatch = layoutContent.match(
                /head\s*=\s*{\s*title:\s*["'](.+?)["']/
              );
              if (titleMatch) {
                return titleMatch[1];
              }
            } catch (error) {
              console.warn(`Could not read layout file: ${layoutPath}`);
            }
          }

          return null;
        }

        // Function to extract title from Astro file content
        async function extractTitle(content: string, filePath: string) {
          // Look for title in frontmatter
          const frontmatterMatch = content.match(/title:\s*["'](.+?)["']/);
          if (frontmatterMatch) {
            return frontmatterMatch[1];
          }

          // Look for title in head prop
          const headMatch = content.match(
            /head\s*=\s*{\s*title:\s*["'](.+?)["']/
          );
          if (headMatch) {
            return headMatch[1];
          }

          // Look for title in head object
          const headObjectMatch = content.match(/head\s*=\s*{\s*([^}]+)}/);
          if (headObjectMatch) {
            const headContent = headObjectMatch[1];
            const titleMatch = headContent.match(/title:\s*["'](.+?)["']/);
            if (titleMatch) {
              return titleMatch[1];
            }
          }

          // Look for HTML title tag
          const htmlTitleMatch = content.match(/<title>(.+?)<\/title>/);
          if (htmlTitleMatch) {
            return htmlTitleMatch[1];
          }

          // Look for title in layout files
          const layoutTitle = await findTitleInLayouts(content);
          if (layoutTitle) {
            return layoutTitle;
          }

          // Look for h1 tag
          const h1Match = content.match(/<h1[^>]*>(.+?)<\/h1>/);
          if (h1Match) {
            return h1Match[1];
          }

          // Default titles for known pages
          const defaultTitles: Record<string, string> = {
            "index.astro": defaultTitle,
            "game.astro": "Touch Arkanoid",
          };

          const fileName = path.basename(filePath);
          if (defaultTitles[fileName]) {
            return defaultTitles[fileName];
          }

          return null;
        }

        // Function to generate OG image for a page
        async function generateOGImage(title: string, outputPath: string) {
          // Replace the title placeholder in the SVG
          const svgContent = templateContent.replace(
            "TITLE_PLACEHOLDER",
            title
          );

          // Convert SVG to PNG using sharp
          await sharp(Buffer.from(svgContent)).png().toFile(outputPath);

          console.log(`Generated OG image: ${outputPath}`);
        }

        // Function to process a single page
        async function processPage(filePath: string) {
          const content = await fs.readFile(filePath, "utf-8");
          const title = await extractTitle(content, filePath);

          if (!title) {
            console.warn(`No title found for ${filePath}`);
            return;
          }

          // Generate output filename from the page path
          const relativePath = path.relative(pagesDir, filePath);
          const outputName = relativePath
            .replace(/\.astro$/, "")
            .replace(/index$/, "index")
            .replace(/\//g, "-");
          const outputPath = path.join(publicPath, `${outputName}.png`);

          await generateOGImage(title, outputPath);
        }

        // Function to recursively scan directory for Astro files
        async function scanDirectory(dir: string) {
          const entries = await fs.readdir(dir, { withFileTypes: true });

          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
              await scanDirectory(fullPath);
            } else if (entry.name.endsWith(".astro")) {
              await processPage(fullPath);
            }
          }
        }

        try {
          // Start scanning from the pages directory
          await scanDirectory(pagesDir);
          console.log("OpenGraph images generated successfully!");
        } catch (error) {
          console.error("Error generating OpenGraph images:", error);
          throw error;
        }
      },
    },
  };
}
