import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    
    const existingAdmin = await User.findOne({ email: 'admin@shrimpzone.com' });
    
    if (existingAdmin) {
      return NextResponse.json({ message: 'Admin user already exists' }, { status: 200 });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);
    
    const admin = new User({
      name: 'Admin',
      email: 'admin@shrimpzone.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await admin.save();
    
    return NextResponse.json({ message: 'Admin user created successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
