'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, Quote } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Alexander V.',
    car: 'Tesla Model 3 Long Range',
    rating: 5,
    date: '2 days ago',
    comment: 'Buying experience was lightning fast. Booked the test drive online, car arrived at my office fully charged, and finance was approved in under 15 minutes!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 2,
    name: 'Dmitry K.',
    car: 'BMW X5 xDrive40i',
    rating: 5,
    date: '1 week ago',
    comment: 'The 150-point inspection report gave me total peace of mind. Transparent pricing with zero hidden dealer markups. Highly recommended!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 3,
    name: 'Elena S.',
    car: 'Porsche Taycan 4S',
    rating: 5,
    date: '2 weeks ago',
    comment: 'The AI Concierge answered all my questions regarding charging speeds and home wallbox installation. Flawless service from start to finish.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
  },
];

export default function ReviewsSection() {
  return (
    <section id="reviews" className="relative py-16 px-4 lg:px-12 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-2">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>4.9 / 5.0 Average Customer Rating</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Client Stories & <span className="text-cyan-400">Feedback</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((rev, idx) => (
          <motion.div
            key={rev.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -6 }}
            className="glass-card-hover p-6 rounded-3xl border border-cyan-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] text-slate-500">{rev.date}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
                "{rev.comment}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-cyan-500/15">
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-10 h-10 rounded-full object-cover border border-cyan-400/40"
              />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{rev.name}</span>
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-[11px] text-cyan-300/80">{rev.car}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
