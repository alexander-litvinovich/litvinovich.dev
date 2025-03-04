import type { AstroIntegration } from "astro";
import fs from "fs";
import sharp from "sharp";
import { join, resolve } from "path";

interface OGImagesOptions {
  template: string;
}

function extractTitleFromHtml(html: string): string {
  // Try to find title in <title> tag
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    return titleMatch[1].trim();
  }

  // Try to find title in meta tags
  const metaTitleMatch = html.match(
    /<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i
  );
  if (metaTitleMatch) {
    return metaTitleMatch[1].trim();
  }

  // Try to find h1 tag
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) {
    return h1Match[1].trim();
  }

  return "Not Found";
}

export default function ogImages(options: OGImagesOptions): AstroIntegration {
  console.log("\n=== OG Images Integration Initialization ===");
  console.log("Integration options:", options);

  return {
    name: "og-images",
    hooks: {
      "astro:build:done": async (props: any) => {
        const { dir, routes } = props;

        console.log("\n=== OG Images Integration: astro:build:done hook ===");

        try {
          const templatePath = resolve(process.cwd(), options.template);
          const outputDir = join(dir.pathname, "og-images");
          console.log("Output directory:", outputDir);

          console.log("Current working directory:", process.cwd());
          console.log("Template path:", templatePath);

          // Check if template file exists
          if (!fs.existsSync(templatePath)) {
            throw new Error(`Template file not found at: ${templatePath}`);
          }

          // Ensure output directory exists
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log("Created output directory:", outputDir);
          }

          // Read template
          const template = fs.readFileSync(templatePath, "utf-8");
          console.log("Template loaded successfully");

          // Process routes
          for (const route of routes) {
            const pathname = route.pathname;
            let htmlFile: string;

            // Handle different page types
            if (pathname === "/") {
              htmlFile = "index.html";
            } else if (pathname === "/404") {
              htmlFile = "404.html";
            } else {
              htmlFile = `${pathname.replace(/^\//, "")}/index.html`;
            }

            console.log(`\nProcessing page: ${pathname}`);
            const htmlPath = join(dir.pathname, htmlFile);
            console.log("Reading HTML file:", htmlPath);

            let title = "Not Found";
            if (fs.existsSync(htmlPath)) {
              const html = fs.readFileSync(htmlPath, "utf-8");
              title = extractTitleFromHtml(html);
              console.log("Extracted title:", title);
            } else {
              console.log("HTML file not found, using default title");
            }

            const outputPath = join(
              outputDir,
              `${pathname.replace(/^\//, "").replace(/\/$/, "") || "index"}.png`
            );
            console.log("Output path:", outputPath);

            // Generate image
            const svg = template.replace("TITLE_PLACEHOLDER", title);
            await sharp(Buffer.from(svg)).png().toFile(outputPath);
            console.log(`Generated image for ${pathname}`);
          }

          console.log("\n=== OG Images Generation Completed Successfully ===");
        } catch (error) {
          console.error("\n=== Error in OG Images Generation ===");
          console.error(error);
          throw error;
        }
      },
    },
  };
}
