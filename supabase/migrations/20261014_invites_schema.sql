-- FarmSync Invite System & Role Enforcement Migration
-- Migration: 20261014_invites_schema.sql

-- 1. ADD must_change_password TO PROFILES
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT false;

-- 2. CREATE INVITES TABLE
CREATE TABLE IF NOT EXISTS invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    role user_role NOT NULL,
    email TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    used_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    used_at TIMESTAMPTZ,
    max_uses INT NOT NULL DEFAULT 1,
    used_count INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'revoked'))
);

-- 3. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_invites_code ON invites(code);
CREATE INDEX IF NOT EXISTS idx_invites_farm_id ON invites(farm_id);
CREATE INDEX IF NOT EXISTS idx_invites_status ON invites(status);
CREATE INDEX IF NOT EXISTS idx_invites_expires_at ON invites(expires_at);

-- 4. ROW LEVEL SECURITY (RLS) FOR INVITES
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- Allow anyone (even unauthenticated during registration) to validate an active invite code
CREATE POLICY "Public can validate active invites by code" ON invites FOR SELECT
USING (
    status = 'active' 
    AND expires_at > NOW() 
    AND used_count < max_uses
);

-- Farm owners and managers can view all invites for their farm
CREATE POLICY "Farm owners and managers view farm invites" ON invites FOR SELECT
USING (
    farm_id IN (
        SELECT farm_id FROM farm_members 
        WHERE user_id = auth.uid() 
        AND role IN ('owner', 'manager')
    )
);

-- Farm owners can create invites for any role; Managers can only create Worker invites
CREATE POLICY "Authorized members create invites" ON invites FOR INSERT
WITH CHECK (
    farm_id IN (
        SELECT farm_id FROM farm_members 
        WHERE user_id = auth.uid() 
        AND (
            role = 'owner' 
            OR (role = 'manager' AND invites.role = 'worker')
        )
    )
);

-- Farm owners can update/revoke any invite; Managers can update worker invites
CREATE POLICY "Authorized members update invites" ON invites FOR UPDATE
USING (
    farm_id IN (
        SELECT farm_id FROM farm_members 
        WHERE user_id = auth.uid() 
        AND (
            role = 'owner' 
            OR (role = 'manager' AND invites.role = 'worker')
        )
    )
);

-- 5. FUNCTION TO SAFELY CONSUME AN INVITE
CREATE OR REPLACE FUNCTION consume_farm_invite(
    p_code TEXT,
    p_user_id UUID
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    farm_id UUID,
    assigned_role user_role
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_invite invites%ROWTYPE;
BEGIN
    SELECT * INTO v_invite
    FROM invites
    WHERE code = UPPER(TRIM(p_code))
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 'Invalid invite code. Please check and try again.'::TEXT, NULL::UUID, NULL::user_role;
        RETURN;
    END IF;

    IF v_invite.status != 'active' THEN
        RETURN QUERY SELECT false, ('Invite code is ' || v_invite.status || '.')::TEXT, NULL::UUID, NULL::user_role;
        RETURN;
    END IF;

    IF v_invite.expires_at <= NOW() THEN
        UPDATE invites SET status = 'expired' WHERE id = v_invite.id;
        RETURN QUERY SELECT false, 'Invite code has expired. Please request a new invite from your farm administrator.'::TEXT, NULL::UUID, NULL::user_role;
        RETURN;
    END IF;

    IF v_invite.used_count >= v_invite.max_uses THEN
        UPDATE invites SET status = 'used' WHERE id = v_invite.id;
        RETURN QUERY SELECT false, 'Invite code has already been completely used.'::TEXT, NULL::UUID, NULL::user_role;
        RETURN;
    END IF;

    -- Add membership to farm_members
    INSERT INTO farm_members (farm_id, user_id, role)
    VALUES (v_invite.farm_id, p_user_id, v_invite.role)
    ON CONFLICT (farm_id, user_id) 
    DO UPDATE SET role = v_invite.role;

    -- Update invite usage
    UPDATE invites
    SET 
        used_count = used_count + 1,
        used_by = p_user_id,
        used_at = NOW(),
        status = CASE WHEN used_count + 1 >= max_uses THEN 'used' ELSE 'active' END
    WHERE id = v_invite.id;

    RETURN QUERY SELECT true, 'Successfully joined farm!'::TEXT, v_invite.farm_id, v_invite.role;
END;
$$;
