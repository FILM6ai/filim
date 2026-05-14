'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import card1 from '../../assets/images/card1.png';
import card2 from '../../assets/images/card2.png';
import card3 from '../../assets/images/card3.png';
import card4 from '../../assets/images/card4.png';
import comedey from '../../assets/images/comedy.jpg';
import drama from '../../assets/images/drama.jpg';
import horor from '../../assets/images/hororo.jpg';

const cards = [
  {
    id: 1,
    title: 'Science Fiction',
    description:
      'FILMe redefines storytelling with open source worlds where creators and fans shape narratives and share success through decentralized tech.',
    backgroundImage: card4,
  },
  {
    id: 2,
    title: 'Animated',
    description:
      'FILMe creates powerful, AI-driven content across genres and formats – from short films to epic sagas, delivering high-quality narratives that bring every story to life.',
    backgroundImage: card3,
  },
  {
    id: 3,
    title: 'Comedy',
    description:
      'FILMe uses advanced AI to craft immersive, boundary-breaking stories that captivate audiences worldwide.',
    backgroundImage: comedey,
  },
  {
    id: 4,
    title: 'Drama',
    description:
      'FILMe Studio crafts immersive worlds and unforgettable stories that captivate global audiences across all mediums.',
    backgroundImage: drama,
  },

  ,
  {
    id: 5,
    title: 'Thriller-Horror',
    description:
      'FILMe Studio crafts immersive worlds and unforgettable stories that captivate global audiences across all mediums.',
    backgroundImage: horor,
  },
  {
    id: 6,
    title: 'Adventure-Action',
    description:
      'FILMe Studio crafts immersive worlds and unforgettable stories that captivate global audiences across all mediums.',
    backgroundImage: card2,
  },
];

const StudioLareSec = () => {
  return (
    <main className='min-h-screen bg-gray-100 mt-16'>
      <div className='Mycontainer pt-10 pb-14'>
        <h1 className=' pb-10 text-center text-2xl md:text-4xl font-medium text-heading font-sans'>
          Film6 build a cinematic metaverse composed of 6 universes:
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6'>
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              className='relative aspect-square overflow-hidden rounded-xl group'
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: 'easeOut',
              }}
            >
              <Image
                src={card.backgroundImage}
                alt={card.title}
                fill
                className='object-cover transition-transform duration-500 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-black bg-opacity-70'></div>
              <div className='relative z-10 h-full flex flex-col justify-start pt-10 px-4 md:px-6'>
                <h3 className='text-white text-2xl md:text-3xl font-sans mb-4'>
                  {card.title}
                </h3>
                <p className='text-white text-base md:text-xl font-sans font-normal pt-4 leading-relaxed'>
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default StudioLareSec;
