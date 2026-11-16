export const INITIAL_PRODUCTS = [
  {
    _id: "prod-001",
    tittle: "Full Expandable Messenger Bag",
    description: "Structured messenger bag crafted with premium water-resistant vegan leather. Expandable main gusset with dedicated padded laptop compartment.",
    category: "Messenger Bag",
    price: { amount: 3035, currency: "INR" },
    images: ["/products/messenger_bag.jpg"],
    variants: [
      {
        _id: "var-001-1",
        images: [{ url: "/products/messenger_bag.jpg" }],
        stock: 15,
        attributes: { color: "Jet Black", capacity: "18L" },
        price: { amount: 3035, currency: "INR" }
      }
    ]
  },
  {
    _id: "prod-002",
    tittle: "Premium Laptop Backpack",
    description: "Ergonomic 24L laptop backpack with breathable back padding, luggage trolley strap, and weather-shielded zippers.",
    category: "Backpack",
    price: { amount: 2285, currency: "INR" },
    images: ["/products/backpack_black.jpg", "/products/backpack_brown.jpg", "/products/backpack_blue.jpg"],
    variants: [
      {
        _id: "var-002-1",
        images: [{ url: "/products/backpack_black.jpg" }],
        stock: 20,
        attributes: { color: "Onyx Black", size: "24L" },
        price: { amount: 2285, currency: "INR" }
      },
      {
        _id: "var-002-2",
        images: [{ url: "/products/backpack_brown.jpg" }],
        stock: 12,
        attributes: { color: "Cognac Brown", size: "24L" },
        price: { amount: 2285, currency: "INR" }
      }
    ]
  },
  {
    _id: "prod-003",
    tittle: "Croco Duffle Bag with Side Pocket",
    description: "Signature duffel bag featuring embossed crocodile grain leather, detachable padded shoulder strap, and rapid-access shoe compartment.",
    category: "Duffel Bag",
    price: { amount: 2085, currency: "INR" },
    images: ["/products/duffel_croco.jpg", "/products/duffel_leather.jpg"],
    variants: [
      {
        _id: "var-003-1",
        images: [{ url: "/products/duffel_croco.jpg" }],
        stock: 10,
        attributes: { color: "Deep Mahogany", size: "35L" },
        price: { amount: 2085, currency: "INR" }
      }
    ]
  },
  {
    _id: "prod-004",
    tittle: "Large Shoulder Bag with Handle",
    description: "Dual-tone shoulder bag built for daily commutes with dual-top handles, front vertical zipper pocket, and tablet sleeve.",
    category: "Sling Bag",
    price: { amount: 999, currency: "INR" },
    images: ["/products/shoulder_bag.jpg"],
    variants: [
      {
        _id: "var-004-1",
        images: [{ url: "/products/shoulder_bag.jpg" }],
        stock: 25,
        attributes: { color: "Charcoal & Rust", size: "Standard" },
        price: { amount: 999, currency: "INR" }
      }
    ]
  },
  {
    _id: "prod-005",
    tittle: "Convertible Office Laptop Bag",
    description: "Office briefcase by day, backpack for the commute home. Conceals full harness straps behind rear zip panel.",
    category: "Laptop Bag",
    price: { amount: 2415, currency: "INR" },
    images: ["/products/office_convertible_blue.jpg", "/products/office_black.jpg"],
    variants: [
      {
        _id: "var-005-1",
        images: [{ url: "/products/office_convertible_blue.jpg" }],
        stock: 18,
        attributes: { color: "Navy Blue", size: "15.6 inch" },
        price: { amount: 2415, currency: "INR" }
      }
    ]
  },
  {
    _id: "prod-006",
    tittle: "Double Compartment Office Bag",
    description: "Classic executive briefcase with dual split compartments for organizing 16-inch MacBooks, chargers, and documents.",
    category: "Laptop Bag",
    price: { amount: 1850, currency: "INR" },
    images: ["/products/office_leather_brown.jpg"],
    variants: [
      {
        _id: "var-006-1",
        images: [{ url: "/products/office_leather_brown.jpg" }],
        stock: 14,
        attributes: { color: "Vintage Tan", size: "16 inch" },
        price: { amount: 1850, currency: "INR" }
      }
    ]
  },
  {
    _id: "prod-007",
    tittle: "Gym Bag with Shoe Compartment",
    description: "Ventilated sports duffel bag equipped with isolated shoe tunnel, water-bottle holder, and water-repellent base lining.",
    category: "Gym Bag",
    price: { amount: 1185, currency: "INR" },
    images: ["/products/duffel_gym_shoe.jpg", "/products/duffel_blue.jpg"],
    variants: [
      {
        _id: "var-007-1",
        images: [{ url: "/products/duffel_gym_shoe.jpg" }],
        stock: 30,
        attributes: { color: "Matte Black", size: "30L" },
        price: { amount: 1185, currency: "INR" }
      }
    ]
  },
  {
    _id: "prod-008",
    tittle: "Polyester Travel Duffle Bag",
    description: "High-tensile polyester travel duffel built for flights and weekend getaways. Anti-tear outer skin and dual side utility pockets.",
    category: "Travel Bag",
    price: { amount: 2565, currency: "INR" },
    images: ["/products/duffel_blue.jpg"],
    variants: [
      {
        _id: "var-008-1",
        images: [{ url: "/products/duffel_blue.jpg" }],
        stock: 8,
        attributes: { color: "Royal Blue", size: "45L" },
        price: { amount: 2565, currency: "INR" }
      }
    ]
  }
];
