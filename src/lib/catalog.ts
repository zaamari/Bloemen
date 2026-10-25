import type { Localized } from "./i18n";

// Voorbeelddata. Namen en prijzen zijn tijdelijk; dit komt later uit de database (Supabase).

export type CategoryId = "bouquets" | "chocolate" | "candy" | "gifts";

export type Category = {
  id: CategoryId;
  name: Localized;
  image: string;
};

export type Product = {
  slug: string;
  name: string;
  category: CategoryId;
  price: number; // in centen
  tagline: Localized;
  description: Localized;
  details: Localized[];
  images: string[];
  badge?: Localized;
};

export type GalleryItem = {
  image: string;
  title: Localized;
  tall?: boolean;
};

export const categories: Category[] = [
  { id: "bouquets", name: { nl: "Satijnen boeketten", en: "Satin bouquets" }, image: "/images/products/bordeaux-nuit-1.jpg" },
  { id: "chocolate", name: { nl: "Rozen & chocolade", en: "Roses & chocolate" }, image: "/images/products/coeur-dore-1.jpg" },
  { id: "candy", name: { nl: "Snoeptaarten", en: "Candy cakes" }, image: "/images/products/sweet-heart-2.jpg" },
  { id: "gifts", name: { nl: "Cadeaus", en: "Gifts" }, image: "/images/products/miroir-champagne-1.jpg" },
];

export const products: Product[] = [
  {
    slug: "bordeaux-nuit",
    name: "Bordeaux Nuit",
    category: "bouquets",
    price: 12900,
    badge: { nl: "Bestseller", en: "Bestseller" },
    tagline: { nl: "Bordeaux satijn met gipskruid", en: "Burgundy satin with baby's breath" },
    description: {
      nl: "Ruim vijftig bordeaux rozen van glanzend satijnlint, losjes afgewisseld met wit gipskruid. Verpakt in zwart papier met een gouden rand. Ons meest gevraagde ontwerp.",
      en: "Over fifty burgundy roses of shiny satin ribbon, loosely mixed with white baby's breath. Wrapped in black paper with a gold edge. Our most requested design.",
    },
    details: [
      { nl: "± 55 rozen", en: "± 55 roses" },
      { nl: "Doorsnede ± 45 cm", en: "Diameter ± 45 cm" },
      { nl: "Zwart-goud papier", en: "Black and gold paper" },
    ],
    images: ["/images/products/bordeaux-nuit-1.jpg", "/images/products/bordeaux-nuit-2.jpg", "/images/products/bordeaux-nuit-3.jpg"],
  },
  {
    slug: "coeur-dore",
    name: "Cœur Doré",
    category: "chocolate",
    price: 7900,
    badge: { nl: "Valentijn", en: "Valentine's" },
    tagline: { nl: "Rode rozen met een hart van chocolade", en: "Red roses with a heart of chocolate" },
    description: {
      nl: "Een krans van rode satijnen rozen rond een hart van gouden chocoladebonbons. Afgewerkt met glitterhartjes en rode vlinders.",
      en: "A wreath of red satin roses around a heart of golden chocolates. Finished with glitter hearts and red butterflies.",
    },
    details: [
      { nl: "± 16 rozen", en: "± 16 roses" },
      { nl: "± 30 chocoladebonbons", en: "± 30 chocolates" },
      { nl: "Zwart papier met koperen rand", en: "Black paper with copper edge" },
    ],
    images: ["/images/products/coeur-dore-1.jpg", "/images/products/coeur-dore-2.jpg", "/images/products/coeur-dore-3.jpg"],
  },
  {
    slug: "champagne-perle",
    name: "Champagne Perle",
    category: "bouquets",
    price: 8900,
    tagline: { nl: "Rood en champagne met parels", en: "Red and champagne with pearls" },
    description: {
      nl: "Rode en champagnekleurige rozen in een kraag van tule met parelrand, omringd door crème papier met gouden randen. Met gouden vlinders.",
      en: "Red and champagne roses in a tulle collar with a pearl edge, surrounded by cream paper with gold edges. With golden butterflies.",
    },
    details: [
      { nl: "± 20 rozen", en: "± 20 roses" },
      { nl: "Tule met parelrand", en: "Tulle with pearl edge" },
      { nl: "Crème-goud papier", en: "Cream and gold paper" },
    ],
    images: ["/images/products/champagne-perle-1.jpg", "/images/products/champagne-perle-2.jpg", "/images/products/champagne-perle-3.jpg"],
  },
  {
    slug: "violette-royale",
    name: "Violette Royale",
    category: "bouquets",
    price: 11900,
    tagline: { nl: "Paars en lila met een tiara", en: "Purple and lilac with a tiara" },
    description: {
      nl: "Paarse, lila en witte rozen met een gouden randje, bekroond met een fonkelende tiara. Een boeket voor een prinses.",
      en: "Purple, lilac and white roses with a golden edge, crowned with a sparkling tiara. A bouquet for a princess.",
    },
    details: [
      { nl: "± 50 rozen", en: "± 50 roses" },
      { nl: "Inclusief tiara", en: "Tiara included" },
      { nl: "Zwart-goud papier", en: "Black and gold paper" },
    ],
    images: ["/images/products/violette-royale-1.jpg", "/images/products/violette-royale-2.jpg"],
  },
  {
    slug: "rouge-ivoire",
    name: "Rouge & Ivoire",
    category: "bouquets",
    price: 5900,
    tagline: { nl: "Rood en ivoor, puur en klassiek", en: "Red and ivory, pure and classic" },
    description: {
      nl: "Een klassiek boeket van rode en ivoorkleurige rozen, verpakt in zacht wit papier. Mooi als bruidsboeket of als stijlvol cadeau.",
      en: "A classic bouquet of red and ivory roses, wrapped in soft white paper. Lovely as a bridal bouquet or a stylish gift.",
    },
    details: [
      { nl: "± 18 rozen", en: "± 18 roses" },
      { nl: "Wit papier", en: "White paper" },
      { nl: "Ook als bruidsboeket", en: "Also as a bridal bouquet" },
    ],
    images: ["/images/products/rouge-ivoire-1.jpg", "/images/products/rouge-ivoire-2.jpg"],
  },
  {
    slug: "sweet-heart",
    name: "Sweet Heart",
    category: "candy",
    price: 4500,
    tagline: { nl: "Snoeptaart in hartvorm", en: "Heart-shaped candy cake" },
    description: {
      nl: "Een hartvormige taart van twee lagen chocoladerepen, gevuld met bonbons en kokosballetjes, afgewerkt met bordeaux lint.",
      en: "A heart-shaped cake of two layers of chocolate bars, filled with chocolates and coconut treats, finished with burgundy ribbon.",
    },
    details: [
      { nl: "Twee lagen", en: "Two layers" },
      { nl: "Bonbons en kokosballetjes", en: "Chocolates and coconut treats" },
      { nl: "Bordeaux lint", en: "Burgundy ribbon" },
    ],
    images: ["/images/products/sweet-heart-1.jpg", "/images/products/sweet-heart-2.jpg"],
  },
  {
    slug: "miroir-champagne",
    name: "Miroir Champagne",
    category: "gifts",
    price: 9500,
    badge: { nl: "Uniek", en: "Unique" },
    tagline: { nl: "Golvende spiegel met satijnen rozen", en: "Wavy mirror with satin roses" },
    description: {
      nl: "Een golvende spiegel met fluwelen rand, omringd door champagnekleurige satijnen rozen en gouden bessen. Met tiara. Een cadeau dat blijft staan.",
      en: "A wavy mirror with a velvet frame, surrounded by champagne satin roses and golden berries. With a tiara. A gift that stays.",
    },
    details: [
      { nl: "Fluwelen spiegel", en: "Velvet mirror" },
      { nl: "± 24 rozen", en: "± 24 roses" },
      { nl: "Inclusief tiara", en: "Tiara included" },
    ],
    images: ["/images/products/miroir-champagne-1.jpg", "/images/products/miroir-champagne-2.jpg"],
  },
];

