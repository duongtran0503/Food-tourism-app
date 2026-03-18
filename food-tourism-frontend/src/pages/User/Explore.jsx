import React from 'react';
import { Search, MapPin, Star, Navigation } from 'lucide-react';
import MapSection from '../../components/Maps/MapSection';

const Explore = () => {
  // Mock Data có thêm tọa độ để hiển thị trên Google Maps
  const popularPlaces = [
    { 
      id: 1, 
      name: "Phở Gia Truyền", 
      rating: 4.8, 
      distance: "1.2 km", 
      category: "Bún/Phở",
      lat: 21.0306, 
      lng: 105.8494,
      address: "49 Bát Đàn, Hà Nội"
    },
    { 
      id: 2, 
      name: "Bánh Mì Phượng", 
      rating: 4.9, 
      distance: "0.8 km", 
      category: "Bánh mì",
      lat: 21.0285, 
      lng: 105.8522,
      address: "Hàng Khay, Hà Nội"
    },
    { 
      id: 3, 
      name: "Bún Chả Hương Liên", 
      rating: 4.7, 
      distance: "2.5 km", 
      category: "Bún chả",
      lat: 21.0198, 
      lng: 105.8558,
      address: "24 Lê Văn Hưu, Hà Nội"
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      
      {/* 🔍 HERO SEARCH SECTION */}
      <section className="text-center space-y-6 py-10">
        <h1 className="text-6xl font-black tracking-tighter leading-none text-white">
          HÔM NAY <br /> <span className="text-orange-500 underline decoration-white/10 italic">BẠN MUỐN ĂN GÌ?</span>
        </h1>
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-0 bg-orange-500/20 blur-3xl group-focus-within:bg-orange-500/40 transition-all duration-500" />
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-[32px] p-2 backdrop-blur-2xl shadow-2xl">
            <Search className="ml-5 text-gray-500" size={24} />
            <input 
              type="text" 
              placeholder="Tìm kiếm món ngon, địa điểm, tỉnh thành..." 
              className="w-full bg-transparent border-none outline-none px-4 py-4 text-lg text-white placeholder:text-gray-600 font-medium"
            />
            <button className="bg-orange-500 px-10 py-4 rounded-2xl font-black text-white shadow-xl hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all">
              TÌM KIẾM
            </button>
          </div>
        </div>
      </section>

      {/* 🗺️ CONTENT GRID: MAP + LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: THE MAP */}
        <div className="lg:col-span-2 relative h-[650px] group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-blue-500/20 rounded-[42px] blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          
          <div className="relative h-full w-full overflow-hidden rounded-[40px] border border-white/10 shadow-2xl">
            {/* TÍCH HỢP MAPSECTION TẠI ĐÂY */}
            <MapSection restaurants={popularPlaces} />

            {/* Overlay thông tin nhanh trên map (Glassmorphism) */}
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/40 backdrop-blur-3xl rounded-[32px] border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 z-10">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 text-white">
                      <MapPin size={28}/>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">Vị trí của bạn</p>
                        <p className="font-bold text-xl text-white">Quận Hoàn Kiếm, Hà Nội</p>
                    </div>
                </div>
                <button className="w-full md:w-auto px-8 py-4 bg-white text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl">
                  CẬP NHẬT GPS
                </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECOMMENDATIONS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Gần bạn nhất</h2>
            <span className="text-orange-500 text-xs font-bold border-b border-orange-500/30 cursor-pointer">Xem tất cả</span>
          </div>
          
          <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar">
            {popularPlaces.map(place => (
              <div 
                key={place.id} 
                className="p-6 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/[0.08] hover:border-orange-500/30 transition-all cursor-pointer group relative overflow-hidden"
              >
                {/* Trang trí góc thẻ */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 blur-2xl rounded-full -mr-10 -mt-10" />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase rounded-lg border border-orange-500/20 tracking-widest">
                    {place.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-sm bg-black/20 px-2 py-1 rounded-lg">
                    <Star size={14} fill="currentColor"/> {place.rating}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-1 text-white group-hover:text-orange-500 transition-colors">
                  {place.name}
                </h3>
                <p className="text-sm text-gray-500 mb-6 flex items-center gap-1.5 font-medium">
                  <MapPin size={14} className="text-gray-700"/> {place.address} • <span className="text-orange-500/70">{place.distance}</span>
                </p>

                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 group-hover:bg-white group-hover:text-black transition-all">
                  <Navigation size={18} className="group-hover:animate-bounce"/> 
                  BẮT ĐẦU CHỈ ĐƯỜNG
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🟠 FOOTER CỦA TRANG (Optional) */}
      <section className="pt-20 border-t border-white/5">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="font-black uppercase tracking-widest text-orange-500 mb-4 text-sm">Về chúng tôi</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Ứng dụng du lịch ẩm thực hàng đầu giúp bạn khám phá những món ngon ẩn mình trong từng con hẻm.</p>
            </div>
            {/* Thêm các cột khác nếu cần */}
         </div>
      </section>

    </div>
  );
};

export default Explore;