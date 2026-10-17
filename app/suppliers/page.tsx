'use client';

import React, { useState, useMemo } from 'react';
import {
  Truck,
  Plus,
  Search,
  Star,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package,
  X,
  Check,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useFarmStore } from '@/hooks/useFarmStore';
import { useAuth } from '@/components/auth-provider';
import { Supplier } from '@/types';
import { formatDate } from '@/lib/utils';

export default function SuppliersPage() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier, inventory } = useFarmStore();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Form states for new supplier
  const [newSup, setNewSup] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    productsSupplied: ['Organic Fertilizer', 'Seeds'],
    rating: 5.0,
    lastOrderDate: new Date().toISOString().split('T')[0],
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      return (
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [suppliers, search]);

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSup.name) return;
    addSupplier(newSup);
    setIsAddModalOpen(false);
    showToast(`Registered supplier: ${newSup.name}`);
    setNewSup({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      productsSupplied: ['Organic Fertilizer', 'Seeds'],
      rating: 5.0,
      lastOrderDate: new Date().toISOString().split('T')[0],
    });
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
            Suppliers & Vendors
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#67756B] dark:text-[#97A79A]">
            Agricultural supply vendors, verified seed merchants, and equipment spare-part dealers.
          </p>
        </div>

        {user?.role !== 'worker' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[#173426] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Supplier</span>
          </button>
        )}
      </div>

      {/* Search Toolbar */}
      <div className="flex rounded-2xl border border-[#ECE6DB] bg-white p-3 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#79857B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search supplier name, contact person, or email..."
            className="w-full rounded-xl border border-[#ECE6DB] bg-[#FAF8F5] py-2 pl-9 pr-3 text-xs text-[#18251C] focus:border-[#173426] focus:bg-white focus:outline-none dark:border-[#263A2B] dark:bg-[#121D15] dark:text-white"
          />
        </div>
      </div>

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((sup) => (
          <div
            key={sup.id}
            onClick={() => setSelectedSupplier(sup)}
            className="cursor-pointer rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-[#233528] dark:bg-[#152219]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F4EFEB] text-[#173426] dark:bg-[#203426] dark:text-[#22C55E]">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#18251C] dark:text-white">{sup.name}</h3>
                  <p className="text-[11px] text-[#79857B]">{sup.contactPerson}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-[#FEF7E6] px-2 py-0.5 text-[10px] font-bold text-[#D97706] dark:bg-[#382613] dark:text-[#FBBF24]">
                <Star className="h-3 w-3 fill-[#D97706]" />
                <span>{sup.rating}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-[#556358] dark:text-[#9FB1A2]">
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#79857B]" />
                <span>{sup.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#79857B]" />
                <span>{sup.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#79857B]" />
                <span className="truncate">{sup.address}</span>
              </p>
            </div>

            {/* Products chips */}
            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[#F2ECE0] pt-3 dark:border-[#1F3024]">
              {sup.productsSupplied.map((p, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-[#F8F6F1] px-2 py-0.5 text-[10px] font-semibold text-[#445047] dark:bg-[#1E2E22] dark:text-[#D1E0D4]"
                >
                  {p}
                </span>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-[#79857B]">
              <span>Last Order: {formatDate(sup.lastOrderDate)}</span>
              <span className="font-bold text-[#2E7D47] dark:text-[#4ADE80]">View Details →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Supplier Details */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
            <div className="flex items-center justify-between border-b border-[#ECE6DB] px-6 py-4 dark:border-[#233528]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#173426] text-white">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#18251C] dark:text-white">
                    {selectedSupplier.name}
                  </h3>
                  <p className="text-xs text-[#79857B]">
                    Primary Contact: {selectedSupplier.contactPerson}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedSupplier(null)}>
                <X className="h-5 w-5 text-[#79857B]" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="rounded-2xl bg-[#F8F6F1] p-4 space-y-2 text-xs dark:bg-[#1C2C20]">
                <div className="flex justify-between">
                  <span className="text-[#79857B]">Phone:</span>
                  <span className="font-bold text-[#18251C] dark:text-white">
                    {selectedSupplier.phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#79857B]">Email:</span>
                  <span className="font-bold text-[#18251C] dark:text-white">
                    {selectedSupplier.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#79857B]">Facility Address:</span>
                  <span className="font-bold text-[#18251C] dark:text-white">
                    {selectedSupplier.address}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#79857B]">Vendor Quality Rating:</span>
                  <span className="font-bold text-[#D97706]">{selectedSupplier.rating} / 5.0</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#18251C] dark:text-white mb-2">
                  Supplied Farm Inventory Items
                </h4>
                <div className="space-y-1.5">
                  {inventory
                    .filter(
                      (i) =>
                        i.supplierName?.toLowerCase() === selectedSupplier.name.toLowerCase()
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl border border-[#ECE6DB] p-2.5 text-xs dark:border-[#233528]"
                      >
                        <span className="font-bold text-[#18251C] dark:text-white">
                          {item.name}
                        </span>
                        <span className="text-[#79857B]">
                          {item.quantity} {item.unit} in stock
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[#ECE6DB] dark:border-[#233528]">
                {user?.role !== 'worker' && (
                  <button
                    onClick={() => {
                      deleteSupplier(selectedSupplier.id);
                      setSelectedSupplier(null);
                      showToast(`Removed supplier ${selectedSupplier.name}`);
                    }}
                    className="text-xs text-[#DE5B50] hover:underline"
                  >
                    Delete Supplier
                  </button>
                )}
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="rounded-xl bg-[#173426] px-4 py-2 text-xs font-bold text-white dark:bg-[#22C55E] dark:text-black"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Supplier */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
            <div className="flex items-center justify-between border-b border-[#ECE6DB] px-6 py-4 dark:border-[#233528]">
              <h3 className="text-base font-bold text-[#18251C] dark:text-white">
                Register Supplier
              </h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-[#79857B]" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Supplier / Vendor Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pacific Ag Spares"
                    value={newSup.name}
                    onChange={(e) => setNewSup({ ...newSup, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Elena Rostova"
                    value={newSup.contactPerson}
                    onChange={(e) => setNewSup({ ...newSup, contactPerson: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 234-5678"
                    value={newSup.phone}
                    onChange={(e) => setNewSup({ ...newSup, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="sales@supplier.com"
                    value={newSup.email}
                    onChange={(e) => setNewSup({ ...newSup, email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Facility Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1400 Industrial Way, Modesto, CA"
                  value={newSup.address}
                  onChange={(e) => setNewSup({ ...newSup, address: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#173426] py-2.5 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
              >
                Register Supplier
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
