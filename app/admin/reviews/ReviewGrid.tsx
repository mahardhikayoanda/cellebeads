// File: app/admin/reviews/ReviewGrid.tsx
'use client';

import { motion } from 'framer-motion';
import { IReviewPopulated } from './actions';
import ReviewAdminCard from './ReviewAdminCard';

export default function ReviewGrid({ reviews }: { reviews: IReviewPopulated[] }) {
  return (
    <motion.div 
      className="grid gap-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {reviews.map((review) => (
        <motion.div
          key={review._id}
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <ReviewAdminCard review={review} />
        </motion.div>
      ))}
    </motion.div>
  );
}