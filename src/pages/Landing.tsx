import React from 'react';
import { Link } from 'react-router-dom';
import { Store, ShoppingBag, Globe, Lock, Share2, Search, Layout, Users } from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: Store,
      title: 'Digital Storefront',
      description: 'Create your professional product catalog in minutes'
    },
    {
      icon: Globe,
      title: 'Share Anywhere',
      description: 'Get a unique URL to share with your customers'
    },
    {
      icon: Layout,
      title: 'Beautiful Layout',
      description: 'Responsive design that looks great on any device'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Help customers find products quickly'
    },
    {
      icon: Lock,
      title: 'Private or Public',
      description: 'Control who sees your catalog'
    },
    {
      icon: Users,
      title: 'Multi-User Access',
      description: 'Collaborate with your team'
    }
  ];

  const plans = [
    {
      name: 'Starter',
      price: 0,
      features: ['1 Catalog', '50 Products', 'Basic Analytics', 'Public URL'],
      cta: 'Start Free'
    },
    {
      name: 'Professional',
      price: 29,
      features: ['5 Catalogs', 'Unlimited Products', 'Advanced Analytics', 'Custom Domain'],
      cta: 'Try Pro',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 99,
      features: ['Unlimited Catalogs', 'API Access', 'Priority Support', 'Custom Integration'],
      cta: 'Contact Sales'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ed1c24] to-rose-600 opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
              Your Products,{' '}
              <span className="text-[#ed1c24]">Beautifully Displayed</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Create stunning product catalogs in minutes. Share with customers, track engagement, and grow your business.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#ed1c24] hover:bg-[#d91920] transition-colors duration-200"
              >
                Get Started Free
              </Link>
              <Link
                to="/admin"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Everything you need to showcase your products</h2>
          <p className="mt-4 text-lg text-gray-500">
            Powerful features to help you create, manage, and share your product catalog
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="absolute top-6 left-6 w-12 h-12 flex items-center justify-center rounded-full bg-rose-100 text-[#ed1c24]">
                <feature.icon className="w-6 h-6" />
              </div>
              <div className="pl-16">
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-500">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-gray-300">
              Choose the plan that's right for your business
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 bg-white rounded-lg ${
                  plan.popular ? 'ring-2 ring-[#ed1c24]' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-6 transform -translate-y-1/2">
                    <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-rose-100 text-[#ed1c24]">
                      Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline justify-center">
                    <span className="text-5xl font-extrabold text-gray-900">${plan.price}</span>
                    <span className="ml-1 text-xl font-semibold text-gray-500">/mo</span>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center justify-center text-gray-500">
                        <ShoppingBag className="w-5 h-5 mr-2 text-[#ed1c24]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`mt-8 w-full py-3 px-6 rounded-md text-base font-medium ${
                      plan.popular
                        ? 'bg-[#ed1c24] text-white hover:bg-[#d91920]'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } transition-colors duration-200`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Product</h4>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#features" className="text-base text-gray-500 hover:text-gray-900">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-base text-gray-500 hover:text-gray-900">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Company</h4>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#about" className="text-base text-gray-500 hover:text-gray-900">
                    About
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-base text-gray-500 hover:text-gray-900">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; 2024 Catalog Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}