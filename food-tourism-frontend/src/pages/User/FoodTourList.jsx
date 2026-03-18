import React from 'react';
import { motion } from 'framer-motion';
import { Map, Clock, Star, ArrowRight, Navigation } from 'lucide-react';

const FoodTourList = () => {
  const tours = [
    { id: 1, title: "Đêm trắng phố cổ Hà Nội", locations: 6, duration: "5h", rating: 4.9, price: "Free", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1" },
    { id: 2, title: "Sài Gòn - Hẻm nhỏ món ngon", locations: 8, duration: "4h", rating: 4.8, price: "Free", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <header>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter">Hành trình <span className="text-orange-500">đề xuất</span></h2>
        <p className="text-gray-400">Những cung đường ẩm thực được thiết kế riêng cho bạn.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tours.map((tour) => (
          <motion.div 
            key={tour.id} 
            whileHover={{ y: -10 }}
            className="group relative h-[400px] rounded-[40px] overflow-hidden border border-white/10"
          >
            <img src={tour.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
              <div className="flex gap-3">
                <span className="px-3 py-1 bg-orange-500 rounded-lg text-[10px] font-black uppercase">Trending</span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-black uppercase border border-white/10 flex items-center gap-1">
                  <Star size={10} fill="currentColor"/> {tour.rating}
                </span>
              </div>
              <h3 className="text-3xl font-black text-white">{tour.title}</h3>
              <div className="flex items-center gap-6 text-sm text-gray-300 font-medium">
                <span className="flex items-center gap-2"><Map size={16} className="text-orange-500"/> {tour.locations} địa điểm</span>
                <span className="flex items-center gap-2"><Clock size={16} className="text-orange-500"/> {tour.duration}</span>
              </div>
              <button className="flex items-center gap-2 text-orange-500 font-black uppercase tracking-widest text-sm group-hover:gap-4 transition-all">
                Khám phá lộ trình <ArrowRight size={18}/>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FoodTourList;