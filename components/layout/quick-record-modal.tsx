'use client';

import React, { useState } from 'react';
import {
  X,
  CheckSquare,
  Sprout,
  PawPrint,
  PackageOpen,
  DollarSign,
  Check,
} from 'lucide-react';
import { useFarmStore } from '@/hooks/useFarmStore';

interface QuickRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickRecordModal({ isOpen, onClose }: QuickRecordModalProps) {
  const {
    crops,
    livestock,
    inventory,
    addTask,
    addCropLog,
    addHealthRecord,
    recordStockMovement,
    addTransaction,
    workers,
  } = useFarmStore();

  const [activeTab, setActiveTab] = useState<'task' | 'crop' | 'animal' | 'stock' | 'finance'>(
    'task'
  );
  const [successMsg, setSuccessMsg] = useState('');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'normal'>('high');
  const [taskAssignee, setTaskAssignee] = useState(workers[0]?.fullName || 'Marcus Johnson');
  const [taskPlot, setTaskPlot] = useState('Plot B-2 (Sweet Corn)');

  // Crop log state
  const [selectedCrop, setSelectedCrop] = useState(crops[0]?.name || 'Corn');
  const [cropActivity, setCropActivity] = useState<'Irrigation' | 'Fertilizer' | 'Pesticide' | 'Harvest'>('Irrigation');
  const [cropDesc, setCropDesc] = useState('');

  // Animal record state
  const [selectedAnimal, setSelectedAnimal] = useState(livestock[0]?.tagId || 'COW-4021');
  const [treatment, setTreatment] = useState('');
  const [recordType, setRecordType] = useState<'Vaccination' | 'Treatment' | 'Checkup'>('Vaccination');

  // Stock movement state
  const [selectedItem, setSelectedItem] = useState(inventory[0]?.id || '');
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN');
  const [stockQty, setStockQty] = useState(10);
  const [stockReason, setStockReason] = useState('');

  // Finance state
  const [txType, setTxType] = useState<'sale' | 'expense'>('sale');
  const [txAmount, setTxAmount] = useState(500);
  const [txCategory, setTxCategory] = useState('Crop Sales');
  const [txDesc, setTxDesc] = useState('');

