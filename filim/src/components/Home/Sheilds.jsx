'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Import images
import card1 from '../../assets/images/sheild5.png';
import card2 from '../../assets/images/sheild6.png';
import card3 from '../../assets/images/sheild7.png';
import card4 from '../../assets/images/sheild8.png';

const cards = [
  {
    img: card3,
    title: 'Golden Crest',
    dots: 'Honors films that demonstrate outstanding craftsmanship and vision. This award is given to works that stand out for their direction and emotional depth. It reflects a high standard of cinematic artistry and storytelling. The Golden Crest is often seen as a stepping stone to global recognition.',
  },
  {
    img: card4,
    title: 'Best Science-Fiction Award',
    dots: 'Recognizes innovation in science-fiction filmmaking and concept development. It celebrates films that explore futuristic worlds, technology, and imagination. Winners often combine compelling narratives with cutting-edge VFX. This award is a benchmark for creativity in speculative storytelling.',
  },
  {
    img: card2,
    title: 'Best Animated Film Award',
    dots: 'Awarded to the most artistically and technically impressive animated film. Highlights animation that blends visual style, strong characters, and emotional resonance. It sets the standard for excellence in animated storytelling across all ages. The winner typically influences global animation trends and techniques.',
  },
  {
    img: card1,
    title: 'Special Honor Award',
    dots: 'A prestigious tribute to an individual’s lifetime achievements in cinema. It honors dedication, influence, and significant contributions to the film industry. Often given to pioneers, legends, or institutions with lasting impact. The Special Honor Award symbolizes legacy, innovation, and inspiration.',
  },
];

const Sheilds = ({mainTitle, cards}) => {
    const displayCards = cards.length ? cards : [];
    console.log(cards, 'displayCards');

  return (
    <div className='w-full min-h-screen bg-black flex flex-col  items-start justify-center gap-12 py-16 px-4 lg:px-20'>
      <h1 className='text-white flex m-auto  md:text-4xl text-2xl'>
        {mainTitle}
      </h1>
      {displayCards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          viewport={{ once: true }}
          className='flex max-sm:flex-wrap items-center gap-6 p-4 rounded-xl border-2 border-white'
        >
          <Image
            src={card.image}
            alt={card.title}
            width={100}
            height={100}
            className='object-contain'
          />
          <div className='text-white text-left'>
            <h2 className='text-2xl  mb-1'>{card.title}</h2>
            <p className='text-sm font-normal '>{card.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Sheilds;
