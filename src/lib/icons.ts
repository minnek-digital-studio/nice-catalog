import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faTag,
  faBox,
  faShoppingBag,
  faCube,
  faBoxes,
  faStore,
  faShoppingBasket,
  faGift,
  faTshirt,
  faHome,
  faBook,
  faTools,
  faUtensils,
  faCoffee,
  faLeaf,
  faAppleAlt,
  faCar,
  faLaptop,
  faGamepad,
  faMusic,
  faGrip,
  faWheatAwn,
  faCandyCane,
  faSoap,
  faFish
} from '@fortawesome/free-solid-svg-icons';

// Only add the icons we actually need
const requiredIcons = [
  faTag,
  faBox,
  faShoppingBag,
  faCube,
  faBoxes,
  faStore,
  faShoppingBasket,
  faGift,
  faTshirt,
  faHome,
  faBook,
  faTools,
  faUtensils,
  faCoffee,
  faLeaf,
  faAppleAlt,
  faCar,
  faLaptop,
  faGamepad,
  faMusic,
  faGrip,
  faWheatAwn,
  faCandyCane,
  faSoap,
  faFish
];

// Initialize FontAwesome library with only required icons
library.add(...requiredIcons);

// Get icon names for the picker
export const getIconNames = (): string[] => {
  return requiredIcons.map(icon => icon.iconName);
};

// Validate if an icon exists in our subset
export const isValidIcon = (name: string): boolean => {
  return requiredIcons.some(icon => icon.iconName === name);
};

// Get a categorized list of icons
export const getIconCategories = () => {
  return {
    'Products': ['box', 'cube', 'boxes', 'gift', 'shopping-bag', 'shopping-basket'],
    'Commerce': ['store', 'tag'],
    'Fashion': ['tshirt'],
    'Food & Drink': ['utensils', 'coffee', 'apple-alt'],
    'Electronics': ['laptop', 'gamepad'],
    'Other': ['home', 'book', 'tools', 'leaf', 'car', 'music', 'grip']
  };
};

// Search icons with categories
export const searchIcons = (query: string): string[] => {
  if (!query) {
    return getIconNames();
  }

  const normalizedQuery = query.toLowerCase();
  return getIconNames().filter(name => {
    // Search by icon name
    if (name.includes(normalizedQuery)) {
      return true;
    }
    
    // Search by category
    const categories = Object.entries(getIconCategories());
    return categories.some(([category, icons]) => {
      if (category.toLowerCase().includes(normalizedQuery)) {
        return icons.includes(name);
      }
      return false;
    });
  });
};