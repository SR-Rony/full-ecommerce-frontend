"use client";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Hardcoded carousel data - Easy to modify later
const heroCarouselData = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1920&q=80",
    title: "Premium Peptide Collection",
    subtitle: "Laboratory Tested & Certified",
    discountOffer: "Save 25% on All Orders",
    link: "/products"
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=1920&q=80",
    title: "New Arrivals",
    subtitle: "Latest Research-Backed Formulas",
    discountOffer: "Free Shipping on Orders $100+",
    link: "/products/new-arrivals"
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80",
    title: "Bulk Savings",
    subtitle: "Maximum Value, Premium Quality",
    discountOffer: "Up to 40% Off Bulk Orders",
    link: "/products/bulk-savings"
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80",
    title: "Lab Tested Products",
    subtitle: "Verified Purity & Potency",
    discountOffer: "Certified Quality Guaranteed",
    link: "/products/lab-tested"
  }
];

export default function HeroBanner() {
  const [swiper, setSwiper] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className="relative w-full bg-white py-4 md:py-6 lg:py-8">
      {/* Container */}
      <div className="max-w-[1395px] mx-auto px-4">
        {/* Hero Carousel Container */}
        <div className="relative w-full h-[40vh] min-h-[300px] sm:h-[45vh] sm:min-h-[350px] md:h-[60vh] md:min-h-[500px] lg:h-[70vh] lg:min-h-[600px] xl:h-[75vh] xl:min-h-[700px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
          <Swiper
            modules={[Autoplay]}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            speed={1000}
            onSwiper={setSwiper}
            onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
            className="hero-carousel h-full"
          >
            {heroCarouselData.map((slide) => (
              <SwiperSlide key={slide.id} className="!w-full">
                <div className="relative w-full h-full rounded-2xl overflow-hidden group cursor-pointer">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={slide.imageUrl}
                      alt={slide.title}
                      fill
                      priority={slide.id === 1}
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      quality={90}
                    />
                  </div>

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/70 via-brand-charcoal/40 to-brand-charcoal/80"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/50 via-transparent to-brand-charcoal/50"></div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 lg:px-16 text-center">
                    {/* Discount Badge */}
                    <div className="mb-3 sm:mb-4 animate-fadeIn delay-100">
                      <span className="inline-block bg-gradient-to-r from-brand-mint to-brand-teal text-brand-text-dark px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-bold shadow-lg">
                        {slide.discountOffer}
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-tight animate-fadeIn delay-200 px-2">
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-brand-mint font-medium mb-4 sm:mb-6 md:mb-8 max-w-2xl animate-fadeIn delay-500 px-2">
                      {slide.subtitle}
                    </p>

                    {/* CTA Button */}
                    
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows */}
          <button
            onClick={() => swiper?.slidePrev()}
            className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="text-white group-hover:text-brand-mint w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => swiper?.slideNext()}
            className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 group"
            aria-label="Next slide"
          >
            <ChevronRight className="text-white group-hover:text-brand-mint w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroCarouselData.map((_, index) => (
              <button
                key={index}
                onClick={() => swiper?.slideToLoop(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "bg-brand-mint w-8"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Professional Bottom Accent Border */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-brand-mint/40 to-transparent shadow-lg mt-4 md:mt-6 lg:mt-8"></div>
      </div>

    </section>
  );
}
