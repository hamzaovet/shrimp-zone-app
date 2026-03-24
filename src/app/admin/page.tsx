"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ShoppingBag, Clock, CheckCircle, XCircle, TrendingUp,
  BarChart3, MapPin
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  country: string;
  branch: string;
  items: OrderItem[];
  totalAmount: number;
  status: "Pending" | "Completed" | "Cancelled";
  createdAt: string;
}

const getFlag = (c: string) => c === "السعودية SA" ? "🇸🇦" : c === "الإمارات AE" ? "🇦🇪" : "🇪🇬";
const getCurrency = (c: string) => c === "السعودية SA" ? "SAR" : c === "الإمارات AE" ? "AED" : "EGP";

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  Pending: { label: "قيد الانتظار", color: "text-yellow-400 bg-yellow-400/10" },
  Completed: { label: "مكتمل", color: "text-green-400 bg-green-400/10" },
  Cancelled: { label: "ملغي", color: "text-red-400 bg-red-400/10" },
};

export default function AdminOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) setOrders(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === "Pending").length;
    const completed = orders.filter(o => o.status === "Completed").length;
    const cancelled = orders.filter(o => o.status === "Cancelled").length;

    const revenueByCountry = (country: string) =>
      orders
        .filter(o => o.country === country && o.status !== "Cancelled")
        .reduce((s, o) => s + o.totalAmount, 0);

    return {
      total, pending, completed, cancelled,
      egpRevenue: revenueByCountry("مصر"),
      sarRevenue: revenueByCountry("السعودية SA"),
      aedRevenue: revenueByCountry("الإمارات AE"),
    };
  }, [orders]);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-white/5 rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-white/5 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
        </div>
        <div className="h-64 bg-white/5 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        نظرة عامة
      </h1>

      {/* Order Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-black text-white">{stats.total}</p>
              <p className="text-gray-400 text-xs mt-0.5">إجمالي الطلبات</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-400/5 border-yellow-400/10 hover:border-yellow-400/20 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-yellow-400/10 rounded-xl">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-3xl font-black text-yellow-400">{stats.pending}</p>
              <p className="text-gray-400 text-xs mt-0.5">قيد الانتظار</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-400/5 border-green-400/10 hover:border-green-400/20 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-green-400/10 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-3xl font-black text-green-400">{stats.completed}</p>
              <p className="text-gray-400 text-xs mt-0.5">مكتمل</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-400/5 border-red-400/10 hover:border-red-400/20 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-red-400/10 rounded-xl">
              <XCircle className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-3xl font-black text-red-400">{stats.cancelled}</p>
              <p className="text-gray-400 text-xs mt-0.5">ملغي</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Region */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" /> الإيرادات حسب المنطقة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Egypt */}
          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/5 border-green-500/10 hover:border-green-500/20 transition-colors overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🇪🇬</span>
                <span className="text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full font-bold">EGP</span>
              </div>
              <p className="text-3xl font-black text-white">{stats.egpRevenue.toLocaleString()}</p>
              <p className="text-gray-400 text-sm mt-1">إيرادات مصر</p>
              <div className="absolute -bottom-4 -left-4 text-8xl opacity-5 font-black">EGP</div>
            </CardContent>
          </Card>

          {/* KSA */}
          <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/5 border-emerald-500/10 hover:border-emerald-500/20 transition-colors overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🇸🇦</span>
                <span className="text-xs text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full font-bold">SAR</span>
              </div>
              <p className="text-3xl font-black text-white">{stats.sarRevenue.toLocaleString()}</p>
              <p className="text-gray-400 text-sm mt-1">إيرادات السعودية</p>
              <div className="absolute -bottom-4 -left-4 text-8xl opacity-5 font-black">SAR</div>
            </CardContent>
          </Card>

          {/* UAE */}
          <Card className="bg-gradient-to-br from-sky-900/20 to-sky-800/5 border-sky-500/10 hover:border-sky-500/20 transition-colors overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🇦🇪</span>
                <span className="text-xs text-sky-400 bg-sky-400/10 px-3 py-1 rounded-full font-bold">AED</span>
              </div>
              <p className="text-3xl font-black text-white">{stats.aedRevenue.toLocaleString()}</p>
              <p className="text-gray-400 text-sm mt-1">إيرادات الإمارات</p>
              <div className="absolute -bottom-4 -left-4 text-8xl opacity-5 font-black">AED</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" /> آخر الطلبات
        </h2>
        {recentOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-secondary/20 rounded-2xl border border-white/5 border-dashed">
            لا توجد طلبات بعد.
          </div>
        ) : (
          <Card className="bg-secondary/30 border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-right text-gray-400 font-medium p-4 text-xs">العميل</th>
                    <th className="text-right text-gray-400 font-medium p-4 text-xs">الدولة</th>
                    <th className="text-right text-gray-400 font-medium p-4 text-xs">الإجمالي</th>
                    <th className="text-right text-gray-400 font-medium p-4 text-xs">الحالة</th>
                    <th className="text-right text-gray-400 font-medium p-4 text-xs">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const st = STATUS_STYLES[order.status];
                    return (
                      <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <p className="text-white font-bold">{order.customerName}</p>
                          <p className="text-gray-500 text-xs mt-0.5" dir="ltr">{order.customerPhone}</p>
                        </td>
                        <td className="p-4 text-gray-300">
                          {getFlag(order.country)} {order.country}
                        </td>
                        <td className="p-4">
                          <span className="text-primary font-black">{order.totalAmount} {getCurrency(order.country)}</span>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${st.color}`}>{st.label}</span>
                        </td>
                        <td className="p-4 text-gray-400 text-xs whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
