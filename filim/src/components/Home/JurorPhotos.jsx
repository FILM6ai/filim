'use client';
import React from 'react';

const JurorPhotos = ({ mainTitle, items }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="w-full bg-black py-16 px-6 lg:px-20">

            {mainTitle && (
                <h2 className="text-center text-white text-4xl font-bold mb-12">
                    {mainTitle}
                </h2>
            )}

            {/* Wraps onto a new line every 4 jurors, remaining ones stay centred.
                max-w = 4 cards (260px) + 3 gaps (24px) so the break point is exact. */}
            <div className="flex flex-wrap justify-center gap-6 mx-auto max-w-[1112px]">
                {items.map((juror, index) => (
                    <div
                        key={juror._id || index}
                        className="flex flex-col bg-white w-full max-w-[300px] sm:w-[260px]"
                    >
                        {/* Image */}
                        <div style={{ position: 'relative' }}>
                            <img
                                src={juror.image}
                                alt={juror.name}
                                style={{
                                    width: '100%',
                                    height: '260px',
                                    objectFit: 'cover',
                                    objectPosition: 'top',
                                    display: 'block',
                                }}
                            />
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col gap-1">
                            <p className="text-black font-bold text-lg leading-snug">
                                {juror.name}
                            </p>
                            <p
                                className="text-sm mt-1"
                                style={{ color: '#555' }}
                            >
                                {juror.role}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JurorPhotos;