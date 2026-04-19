"use client";

import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";

export default function NewsSection() {
  const news = [
    {
      id: 1,
      title: "New Udaipur Community Center Inaugurated",
      excerpt: "Ramani Foundation opens state-of-the-art community center in rural Udaipur, providing education and healthcare services to 500+ families...",
      category: "News",
      date: "May 15, 2024",
      bgClass: "from-primary to-secondary",
      image: "/images/news-community-center.jpg",
    },
    {
      id: 2,
      title: "Udaipur Artisan Empowerment Program",
      excerpt: "New initiative launched to support traditional craftsmen in Udaipur's old city, connecting them with modern markets...",
      category: "Events",
      date: "May 10, 2024",
      bgClass: "from-secondary to-accent",
      image: "/images/news-volunteer-program.jpg",
    },
    {
      id: 3,
      title: "Ramani Foundation 2024 Impact Report",
      excerpt: "Celebrating 10 years of service in Udaipur: 25,000+ lives touched, 50+ villages reached, and sustainable development achieved...",
      category: "Report",
      date: "May 8, 2024",
      bgClass: "from-accent to-primary",
      image: "/images/news-impact-report.jpg",
    },
  ];

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
          {news.map((article, index) => (
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
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                {article.excerpt}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Clock className="w-4 h-4" />
                  {article.date}
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
