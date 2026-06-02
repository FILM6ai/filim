'use client';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const GalleryPhotos = ({ mainTitle, images }) => {
    const scrollRef = useRef(null);

    if (!images || images.length === 0) return null;

    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -320 : 320,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="w-full bg-[#0d0d0d] text-white py-16 px-4 lg:px-20">

            {/* Title */}
            <div className="mb-8 max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-semibold text-white">
                    {mainTitle}
                </h2>
            </div>

            {/* Arrow Left + Images + Arrow Right */}
            <div className="flex items-center gap-4 max-w-7xl mx-auto">

                {/* LEFT ARROW */}
                <button
                    onClick={() => scroll('left')}
                    className="shrink-0 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* IMAGES ROW */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto py-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {images.map((src, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="shrink-0 rounded-3xl overflow-hidden"
                            style={{ backgroundColor: 'black' }}
                        >
                            <img
                                src={src}
                                alt={`gallery-${index}`}
                                className="h-64 w-64 object-cover"
                                style={{ backgroundColor: 'black' }}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* RIGHT ARROW */}
                <button
                    onClick={() => scroll('right')}
                    className="shrink-0 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

            </div>

        </div>
    );
};

export default GalleryPhotos;