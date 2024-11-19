import type { MetadataRoute } from "next";

const BASE_URL = "https://all-in-one-my-shop-front.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          es: `${BASE_URL}/en`,
          de: `${BASE_URL}/ar`
        }
      }
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      alternates: {
        languages: {
          es: `${BASE_URL}/en/login`,
          de: `${BASE_URL}/ar/login`
        }
      }
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date(),
      alternates: {
        languages: {
          es: `${BASE_URL}/en/register`,
          de: `${BASE_URL}/ar/register`
        }
      }
    },
    {
      url: `${BASE_URL}/feeds`,
      lastModified: new Date(),
      alternates: {
        languages: {
          es: `${BASE_URL}/en/feeds`,
          de: `${BASE_URL}/ar/feeds`
        }
      }
    },
    {
      url: `${BASE_URL}/discover/categories`,
      lastModified: new Date(),
      alternates: {
        languages: {
          es: `${BASE_URL}/en/discover/categories`,
          de: `${BASE_URL}/ar/discover/categories`
        }
      }
    },
    {
      url: `${BASE_URL}/discover/tags`,
      lastModified: new Date(),
      alternates: {
        languages: {
          es: `${BASE_URL}/en/discover/tags`,
          de: `${BASE_URL}/ar/discover/tags`
        }
      }
    },
    {
      url: `${BASE_URL}/discover/vendors`,
      lastModified: new Date(),
      alternates: {
        languages: {
          es: `${BASE_URL}/en/discover/vendors`,
          de: `${BASE_URL}/ar/discover/vendors`
        }
      }
    }
  ];
}
