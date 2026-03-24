import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MenuItem from "@/models/MenuItem";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export async function GET() {
  try {
    // 0. Database Connection
    await connectDB();

    // 1. Admin Verification
    const adminExists = await User.findOne({ email: "admin@shrimpzone.com" });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("123456", salt);
      await User.create({
        name: "Admin",
        email: "admin@shrimpzone.com",
        password: hashedPassword,
        role: "admin",
      });
    }

    // 2. UAE Menu Payload
    const uaeMenu = [
      // الشوربة
      { name: "شوربة سي فود (كريمة - صيامي - حمراء)", description: "شوربة مأكولات بحرية مشكلة", price: 25, category: "الشوربة", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },
      { name: "شوربة جمبري", description: "شوربة روبيان طازج", price: 25, category: "الشوربة", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },
      { name: "شوربة حيتان البحر", description: "شوربة بحرية خاصة", price: 35, category: "الشوربة", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },
      { name: "شوربة سي فود مخلية كريمة", description: "شوربة مأكولات بحرية بدون قشر بالكريمة", price: 40, category: "الشوربة", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },

      // السلطات
      { name: "سلطة خضراء", description: "سلطة خضروات طازجة", price: 5, category: "السلطات", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },
      { name: "سلطة طحينة", description: "طحينة بالسمسم", price: 5, category: "السلطات", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },
      { name: "سلطة جرجير", description: "جرجير طازج مع الليمون", price: 5, category: "السلطات", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },
      { name: "سلطة حمص", description: "حمص بالطحينة", price: 8, category: "السلطات", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },
      { name: "سلطة رنجة", description: "قطع رنجة مدخنة مع الخضار", price: 20, category: "السلطات", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },

      // الأرز والمعجنات
      { name: "أرز صيادية ساده (كبير)", description: "أرز بني متبل", price: 10, category: "الأرز والمعجنات", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },
      { name: "أرز برياني", description: "أرز برياني بالبهارات الهندية", price: 10, category: "الأرز والمعجنات", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },
      { name: "أرز سي فود", description: "أرز مع قطع المأكولات البحرية", price: 20, category: "الأرز والمعجنات", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },
      { name: "اسباجتي سي فود", description: "مكرونة اسباجتي مع المأكولات البحرية", price: 20, category: "الأرز والمعجنات", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },

      // المقبلات الساخنة
      { name: "طبق كفتة جمبري مقلي", description: "كفتة روبيان مقرمشة", price: 30, category: "المقبلات الساخنة", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },
      { name: "ملوخية بالجمبري", description: "ملوخية خضراء بالروبيان", price: 12, category: "المقبلات الساخنة", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },
      { name: "بايلا سي فود", description: "بايلا إسبانية بالمأكولات البحرية", price: 60, category: "المقبلات الساخنة", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },
      { name: "بلح بحر بالجبنة الموتزاريلا", description: "بلح بحر مخبوز بالجبنة", price: 35, category: "المقبلات الساخنة", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },

      // الوجبات الرئيسية
      { name: "وجبة بلطي", description: "وجبة سمك بلطي متكاملة", price: 20, category: "الوجبات الرئيسية", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },
      { name: "وجبة سيباس", description: "وجبة سمك سيباس فاخرة", price: 35, category: "الوجبات الرئيسية", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },

      // الأسماك
      { name: "بوري مصري", description: "سعر الكيلو (يشمل الشوي + خبز وطحينية)", price: 40, category: "الأسماك", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },
      { name: "سيباس", description: "سعر الكيلو (يشمل الشوي + خبز وطحينية)", price: 70, category: "الأسماك", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },
      { name: "هامور", description: "سعر الكيلو (يشمل الشوي + خبز وطحينية)", price: 85, category: "الأسماك", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },
      { name: "سالمون", description: "سعر الكيلو (يشمل الشوي + خبز وطحينية)", price: 100, category: "الأسماك", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },

      // القشريات
      { name: "روبيان وسط", description: "سعر الكيلو (يشمل الشوي + خبز وطحينية)", price: 55, category: "القشريات", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },
      { name: "استاكوزا", description: "سعر الكيلو (يشمل الشوي + خبز وطحينية)", price: 150, category: "القشريات", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },
      { name: "كابوريا", description: "سعر الكيلو (يشمل الشوي + خبز وطحينية)", price: 60, category: "القشريات", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },

      // الطواجن
      { name: "طاجن ميكس سي فود", description: "طاجن فخار بالمأكولات البحرية المشكلة", price: 30, category: "الطواجن", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },

      // السطل البحري
      { name: "سطل بحري وسط", description: "سطل مأكولات بحرية مسلوقة بالبهارات", price: 90, category: "السطل البحري", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },

      // الوجبات الاقتصادية
      { name: "وجبة سيفود مقلي", description: "2 فيليه + 2 ربيان + 2 كلاماري + بطاطس + سلطة + رز + خبز", price: 15, category: "الوجبات الاقتصادية", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" },
      { name: "وجبة ملوخية بالجمبري", description: "3 روبيان على الفحم + أرز + ملوخية", price: 15, category: "الوجبات الاقتصادية", image: "https://i.postimg.cc/placeholder.png", country: "الإمارات AE" }
    ];

    // 3. Clear and Insert strictly for UAE
    await MenuItem.deleteMany({ country: "الإمارات AE" });
    await MenuItem.insertMany(uaeMenu);

    return NextResponse.json({ message: "تم زرع منيو الإمارات بنجاح! 🇦🇪🚀" }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "فشل زرع البيانات" }, { status: 500 });
  }
}