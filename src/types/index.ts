export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  username: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subCategory?: string;
  image: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  promotion?: {
    type: 'discount' | 'text';
    value: number | string;
    backgroundColor?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subCategories?: string[];
}