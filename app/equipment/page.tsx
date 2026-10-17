'use client';

import React, { useState, useMemo } from 'react';
import {
  Tractor,
  Plus,
  Search,
  Filter,
  Wrench,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  X,
  Check,
  Trash2,
  Clock,
  History,
} from 'lucide-react';
import { useFarmStore } from '@/hooks/useFarmStore';
import { useAuth } from '@/components/auth-provider';
import { Equipment, EquipmentStatus } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function EquipmentPage() {
  const {
    equipment,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    maintenanceLogs,
    addMaintenanceLog,
    workers,
  } = useFarmStore();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedEq, setSelectedEq] = useState<Equipment | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  // Form state for new equipment
  const [newEq, setNewEq] = useState({
    name: '',
    model: '',
    serialNumber: '',
    status: 'active' as EquipmentStatus,
    purchaseDate: new Date().toISOString().split('T')[0],
    purchaseCost: 65000,
    lastServiceDate: new Date().toISOString().split('T')[0],
    nextServiceDue: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    assignedOperator: workers[0]?.fullName || 'Marcus Johnson',
    notes: '',
  });

  // Service log form state
  const [serviceForm, setServiceForm] = useState({
    serviceType: 'Routine Oil & Hydraulic Fluid Change',
    cost: 450,
    servicedBy: 'Central Coast Diesel Techs',
    description: 'Fluids replaced, filters renewed, telemetry sensors checked.',
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const filteredEquipment = useMemo(() => {
    return equipment.filter((eq) => {
      const matchesSearch =
        eq.name.toLowerCase().includes(search.toLowerCase()) ||
        eq.model.toLowerCase().includes(search.toLowerCase()) ||
        eq.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
        eq.assignedOperator.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || eq.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [equipment, search, statusFilter]);

  const handleCreateEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEq.name) return;
    addEquipment(newEq);
    setIsAddModalOpen(false);
    showToast(`Added ${newEq.name} to equipment fleet!`);
    setNewEq({
      name: '',
      model: '',
      serialNumber: '',
      status: 'active',
      purchaseDate: new Date().toISOString().split('T')[0],
      purchaseCost: 65000,
      lastServiceDate: new Date().toISOString().split('T')[0],
      nextServiceDue: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      assignedOperator: workers[0]?.fullName || 'Marcus Johnson',
      notes: '',
    });
  };

  const handleLogService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEq) return;
    addMaintenanceLog({
      equipmentId: selectedEq.id,
      equipmentName: selectedEq.name,
      serviceType: serviceForm.serviceType,
      cost: Number(serviceForm.cost),
      servicedBy: serviceForm.servicedBy,
      date: new Date().toISOString().split('T')[0],
      description: serviceForm.description,
    });
    // Set status to active and push next service due
    updateEquipment(selectedEq.id, {
      status: 'active',
      lastServiceDate: new Date().toISOString().split('T')[0],
      nextServiceDue: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    });
    setIsServiceModalOpen(false);
    showToast(`Service logged for ${selectedEq.name}! Status updated to Active.`);
  };

  const getStatusBadge = (status: EquipmentStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="rounded-full bg-[#E7F6ED] px-2.5 py-0.5 text-[10px] font-bold text-[#1D7A40] dark:bg-[#1E3B27] dark:text-[#4ADE80]">
            Active
          </span>
        );
      case 'under_maintenance':
        return (
          <span className="rounded-full bg-[#FEF0EC] px-2.5 py-0.5 text-[10px] font-bold text-[#DE5B50] dark:bg-[#3D1E18] dark:text-[#F87171]">
            Maintenance Due
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-[#F3EFE7] px-2.5 py-0.5 text-[10px] font-bold text-[#556358]">
            Retired
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#173426] px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-in fade-in">
          <Check className="h-4 w-4 text-[#22C55E]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#18251C] dark:text-white flex items-center gap-2">
            Equipment & Machinery Fleet
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#67756B] dark:text-[#97A79A]">
            Tractors, center pivots, implements, operator duty assignments, and maintenance countdowns.
          </p>
        </div>

        {user?.role !== 'worker' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[#173426] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Equipment</span>
          </button>
        )}
      </div>

      {/* Overdue Maintenance Banner if John Deere is overdue */}
      {equipment.some((e) => e.status === 'under_maintenance') && (
        <div className="flex items-center justify-between rounded-2xl bg-[#FEF0EC] p-3.5 border border-[#FCD8CF] dark:bg-[#341B17] dark:border-[#522923]">
          <div className="flex items-center gap-2.5">
            <Wrench className="h-5 w-5 text-[#DE5B50]" />
            <div>
              <p className="text-xs font-bold text-[#DE5B50] dark:text-[#F87171]">
                Machinery Service Overdue
              </p>
              <p className="text-[11px] text-[#7E3D35] dark:text-[#E2A69E]">
                John Deere 8R Tractor 250-hour routine fluid change is overdue by 2 days. Plot C deploy held.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const eq = equipment.find((e) => e.status === 'under_maintenance') || equipment[0];
              setSelectedEq(eq);
              setIsServiceModalOpen(true);
            }}
            className="rounded-xl bg-[#DE5B50] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#C94D43]"
          >
            Log Service Now
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#ECE6DB] bg-white p-3 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#79857B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search machinery, model, serial number, or operator..."
            className="w-full rounded-xl border border-[#ECE6DB] bg-[#FAF8F5] py-2 pl-9 pr-3 text-xs text-[#18251C] focus:border-[#173426] focus:bg-white focus:outline-none dark:border-[#263A2B] dark:bg-[#121D15] dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#79857B]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[#ECE6DB] bg-[#FAF8F5] px-3 py-2 text-xs font-semibold text-[#18251C] dark:border-[#263A2B] dark:bg-[#121D15] dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="under_maintenance">Under Maintenance</option>
            <option value="retired">Retired</option>
          </select>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-sm dark:border-[#233528] dark:bg-[#152219]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#ECE6DB] bg-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider text-[#79857B] dark:border-[#233528] dark:bg-[#111C14] dark:text-[#8E9F92]">
              <tr>
                <th className="px-5 py-3.5">Equipment & Model</th>
                <th className="px-4 py-3.5">Serial Number</th>
                <th className="px-4 py-3.5">Purchase Cost</th>
                <th className="px-4 py-3.5">Assigned Operator</th>
                <th className="px-4 py-3.5">Last Service</th>
                <th className="px-4 py-3.5">Next Service Due</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE0] dark:divide-[#1F3024]">
              {filteredEquipment.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#79857B]">
                    No machinery found.
                  </td>
                </tr>
              ) : (
                filteredEquipment.map((eq) => (
                  <tr
                    key={eq.id}
                    className="transition-colors hover:bg-[#FBF9F4] dark:hover:bg-[#1C2C20]"
                  >
                    <td className="px-5 py-3.5 font-bold text-[#18251C] dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF5EE] text-[#173426] dark:bg-[#1F3627] dark:text-[#4ADE80]">
                          <Tractor className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-[#18251C] dark:text-white">{eq.name}</p>
                          <p className="text-[10px] font-normal text-[#79857B]">{eq.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[#556358] dark:text-[#9FB1A2]">
                      {eq.serialNumber}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-[#18251C] dark:text-white">
                      {formatCurrency(eq.purchaseCost)}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-[#18251C] dark:text-white">
                      {eq.assignedOperator}
                    </td>
                    <td className="px-4 py-3.5 text-[#556358] dark:text-[#9FB1A2]">
                      {formatDate(eq.lastServiceDate)}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-[#DE5B50] dark:text-[#F87171]">
                      {formatDate(eq.nextServiceDue)}
                    </td>
                    <td className="px-4 py-3.5">{getStatusBadge(eq.status)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedEq(eq);
                            setIsServiceModalOpen(true);
                          }}
                          className="rounded-lg border border-[#D5CEC0] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#18251C] hover:bg-[#F8F5EE] dark:border-[#2D4032] dark:bg-[#18251C] dark:text-white"
                        >
                          Log Service
                        </button>
                        {user?.role !== 'worker' && (
                          <button
                            onClick={() => {
                              deleteEquipment(eq.id);
                              showToast(`Deleted ${eq.name}`);
                            }}
                            className="p-1 text-[#79857B] hover:text-[#DE5B50]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fleet Maintenance History */}
      <div className="rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
        <h3 className="text-sm font-bold text-[#18251C] dark:text-white flex items-center gap-2 mb-3">
          <History className="h-4 w-4 text-[#2E7D47]" />
          <span>Completed Maintenance History</span>
        </h3>

        <div className="space-y-2">
          {maintenanceLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between rounded-xl border border-[#ECE6DB] p-3 text-xs dark:border-[#233528]"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#18251C] dark:text-white">
                    {log.equipmentName} : {log.serviceType}
                  </span>
                  <span className="text-[10px] text-[#79857B]">{log.date}</span>
                </div>
                <p className="text-[11px] text-[#556358] dark:text-[#A7B8AA] mt-0.5">
                  {log.description}
                </p>
              </div>
              <div className="text-right text-[11px] font-semibold text-[#18251C] dark:text-white">
                <span>{formatCurrency(log.cost)}</span>
                <span className="block text-[9px] font-normal text-[#79857B]">
                  by {log.servicedBy}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add Equipment */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
            <div className="flex items-center justify-between border-b border-[#ECE6DB] px-6 py-4 dark:border-[#233528]">
              <h3 className="text-base font-bold text-[#18251C] dark:text-white">
                Add Fleet Equipment
              </h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-[#79857B]" />
              </button>
            </div>

            <form onSubmit={handleCreateEquipment} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Equipment Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Case IH Combine Harvester"
                    value={newEq.name}
                    onChange={(e) => setNewEq({ ...newEq, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Model / Series
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Axial-Flow 250"
                    value={newEq.model}
                    onChange={(e) => setNewEq({ ...newEq, model: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CIH-992-881"
                    value={newEq.serialNumber}
                    onChange={(e) => setNewEq({ ...newEq, serialNumber: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Assigned Operator
                  </label>
                  <select
                    value={newEq.assignedOperator}
                    onChange={(e) => setNewEq({ ...newEq, assignedOperator: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  >
                    {workers.map((w) => (
                      <option key={w.id} value={w.fullName}>
                        {w.fullName} ({w.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Purchase Cost ($)
                  </label>
                  <input
                    type="number"
                    value={newEq.purchaseCost}
                    onChange={(e) =>
                      setNewEq({ ...newEq, purchaseCost: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Next Service Due Date
                  </label>
                  <input
                    type="date"
                    value={newEq.nextServiceDue}
                    onChange={(e) => setNewEq({ ...newEq, nextServiceDue: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#173426] py-2.5 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
              >
                Register Machinery
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Service */}
      {isServiceModalOpen && selectedEq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
            <div className="flex items-center justify-between border-b border-[#ECE6DB] px-6 py-4 dark:border-[#233528]">
              <h3 className="text-base font-bold text-[#18251C] dark:text-white">
                Log Maintenance: {selectedEq.name}
              </h3>
              <button onClick={() => setIsServiceModalOpen(false)}>
                <X className="h-5 w-5 text-[#79857B]" />
              </button>
            </div>

            <form onSubmit={handleLogService} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Service Performed
                </label>
                <input
                  type="text"
                  required
                  value={serviceForm.serviceType}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, serviceType: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Cost ($)
                  </label>
                  <input
                    type="number"
                    value={serviceForm.cost}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, cost: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Technician / Workshop
                  </label>
                  <input
                    type="text"
                    value={serviceForm.servicedBy}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, servicedBy: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Notes & Replaced Components
                </label>
                <textarea
                  rows={3}
                  value={serviceForm.description}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, description: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] p-3 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#173426] py-2.5 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
              >
                Complete & Clear Overdue Flag
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
