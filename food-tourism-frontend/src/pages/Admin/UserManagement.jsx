import React from 'react';
import { Search, Mail, User } from 'lucide-react';

const UserManagement = () => (
  <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] backdrop-blur-xl">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-black uppercase tracking-tighter">Quản lý người dùng</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
        <input type="text" placeholder="Tìm kiếm user..." className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 outline-none focus:border-blue-500" />
      </div>
    </div>
    <div className="space-y-4">
      {[1, 2, 3].map((u) => (
        <div key={u} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400"><User size={20}/></div>
            <div>
              <p className="font-bold">Người dùng #{u}</p>
              <p className="text-xs text-gray-500">user{u}@gmail.com</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all text-xs font-bold">Khóa tài khoản</button>
        </div>
      ))}
    </div>
  </div>
);

export default UserManagement;