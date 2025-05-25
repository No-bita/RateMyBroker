import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // TODO: Replace with actual database operations
    // This is a mock registration for demonstration
    const mockUser = {
      id: '1',
      name,
      email,
      password // In real app, this would be hashed
    };

    // Create JWT token
    const token = sign(
      { userId: mockUser.id, email: mockUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    // Return user data (excluding sensitive information)
    return NextResponse.json({
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 