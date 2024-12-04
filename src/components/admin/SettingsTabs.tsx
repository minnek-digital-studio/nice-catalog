import React from 'react';
import { Tab } from '@headlessui/react';
import { User, Image, CreditCard } from 'lucide-react';
import ProfileSettings from './settings/ProfileSettings';
import BrandingSettings from './settings/BrandingSettings';
import PlansSettings from './settings/PlansSettings';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function SettingsTabs() {
  const tabs = [
    { name: 'Profile', icon: User, component: ProfileSettings },
    { name: 'Branding', icon: Image, component: BrandingSettings },
    { name: 'Plans', icon: CreditCard, component: PlansSettings }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200',
                  'focus:outline-none',
                  selected
                    ? 'bg-white text-[#ed1c24] shadow'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
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
                'rounded-xl bg-white p-6',
                'focus:outline-none'
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