  if (!isOpen) return null;

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;
    addTask({
      title: taskTitle,
      description: `Logged via Quick Record for ${taskPlot}`,
      priority: taskPriority,
      status: 'todo',
      assignedToName: taskAssignee,
      assignedToId: 'user-worker',
      dueDate: new Date().toISOString(),
      relatedPlot: taskPlot,
      progressPercentage: 0,
      completed: false,
    });
    showSuccess('Task created successfully!');
  };

  const handleLogCrop = (e: React.FormEvent) => {
    e.preventDefault();
    const cropObj = crops.find((c) => c.name === selectedCrop) || crops[0];
    addCropLog({
      cropId: cropObj.id,
      cropName: cropObj.name,
      activityType: cropActivity,
      description: cropDesc || `${cropActivity} applied successfully`,
      quantity: 50,
      unit: 'Liters',
      appliedBy: 'Sarah Jenkins',
      date: new Date().toISOString().split('T')[0],
    });
    showSuccess('Crop activity logged!');
  };

  const handleLogAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    const animalObj = livestock.find((l) => l.tagId === selectedAnimal) || livestock[0];
    addHealthRecord({
      livestockId: animalObj.id,
      tagId: animalObj.tagId,
      recordType: recordType,
      treatment: treatment || 'Routine preventive screening',
      veterinarian: 'Dr. Gregory Hayes, DVM',
      date: new Date().toISOString().split('T')[0],
      notes: 'Logged via Quick Record',
    });
    showSuccess('Animal health record saved!');
  };

  const handleStockMove = (e: React.FormEvent) => {
    e.preventDefault();
    const itemId = selectedItem || inventory[0]?.id;
    recordStockMovement(
      itemId,
      movementType,
      Number(stockQty),
      stockReason || (movementType === 'IN' ? 'Warehouse Replenishment' : 'Field Usage')
    );
    showSuccess(`Inventory ${movementType === 'IN' ? 'received' : 'dispatched'}!`);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction({
      type: txType,
      category: txCategory,
      amount: Number(txAmount),
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Direct Transfer',
      referenceNumber: `REC-${Date.now().toString().slice(-4)}`,
      description: txDesc || `${txType.toUpperCase()} entry via Quick Record`,
    });
    showSuccess('Transaction recorded!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#ECE6DB] px-6 py-4 dark:border-[#233528]">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E7AC38] text-[#18251C] font-bold text-xs">
              +
            </span>
            <h3 className="text-base font-bold text-[#18251C] dark:text-white">Quick Record Action</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#79857B] hover:bg-[#F3EFE7] dark:hover:bg-[#1A261E]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#ECE6DB] bg-[#FAF8F3] px-4 dark:border-[#233528] dark:bg-[#111C14] overflow-x-auto">
          {[
            { id: 'task', label: 'Task', icon: CheckSquare },
            { id: 'crop', label: 'Crop Log', icon: Sprout },
            { id: 'animal', label: 'Animal Health', icon: PawPrint },
            { id: 'stock', label: 'Stock In/Out', icon: PackageOpen },
            { id: 'finance', label: 'Finance', icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 border-b-2 px-3.5 py-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-[#173426] text-[#173426] dark:border-[#22C55E] dark:text-[#22C55E]'
                    : 'border-transparent text-[#6F7D72] hover:text-[#18251C] dark:text-[#8E9F92] dark:hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Success Banner */}
        {successMsg ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-in zoom-in-95">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D47] dark:bg-[#1E3B27] dark:text-[#4ADE80]">
              <Check className="h-8 w-8 stroke-[2.5]" />
            </div>
            <p className="mt-4 text-sm font-bold text-[#18251C] dark:text-white">{successMsg}</p>
          </div>
        ) : (
          <div className="p-6">
            {/* TAB 1: TASK */}
            {activeTab === 'task' && (
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Inspect Drip Emitters in Sector 3"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2.5 text-xs text-[#18251C] focus:border-[#173426] focus:outline-none dark:border-[#2C3F2E] dark:bg-[#142017] dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                      Priority
                    </label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as any)}
                      className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#142017] dark:text-white"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="normal">Normal</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                      Assign To
                    </label>
                    <select
                      value={taskAssignee}
                      onChange={(e) => setTaskAssignee(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#142017] dark:text-white"
                    >
                      {workers.map((w) => (
                        <option key={w.id} value={w.fullName}>
                          {w.fullName} ({w.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Field / Plot Location
                  </label>
                  <input
                    type="text"
                    value={taskPlot}
                    onChange={(e) => setTaskPlot(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#142017] dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#173426] py-2.5 text-xs font-semibold text-white shadow hover:bg-[#1F4532] transition-colors"
                >
                  Create Task
                </button>
              </form>
            )}

            {/* TAB 2: CROP LOG */}
            {activeTab === 'crop' && (
              <form onSubmit={handleLogCrop} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                      Select Crop
                    </label>
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#142017] dark:text-white"
                    >
                      {crops.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.fieldPlot})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                      Activity Type
                    </label>
                    <select
                      value={cropActivity}
                      onChange={(e) => setCropActivity(e.target.value as any)}
                      className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#142017] dark:text-white"
                    >
                      <option value="Irrigation">Irrigation Cycle</option>
                      <option value="Fertilizer">Fertilizer Application</option>
                      <option value="Pesticide">Pesticide / Treatment</option>
                      <option value="Harvest">Harvest Yield Log</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Log Description / Observations
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. 4,200L delivered via central emitter, pressure regular."
                    value={cropDesc}
                    onChange={(e) => setCropDesc(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white p-3 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#142017] dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#173426] py-2.5 text-xs font-semibold text-white shadow hover:bg-[#1F4532] transition-colors"
                >
                  Save Crop Log
                </button>
              </form>
            )}

            {/* TAB 3: ANIMAL HEALTH */}
            {activeTab === 'animal' && (
              <form onSubmit={handleLogAnimal} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                      Livestock Tag ID
                    </label>
                    <select
                      value={selectedAnimal}
                      onChange={(e) => setSelectedAnimal(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#142017] dark:text-white"
                    >
                      {livestock.map((l) => (
                        <option key={l.id} value={l.tagId}>
                          {l.tagId} ({l.breed})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                      Record Type
                    </label>
                    <select
                      value={recordType}
                      onChange={(e) => setRecordType(e.target.value as any)}
                      className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#142017] dark:text-white"
                    >
                      <option value="Vaccination">Vaccination</option>
                      <option value="Treatment">Medical Treatment</option>
                      <option value="Checkup">General Checkup</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Treatment / Protocol Details
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Booster BVD 2ml subcutaneous"
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#142017] dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#173426] py-2.5 text-xs font-semibold text-white shadow hover:bg-[#1F4532] transition-colors"
                >
                  Record Health Event
                </button>
              </form>
            )}

            {/* TAB 4: STOCK MOVEMENT */}
            {activeTab === 'stock' && (
              <form onSubmit={handleStockMove} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Select Inventory Item
                  </label>
                  <select
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#142017] dark:text-white"
                  >
                    {inventory.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name} (Current: {i.quantity} {i.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                      Movement Action
                    </label>
                    <div className="mt-1 flex rounded-xl border border-[#D5CEC0] p-0.5 dark:border-[#2C3F2E]">
                      <button
                        type="button"
                        onClick={() => setMovementType('IN')}
                        className={`flex-1 rounded-lg py-1.5 text-xs font-semibold ${
                          movementType === 'IN'
                            ? 'bg-[#173426] text-white dark:bg-[#22C55E] dark:text-black'
                            : 'text-[#546256]'
                        }`}
                      >
                        Stock IN (+)
                      </button>
                      <button
                        type="button"
                        onClick={() => setMovementType('OUT')}
                        className={`flex-1 rounded-lg py-1.5 text-xs font-semibold ${
                          movementType === 'OUT'
                            ? 'bg-[#DF5D52] text-white'
                            : 'text-[#546256]'
                        }`}
                      >
                        Stock OUT (-)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={stockQty}
                      onChange={(e) => setStockQty(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#142017] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Reason / Destination
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Delivered to Barn 2, or applied to Plot B"
                    value={stockReason}
                    onChange={(e) => setStockReason(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#142017] dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#173426] py-2.5 text-xs font-semibold text-white shadow hover:bg-[#1F4532] transition-colors"
                >
                  Submit Stock Adjustment
                </button>
              </form>
            )}

            {/* TAB 5: FINANCE */}
            {activeTab === 'finance' && (
              <form onSubmit={handleSaveTransaction} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                      Transaction Type
                    </label>
                    <select
                      value={txType}
                      onChange={(e) => setTxType(e.target.value as any)}
                      className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#142017] dark:text-white"
                    >
                      <option value="sale">Income / Crop Sale (+)</option>
                      <option value="expense">Expense / Operating Cost (-)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={txAmount}
                      onChange={(e) => setTxAmount(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#142017] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Category
                  </label>
                  <input
                    type="text"
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#142017] dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Wholesale spinach delivery receipt"
                    value={txDesc}
                    onChange={(e) => setTxDesc(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#142017] dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#173426] py-2.5 text-xs font-semibold text-white shadow hover:bg-[#1F4532] transition-colors"
                >
                  Record Financial Entry
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
