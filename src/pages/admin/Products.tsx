import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../../lib/store";
import AdminLayout from "../../components/admin/AdminLayout";
import ProductTabs from "../../components/admin/ProductTabs";
import TopNav from "../../components/admin/TopNav";
import { toast } from "react-hot-toast";
import { useAuth } from "../../lib/auth/AuthProvider";

export default function ProductsPage() {
    const { catalogId } = useParams<{ catalogId: string }>();
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const { catalogs, setCurrentCatalog, fetchCatalogs } = useStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCatalog = async () => {
            if (!catalogId) {
                navigate("/admin/catalogs");
                return;
            }

            if (!catalogs.length && loading) {
                await fetchCatalogs();
                setLoading(false);
                return;
            } else {
                setLoading(false);
            }

            const catalog = catalogs.find((c) => c.id === catalogId);
            if (catalog) {
                setCurrentCatalog(catalog);
            } else {
                toast.error("Catalog not found, admin/Products.tsx");
                navigate("/admin/catalogs");
            }
        };

        loadCatalog();
    }, [catalogs]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate("/");
            toast.success("Signed out successfully");
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            }
            toast.error("Failed to sign out");
        }
    };

    return (
        <AdminLayout>
            <TopNav onSignOut={handleSignOut} />
            <ProductTabs />
        </AdminLayout>
    );
}
