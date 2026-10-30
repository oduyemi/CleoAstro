import type { IProduct } from "../models/product.model";


export const PRODUCT_CATALOG = [
    {
      slug: "cleo-astro-beeds",
      number: "01",
      name: "Cleo Astro Beeds",
      category: "Spiritual Jewelry",
      description:
        "A symbolic beaded piece created for everyday wear, personal intention, and connection to your spiritual journey.",
      price: 50000,
      image: "/images/products/beads.png",
      featured: true,
    },
    {
      slug: "cleo-astra-clothes",
      number: "02",
      name: "Cleo Astra Clothes",
      category: "Spiritual Wears",
      description:
        "Meaningful spiritual wear designed to blend everyday style with intention, protection, and the energy of personal expression.",
      price: 70000,
      image: "/images/products/tshirt.png",
    },
    {
      slug: "cleo-astro-cap",
      number: "03",
      name: "Cleo Astro Cap",
      category: "Apparel",
      description:
        "A distinctive everyday cap inspired by the cosmos, crafted to carry the Cleo Astro spirit with effortless style.",
      price: 50000,
      image: "/images/products/cap2.jpeg",
    },
    {
      slug: "cleo-astro-perfumes",
      number: "04",
      name: "Cleo Astro Perfumes",
      category: "Perfume",
      description:
        "A refined fragrance experience created to complement your presence, evoke intention, and leave a memorable impression.",
      price: 70000,
      image: "/images/products/perfumes.png",
    },
    {
      slug: "cosmic-dogs",
      number: "05",
      name: "Cosmic Dogs",
      category: "Dogs",
      description:
        "Thoughtfully selected companion dogs for those seeking a loyal, meaningful presence and a deeper connection with their everyday journey.",
      price: 150000,
      image: "/images/products/dog.png",
    },
    {
      slug: "sacred-flip-flops",
      number: "06",
      name: "Sacred Flip Flops",
      category: "Apparel",
      description:
        "Comfortable everyday footwear infused with the Cleo Astro spirit, designed for relaxed movement and effortless personal style.",
      price: 100000,
      image: "/images/products/flipflop.jpeg",
    },
    {
      slug: "astrology-jalamai",
      number: "07",
      name: "Astrology Jalamai",
      category: "Apparel",
      description:
        "A distinctive piece inspired by astrology and spiritual tradition, created as a wearable expression of identity, intention, and personal alignment.",
      price: 30000,
      image: "/images/products/jalamia.png",
    },
    {
      slug: "sea-water",
      number: "08",
      name: "Sea Water",
      category: "Spiritual Jewelry",
      description:
        "A carefully presented spiritual essential inspired by the cleansing, renewing, and transformative qualities associated with the sea.",
      price: 5000,
      image: "/images/products/seawater.png",
    },
    {
      slug: "salt-alum-nzu",
      number: "09",
      name: "Salt / Alum / Nzu",
      category: "Accessories",
      description:
        "Traditional spiritual essentials brought together for personal rituals, cleansing practices, and intentional everyday use.",
      price: 5000,
      image: "/images/products/nzu.png",
    },
    {
      slug: "cleo-astro-clay-pot",
      number: "10",
      name: "Cleo Astro Clay Pot",
      category: "Accessories",
      description:
        "A handcrafted clay vessel inspired by traditional symbolism and spiritual practice, bringing an earthy, grounded presence to your space.",
      price: 70000,
      image: "/images/products/pot.png",
    },
] as const;
  