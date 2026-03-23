import { LOCATIONS } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/10 pt-16 pb-24 md:pb-16 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-primary mb-6">Shrimp Zone</h3>
            <p className="text-gray-400 text-sm">
              عش تجربة الطعم الأصلي للمأكولات البحرية. متواجدون لخدمتكم بأفضل جودة.
            </p>
          </div>

          {/* Egypt Hotlines */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2 inline-block">خدمة العملاء (مصر)</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-primary font-black bg-primary/10 px-3 py-1 rounded-full text-lg shadow-sm">15911</span>
                <span className="text-gray-300 text-sm">الخط الساخن</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary font-black bg-primary/10 px-3 py-1 rounded-full text-lg shadow-sm">01202799990</span>
                <span className="text-gray-300 text-sm">التوصيل المباشر</span>
              </li>
            </ul>
          </div>

          {/* KSA Branches */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2 inline-block">فروع المملكة (السعودية)</h4>
            <ul className="space-y-3">
              {LOCATIONS.ksa.map((loc, idx) => (
                <li key={idx} className="flex flex-col">
                  <span className="text-white font-bold">{loc.name}</span>
                  <span className="text-gray-400 text-xs mt-1">{loc.address}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Egypt Branches */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2 inline-block">فروع مصر</h4>
            <ul className="space-y-3">
              {LOCATIONS.egypt.map((loc, idx) => (
                <li key={idx} className="flex flex-col">
                  <span className="text-white font-bold">{loc.name}</span>
                  <span className="text-gray-400 text-xs mt-1">{loc.address}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Shrimp Zone. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
