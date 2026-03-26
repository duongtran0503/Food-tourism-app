import { RegisterFormValues, UserRole } from "./zod-schemas";

// --- ĐỊNH NGHĨA INTERFACE ---
export interface Restaurant extends RegisterFormValues {
  id: string;
  status: "PENDING" | "ACTIVE" | "BANNED";
  createdAt: string;
}

export interface UserItem extends Omit<RegisterFormValues, "role"> {
  id: string;
  role: UserRole;
  status: "ACTIVE" | "BANNED";
  createdAt: string;
}

export interface Food {
  id: string;
  name: string;
  price: number;
}

export interface Restaurant {
  id: string;
  fullName: string; // Tên quán
  email: string;
  phoneNumber: string; // Hotline
  address: string;
  openingHours: string;
  avatar?: string;
  status: "PENDING" | "ACTIVE" | "BANNED";
  foodIds: string[]; // Danh sách ID các món ăn thuộc quán
  createdAt: string;
}

export interface FoodItem {
  id: string;
  merchantId: string;
  name: string;
  minPrice: number;
  maxPrice: number;
  categoryId: string;
  poiId: string;
  status: "Còn món" | "Hết món";
  image?: string;
}

export interface MenuItem {
  id: string;
  merchantId: string;
  name: string;
  price: string;
  category: string;
  status: "Còn món" | "Hết món";
  isSignature: boolean;
  desc: string;
  image?: string;
}

export const MOCK_FOODS: Food[] = [
  { id: "f1", name: "Phở Bò Nam Định", price: 55000 },
  { id: "f2", name: "Bún Chả Hà Nội", price: 45000 },
  { id: "f3", name: "Cơm Tấm Sườn Bì", price: 60000 },
  { id: "f4", name: "Trà Đào Cam Sả", price: 35000 },
];

export const MOCK_CATEGORIES = [
  { id: "cat1", name: "Món nước (Phở, Bún)" },
  { id: "cat2", name: "Cơm & Xôi" },
  { id: "cat3", name: "Ăn vặt & Đường phố" },
  { id: "cat4", name: "Đồ uống & Tráng miệng" },
];

export const MOCK_POIS = [
  { id: "poi1", name: "Chợ Bến Thành - Q1" },
  { id: "poi2", name: "Nhà thờ Đức Bà - Q1" },
  { id: "poi3", name: "Hồ Con Rùa - Q3" },
  { id: "poi4", name: "Phố đi bộ Nguyễn Huệ" },
];

const RESTAURANT_KEY = "food_tour_restaurants";
const USER_KEY = "food_tour_users";
const FOOD_KEY = "food_tour_all_foods";
const MENU_STORAGE_KEY = "food_tour_merchant_menu";
const delay = (ms: number = 800) => new Promise(res => setTimeout(res, ms));

// --- 1. MOCK API CHO QUÁN ĂN (Để dùng trong admin/restaurants) ---
export const MockAPI = {
  getRestaurants: async (): Promise<Restaurant[]> => {
    await delay();
    const data = localStorage.getItem(RESTAURANT_KEY);
    return data ? JSON.parse(data) : [];
  },

  createRestaurant: async (data: any): Promise<Restaurant> => {
    await delay(1000);
    const current = await MockAPI.getRestaurants();
    const newItem: Restaurant = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(RESTAURANT_KEY, JSON.stringify([newItem, ...current]));
    return newItem;
  },

  updateStatus: async (id: string, status: "ACTIVE" | "BANNED"): Promise<void> => {
    await delay(500);
    const current = await MockAPI.getRestaurants();
    const updated = current.map(item => item.id === id ? { ...item, status } : item);
    localStorage.setItem(RESTAURANT_KEY, JSON.stringify(updated));
  },

  deleteRestaurant: async (id: string): Promise<void> => {
    await delay(500);
    const current = await MockAPI.getRestaurants();
    const filtered = current.filter(item => item.id !== id);
    localStorage.setItem(RESTAURANT_KEY, JSON.stringify(filtered));
  }
};

