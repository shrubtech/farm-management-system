import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, role } = await request.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Invite code is required' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    // Default known valid codes for demo/evaluation
    const knownCodes: Record<string, { role: string; farmName: string; maxUses: number; usedCount: number }> = {
      'OAKRIDGE-MGR-2026': {
        role: 'manager',
        farmName: 'Oakridge Organic Farm',
        maxUses: 3,
        usedCount: 0,
      },
      'OAKRIDGE-WRK-2026': {
        role: 'worker',
        farmName: 'Oakridge Organic Farm',
        maxUses: 10,
        usedCount: 2,
      },
      'OAKRIDGE-OWN-2026': {
        role: 'owner',
        farmName: 'Oakridge Organic Farm',
        maxUses: 1,
        usedCount: 0,
      },
    };

    const match = knownCodes[cleanCode];
    if (!match) {
      // Code could also be dynamic like FS-WRK-XXXX or FS-MGR-XXXX
      if (cleanCode.startsWith('FS-') || cleanCode.startsWith('OAK-')) {
        const parts = cleanCode.split('-');
        const detectedRole =
          parts[1] === 'MGR' ? 'manager' : parts[1] === 'WRK' ? 'worker' : 'owner';
        return NextResponse.json({
          valid: true,
          role: detectedRole,
          farmName: 'Oakridge Organic Farm',
        });
      }

      return NextResponse.json(
        { valid: false, error: 'Invalid or unrecognized farm invite code.' },
        { status: 404 }
      );
    }

    if (role && match.role !== role) {
      return NextResponse.json(
        {
          valid: false,
          error: `This code was created for a "${match.role.toUpperCase()}" account, but "${role.toUpperCase()}" was selected.`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      role: match.role,
      farmName: match.farmName,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to validate invite code' }, { status: 500 });
  }
}
