/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Shield, Award, Truck } from "lucide-react";
import localFont from "next/font/local";

const myfont = localFont({
  src: "../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Shop",
      links: [
        { name: "All Products", href: "/products/all" },
        { name: "Bulk Savings", href: "/products/bulk-savings" },
        { name: "Hot Deals", href: "/products/bulk-savings" },
        { name: "Lab Tested", href: "/products/lab-tested" },
        { name: "Monthly Deals", href: "/monthly-deals" },
      ],
    },
    {
      title: "Customer Service",
      links: [
        { name: "Contact Us", href: "/contact-us" },
        { name: "FAQ", href: "/faq" },
        { name: "My Orders", href: "/customer/order" },
        { name: "Account Info", href: "/customer/account-information" },
        { name: "Shipping Info", href: "/shipping" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", href: "/terms-of-service" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Refund Policy", href: "/refund-policy" },
        { name: "Disclaimer", href: "/disclaimer" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", name: "Facebook" },
    { icon: Twitter, href: "#", name: "Twitter" },
    { icon: Instagram, href: "#", name: "Instagram" },
    { icon: Youtube, href: "#", name: "YouTube" },
  ];

  const trustBadges = [
    { icon: Shield, text: "Secure Payment" },
    { icon: Award, text: "Lab Tested" },
    { icon: Truck, text: "Fast Shipping" },
  ];

  return (
    <footer className="bg-gradient-to-br from-brand-charcoal via-brand-charcoal-dark to-brand-charcoal text-white">
      <div className="max-w-[1395px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block mb-4">
                <span className={`${myfont.className} text-3xl sm:text-4xl bg-gradient-to-r from-brand-mint to-brand-teal bg-clip-text text-transparent`}>
                  Hammer & Bell
                </span>
              </Link>
              <p className="text-gray-300 mb-6 leading-relaxed text-sm sm:text-base max-w-md">
                Premium quality products for your fitness journey. We're dedicated to providing the best experience for our customers.
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 mb-6">
                {trustBadges.map((badge, index) => {
                  const Icon = badge.icon;
                  return (
                    <div key={index} className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                      <Icon className="w-4 h-4 text-brand-mint" />
                      <span className="text-xs text-gray-300">{badge.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Social Links */}
              {/* <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 mr-2">Follow us:</span>
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg border border-white/20 hover:bg-brand-mint/20 hover:border-brand-mint/50 transition-all duration-300 hover:scale-110 group"
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5 text-gray-300 group-hover:text-brand-mint transition-colors" />
                    </a>
                  );
                })}
              </div> */}
            </div>

            {/* Footer Links Columns */}
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="text-base font-bold mb-4 text-brand-mint uppercase tracking-wider text-sm">
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-300 hover:text-brand-mint transition-colors duration-200 inline-block hover:translate-x-1"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* ////////// */}
          <div className="flex items-center gap-3 justify-center mt-8">
                <span className="text-sm text-gray-400 mr-2">Follow us:</span>
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg border border-white/20 hover:bg-brand-mint/20 hover:border-brand-mint/50 transition-all duration-300 hover:scale-110 group"
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5 text-gray-300 group-hover:text-brand-mint transition-colors" />
                    </a>
                  );
                })}
              </div>
          {/* ////////// */}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10"></div>

        {/* Bottom Bar */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-gray-400">
              <p>© {currentYear} Hammer & Bell. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link href="/terms-of-service" className="text-xs sm:text-sm text-gray-400 hover:text-brand-mint transition-colors">
                Terms
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/privacy" className="text-xs sm:text-sm text-gray-400 hover:text-brand-mint transition-colors">
                Privacy
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/faq" className="text-xs sm:text-sm text-gray-400 hover:text-brand-mint transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
