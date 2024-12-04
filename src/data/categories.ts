import { Category } from '../types';
import { categories } from './products';

export const categoryList: Category[] = [
  {
    id: 'personalCare',
    name: 'Personal Care & Health',
    icon: 'heart',
    subCategories: categories.personalCare
  },
  {
    id: 'cleaning',
    name: 'Cleaning Supplies',
    icon: 'spray-can',
    subCategories: categories.cleaning
  },
  {
    id: 'foodItems',
    name: 'Food Items',
    icon: 'utensils',
    subCategories: Object.values(categories.foodItems).flat()
  },
  {
    id: 'beverages',
    name: 'Beverages',
    icon: 'coffee',
    subCategories: categories.beverages
  },
  {
    id: 'grains',
    name: 'Grains & Pastas',
    icon: 'wheat',
    subCategories: categories.grains
  }
];