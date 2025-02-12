import { Tab } from "@headlessui/react";
import { Package2, Tags, Building2 } from "lucide-react";
import ProductList from "@/components/admin/Product/ProductList";
import CategoryList from "@/components/admin/CategoryList";
import BrandList from "@/components/admin/BrandList";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function ProductTabs() {
    const tabs = [
        { name: "Products", icon: Package2, component: ProductList },
        { name: "Categories", icon: Tags, component: CategoryList },
        { name: "Brands", icon: Building2, component: BrandList },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.name}
                            className={({ selected }) =>
                                classNames(
                                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200",
                                    "focus:outline-none",
                                    selected
                                        ? "bg-white text-[#ed1c24] shadow"
                                        : "text-gray-600 hover:bg-white/[0.12] hover:text-gray-800"
                                )
                            }
                        >
                            <div className="flex items-center justify-center">
                                <tab.icon className="w-4 h-4 mr-2" />
                                {tab.name}
                            </div>
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels className="mt-6">
                    {tabs.map((tab, idx) => (
                        <Tab.Panel
                            key={idx}
                            className={classNames(
                                "rounded-xl bg-white p-6",
                                "focus:outline-none"
                            )}
                        >
                            <tab.component />
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
}
