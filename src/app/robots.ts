import { languages } from "@/lib/misc";
import type { MetadataRoute } from "next";

type RobotRoutes = {
  [key: string]: string[];
};

// Define allowed routes by type
const allowedRoutes: RobotRoutes = {
  auth: ["login", "register"],
  product: ["product/*"],
  profile: ["profile/vendor/*", "profile/tag/*", "profile/category/*"],
  pages: ["feeds"],
  system: ["sitemap.xml"]
};

export default function robots(): MetadataRoute.Robots {
  // Generate language-specific paths
  const generatePaths = (routes: string[]): string[] => {
    const paths: string[] = [];

    // Add root paths for each language
    languages.forEach((lang) => {
      paths.push(`/${lang}`);
      routes.forEach((route) => {
        paths.push(`/${lang}/${route}`);
      });
    });

    return paths;
  };

  // Combine all allowed paths
  const allowedPaths = [
    ...generatePaths([
      ...allowedRoutes.auth,
      ...allowedRoutes.product,
      ...allowedRoutes.profile,
      ...allowedRoutes.pages
    ]),
    ...allowedRoutes.system
  ];

  return {
    rules: {
      userAgent: "*",
      allow: allowedPaths,
      disallow: [
        "/api/*", // Block API routes
        "/admin/*", // Block admin routes
        "/_next/*", // Block Next.js system files
        "/*.json$", // Block JSON files
        "/*.xml$", // Block XML files except sitemap
        "/cdn-cgi/*", // Block Cloudflare files
        "/private/*" // Block private routes
      ]
    },
    sitemap: "https://techshop-commerce.vercel.app/sitemap.xml"
  };
}
