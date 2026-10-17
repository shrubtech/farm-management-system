'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Calendar,
  X,
  Check,
  Ticket,
  Copy,
  Ban,
  ShieldAlert,
  KeyRound,
  Sparkles,
  ExternalLink,
  Crown,
  Briefcase,
  Tractor,
} from 'lucide-react';
import { useFarmStore } from '@/hooks/useFarmStore';
import { useAuth } from '@/components/auth-provider';
import { Worker, UserRole, Invite } from '@/types';
import { passwordRegex, calculatePasswordStrength } from '@/lib/validators';

export default function WorkersPage() {
  const {
    workers,
    markAttendance,
    attendance,
    tasks,
    invites,
    createInvite,
    revokeInvite,
    addUserDirectly,
  } = useFarmStore();
  const { user } = useAuth();

  const isOwner = user?.role === 'owner';
  const isManager = user?.role === 'manager';
  const canInvite = isOwner || isManager;

  // Active view tab: 'roster' | 'invites' | 'attendance'
  const [activeTab, setActiveTab] = useState<'roster' | 'invites' | 'attendance'>('roster');
  const [search, setSearch] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Modals
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isDirectAddModalOpen, setIsDirectAddModalOpen] = useState(false);

  // Invite modal form state
  const [inviteRole, setInviteRole] = useState<UserRole>(isManager ? 'worker' : 'worker');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteExpiry, setInviteExpiry] = useState<'24h' | '7d' | '30d'>('7d');
  const [inviteMaxUses, setInviteMaxUses] = useState(1);
  const [newlyCreatedInvite, setNewlyCreatedInvite] = useState<Invite | null>(null);

  // Direct Add User form state (Owner only)
  const [directName, setDirectName] = useState('');
  const [directEmail, setDirectEmail] = useState('');
  const [directPhone, setDirectPhone] = useState('');
  const [directRole, setDirectRole] = useState<UserRole>('worker');
  const [directPassword, setDirectPassword] = useState('FarmSync2026!');
  const [directError, setDirectError] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const copyToClipboard = (text: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`Copied ${label} to clipboard!`);
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let result = 'FS-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setDirectPassword(result);
  };

  const handleGenerateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Security: Managers can only invite Workers
      const effectiveRole: UserRole = isManager ? 'worker' : inviteRole;

      const inv = createInvite({
        role: effectiveRole,
        email: inviteEmail || undefined,
        expiryDuration: inviteExpiry,
        maxUses: Number(inviteMaxUses) || 1,
      });

      setNewlyCreatedInvite(inv);
      showToast(`Generated invitation code: ${inv.code}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to generate invitation.');
    }
  };

  const handleDirectAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setDirectError('');

    if (!directName.trim() || !directEmail.trim()) {
      setDirectError('Name and email are required.');
      return;
    }

    if (directPassword.length < 8 || !passwordRegex.test(directPassword)) {
      setDirectError('Temporary password must be at least 8 characters with letters & numbers.');
      return;
    }

    try {
      const res = addUserDirectly({
        fullName: directName,
        email: directEmail,
        phone: directPhone,
        role: directRole,
        temporaryPassword: directPassword,
      });

      if (!res.success) {
        setDirectError(res.message);
        return;
      }

      showToast(`Directly created user ${directName}. Must change password on first login.`);
      setIsDirectAddModalOpen(false);
      setDirectName('');
      setDirectEmail('');
      setDirectPhone('');
      setDirectPassword('FarmSync2026!');
    } catch (err: any) {
      setDirectError(err.message || 'Error provisioning account.');
    }
  };

  const handleRevokeInvite = (inviteId: string, code: string) => {
    if (confirm(`Are you sure you want to revoke invite code "${code}"? It will immediately stop working.`)) {
      revokeInvite(inviteId);
      showToast(`Revoked invite code ${code}`);
    }
  };

  const filteredWorkers = workers.filter((w) => {
    return (
      w.fullName.toLowerCase().includes(search.toLowerCase()) ||
      w.email.toLowerCase().includes(search.toLowerCase()) ||
      w.role.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getAttendanceBadge = (status?: string) => {
    switch (status) {
      case 'present':
        return (
          <span className="rounded-full bg-[#E7F6ED] px-2.5 py-0.5 text-[10px] font-bold text-[#1D7A40] dark:bg-[#1E3B27] dark:text-[#4ADE80]">
            Present Today
          </span>
        );
      case 'late':
        return (
          <span className="rounded-full bg-[#FEF7E6] px-2.5 py-0.5 text-[10px] font-bold text-[#D97706]">
            Late
          </span>
        );
      case 'absent':
        return (
          <span className="rounded-full bg-[#FEF0EC] px-2.5 py-0.5 text-[10px] font-bold text-[#DE5B50]">
            Absent
          </span>
        );
      case 'on_leave':
        return (
          <span className="rounded-full bg-[#F3EFE7] px-2.5 py-0.5 text-[10px] font-bold text-[#556358]">
            On Leave
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-[#F3EFE7] px-2.5 py-0.5 text-[10px] font-bold text-[#556358]">
            Not Checked In
          </span>
        );
    }
  };

  const getInviteStatusBadge = (status: Invite['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="rounded-full bg-[#E7F6ED] px-2.5 py-0.5 text-[10px] font-bold text-[#1D7A40] dark:bg-[#1E3B27] dark:text-[#4ADE80]">
            Active
          </span>
        );
      case 'used':
        return (
          <span className="rounded-full bg-[#F3EFE7] px-2.5 py-0.5 text-[10px] font-bold text-[#556358]">
            Used
          </span>
        );
      case 'expired':
        return (
          <span className="rounded-full bg-[#FEF7E6] px-2.5 py-0.5 text-[10px] font-bold text-[#D97706]">
            Expired
          </span>
        );
      case 'revoked':
        return (
          <span className="rounded-full bg-[#FEF0EC] px-2.5 py-0.5 text-[10px] font-bold text-[#DE5B50]">
            Revoked
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#173426] px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-in fade-in border border-[#22C55E]/30">
          <Check className="h-4 w-4 text-[#22C55E]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header with Title and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#18251C] dark:text-white flex items-center gap-2">
            Workers & Operations Staff
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#67756B] dark:text-[#97A79A]">
            Manage staff members, issue verified farm invitations, and log daily field attendance.
          </p>
        </div>

        {canInvite && (
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Generate Invite Code Button */}
            <button
              onClick={() => {
                setNewlyCreatedInvite(null);
                setIsInviteModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-full border border-[#173426] bg-[#173426]/5 px-4 py-2 text-xs font-bold text-[#173426] hover:bg-[#173426]/10 dark:border-[#22C55E] dark:bg-[#22C55E]/10 dark:text-[#4ADE80]"
            >
              <Ticket className="h-4 w-4 stroke-[2.2]" />
              <span>Invite Staff</span>
            </button>

            {/* Direct Add User (Owner Only) */}
            {isOwner && (
              <button
                onClick={() => {
                  setDirectError('');
                  setIsDirectAddModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-full bg-[#173426] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>Add User Directly</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#ECE6DB] dark:border-[#233528]">
        <button
          onClick={() => setActiveTab('roster')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'roster'
              ? 'border-[#173426] text-[#173426] dark:border-[#22C55E] dark:text-[#22C55E]'
              : 'border-transparent text-[#79857B] hover:text-[#18251C] dark:hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Staff Roster ({workers.length})</span>
        </button>

        {canInvite && (
          <button
            onClick={() => setActiveTab('invites')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'invites'
                ? 'border-[#173426] text-[#173426] dark:border-[#22C55E] dark:text-[#22C55E]'
                : 'border-transparent text-[#79857B] hover:text-[#18251C] dark:hover:text-white'
            }`}
          >
            <Ticket className="h-4 w-4" />
            <span>Farm Invites ({invites.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'attendance'
              ? 'border-[#173426] text-[#173426] dark:border-[#22C55E] dark:text-[#22C55E]'
              : 'border-transparent text-[#79857B] hover:text-[#18251C] dark:hover:text-white'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Attendance History</span>
        </button>
      </div>

      {/* TAB 1: STAFF ROSTER */}
      {activeTab === 'roster' && (
        <div className="space-y-6">
          {/* Search Toolbar */}
          <div className="flex rounded-2xl border border-[#ECE6DB] bg-white p-3 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#79857B]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search staff name, email, or role..."
                className="w-full rounded-xl border border-[#ECE6DB] bg-[#FAF8F5] py-2 pl-9 pr-3 text-xs text-[#18251C] focus:border-[#173426] focus:bg-white focus:outline-none dark:border-[#263A2B] dark:bg-[#121D15] dark:text-white"
              />
            </div>
          </div>

          {/* Staff Roster Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => {
              const assignedCount = tasks.filter(
                (t) =>
                  t.assignedToName.toLowerCase().includes(worker.fullName.toLowerCase()) &&
                  t.status !== 'completed'
              ).length;

              return (
                <div
                  key={worker.id}
                  className="rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-sm dark:border-[#233528] dark:bg-[#152219]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#18251C] dark:text-white">
                        {worker.fullName}
                      </h3>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#2E7D47] dark:text-[#4ADE80]">
                        {worker.role}
                      </p>
                    </div>
                    {getAttendanceBadge(worker.attendanceStatus)}
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-[#556358] dark:text-[#9FB1A2]">
                    <p className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-[#79857B]" />
                      <span>{worker.phone || 'On file'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-[#79857B]" />
                      <span>{worker.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-[#79857B]" />
                      <span>{assignedCount} active assigned tasks</span>
                    </p>
                  </div>

                  {/* Attendance Quick Buttons */}
                  {user?.role !== 'worker' && (
                    <div className="mt-4 flex items-center gap-1.5 border-t border-[#F2ECE0] pt-3 dark:border-[#1F3024]">
                      <span className="text-[10px] font-semibold text-[#79857B]">Mark Today:</span>
                      <button
                        onClick={() => {
                          markAttendance(worker.id, 'present');
                          showToast(`Marked ${worker.fullName} as Present`);
                        }}
                        title="Mark Present"
                        className="rounded-lg bg-[#E7F6ED] px-2 py-1 text-[10px] font-bold text-[#1D7A40] hover:bg-[#D4EFE0] dark:bg-[#1E3B27] dark:text-[#4ADE80]"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => {
                          markAttendance(worker.id, 'late');
                          showToast(`Marked ${worker.fullName} as Late`);
                        }}
                        title="Mark Late"
                        className="rounded-lg bg-[#FEF7E6] px-2 py-1 text-[10px] font-bold text-[#D97706] hover:bg-[#FDE9C2]"
                      >
                        Late
                      </button>
                      <button
                        onClick={() => {
                          markAttendance(worker.id, 'absent');
                          showToast(`Marked ${worker.fullName} as Absent`);
                        }}
                        title="Mark Absent"
                        className="rounded-lg bg-[#FEF0EC] px-2 py-1 text-[10px] font-bold text-[#DE5B50] hover:bg-[#FCD2C9]"
                      >
                        Absent
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: FARM INVITATIONS */}
      {activeTab === 'invites' && canInvite && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-[#ECE6DB] bg-white p-4 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
            <div>
              <h3 className="text-sm font-bold text-[#18251C] dark:text-white">
                Active & Past Farm Invitations
              </h3>
              <p className="text-xs text-[#6A786E] dark:text-[#8E9F92]">
                {isOwner
                  ? 'Owners can generate codes for Owners, Managers, and Workers.'
                  : 'Managers are authorized to issue Worker invitations only.'}
              </p>
            </div>
            <button
              onClick={() => {
                setNewlyCreatedInvite(null);
                setIsInviteModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-[#173426] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
            >
              <Ticket className="h-4 w-4" />
              <span>Create New Invite</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[#ECE6DB] bg-white shadow-sm dark:border-[#233528] dark:bg-[#152219]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#ECE6DB] bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#6A786E] dark:border-[#233528] dark:bg-[#121D15] dark:text-[#8E9F92]">
                <tr>
                  <th className="px-5 py-3.5">Invite Code</th>
                  <th className="px-5 py-3.5">Target Role</th>
                  <th className="px-5 py-3.5">Created By</th>
                  <th className="px-5 py-3.5">Expires</th>
                  <th className="px-5 py-3.5">Uses</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE6DB] dark:divide-[#233528]">
                {invites.map((inv) => {
                  const isExpired = new Date(inv.expiresAt).getTime() <= Date.now();
                  const effectiveStatus =
                    inv.status === 'active' && isExpired ? 'expired' : inv.status;

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-[#FAF8F5]/80 dark:hover:bg-[#121D15]/50 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-mono font-bold tracking-wider text-[#173426] dark:text-[#4ADE80]">
                        <div className="flex items-center gap-2">
                          <span>{inv.code}</span>
                          <button
                            onClick={() => copyToClipboard(inv.code, 'Invite code')}
                            title="Copy code"
                            className="rounded p-1 text-[#79857B] hover:bg-[#EFE9DD] hover:text-[#18251C] dark:hover:bg-[#1F3024] dark:hover:text-white"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#FAF8F5] px-2.5 py-1 font-semibold uppercase tracking-wider text-[10px] text-[#2E7D47] border border-[#E0D9CD] dark:border-[#2C3F2E] dark:bg-[#18261C] dark:text-[#4ADE80]">
                          {inv.role === 'owner' ? (
                            <Crown className="h-3 w-3" />
                          ) : inv.role === 'manager' ? (
                            <Briefcase className="h-3 w-3" />
                          ) : (
                            <Tractor className="h-3 w-3" />
                          )}
                          <span>{inv.role}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#556358] dark:text-[#9FB1A2]">
                        {inv.createdByName || inv.createdBy}
                        {inv.email && (
                          <span className="block text-[10px] text-[#79857B]">
                            For: {inv.email}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-[#556358] dark:text-[#9FB1A2]">
                        {new Date(inv.expiresAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-3.5 font-semibold">
                        {inv.usedCount} / {inv.maxUses}
                      </td>
                      <td className="px-5 py-3.5">{getInviteStatusBadge(effectiveStatus)}</td>
                      <td className="px-5 py-3.5 text-right">
                        {effectiveStatus === 'active' && (
                          <button
                            onClick={() => handleRevokeInvite(inv.id, inv.code)}
                            className="rounded-lg border border-[#F87171]/40 px-2.5 py-1 text-[11px] font-semibold text-[#DC2626] hover:bg-[#FEF2F2] dark:hover:bg-[#2B1717]"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ATTENDANCE HISTORY LOG */}
      {activeTab === 'attendance' && (
        <div className="rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-sm dark:border-[#233528] dark:bg-[#152219] animate-in fade-in">
          <h3 className="text-sm font-bold text-[#18251C] dark:text-white flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-[#2E7D47]" />
            <span>Daily Attendance Record Log</span>
          </h3>

          <div className="space-y-2">
            {attendance.map((rec) => (
              <div
                key={rec.id}
                className="flex items-center justify-between rounded-xl border border-[#ECE6DB] p-3 text-xs dark:border-[#233528]"
              >
                <div>
                  <p className="font-bold text-[#18251C] dark:text-white">{rec.workerName}</p>
                  <p className="text-[11px] text-[#79857B]">
                    Date: {rec.date} {rec.checkIn ? `• Check-in: ${rec.checkIn}` : ''}{' '}
                    {rec.notes ? `• ${rec.notes}` : ''}
                  </p>
                </div>
                <div>{getAttendanceBadge(rec.status)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: GENERATE INVITE CODE */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
            <div className="flex items-center justify-between border-b border-[#ECE6DB] px-6 py-4 dark:border-[#233528]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#173426]/10 text-[#173426] dark:bg-[#22C55E]/10 dark:text-[#4ADE80]">
                  <Ticket className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#18251C] dark:text-white">
                    Generate Farm Invite Code
                  </h3>
                  <p className="text-[11px] text-[#6A786E] dark:text-[#8E9F92]">
                    Invite new colleagues or field workers securely to your farm.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-[#79857B] hover:text-[#18251C] dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {newlyCreatedInvite ? (
              /* Success View showing generated code */
              <div className="p-6 space-y-4 text-center animate-in zoom-in-95">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F6ED] text-[#1D7A40] dark:bg-[#1E3B27] dark:text-[#4ADE80]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-[#18251C] dark:text-white">
                  Invite Code Generated!
                </h4>
                <p className="text-xs text-[#6A786E] dark:text-[#8E9F92]">
                  Share this code with the recipient. They will enter it on the registration page to join your farm.
                </p>

                <div className="rounded-2xl border border-[#D5CEC0] bg-[#FAF8F5] p-4 dark:border-[#2C3F2E] dark:bg-[#121D15]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#79857B]">
                    Invitation Code ({newlyCreatedInvite.role.toUpperCase()})
                  </span>
                  <div className="mt-1 font-mono text-2xl font-black tracking-widest text-[#173426] dark:text-[#4ADE80]">
                    {newlyCreatedInvite.code}
                  </div>
                  <p className="mt-1 text-[11px] text-[#79857B]">
                    Expires:{' '}
                    {new Date(newlyCreatedInvite.expiresAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    • Max Uses: {newlyCreatedInvite.maxUses}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() =>
                      copyToClipboard(newlyCreatedInvite.code, 'Invite Code')
                    }
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#173426] bg-white py-2.5 text-xs font-bold text-[#173426] hover:bg-[#FAF8F5] dark:border-[#22C55E] dark:bg-[#162319] dark:text-[#4ADE80]"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy Code</span>
                  </button>

                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/register?code=${newlyCreatedInvite.code}`;
                      copyToClipboard(url, 'Registration Link');
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#173426] py-2.5 text-xs font-bold text-white hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Copy Link</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="mt-3 text-xs font-semibold text-[#79857B] hover:underline"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Generation Form */
              <form onSubmit={handleGenerateInvite} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Assigned Role *
                  </label>
                  {isManager ? (
                    <div className="mt-1 rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] p-2.5 text-xs text-[#526054] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-[#A7B8AA]">
                      <span className="font-bold text-[#18251C] dark:text-white">Worker</span> (Managers may invite Workers only)
                    </div>
                  ) : (
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as UserRole)}
                      className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] px-3 py-2 text-xs text-[#18251C] focus:border-[#173426] focus:bg-white focus:outline-none dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                    >
                      <option value="worker">Worker (Field Operations & Assigned Tasks)</option>
                      <option value="manager">Manager (Crops, Livestock, Inventory & Tasks)</option>
                      <option value="owner">Owner (Full Co-Ownership of this Farm)</option>
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                      Expiration Duration *
                    </label>
                    <select
                      value={inviteExpiry}
                      onChange={(e) => setInviteExpiry(e.target.value as any)}
                      className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] px-3 py-2 text-xs text-[#18251C] focus:border-[#173426] focus:bg-white focus:outline-none dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                    >
                      <option value="24h">24 Hours</option>
                      <option value="7d">7 Days</option>
                      <option value="30d">30 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                      Maximum Uses
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={inviteMaxUses}
                      onChange={(e) => setInviteMaxUses(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] px-3 py-2 text-xs text-[#18251C] focus:border-[#173426] focus:bg-white focus:outline-none dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Recipient Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="e.g. colleague@example.com"
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#18251C] focus:border-[#173426] focus:bg-white focus:outline-none dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#173426] py-3 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
                >
                  Create Invitation Code
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: DIRECT USER PROVISIONING (Owner Only) */}
      {isDirectAddModalOpen && isOwner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
            <div className="flex items-center justify-between border-b border-[#ECE6DB] px-6 py-4 dark:border-[#233528]">
              <div>
                <h3 className="text-sm font-bold text-[#18251C] dark:text-white flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-[#D97706]" />
                  <span>Direct User Provisioning (Owner Only)</span>
                </h3>
                <p className="text-[11px] text-[#6A786E] dark:text-[#8E9F92]">
                  Create an account directly with a temporary password.
                </p>
              </div>
              <button
                onClick={() => setIsDirectAddModalOpen(false)}
                className="text-[#79857B] hover:text-[#18251C] dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {directError && (
              <div className="mx-6 mt-4 rounded-xl bg-[#FEF2F2] p-2.5 text-xs font-semibold text-[#DC2626] dark:bg-[#2B1717] dark:text-[#F87171]">
                {directError}
              </div>
            )}

            <form onSubmit={handleDirectAddUser} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Vance"
                  value={directName}
                  onChange={(e) => setDirectName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="liam@farmsync.io"
                    value={directEmail}
                    onChange={(e) => setDirectEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 012-9900"
                    value={directPhone}
                    onChange={(e) => setDirectPhone(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Role Assignment *
                </label>
                <select
                  value={directRole}
                  onChange={(e) => setDirectRole(e.target.value as UserRole)}
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                >
                  <option value="worker">Worker (Field Operations & Assigned Tasks)</option>
                  <option value="manager">Manager (Crops, Livestock, Inventory & Tasks)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Temporary Password *
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#2E7D47] hover:underline dark:text-[#4ADE80]"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Auto-generate</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={directPassword}
                  onChange={(e) => setDirectPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] px-3.5 py-2 font-mono text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                />
                <p className="mt-1 text-[10px] text-[#79857B]">
                  🔒 Note: The user will be automatically prompted to set their own permanent password on their first login.
                </p>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#173426] py-3 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
              >
                Create Account & Set Temporary Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