export const gallery: GalleryItem[] = [
  { image: "/images/gallery/rood-champagne.jpg", title: { nl: "Rood & champagne bij avondlicht", en: "Red & champagne at dusk" }, tall: true },
  { image: "/images/gallery/cadeautas.jpg", title: { nl: "Cadeautas voor een geslaagde", en: "Graduation gift bag" }, tall: true },
  { image: "/images/gallery/duo-ferrero.jpg", title: { nl: "Twee hartboeketten", en: "Two heart bouquets" } },
  { image: "/images/gallery/spiegel.jpg", title: { nl: "Spiegel met champagnerozen", en: "Mirror with champagne roses" } },
  { image: "/images/gallery/snoeptaarten.jpg", title: { nl: "Snoeptaarten voor een feest", en: "Candy cakes for a party" }, tall: true },
  { image: "/images/gallery/paars-tiara.jpg", title: { nl: "Paars met tiara", en: "Purple with tiara" } },
  { image: "/images/gallery/roze-rozen.jpg", title: { nl: "Poederroze rozen", en: "Powder pink roses" }, tall: true },
  { image: "/images/gallery/bordeaux.jpg", title: { nl: "Bordeaux met gipskruid", en: "Burgundy with baby's breath" } },
  { image: "/images/gallery/ringschaal.jpg", title: { nl: "Ringschaal voor een bruiloft", en: "Wedding ring tray" } },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(id: CategoryId) {
  return categories.find((c) => c.id === id)!;
}

export const WHATSAPP_NUMBER = "31600000000"; // TODO: echt nummer invullen
