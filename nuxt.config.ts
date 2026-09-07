import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2026-08-14",

  devtools: {
    enabled: true,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  css: ["~/assets/css/main.css"],

  typescript: {
    strict: true,
    typeCheck: true,
  },

  runtimeConfig: {
    // -----------------------------------------------------------------------
    // Private server-side configuration
    // NEVER expose these inside `public`
    // -----------------------------------------------------------------------

    mongodbUri: process.env.MONGODB_URI || "",
    jwtSecret: process.env.JWT_SECRET || "",

    freeAstroApiKey: process.env.FREE_ASTRO_API_KEY || "",

    paystackSecretKey: process.env.PAYSTACK_SECRET_KEY || "",

    // cloudinaryCloudName:
    //   process.env.CLOUDINARY_CLOUD_NAME || "",

    // cloudinaryApiKey:
    //   process.env.CLOUDINARY_API_KEY || "",

    // cloudinaryApiSecret:
    //   process.env.CLOUDINARY_API_SECRET || "",

    // -----------------------------------------------------------------------
    // Client-accessible configuration
    // -----------------------------------------------------------------------

    public: {
      appName:
        process.env.NUXT_PUBLIC_APP_NAME ||
        "Cleo Astro",

      appUrl:
        process.env.NUXT_PUBLIC_APP_URL ||
        "http://localhost:3000",

      paystackPublicKey:
        process.env.NUXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },

      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          name: "theme-color",
          content: "#050814",
        },
      ],

      link: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
        },
      ],
    },
  },

  routeRules: {
    "/": {
      prerender: true,
    },

    "/horoscope/**": {
      swr: 3600,
    },

    "/blog/**": {
      swr: 3600,
    },

    "/shop/**": {
      swr: 300,
    },

    "/api/**": {
      cors: true,
    },
  },
});