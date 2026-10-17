import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validators';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting by IP or forwarded header
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'anonymous-ip';

    const rateLimit = checkRateLimit(`login-${ip}`, 5, 15 * 60 * 1000); // 5 attempts per 15 min
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: `Too many login attempts. Please try again in ${Math.ceil(
            rateLimit.resetInSeconds / 60
          )} minutes.`,
        },
        { status: 429 }
      );
    }

    // 2. Body parsing and Zod Validation
    const body = await request.json();
    const parseResult = loginSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    // 3. Return sanitized response
    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      email: email.toLowerCase(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'An unexpected authentication error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
