"use client";

import { useState, useEffect, useMemo } from "react";
import { ShoppingBag, Clock, CheckCircle, XCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const STATUS_CONFIG = {
  Pending: { label: "قيد الانتظار", icon: Clock, color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  Completed: { label: "مكتمل", icon: CheckCircle, color: "text-green-400 bg-green-400/10 border-green-400/20" },
  Cancelled: { label: "ملغي", icon: XCircle, color: "text-red-400 bg-red-400/10 border-red-400/20" },
};

const COUNTRY_FILTERS = [
  { key: "all", label: "الكل" },
  { key: "السعودية SA", label: "🇸🇦 السعودية" },
  { key: "مصر", label: "🇪🇬 مصر" },
  { key: "الإمارات AE", label: "🇦🇪 الإمارات" },
];

const getCurrency = (country: string) => {
  if (country === "السعودية SA") return "SAR";
  if (country === "الإمارات AE") return "AED";
  return "EGP";
};

const getFlag = (country: string) => {
  if (country === "السعودية SA") return "🇸🇦";
  if (country === "الإمارات AE") return "🇦🇪";
  return "🇪🇬";
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return orders;
    return orders.filter((o) => o.country === activeFilter);
  }, [orders, activeFilter]);

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    completed: orders.filter((o) => o.status === "Completed").length,
    revenue: orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.totalAmount, 0),
  }), [orders]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-primary" />
          إدارة الطلبات
        </h1>
        <Button onClick={fetchOrders} variant="outline" className="border-white/20 text-white hover:bg-white/5 rounded-xl">
          تحديث
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <p className="text-3xl font-black text-white">{stats.total}</p>
          <p className="text-gray-400 text-sm mt-1">إجمالي الطلبات</p>
        </div>
        <div className="bg-yellow-400/5 border border-yellow-400/10 rounded-2xl p-5 text-center">
          <p className="text-3xl font-black text-yellow-400">{stats.pending}</p>
          <p className="text-gray-400 text-sm mt-1">قيد الانتظار</p>
        </div>
        <div className="bg-green-400/5 border border-green-400/10 rounded-2xl p-5 text-center">
          <p className="text-3xl font-black text-green-400">{stats.completed}</p>
          <p className="text-gray-400 text-sm mt-1">مكتمل</p>
        </div>
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 text-center">
          <p className="text-3xl font-black text-primary">{stats.revenue.toLocaleString()}</p>
          <p className="text-gray-400 text-sm mt-1">إجمالي الإيرادات</p>
        </div>
      </div>

      {/* Country Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 text-gray-400 shrink-0" />
        {COUNTRY_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all ${
              activeFilter === f.key
                ? "bg-primary text-white shadow-[0_0_12px_rgba(255,87,34,0.3)]"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center text-gray-400 py-16">جاري التحميل...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500 py-16 bg-secondary/20 rounded-2xl border border-white/5 border-dashed">
          لا توجد طلبات حالياً.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status];
            const StatusIcon = statusCfg.icon;
            const orderCurrency = getCurrency(order.country);

            return (
              <Card key={order._id} className="bg-secondary/40 border-white/10 hover:border-white/20 transition-colors overflow-hidden">
                <CardContent className="p-5">
                  {/* Top Row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 font-mono bg-white/5 px-2 py-1 rounded" dir="ltr">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                          year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${statusCfg.color}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {statusCfg.label}
                    </div>
                  </div>

                  {/* Customer & Country */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">العميل</p>
                      <p className="text-white font-bold text-sm">{order.customerName}</p>
                      <p className="text-gray-400 text-xs mt-0.5" dir="ltr">{order.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">العنوان</p>
                      <p className="text-gray-300 text-sm line-clamp-2">{order.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">الدولة / الفرع</p>
                      <p className="text-white font-bold text-sm">{getFlag(order.country)} {order.country}</p>
                      {order.branch && <p className="text-gray-400 text-xs mt-0.5">{order.branch}</p>}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-white/5 rounded-xl p-3 mb-4 border border-white/5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-1">
                        <span className="text-gray-300">{item.quantity}x {item.name}</span>
                        <span className="text-primary font-bold">{item.price * item.quantity} {orderCurrency}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 mt-2 border-t border-white/10">
                      <span className="text-white font-bold text-sm">الإجمالي</span>
                      <span className="text-primary font-black">{order.totalAmount} {orderCurrency}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {order.status === "Pending" && (
                      <>
                        <Button
                          onClick={() => updateStatus(order._id, "Completed")}
                          size="sm"
                          className="bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded-lg text-xs h-8 px-4 transition-colors"
                        >
                          <CheckCircle className="h-3.5 w-3.5 ml-1" /> تأكيد
                        </Button>
                        <Button
                          onClick={() => updateStatus(order._id, "Cancelled")}
                          size="sm"
                          className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-xs h-8 px-4 transition-colors"
                        >
                          <XCircle className="h-3.5 w-3.5 ml-1" /> إلغاء
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
