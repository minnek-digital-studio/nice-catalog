export const categories = {
  personalCare: ["Wet Wipes", "Diapers", "Sanitary Towels", "Shampoos", "Soaps"],
  cleaning: ["Cleaning Sponges", "Detergents", "Insecticides", "Trash Bags"],
  foodItems: {
    pantry: ["Canned Goods", "Pasta Meals", "Tomato Sauces", "Sausages", "Vegetables", "Legumes", "Fish Products"],
    condiments: ["Soups", "Mayonnaise", "Garlic Paste", "Vinegars", "Seasonings", "Soy Sauce", "Worcestershire Sauce"],
    cooking: ["Cooking Oils", "BBQ Sauce", "Ketchup", "Vanilla Extract", "Salt", "Sugar"],
    snacks: ["Puddings", "Crackers", "Candies", "Compotes", "Popcorn"]
  },
  beverages: ["Malt Beverages", "Energy Drinks", "Almond Milk", "Oat Milk"],
  grains: ["Oatmeal", "Cornmeal", "Wheat Flour", "Beans", "Lentils", "Wheat", "Dry Pigeon Peas", "Pasta Products"]
};

export const products = [
  {
    id: '1',
    name: 'Organic Shampoo',
    description: 'Natural ingredients for healthy, shiny hair',
    price: 12.99,
    category: 'personalCare',
    image: 'https://images.unsplash.com/photo-1585232351009-aa87416fca90?auto=format&fit=crop&q=80&w=400',
    brand: 'NatureCare',
    rating: 4.5,
    reviews: 128,
    inStock: true,
    promotion: {
      type: 'discount',
      value: 20
    }
  },
  {
    id: '2',
    name: 'Eco-Friendly Detergent',
    description: 'Biodegradable cleaning solution for all surfaces',
    price: 15.99,
    category: 'cleaning',
    image: 'https://images.unsplash.com/photo-1550963295-019d8a8a61c5?auto=format&fit=crop&q=80&w=400',
    brand: 'EcoClean',
    rating: 4.2,
    reviews: 89,
    inStock: true,
    promotion: {
      type: 'text',
      value: 'NEW',
      backgroundColor: 'bg-emerald-500'
    }
  },
  // Add more products as needed
];