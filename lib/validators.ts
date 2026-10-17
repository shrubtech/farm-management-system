import { z } from 'zod';

// Strong Password regex: minimum 8 characters, at least one letter and one number
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&_\-\.]{8,}$/;

export const passwordValidationMessage =
  'Password must be at least 8 characters and contain both letters and numbers.';

export function calculatePasswordStrength(password: string): {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
} {
  if (!password) return { score: 0, label: 'Very Weak', color: '#9CA3AF' };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 10) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // Normalize score between 0 and 4
  const normalized = Math.min(4, Math.max(1, score - 1));

  switch (normalized) {
    case 1:
      return { score: 1, label: 'Weak', color: '#EF4444' };
    case 2:
      return { score: 2, label: 'Fair', color: '#F59E0B' };
    case 3:
      return { score: 3, label: 'Good', color: '#3B82F6' };
    case 4:
      return { score: 4, label: 'Strong', color: '#10B981' };
    default:
      return { score: 0, label: 'Very Weak', color: '#EF4444' };
  }
}

// 1. LOGIN SCHEMA
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

// 2. REGISTRATION SCHEMAS
export const registerOwnerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(passwordRegex, passwordValidationMessage),
    confirmPassword: z.string(),
    role: z.literal('owner'),
    farmName: z.string().min(2, 'Farm name is required (minimum 2 characters)'),
    farmLocation: z.string().optional(),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the Terms of Service to continue.' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterOwnerInput = z.infer<typeof registerOwnerSchema>;

export const registerMemberSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(passwordRegex, passwordValidationMessage),
    confirmPassword: z.string(),
    role: z.enum(['manager', 'worker']),
    inviteCode: z.string().min(4, 'Farm invite code is required to join an existing farm'),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the Terms of Service to continue.' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterMemberInput = z.infer<typeof registerMemberSchema>;

// Unified Registration Schema
export const registrationSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(passwordRegex, passwordValidationMessage),
    confirmPassword: z.string(),
    role: z.enum(['owner', 'manager', 'worker']),
    farmName: z.string().optional(),
    farmLocation: z.string().optional(),
    inviteCode: z.string().optional(),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the Terms of Service to continue.' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      if (data.role === 'owner') {
        return !!data.farmName && data.farmName.trim().length >= 2;
      }
      return true;
    },
    {
      message: 'Farm name is required when registering as an Owner',
      path: ['farmName'],
    }
  )
  .refine(
    (data) => {
      if (data.role === 'manager' || data.role === 'worker') {
        return !!data.inviteCode && data.inviteCode.trim().length >= 4;
      }
      return true;
    },
    {
      message: 'A valid Farm Invite Code is required to join as Manager or Worker',
      path: ['inviteCode'],
    }
  );

export type RegistrationInput = z.infer<typeof registrationSchema>;

// 3. INVITE CREATION SCHEMA
export const createInviteSchema = z.object({
  role: z.enum(['owner', 'manager', 'worker']),
  email: z.string().email().optional().or(z.literal('')),
  expiryDuration: z.enum(['24h', '7d', '30d']),
  maxUses: z.number().int().min(1).max(100).default(1),
});

export type CreateInviteInput = z.infer<typeof createInviteSchema>;

// 4. DIRECT USER CREATION SCHEMA (Owner creates user)
export const createDirectUserSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  role: z.enum(['manager', 'worker']),
  temporaryPassword: z
    .string()
    .min(8, 'Temporary password must be at least 8 characters')
    .regex(passwordRegex, passwordValidationMessage),
});

export type CreateDirectUserInput = z.infer<typeof createDirectUserSchema>;
