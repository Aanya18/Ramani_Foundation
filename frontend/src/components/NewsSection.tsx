"use client";

import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { type Article, mediaUrl } from "@/lib/api";
import { format } from "date-fns";

interface NewsSectionProps {
  articles: Article[];
}

export default function NewsSection({ articles }: NewsSectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="relative py-24 px-4 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 flex items-end justify-between gap-8 flex-col lg:flex-row"
        >
          <div>
            <span className="inline-flex items-center rounded-full bg-primary/20 px-4 py-2 text-sm font-semibold text-primary mb-4">
              ✓ News
            </span>
            <h2 className="text-4xl lg:text-5xl font-manrope font-extrabold text-foreground">
              Read Our Latest News
            </h2>
          </div>
          <button className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
            View All <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* News Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-56 rounded-2xl overflow-hidden mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                {article.image_url ? (
                  <img
                    src={mediaUrl(article.image_url)}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                    <span className="text-4xl font-bold">News</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {article.category && (
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                      {article.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                {article.content}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Clock className="w-4 h-4" />
                  {format(new Date(article.created_at), 'MMMM dd, yyyy')}
                </div>
                <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
