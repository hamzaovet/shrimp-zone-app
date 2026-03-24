import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from '@/lib/db';
import MenuItem from '@/models/MenuItem';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const params = await context.params;
    const { id } = params;
    
    const data = await request.json();
    await connectDB();
    
    const updatedItem = await MenuItem.findByIdAndUpdate(id, data, { new: true });
    if (!updatedItem) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    
    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const params = await context.params;
    const { id } = params;

    await connectDB();
    const deletedItem = await MenuItem.findByIdAndDelete(id);
    if (!deletedItem) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    
    return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
