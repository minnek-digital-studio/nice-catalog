import { create } from "zustand";
import { supabase } from "./supabase";
import type { Database } from "../types/supabase";
import { generateUniqueSlug } from "./utils/slugs";
import { deleteProductImage } from "./storage";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"] & {
    category?: Database["public"]["Tables"]["categories"]["Row"];
    images: Database["public"]["Tables"]["product_images"]["Row"][];
};
export type Image = Database["public"]["Tables"]["product_images"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Catalog = Database["public"]["Tables"]["catalogs"]["Row"];
export type Brand = Database["public"]["Tables"]["brands"]["Row"];

interface StoreState {
    user: Profile | null;
    catalogs: Catalog[];
    currentCatalog: Catalog | null;
    products: Product[];
    categories: Category[];
    brands: Brand[];
    setUser: (user: Profile | null) => void;
    updateProfile: (updates: Partial<Profile>) => Promise<void>;
    fetchCatalogs: () => Promise<void>;
    createCatalog: (
        catalog: Omit<
            Database["public"]["Tables"]["catalogs"]["Insert"],
            "user_id"
        >
    ) => Promise<Catalog | null>;
    updateCatalog: (
        id: string,
        updates: Partial<Database["public"]["Tables"]["catalogs"]["Update"]>
    ) => Promise<Catalog | null>;
    deleteCatalog: (id: string) => Promise<void>;
    setCurrentCatalog: (catalog: Catalog | null) => void;
    fetchProducts: () => Promise<void>;
    fetchCategories: () => Promise<void>;
    fetchBrands: () => Promise<void>;
    createProduct: (
        product: Omit<
            Database["public"]["Tables"]["products"]["Insert"],
            "catalog_id"
        >
    ) => Promise<Product | null>;
    updateProduct: (
        id: string,
        updates: Partial<Database["public"]["Tables"]["products"]["Update"]>
    ) => Promise<Product | null>;
    deleteProduct: (id: string) => Promise<boolean>;
    createImages: (
        images: Database["public"]["Tables"]["product_images"]["Insert"][]
    ) => Promise<Image[]>;
    updateImages: (
        images: Database["public"]["Tables"]["product_images"]["Update"][],
        productId: string
    ) => Promise<Image[]>;
    deleteImages: (image: Partial<Image>) => Promise<void>;
    createCategory: (
        category: Omit<
            Database["public"]["Tables"]["categories"]["Insert"],
            "catalog_id"
        >
    ) => Promise<Category | null>;
    updateCategory: (
        id: string,
        updates: Partial<Database["public"]["Tables"]["categories"]["Update"]>
    ) => Promise<Category | null>;
    deleteCategory: (id: string) => Promise<boolean>;
    createBrand: (
        brand: Omit<
            Database["public"]["Tables"]["brands"]["Insert"],
            "catalog_id"
        >
    ) => Promise<Brand | null>;
    updateBrand: (
        id: string,
        updates: Partial<Database["public"]["Tables"]["brands"]["Update"]>
    ) => Promise<Brand | null>;
    deleteBrand: (id: string) => Promise<boolean>;
    reorderProducts: (productId: string, newPosition: number) => Promise<void>;
    reorderCategories: (
        categoryId: string,
        newPosition: number
    ) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
    user: null,
    catalogs: [],
    currentCatalog: null,
    products: [],
    categories: [],
    brands: [],

    setUser: (user) => set({ user }),

    updateProfile: async (updates) => {
        const user = get().user;
        if (!user) {
            throw new Error("No user logged in");
        }

        try {
            const { data, error } = await supabase
                .from("profiles")
                .update(updates)
                .eq("id", user.id)
                .select()
                .single();

            if (error) throw error;
            set({ user: { ...user, ...data } });
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    },

    fetchCatalogs: async () => {
        try {
            const { data: catalogs, error } = await supabase
                .from("catalogs")
                .select("*")
                .eq("user_id", get().user?.id as string)
                .order("created_at", { ascending: false });

            if (error) throw error;
            set({ catalogs: catalogs || [] });
        } catch (error) {
            console.error("Error fetching catalogs:", error);
            set({ catalogs: [] });
        }
    },

    createCatalog: async (catalog) => {
        const { data, error } = await supabase
            .from("catalogs")
            .insert({
                ...catalog,
                user_id: get().user?.id as string,
            })
            .select()
            .single();

        if (error) throw error;

        const catalogs = get().catalogs;
        set({ catalogs: [data, ...catalogs] });
        return data;
    },

    updateCatalog: async (id, updates) => {
        try {
            const { data, error } = await supabase
                .from("catalogs")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;

            const catalogs = get().catalogs.map((c) =>
                c.id === id ? data : c
            );
            set({ catalogs });
            return data;
        } catch (error) {
            console.error("Error updating catalog:", error);
            return null;
        }
    },

    deleteCatalog: async (id) => {
        try {
            const { error } = await supabase
                .from("catalogs")
                .delete()
                .eq("id", id);

            if (error) throw error;

            set((state) => ({
                catalogs: state.catalogs.filter((c) => c.id !== id),
            }));
        } catch (error) {
            console.error("Error deleting catalog:", error);
            throw error;
        }
    },

    setCurrentCatalog: (catalog) => {
        set({ currentCatalog: catalog });
        if (catalog) {
            get().fetchProducts();
            get().fetchCategories();
            get().fetchBrands();
        }
    },

    fetchProducts: async () => {
        const catalogId = get().currentCatalog?.id;
        if (!catalogId) {
            console.error("No catalog selected");
            return;
        }

        try {
            const { data: products, error } = await supabase
                .from("products")
                .select(
                    `
          *,
          category:categories(*),
          brand_obj:brands(*),
          images:product_images(*)
        `
                )
                .eq("catalog_id", catalogId)
                .order("position", { ascending: true });

            if (error) throw error;
            set({ products: (products as Product[]) || [] });
        } catch (error) {
            console.error("Error fetching products:", error);
            set({ products: [] });
        }
    },

    fetchCategories: async () => {
        const catalogId = get().currentCatalog?.id;
        if (!catalogId) {
            console.error("No catalog selected");
            return;
        }

        try {
            const { data: categories, error } = await supabase
                .from("categories")
                .select("*")
                .eq("catalog_id", catalogId)
                .order("position", { ascending: true });

            if (error) throw error;
            set({ categories: categories || [] });
        } catch (error) {
            console.error("Error fetching categories:", error);
            set({ categories: [] });
        }
    },

    fetchBrands: async () => {
        const catalogId = get().currentCatalog?.id;
        if (!catalogId) {
            console.error("No catalog selected");
            return;
        }

        try {
            const { data: brands, error } = await supabase
                .from("brands")
                .select("*")
                .eq("catalog_id", catalogId)
                .order("name");

            if (error) throw error;
            set({ brands: brands || [] });
        } catch (error) {
            console.error("Error fetching brands:", error);
            set({ brands: [] });
        }
    },

    createProduct: async (product) => {
        const catalogId = get().currentCatalog?.id;
        if (!catalogId) {
            throw new Error("No catalog selected");
        }

        try {
            // Generate a unique slug for the product
            const slug = await generateUniqueSlug(product.title, catalogId);

            // Get the highest position
            const { data: maxPositionResult } = await supabase
                .from("products")
                .select("position")
                .eq("catalog_id", catalogId)
                .order("position", { ascending: false })
                .limit(1)
                .single();

            const newPosition = (maxPositionResult?.position || 0) + 1;

            const { data, error } = await supabase
                .from("products")
                .insert({
                    ...product,
                    catalog_id: catalogId,
                    position: newPosition,
                    slug,
                })
                .select(
                    `
          *,
          category:categories(*),
          brand_obj:brands(*),
          images:product_images(*)
        `
                )
                .single();

            if (error) throw error;

            const products = get().products;
            set({ products: [...products, data as Product] });
            return data as Product;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },

    updateProduct: async (id, updates) => {
        const catalogId = get().currentCatalog?.id;
        if (!catalogId) {
            throw new Error("No catalog selected");
        }

        try {
            // If title is being updated, generate a new unique slug
            if (updates.title) {
                updates.slug = await generateUniqueSlug(
                    updates.title,
                    catalogId,
                    id
                );
            }

            const { data, error } = await supabase
                .from("products")
                .update(updates)
                .eq("id", id)
                .select(
                    `
                        *,
                        category:categories(*),
                        brand_obj:brands(*),
                        images:product_images(*)
                    `
                )
                .single();

            if (error) throw error;

            const products = get().products.map((p) =>
                p.id === id ? data : p
            ) as Product[];
            set({ products });
            return data as Product;
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    },

    reorderProducts: async (productId: string, newPosition: number) => {
        const products = get().products;
        const catalogId = get().currentCatalog?.id;

        if (!catalogId) return;

        try {
            const oldIndex = products.findIndex((p) => p.id === productId);
            const newIndex = newPosition;

            if (oldIndex === -1) return;

            const newProducts = [...products];
            const [movedProduct] = newProducts.splice(oldIndex, 1);
            newProducts.splice(newIndex, 0, movedProduct);

            const affectedProducts = newProducts.slice(
                Math.min(oldIndex, newIndex),
                Math.max(oldIndex, newIndex) + 1
            );

            const newProductList = newProducts.map((p, i) => {
                if (affectedProducts.includes(p)) {
                    return { ...p, position: i + Math.min(oldIndex, newIndex) };
                }
                return p;
            });

            const updateAffectedProducts = affectedProducts.map((p, i) => ({
                id: p.id,
                position: i + Math.min(oldIndex, newIndex),
            }));

            updateAffectedProducts.forEach(async (product) => {
                const { error } = await supabase
                    .from("products")
                    .update({
                        position: product.position,
                    })
                    .eq("id", product.id);
                if (error) throw error;
            });

            set({ products: newProductList });
        } catch (error) {
            // Revert to original order on error
            get().fetchProducts();
            console.error("Error reordering products:", error);
            throw error;
        }
    },

    deleteProduct: async (id) => {
        try {
            const { error } = await supabase
                .from("products")
                .delete()
                .eq("id", id);

            if (error) throw error;

            const products = get().products.filter((p) => p.id !== id);
            set({ products });
            return true;
        } catch (error) {
            console.error("Error deleting product:", error);
            return false;
        }
    },

    createCategory: async (category) => {
        const catalogId = get().currentCatalog?.id;
        if (!catalogId) {
            throw new Error("No catalog selected");
        }

        try {
            const { data: maxPositionResult } = await supabase
                .from("categories")
                .select("position")
                .eq("catalog_id", catalogId)
                .order("position", { ascending: false })
                .limit(1)
                .single();

            const newPosition = (maxPositionResult?.position || 0) + 1;

            const { data, error } = await supabase
                .from("categories")
                .insert({
                    ...category,
                    catalog_id: catalogId,
                    position: newPosition,
                })
                .select()
                .single();

            if (error) throw error;

            const categories = get().categories;
            set({ categories: [...categories, data] });
            return data;
        } catch (error) {
            console.error("Error creating category:", error);
            throw error;
        }
    },

    updateCategory: async (id, updates) => {
        try {
            const { data, error } = await supabase
                .from("categories")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;

            const categories = get().categories.map((c) =>
                c.id === id ? data : c
            );
            set({ categories });
            return data;
        } catch (error) {
            console.error("Error updating category:", error);
            return null;
        }
    },
    deleteCategory: async (id) => {
        try {
            const { error } = await supabase
                .from("categories")
                .delete()
                .eq("id", id);

            if (error) throw error;

            const categories = get().categories.filter((c) => c.id !== id);
            set({ categories });
            return true;
        } catch (error) {
            console.error("Error deleting category:", error);
            return false;
        }
    },

    createBrand: async (brand) => {
        const catalogId = get().currentCatalog?.id;
        if (!catalogId) {
            throw new Error("No catalog selected");
        }

        try {
            const { data, error } = await supabase
                .from("brands")
                .insert({
                    ...brand,
                    catalog_id: catalogId,
                })
                .select()
                .single();

            if (error) throw error;

            const brands = get().brands;
            set({ brands: [...brands, data] });
            return data;
        } catch (error) {
            console.error("Error creating brand:", error);
            throw error;
        }
    },

    updateBrand: async (id, updates) => {
        try {
            const { data, error } = await supabase
                .from("brands")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;

            const brands = get().brands.map((b) => (b.id === id ? data : b));
            set({ brands });
            return data;
        } catch (error) {
            console.error("Error updating brand:", error);
            return null;
        }
    },

    deleteBrand: async (id) => {
        try {
            const { error } = await supabase
                .from("brands")
                .delete()
                .eq("id", id);

            if (error) throw error;

            const brands = get().brands.filter((b) => b.id !== id);
            set({ brands });
            return true;
        } catch (error) {
            console.error("Error deleting brand:", error);
            return false;
        }
    },

    reorderCategories: async (categoryId: string, newPosition: number) => {
        const categories = get().categories;
        const catalogId = get().currentCatalog?.id;

        if (!catalogId) return;

        try {
            const oldIndex = categories.findIndex((c) => c.id === categoryId);
            const newIndex = newPosition;

            if (oldIndex === -1) return;

            const newCategories = [...categories];
            const [movedCategory] = newCategories.splice(oldIndex, 1);
            newCategories.splice(newIndex, 0, movedCategory);

            const affectedCategories = newCategories.slice(
                Math.min(oldIndex, newIndex),
                Math.max(oldIndex, newIndex) + 1
            );

            const newCategoryList = newCategories.map((c, i) => {
                if (affectedCategories.includes(c)) {
                    return { ...c, position: i + Math.min(oldIndex, newIndex) };
                }
                return c;
            });

            const updateAffectedCategories = affectedCategories.map((c, i) => ({
                id: c.id,
                position: i + Math.min(oldIndex, newIndex),
            }));

            updateAffectedCategories.forEach(async (category) => {
                const { error } = await supabase
                    .from("categories")
                    .update({
                        position: category.position,
                    })
                    .eq("id", category.id);
                if (error) throw error;
            });

            set({ categories: newCategoryList });
        } catch (error) {
            // Revert to original order on error
            get().fetchCategories();
            console.error("Error reordering categories:", error);
            throw error;
        }
    },

    createImages: async (images) => {
        const { data: lastPositionImage } = await supabase
            .from("product_images")
            .select("position")
            .eq("product_id", images[0].product_id)
            .order("position", { ascending: false })
            .limit(1)
            .single();

        const newPosition = (lastPositionImage?.position || 0) + 1;
        const { data, error } = await supabase
            .from("product_images")
            .insert(
                images.map((image, index) => ({
                    ...image,
                    position: newPosition + index,
                }))
            )
            .select();

        if (error) throw error;

        set({
            products: get().products.map((product) =>
                product.id === images[0].product_id
                    ? { ...product, images: [...product.images, ...data] }
                    : product
            ),
        });

        return data;
    },

    updateImages: async (images, productId) => {
        const { data, error } = await supabase
            .from("product_images")
            .upsert(
                images.map((image) => ({
                    ...image,
                    product_id: image.product_id as string,
                    url: image.url as string,
                })),
                {
                    onConflict: "id",
                }
            )
            .select()
            .order("position", { ascending: true });

        if (error) throw error;

        set({
            products: get().products.map((product) =>
                product.id === productId
                    ? {
                          ...product,
                          images: data,
                      }
                    : product
            ),
        });
        return data;
    },

    deleteImages: async (image) => {
        if (!image.id) throw new Error("Image ID is required");
        if (!image.url) throw new Error("Image URL is required");

        const { error } = await supabase
            .from("product_images")
            .delete()
            .eq("id", image.id);

        if (error) throw error;

        await deleteProductImage(image.url);

        set({
            products: get().products.map((product) =>
                product.id === image.product_id
                    ? {
                          ...product,
                          images: product.images.filter(
                              (i) => i.id !== image.id
                          ),
                      }
                    : product
            ),
        });
    },
}));