// --- 2. MOCK API CHO NGƯỜI DÙNG (Để dùng trong admin/users) ---
export const UserMockAPI = {
  getUsers: async (): Promise<UserItem[]> => {
    await delay();
    const data = localStorage.getItem(USER_KEY);
    if (data) return JSON.parse(data);

    const defaultUsers: UserItem[] = [{ 
      id: "admin-1", fullName: "Lợi Admin", email: "admin@food.com", 
      phoneNumber: "0901234567", role: "ADMIN", status: "ACTIVE", 
      createdAt: new Date().toISOString(), password: "123", confirmPassword: "123" 
    }];
    localStorage.setItem(USER_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  },

  // CREATE: Admin thêm thủ công staff/người dùng
  createUser: async (data: any): Promise<UserItem> => {
    await delay(1000);
    const users = await UserMockAPI.getUsers();
    const newUser: UserItem = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(USER_KEY, JSON.stringify([newUser, ...users]));
    return newUser;
  },

  updateUser: async (id: string, updates: Partial<UserItem>): Promise<void> => {
    await delay(800);
    const users = await UserMockAPI.getUsers();
    const updated = users.map(u => u.id === id ? { ...u, ...updates } : u);
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
  },

  deleteUser: async (id: string): Promise<void> => {
    await delay(500);
    const users = await UserMockAPI.getUsers();
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem(USER_KEY, JSON.stringify(filtered));
  }
};

export const RestaurantAPI = {
  getRestaurants: async (): Promise<Restaurant[]> => {
    await delay();
    const data = localStorage.getItem(RESTAURANT_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveRestaurant: async (data: Partial<Restaurant>): Promise<void> => {
    await delay(1000);
    const list = await RestaurantAPI.getRestaurants();
    if (data.id) {
      // Update
      const updated = list.map(r => r.id === data.id ? { ...r, ...data } : r);
      localStorage.setItem(RESTAURANT_KEY, JSON.stringify(updated));
    } else {
      // Create
      const newItem: Restaurant = {
        ...data as any,
        id: Math.random().toString(36).substr(2, 9),
        status: "PENDING",
        foodIds: data.foodIds || [],
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(RESTAURANT_KEY, JSON.stringify([newItem, ...list]));
    }
  },

  delete: async (id: string) => {
    await delay(500);
    const list = await RestaurantAPI.getRestaurants();
    localStorage.setItem(RESTAURANT_KEY, JSON.stringify(list.filter(r => r.id !== id)));
  }
};

export const FoodAPI = {
  getAll: async (): Promise<FoodItem[]> => {
    const data = localStorage.getItem(FOOD_KEY);
    return data ? JSON.parse(data) : [];
  },

  save: async (data: Partial<FoodItem>) => {
    const list = await FoodAPI.getAll();
    if (data.id) {
      const updated = list.map(f => f.id === data.id ? { ...f, ...data } : f);
      localStorage.setItem(FOOD_KEY, JSON.stringify(updated));
    } else {
      const newItem = { ...data, id: Math.random().toString(36).substr(2, 9), status: "ACTIVE" };
      localStorage.setItem(FOOD_KEY, JSON.stringify([newItem, ...list]));
    }
  },

  delete: async (id: string) => {
    const list = await FoodAPI.getAll();
    localStorage.setItem(FOOD_KEY, JSON.stringify(list.filter(f => f.id !== id)));
  }
};

export const MenuMockAPI = {
  // 1. READ: Lấy thực đơn của một Merchant cụ thể
  getMenu: async (merchantId: string): Promise<MenuItem[]> => {
    await delay();
    const data = localStorage.getItem(MENU_STORAGE_KEY);
    const allMenu: MenuItem[] = data ? JSON.parse(data) : [
      // Dữ liệu mẫu ban đầu
      { id: "m1", merchantId: "merchant-123", name: "Phở Bò Đặc Biệt", price: "65,000đ", category: "Món nước", status: "Còn món", isSignature: true, desc: "Nước dùng truyền thống hầm từ xương bò." },
      { id: "m2", merchantId: "merchant-123", name: "Quẩy Giòn", price: "5,000đ", category: "Món thêm", status: "Còn món", isSignature: false, desc: "Quẩy mới chiên giòn tan." }
    ];
    
    // Lọc theo Merchant đang đăng nhập
    return allMenu.filter(item => item.merchantId === merchantId);
  },

  // 2. CREATE/UPDATE
  saveMenuItem: async (item: Partial<MenuItem>): Promise<void> => {
    await delay(1000);
    const data = localStorage.getItem(MENU_STORAGE_KEY);
    let allMenu: MenuItem[] = data ? JSON.parse(data) : [];

    if (item.id) {
      // Cập nhật
      allMenu = allMenu.map(m => m.id === item.id ? { ...m, ...item } : m);
    } else {
      // Thêm mới
      const newItem = {
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        status: "Còn món",
      } as MenuItem;
      allMenu.push(newItem);
    }
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(allMenu));
  },

  // 3. DELETE
  deleteMenuItem: async (id: string): Promise<void> => {
    await delay(500);
    const data = localStorage.getItem(MENU_STORAGE_KEY);
    if (data) {
      const allMenu: MenuItem[] = JSON.parse(data);
      const filtered = allMenu.filter(m => m.id !== id);
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(filtered));
    }
  }
};