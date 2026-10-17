'use client';

import React, { useState, useMemo } from 'react';
import {
  PackageOpen,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  History,
  X,
  Check,
  Trash2,
  Boxes,
} from 'lucide-react';
import { useFarmStore } from '@/hooks/useFarmStore';
import { useAuth } from '@/components/auth-provider';
import { InventoryItem } from '@/types';
import { formatCurrencyINR } from '@/lib/units';

export default function InventoryPage() {
  const {
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    stockMovements,
    recordStockMovement,
    suppliers,
  } = useFarmStore();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN');
  const [movementQty, setMovementQty] = useState(10);
  const [movementReason, setMovementReason] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Form states for new item with Indian inputs
  const [newItem, setNewItem] = useState({
    name: 'Neem Coated Urea 46% (IFFCO)',
    category: 'Fertilizers' as const,
    sku: 'IFFCO-UREA-46N',
    quantity: 40,
    unit: 'Bags (45kg)',
    reorderLevel: 15,
    unitCost: 266.5,
    supplierName: suppliers[0]?.name || 'IFFCO Farmers Service Centre, Niphad',
    storageLocation: 'Gat No. 142 Fertilizer Godown',
    expiryDate: '2027-12-31',
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase()) ||
        item.storageLocation.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [inventory, search, categoryFilter]);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;
    addInventoryItem(newItem);
    setIsAddModalOpen(false);
    showToast(`Added ${newItem.name} to warehouse inventory!`);
    setNewItem({
      name: '',
      category: 'Fertilizers',
      sku: '',
      quantity: 50,
      unit: 'Bags',
      reorderLevel: 20,
      unitCost: 35,
      supplierName: suppliers[0]?.name || 'Valley Agritech Supplies',
      storageLocation: 'Main Warehouse Bay 1',
      expiryDate: '2027-12-31',
    });
  };

  const handleStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    recordStockMovement(
      selectedItem.id,
      movementType,
      Number(movementQty),
      movementReason || (movementType === 'IN' ? 'Warehouse Replenishment' : 'Field Usage')
    );
    setIsStockModalOpen(false);
    showToast(
      `Adjusted stock for ${selectedItem.name} (${movementType === 'IN' ? '+' : '-'}${movementQty})`
    );
  };

  const lowStockCount = inventory.filter((i) => i.quantity <= i.reorderLevel).length;

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
            Inventory & Warehouse
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#67756B] dark:text-[#97A79A]">
            Supplies, chemicals, seeds, feeds, tools, and real-time buffer threshold tracking.
          </p>
        </div>

        {user?.role !== 'worker' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[#173426] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Inventory Item</span>
          </button>
        )}
      </div>

      {/* Low Stock Warning Banner if applicable */}
      {lowStockCount > 0 && (
        <div className="flex items-center justify-between rounded-2xl bg-[#FEF0EC] p-3.5 border border-[#FCD8CF] dark:bg-[#341B17] dark:border-[#522923]">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 text-[#DE5B50]" />
            <div>
              <p className="text-xs font-bold text-[#DE5B50] dark:text-[#F87171]">
                {lowStockCount} Items Below Buffer Threshold
              </p>
              <p className="text-[11px] text-[#7E3D35] dark:text-[#E2A69E]">
                Urea 46%, Drip Irrigation Fittings and other crucial farm items require restock.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-[#DE5B50] px-2.5 py-0.5 text-[10px] font-bold text-white">
            Action Needed
          </span>
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
            placeholder="Search item name, SKU, category, or storage bay..."
            className="w-full rounded-xl border border-[#ECE6DB] bg-[#FAF8F5] py-2 pl-9 pr-3 text-xs text-[#18251C] focus:border-[#173426] focus:bg-white focus:outline-none dark:border-[#263A2B] dark:bg-[#121D15] dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#79857B]" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-[#ECE6DB] bg-[#FAF8F5] px-3 py-2 text-xs font-semibold text-[#18251C] dark:border-[#263A2B] dark:bg-[#121D15] dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="Fertilizers">Fertilizers</option>
            <option value="Seeds">Seeds</option>
            <option value="Irrigation">Irrigation</option>
            <option value="Pesticides">Pesticides</option>
            <option value="Feed">Animal Feed</option>
            <option value="Tools">Tools</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-sm dark:border-[#233528] dark:bg-[#152219]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#ECE6DB] bg-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider text-[#79857B] dark:border-[#233528] dark:bg-[#111C14] dark:text-[#8E9F92]">
              <tr>
                <th className="px-5 py-3.5">Item & SKU</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Quantity on Hand</th>
                <th className="px-4 py-3.5">Reorder Level</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Supplier</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE0] dark:divide-[#1F3024]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#79857B]">
                    No inventory items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLow = item.quantity <= item.reorderLevel;
                  return (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-[#FBF9F4] dark:hover:bg-[#1C2C20]"
                    >
                      <td className="px-5 py-3.5 font-bold text-[#18251C] dark:text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F4EFEB] text-[#173426] dark:bg-[#223528] dark:text-[#22C55E]">
                            <Boxes className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-bold text-[#18251C] dark:text-white">{item.name}</p>
                            <p className="text-[10px] font-normal text-[#79857B]">{item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[#49574D] dark:text-[#B1C3B4]">
                        {item.category}
                      </td>
                      <td className="px-4 py-3.5 font-black text-sm text-[#18251C] dark:text-white">
                        {item.quantity}{' '}
                        <span className="text-xs font-normal text-[#79857B]">{item.unit}</span>
                      </td>
                      <td className="px-4 py-3.5 text-[#556358] dark:text-[#9FB1A2]">
                        {item.reorderLevel} {item.unit}
                      </td>
                      <td className="px-4 py-3.5 text-[#556358] dark:text-[#9FB1A2]">
                        {item.storageLocation}
                      </td>
                      <td className="px-4 py-3.5 text-[#556358] dark:text-[#9FB1A2]">
                        {item.supplierName || 'Primary Supplier'}
                      </td>
                      <td className="px-4 py-3.5">
                        {isLow ? (
                          <span className="rounded-full bg-[#FEF0EC] px-2.5 py-0.5 text-[10px] font-bold text-[#DE5B50] dark:bg-[#3D1E18] dark:text-[#F87171]">
                            Low Stock
                          </span>
                        ) : (
                          <span className="rounded-full bg-[#E7F6ED] px-2.5 py-0.5 text-[10px] font-bold text-[#1D7A40] dark:bg-[#1E3B27] dark:text-[#4ADE80]">
                            In Buffer
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setMovementType('IN');
                              setIsStockModalOpen(true);
                            }}
                            title="Stock In (+)"
                            className="rounded-lg p-1.5 text-[#1D7A40] hover:bg-[#E8F5EC] dark:hover:bg-[#1C3625]"
                          >
                            <ArrowDownRight className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setMovementType('OUT');
                              setIsStockModalOpen(true);
                            }}
                            title="Stock Out (-)"
                            className="rounded-lg p-1.5 text-[#DE5B50] hover:bg-[#FEF0EC] dark:hover:bg-[#341B17]"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </button>
                          {user?.role !== 'worker' && (
                            <button
                              onClick={() => {
                                deleteInventoryItem(item.id);
                                showToast(`Deleted ${item.name}`);
                              }}
                              className="rounded-lg p-1.5 text-[#79857B] hover:text-[#DE5B50]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Stock Movement Audit Stream */}
      <div className="rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
        <h3 className="text-sm font-bold text-[#18251C] dark:text-white flex items-center gap-2 mb-3">
          <History className="h-4 w-4 text-[#2E7D47]" />
          <span>Immutable Stock Movement Log</span>
        </h3>

        <div className="space-y-2">
          {stockMovements.slice(0, 5).map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-xl border border-[#ECE6DB] p-3 text-xs dark:border-[#233528]"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${
                    m.movementType === 'IN'
                      ? 'bg-[#E7F6ED] text-[#1D7A40] dark:bg-[#1E3B27] dark:text-[#4ADE80]'
                      : 'bg-[#FEF0EC] text-[#DE5B50] dark:bg-[#3A1E1A] dark:text-[#F87171]'
                  }`}
                >
                  {m.movementType === 'IN' ? '+' : '-'}
                </span>
                <div>
                  <p className="font-bold text-[#18251C] dark:text-white">
                    {m.movementType === 'IN' ? 'Stock In:' : 'Dispatched:'} {m.quantity} of{' '}
                    {m.itemName}
                  </p>
                  <p className="text-[11px] text-[#79857B]">{m.reason}</p>
                </div>
              </div>
              <div className="text-right text-[11px] text-[#79857B]">
                <p>{m.date}</p>
                <p className="font-semibold text-[#18251C] dark:text-white">{m.performedBy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add Inventory Item */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
            <div className="flex items-center justify-between border-b border-[#ECE6DB] px-6 py-4 dark:border-[#233528]">
              <h3 className="text-base font-bold text-[#18251C] dark:text-white">
                Register Inventory Item
              </h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-[#79857B]" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="p-6 space-y-4">
              {/* Quick Pick Indian Inputs */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#79857B]">
                  Quick Pick Indian Agri Inputs
                </label>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {[
                    { name: 'Neem Coated Urea', cat: 'Fertilizers', unit: 'Bags (45kg)', cost: 266.5 },
                    { name: 'IFFCO DAP 18:46:0', cat: 'Fertilizers', unit: 'Bags (50kg)', cost: 1350 },
                    { name: 'NPK 10:26:26 Mahadhan', cat: 'Fertilizers', unit: 'Bags (50kg)', cost: 1470 },
                    { name: 'Vermicompost', cat: 'Fertilizers', unit: 'Quintals', cost: 650 },
                    { name: 'Neem Oil 10,000 PPM', cat: 'Pesticides', unit: 'Liters', cost: 480 },
                    { name: '16mm Inline Drip Laterals', cat: 'Irrigation', unit: 'Rolls (400m)', cost: 2200 },
                  ].map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() =>
                        setNewItem({
                          ...newItem,
                          name: p.name,
                          category: p.cat as any,
                          unit: p.unit,
                          unitCost: p.cost,
                        })
                      }
                      className="rounded-lg border border-[#D5CEC0] bg-[#FAF8F5] px-2.5 py-1 text-[11px] font-medium text-[#18251C] hover:bg-[#173426] hover:text-white dark:border-[#2C3F2E] dark:bg-[#111A13] dark:text-white"
                    >
                      {p.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Copper Sulfate Spray"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Category *
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  >
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Seeds">Seeds</option>
                    <option value="Irrigation">Irrigation</option>
                    <option value="Pesticides">Pesticides</option>
                    <option value="Feed">Animal Feed</option>
                    <option value="Tools">Tools</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem({ ...newItem, quantity: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Reorder Alert Level
                  </label>
                  <input
                    type="number"
                    value={newItem.reorderLevel}
                    onChange={(e) =>
                      setNewItem({ ...newItem, reorderLevel: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Storage Bay
                  </label>
                  <input
                    type="text"
                    value={newItem.storageLocation}
                    onChange={(e) => setNewItem({ ...newItem, storageLocation: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Unit Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.unitCost}
                    onChange={(e) =>
                      setNewItem({ ...newItem, unitCost: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#173426] py-2.5 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
              >
                Register Stock Item
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Stock Movement */}
      {isStockModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
            <div className="flex items-center justify-between border-b border-[#ECE6DB] px-6 py-4 dark:border-[#233528]">
              <h3 className="text-base font-bold text-[#18251C] dark:text-white">
                {movementType === 'IN' ? 'Stock In (+)' : 'Stock Out (-)'} : {selectedItem.name}
              </h3>
              <button onClick={() => setIsStockModalOpen(false)}>
                <X className="h-5 w-5 text-[#79857B]" />
              </button>
            </div>

            <form onSubmit={handleStockAdjustment} className="p-6 space-y-4">
              <p className="text-xs text-[#79857B]">
                Current stock: <strong className="text-[#18251C] dark:text-white">{selectedItem.quantity} {selectedItem.unit}</strong>
              </p>

              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Quantity to {movementType === 'IN' ? 'Add' : 'Deduct'} ({selectedItem.unit})
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={movementQty}
                  onChange={(e) => setMovementQty(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Reason / Order Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. Irrigation Sector B repair or PO-4091"
                  value={movementReason}
                  onChange={(e) => setMovementReason(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                />
              </div>

              <button
                type="submit"
                className={`w-full rounded-xl py-2.5 text-xs font-bold text-white shadow transition-colors ${
                  movementType === 'IN'
                    ? 'bg-[#173426] hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black'
                    : 'bg-[#DE5B50] hover:bg-[#C94D43]'
                }`}
              >
                Confirm {movementType === 'IN' ? 'Stock In' : 'Stock Out'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
