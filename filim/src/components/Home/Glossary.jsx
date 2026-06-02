'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Glossary = ({ mainTitle, subtitle, items }) => {
    const [openIndex, setOpenIndex] = useState(null);

    if (!items || items.length === 0) return null;

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="w-full bg-[#0d0d0d] py-20 px-4 lg:px-20">
            {/* {subtitle && (
                <p className="text-center text-[#c9a84c] tracking-[0.3em] text-sm uppercase mb-3">
                    {subtitle}
                </p>
            )} */}
            {/* Gold underline */}
            {/* {subtitle && (
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-[2px] bg-[#c9a84c]" />
                </div>
            )} */}
            {mainTitle && (
                <h2 className="text-center text-white text-4xl md:text-5xl font-serif mb-14">
                    {mainTitle}
                </h2>
            )}

            <div className="w-full">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="border-b border-gray-700"
                    >
                        <button
                            type="button"
                            onClick={() => toggle(index)}
                            className="w-full flex items-center justify-between py-5 text-left group"
                        >
                            <div className="flex items-center gap-6">
                                <span className="text-[#2ec3f5]  text-sm font-semibold w-8 shrink-0">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="text-white text-lg font-semibold group-hover:text-[#2ec3f5] transition-colors">
                                    {item.term}
                                </span>
                            </div>
                            <span className="text-[#2ec3f5] text-2xl font-light ml-4 shrink-0">
                                {openIndex === index ? "−" : "+"}
                            </span>
                        </button>

                        <AnimatePresence>
                            {openIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <p className="text-gray-400 pl-14 pb-6 leading-relaxed">
                                        {item.definition}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Glossary;