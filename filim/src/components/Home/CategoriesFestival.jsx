"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const CategoriesFestival = ({ index = 0, description, img, youtubeUrl }) => {
  return (
    <div>
      <motion.div
        className="bg-gray-800 rounded-xl shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{
          duration: 0.6,
          delay: index * 0.2,
          ease: "easeOut",
        }}
      >
        <div>
          {youtubeUrl ? (
            <div className="relative w-full h-64">
              <iframe
                src={`${youtubeUrl}?rel=0`}
                title={description}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: "none" }}
              />
            </div>
          ) : img ? (
            <motion.div
              className="relative w-full h-64"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src={img}
                alt={description || "card image"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                priority={true}
              />
            </motion.div>
          ) : null}
        </div>
        <div className="p-4">
          <h2 className="text-xl font-sans font-medium mb-2">{description}</h2>
        </div>
      </motion.div>
    </div>
  );
};

export default CategoriesFestival;
