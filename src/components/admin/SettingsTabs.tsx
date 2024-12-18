import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { User, Image, CreditCard } from 'lucide-react';
import ProfileSettings from './settings/ProfileSettings';
import BrandingSettings from './settings/BrandingSettings';
import PlansSettings from './settings/PlansSettings';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function SettingsTabs() {
    const location = useLocation();

    const tabs = [
        {
            name: 'Profile',
            icon: User,
            component: ProfileSettings,
            hash: '#profile'
        },
        {
            name: 'Branding',
            icon: Image,
            component: BrandingSettings,
            hash: '#branding'
        },
        {
            name: 'Plans',
            icon: CreditCard,
            component: PlansSettings,
            hash: '#plans'
        }
    ];

    // Default to first tab if no hash
    const activeTab =
        tabs.find(tab => tab.hash === location.hash) ||
        tabs[0];

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 rounded-xl bg-gray-100 p-1">
                {tabs.map((tab) => (
                    <Link
                        key={tab.name}
                        to={`/admin/settings${tab.hash}`}
                        className={classNames(
                            'w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200',
                            'focus:outline-none',
                            activeTab.hash === tab.hash
                                ? 'bg-white text-[#ed1c24] shadow'
                                : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                        )}
                    >
                        <div className="flex items-center justify-center">
                            <tab.icon className="w-4 h-4 mr-2" />
                            {tab.name}
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-6">
                <div
                    className={classNames(
                        'rounded-xl bg-white p-6',
                        'focus:outline-none'
                    )}
                >
                    <activeTab.component />
                </div>
            </div>
        </div>
    );
}
