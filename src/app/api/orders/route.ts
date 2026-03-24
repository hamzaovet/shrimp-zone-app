import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// POST - Create new order (public)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { customerName, customerPhone, address, country, branch, items, totalAmount } = body;

    if (!customerName || !customerPhone || !address || !country || !items?.length || !totalAmount) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    }

    const order = await Order.create({
      customerName,
      customerPhone,
      address,
      country,
      branch: branch || "",
      items,
      totalAmount,
      status: "Pending",
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: error.message || "فشل إنشاء الطلب" }, { status: 500 });
  }
}

// GET - Fetch all orders (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ error: error.message || "فشل جلب الطلبات" }, { status: 500 });
  }
}
