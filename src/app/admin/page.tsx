"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      title: "إجمالي الطلبات",
      value: "1,248",
      icon: ShoppingCart,
      trend: "+12.5%",
      trendUp: true
    },
    {
      title: "الإيرادات",
      value: "45,231 SAR",
      icon: DollarSign,
      trend: "+8.2%",
      trendUp: true
    },
    {
      title: "العملاء النشطين",
      value: "342",
      icon: Users,
      trend: "-2.4%",
      trendUp: false
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">نظرة عامة</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="bg-secondary/40 border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium text-gray-300">
                  {stat.title}
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                <p className={`text-sm font-bold ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend} <span className="text-gray-400 font-normal">من الشهر الماضي</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-secondary/40 border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-white">أحدث الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            لا توجد طلبات حديثة لعرضها.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
