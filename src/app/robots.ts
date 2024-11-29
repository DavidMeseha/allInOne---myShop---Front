import { languages } from "@/lib/misc";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const allowLoginPage = languages.map((lang) => `/${lang}/login`);
  const allowRegisterPage = languages.map((lang) => `/${lang}/register`);
  const allowProductPage = languages.map((lang) => `/${lang}/product/*`);
  const allowVendorProfile = languages.map((lang) => `/${lang}/profile/vendor/*`);
  const allowTagProfile = languages.map((lang) => `/${lang}/profile/tag/*`);
  const allowCategoryProfile = languages.map((lang) => `/${lang}/profile/category/*`);
  const allowFeeds = languages.map((lang) => `/${lang}/feeds`);
  const allowHome = languages.map((lang) => `/${lang}`);
  const allowSitemap = ["/sitemap.xml"];

  return {
    rules: {
      userAgent: "*",
      allow: [
        ...allowCategoryProfile,
        ...allowFeeds,
        ...allowHome,
        ...allowLoginPage,
        ...allowProductPage,
        ...allowRegisterPage,
        ...allowTagProfile,
        ...allowSitemap,
        ...allowVendorProfile
      ],
      disallow: "/"
    },
    sitemap: "https://techshop-commerce.vercel.app/sitemap.xml"
  };
}
