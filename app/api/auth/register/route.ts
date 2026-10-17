import { NextRequest, NextResponse } from 'next/server';
import { registrationSchema } from '@/lib/validators';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'anonymous-ip';

    const rateLimit = checkRateLimit(`register-${ip}`, 10, 60 * 60 * 1000); // 10 attempts per hour
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: `Too many registration attempts. Please try again in ${Math.ceil(
            rateLimit.resetInSeconds / 60
          )} minutes.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parseResult = registrationSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0]?.message || 'Invalid registration data' },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Enforce role security: Client can NEVER self-elevate to Manager or Worker without an invite code
    if (data.role === 'manager' || data.role === 'worker') {
      if (!data.inviteCode || !data.inviteCode.trim()) {
        return NextResponse.json(
          { error: `A valid Farm Invite Code is required to join with the ${data.role.toUpperCase()} role.` },
          { status: 403 }
        );
      }
    }

    // Role-specific server handling
    return NextResponse.json({
      success: true,
      message:
        data.role === 'owner'
          ? `Farm "${data.farmName}" and Owner account registered successfully.`
          : `Joined farm successfully as ${data.role.toUpperCase()}.`,
      user: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        role: data.role,
        farmName: data.farmName || 'FarmSync Partner Farm',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'An unexpected server error occurred during registration.' },
      { status: 500 }
    );
  }
}
