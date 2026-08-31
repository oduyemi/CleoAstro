import tailwindcss from "@tailwindcss/vite"

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
    mongodbUri: "",
    jwtSecret: "",

    paystackSecretKey: "",

    cloudinaryCloudName: "",
    cloudinaryApiKey: "",
    cloudinaryApiSecret: "",

    public: {
      appName: "Cleo Astro",
      appUrl: "http://localhost:3000",
      paystackPublicKey: "",
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
          content: "#120B2E",
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
})