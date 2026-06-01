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
            {/* Title row with arrows */}
            <div className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-semibold text-white">
                    {mainTitle}
                </h2>
            </div>

            {/* Scrollable row */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide max-w-7xl mx-auto py-4"
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
        </div>
    );
};

export default GalleryPhotos;