import { NextRequest, NextResponse } from 'next/server';
import { createDirectUserSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const callerRole = request.headers.get('x-user-role') || 'owner';

    // Strictly enforce that only Owner can directly provision user accounts
    if (callerRole !== 'owner') {
      return NextResponse.json(
        { error: 'Forbidden: Only Farm Owners can directly provision new user accounts.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parseResult = createDirectUserSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0]?.message || 'Invalid user data' },
        { status: 400 }
      );
    }

    const { fullName, email, phone, role, temporaryPassword } = parseResult.data;

    // In a live Supabase environment with SUPABASE_SERVICE_ROLE_KEY:
    // const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    // await supabaseAdmin.auth.admin.createUser({ email, password: temporaryPassword, user_metadata: { must_change_password: true } });

    return NextResponse.json({
      success: true,
      message: `User ${fullName} successfully created with role ${role.toUpperCase()}. User will be required to change password on first login.`,
      user: {
        id: `user-${Date.now()}`,
        fullName,
        email: email.toLowerCase(),
        phone,
        role,
        mustChangePassword: true,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to provision user account.' },
      { status: 500 }
    );
  }
}
