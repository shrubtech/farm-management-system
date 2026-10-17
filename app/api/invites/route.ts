import { NextRequest, NextResponse } from 'next/server';
import { createInviteSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = createInviteSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0]?.message || 'Invalid invite parameters' },
        { status: 400 }
      );
    }

    const { role, email, expiryDuration, maxUses } = parseResult.data;
    const callerRole = request.headers.get('x-user-role') || 'owner';

    // Role enforcement
    if (callerRole === 'worker') {
      return NextResponse.json(
        { error: 'Worker accounts are not permitted to generate invite codes.' },
        { status: 403 }
      );
    }

    if (callerRole === 'manager' && role !== 'worker') {
      return NextResponse.json(
        { error: 'Farm Managers can only generate invite codes for Workers.' },
        { status: 403 }
      );
    }

    const durationDays = expiryDuration === '24h' ? 1 : expiryDuration === '7d' ? 7 : 30;
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = `FS-${role.toUpperCase().slice(0, 3)}-${randomHex}`;

    return NextResponse.json({
      success: true,
      invite: {
        id: `inv-${Date.now()}`,
        code,
        role,
        email: email || null,
        expiresAt,
        maxUses,
        usedCount: 0,
        status: 'active',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to generate farm invitation code.' },
      { status: 500 }
    );
  }
}
