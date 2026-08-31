export default defineAppConfig({
    app: {
      name: "Cleo Astro",
      description:
        "Authentic Vedic astrology, personalized readings, spiritual guidance, and sacred products.",
    },
  
    theme: {
      primary: "#D99A0B",
      secondary: "#120B2E",
      background: "#FAF7F0",
    },
  
    navigation: {
      main: [
        {
          label: "Home",
          to: "/",
        },
        {
          label: "About Guru",
          to: "/about",
        },
        {
          label: "Horoscope",
          to: "/horoscope",
        },
        {
          label: "Readings",
          to: "/readings",
        },
        {
          label: "Shop",
          to: "/shop",
        },
        {
          label: "Blog",
          to: "/blog",
        },
        {
          label: "Contact",
          to: "/contact",
        },
      ],
    },
  });