import React from 'react';
import { Star, MapPin, Clock, Phone, Share2, Heart } from 'lucide-react';

const RestaurantDetail = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Image Section */}
      <div className="relative h-[450px] rounded-[50px] overflow-hidden border border-white/10">
        <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4" className="w-full h-full object-cover" alt="" />
        <div className="absolute top-6 right-6 flex gap-3">
          <button className="p-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-orange-500 transition-all text-white"><Heart size={20}/></button>
          <button className="p-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white hover:text-black transition-all text-white"><Share2 size={20}/></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <Star size={18} fill="currentColor"/>
              <span className="font-black">4.9 (2.5k đánh giá)</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase">Phở Gia Truyền Bát Đàn</h1>
            <p className="text-gray-400 mt-4 leading-relaxed">Hương vị phở bò truyền thống lâu đời nhất tại Hà Nội. Nước dùng thanh ngọt từ xương, thịt bò mềm tươi và bánh phở dẻo dai tạo nên thương hiệu không thể trộn lẫn.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Giá trung bình</p>
              <p className="text-xl font-black">50.000đ - 150.000đ</p>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Giờ mở cửa</p>
              <p className="text-xl font-black">06:00 - 22:00</p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] h-fit sticky top-28 backdrop-blur-xl">
          <h3 className="text-xl font-bold mb-6">Thông tin liên hệ</h3>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-orange-500/20 text-orange-500 rounded-xl"><MapPin size={20}/></div>
              <p className="text-sm text-gray-300">49 Bát Đàn, Cửa Đông, Hoàn Kiếm, Hà Nội</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl"><Phone size={20}/></div>
              <p className="text-sm text-gray-300">024 3828 5009</p>
            </div>
          </div>
          <button className="w-full mt-10 py-4 bg-orange-500 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 hover:scale-105 transition-all">XEM ĐƯỜNG ĐI</button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;