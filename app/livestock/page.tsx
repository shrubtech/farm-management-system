'use client';

import React, { useState, useMemo } from 'react';
import {
  PawPrint,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Syringe,
  Activity,
  ChevronRight,
  X,
  Check,
  Trash2,
  Calendar,
  Scale,
  Milk,
  IndianRupee,
  BadgeCheck,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useFarmStore } from '@/hooks/useFarmStore';
import { useAuth } from '@/components/auth-provider';
import { Livestock, HealthStatus, AnimalGender, MilkEntry } from '@/types';
import { formatDateIndian, formatCurrencyINR } from '@/lib/units';

export default function LivestockPage() {
  const {
    livestock,
    addLivestock,
    updateLivestock,
    deleteLivestock,
    healthRecords,
    addHealthRecord,
    milkEntries,
    addMilkEntry,
    deleteMilkEntry,
  } = useFarmStore();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'herd' | 'milk'>('herd');
  const [search, setSearch] = useState('');
  const [healthFilter, setHealthFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [selectedAnimal, setSelectedAnimal] = useState<Livestock | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isAddMilkModalOpen, setIsAddMilkModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Form states for new animal (Indian Breeds & INAPH Tag)
  const [newAnimal, setNewAnimal] = useState({
    tagId: 'MH-NSK-GIR-03',
    animalType: 'Cattle' as const,
    breed: 'Gir Cow',
    ageMonths: 36,
    gender: 'female' as AnimalGender,
    healthStatus: 'healthy' as HealthStatus,
    weightKg: 420,
    pastureLocation: 'Gat No. 142/2A Shed 1',
    feedSchedule: 'Green fodder (Maize/Napier grass) + dry silage + mineral mixture',
    lastVaccinationDate: new Date().toISOString().split('T')[0],
    nextVaccinationDate: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
  });

  // Health record form state
  const [newHealthRecord, setNewHealthRecord] = useState({
    recordType: 'Vaccination' as const,
    treatment: 'FMD',
    dosage: '2ml subcutaneous',
    veterinarian: 'Dr. Gregory Hayes, DVM (Govt Vet Hospital Niphad)',
    notes: 'National Animal Disease Control Programme (NADCP) vaccination',
  });

  // Milk entry form state
  const [newMilk, setNewMilk] = useState({
    tagId: 'MH-NSK-GIR-01',
    animalBreed: 'Gir Cow',
    date: new Date().toISOString().split('T')[0],
    session: 'morning' as 'morning' | 'evening',
    quantityLitres: 10.5,
    fatPercentage: 4.8,
    snfPercentage: 8.7,
    ratePerLitre: 42,
    purchaserName: 'Nashik District Co-op Milk Union',
    notes: 'Premium A2 Desi Gir Cow Milk',
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Calculations for Milk tab
  const todayDate = new Date().toISOString().split('T')[0];
  const todayEntries = milkEntries.filter((m) => m.date === todayDate);
  const todayLitres = todayEntries.reduce((sum, m) => sum + m.quantityLitres, 0);
  const todayRevenue = todayEntries.reduce((sum, m) => sum + m.totalAmount, 0);
  const avgFat =
    todayEntries.length > 0
      ? (todayEntries.reduce((sum, m) => sum + (m.fatPercentage || 0), 0) / todayEntries.length).toFixed(1)
      : '4.8';
  const avgSnf =
    todayEntries.length > 0
      ? (todayEntries.reduce((sum, m) => sum + (m.snfPercentage || 0), 0) / todayEntries.length).toFixed(1)
      : '8.6';

  const filteredLivestock = useMemo(() => {
    return livestock.filter((animal) => {
      const matchesSearch =
        animal.tagId.toLowerCase().includes(search.toLowerCase()) ||
        animal.breed.toLowerCase().includes(search.toLowerCase()) ||
        animal.animalType.toLowerCase().includes(search.toLowerCase()) ||
        animal.pastureLocation.toLowerCase().includes(search.toLowerCase());
      const matchesHealth = healthFilter === 'all' || animal.healthStatus === healthFilter;
      return matchesSearch && matchesHealth;
    });
  }, [livestock, search, healthFilter]);

  const handleCreateAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnimal.tagId || !newAnimal.breed) return;
    addLivestock(newAnimal);
    setIsAddModalOpen(false);
    showToast(`Registered animal ${newAnimal.tagId} successfully!`);
    setNewAnimal({
      tagId: 'MH-NSK-MUR-03',
      animalType: 'Cattle',
      breed: 'Murrah Buffalo',
      ageMonths: 42,
      gender: 'female',
      healthStatus: 'healthy',
      weightKg: 580,
      pastureLocation: 'Gat No. 142/2A Shed 2',
      feedSchedule: 'Green fodder + concentrate mash + minerals',
      lastVaccinationDate: new Date().toISOString().split('T')[0],
      nextVaccinationDate: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
    });
  };

  const handleAddHealth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimal) return;
    addHealthRecord({
      livestockId: selectedAnimal.id,
      tagId: selectedAnimal.tagId,
      recordType: newHealthRecord.recordType,
      treatment: newHealthRecord.treatment || `${newHealthRecord.recordType} protocol`,
      dosage: newHealthRecord.dosage,
      veterinarian: newHealthRecord.veterinarian,
      date: new Date().toISOString().split('T')[0],
      notes: newHealthRecord.notes,
    });
    setIsHealthModalOpen(false);
    showToast(`Health record saved for ${selectedAnimal.tagId}`);
  };

  const handleAddMilk = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = Number(newMilk.quantityLitres) * Number(newMilk.ratePerLitre);
    addMilkEntry({
      tagId: newMilk.tagId,
      animalBreed: newMilk.animalBreed,
      date: newMilk.date,
      session: newMilk.session,
      quantityLitres: Number(newMilk.quantityLitres),
      fatPercentage: Number(newMilk.fatPercentage),
      snfPercentage: Number(newMilk.snfPercentage),
      ratePerLitre: Number(newMilk.ratePerLitre),
      totalAmount,
      purchaserName: newMilk.purchaserName,
      notes: newMilk.notes,
    });
    setIsAddMilkModalOpen(false);
    showToast(`Recorded ${newMilk.quantityLitres}L milk for ${newMilk.tagId}`);
  };

  const getHealthBadge = (status: HealthStatus) => {
    switch (status) {
      case 'healthy':
        return (
          <span className="rounded-full bg-[#E7F6ED] px-2.5 py-0.5 text-[10px] font-bold text-[#1D7A40] dark:bg-[#1E3B27] dark:text-[#4ADE80]">
            Healthy
          </span>
        );
      case 'treatment':
        return (
          <span className="rounded-full bg-[#FEF7E6] px-2.5 py-0.5 text-[10px] font-bold text-[#D97706] dark:bg-[#382613] dark:text-[#FBBF24]">
            Treatment
          </span>
        );
      case 'quarantine':
        return (
          <span className="rounded-full bg-[#FEF0EC] px-2.5 py-0.5 text-[10px] font-bold text-[#DE5B50] dark:bg-[#3D1E18] dark:text-[#F87171]">
            Quarantine
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-[#F3EFE7] px-2.5 py-0.5 text-[10px] font-bold text-[#556358]">
            Critical
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
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
            Livestock & Dairy Records
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#67756B] dark:text-[#97A79A]">
            Desi breeds (Gir, Murrah), Pashu Aadhaar tags, daily Fat/SNF milk tracking, and NADCP vaccines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {user?.role !== 'worker' && (
            <button
              onClick={() => setIsAddMilkModalOpen(true)}
              className="flex items-center gap-2 rounded-full border border-[#D5CEC0] bg-white px-4 py-2 text-xs font-bold text-[#18251C] shadow-sm hover:bg-[#FAF8F5] dark:border-[#2D4032] dark:bg-[#162319] dark:text-white"
            >
              <Milk className="h-4 w-4 text-[#22C55E]" />
              <span>Log Daily Milk</span>
            </button>
          )}

          {user?.role !== 'worker' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-full bg-[#173426] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Add Livestock</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-[#ECE6DB] pb-0 dark:border-[#233528]">
        <button
          onClick={() => setActiveTab('herd')}
          className={`border-b-2 px-4 py-2.5 text-xs font-bold transition-colors ${
            activeTab === 'herd'
              ? 'border-[#173426] text-[#173426] dark:border-[#22C55E] dark:text-[#22C55E]'
              : 'border-transparent text-[#79857B] hover:text-[#18251C] dark:text-[#8E9F92] dark:hover:text-white'
          }`}
        >
          Herd Registry & Health ({livestock.length} Animals)
        </button>
        <button
          onClick={() => setActiveTab('milk')}
          className={`border-b-2 px-4 py-2.5 text-xs font-bold transition-colors ${
            activeTab === 'milk'
              ? 'border-[#173426] text-[#173426] dark:border-[#22C55E] dark:text-[#22C55E]'
              : 'border-transparent text-[#79857B] hover:text-[#18251C] dark:text-[#8E9F92] dark:hover:text-white'
          }`}
        >
          Daily Milk Collection & Fat/SNF ({milkEntries.length} Records)
        </button>
      </div>

      {/* TAB 1: HERD REGISTRY */}
      {activeTab === 'herd' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#ECE6DB] bg-white p-3 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#79857B]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Pashu Aadhaar Tag ID, breed, animal type, shed..."
                className="w-full rounded-xl border border-[#ECE6DB] bg-[#FAF8F5] py-2 pl-9 pr-3 text-xs text-[#18251C] focus:border-[#173426] focus:bg-white focus:outline-none dark:border-[#263A2B] dark:bg-[#121D15] dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={healthFilter}
                onChange={(e) => setHealthFilter(e.target.value)}
                className="rounded-xl border border-[#ECE6DB] bg-[#FAF8F5] px-3 py-2 text-xs font-semibold text-[#18251C] dark:border-[#263A2B] dark:bg-[#121D15] dark:text-white"
              >
                <option value="all">All Health Conditions</option>
                <option value="healthy">Healthy</option>
                <option value="treatment">Under Treatment</option>
                <option value="quarantine">Quarantine</option>
              </select>

              {/* Table / Card Toggle */}
              <div className="flex rounded-xl border border-[#ECE6DB] p-0.5 dark:border-[#263A2B]">
                <button
                  onClick={() => setViewMode('table')}
                  className={`rounded-lg p-1.5 transition-colors ${
                    viewMode === 'table'
                      ? 'bg-[#173426] text-white dark:bg-[#22C55E] dark:text-black'
                      : 'text-[#79857B]'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  className={`rounded-lg p-1.5 transition-colors ${
                    viewMode === 'card'
                      ? 'bg-[#173426] text-white dark:bg-[#22C55E] dark:text-black'
                      : 'text-[#79857B]'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* VIEW: TABLE */}
          {viewMode === 'table' ? (
            <div className="overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-sm dark:border-[#233528] dark:bg-[#152219]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#ECE6DB] bg-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider text-[#79857B] dark:border-[#233528] dark:bg-[#111C14] dark:text-[#8E9F92]">
                    <tr>
                      <th className="px-5 py-3.5">Pashu Aadhaar (Tag)</th>
                      <th className="px-4 py-3.5">Desi Breed</th>
                      <th className="px-4 py-3.5">Age & Sex</th>
                      <th className="px-4 py-3.5">Weight</th>
                      <th className="px-4 py-3.5">Shed / Plot</th>
                      <th className="px-4 py-3.5">Health Status</th>
                      <th className="px-4 py-3.5">Vaccination Due</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2ECE0] dark:divide-[#1F3024]">
                    {filteredLivestock.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-xs text-[#79857B]">
                          No livestock found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredLivestock.map((animal) => (
                        <tr
                          key={animal.id}
                          onClick={() => setSelectedAnimal(animal)}
                          className="cursor-pointer transition-colors hover:bg-[#FBF9F4] dark:hover:bg-[#1C2C20]"
                        >
                          <td className="px-5 py-3.5 font-bold text-[#18251C] dark:text-white">
                            <div className="flex items-center gap-2">
                              <BadgeCheck className="h-4 w-4 text-[#22C55E]" />
                              <span>{animal.tagId}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-[#18251C] dark:text-white">
                            {animal.breed}
                          </td>
                          <td className="px-4 py-3.5 text-[#556358] dark:text-[#9FB1A2] capitalize">
                            {animal.ageMonths}m • {animal.gender}
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-[#18251C] dark:text-white">
                            {animal.weightKg} kg
                          </td>
                          <td className="px-4 py-3.5 text-[#556358] dark:text-[#9FB1A2]">
                            {animal.pastureLocation}
                          </td>
                          <td className="px-4 py-3.5">{getHealthBadge(animal.healthStatus)}</td>
                          <td className="px-4 py-3.5 text-[#556358] dark:text-[#9FB1A2]">
                            {animal.nextVaccinationDate
                              ? formatDateIndian(animal.nextVaccinationDate)
                              : 'Up to date'}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAnimal(animal);
                              }}
                              className="rounded-lg p-1 text-[#79857B] hover:bg-[#EFE8DC] dark:hover:bg-[#25392B]"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* VIEW: CARDS */
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredLivestock.map((animal) => (
                <div
                  key={animal.id}
                  onClick={() => setSelectedAnimal(animal)}
                  className="cursor-pointer rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-[#233528] dark:bg-[#152219]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E6F8F3] text-[#0D9488] dark:bg-[#13352F] dark:text-[#2DD4BF]">
                        <PawPrint className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#18251C] dark:text-white">
                          {animal.tagId}
                        </h3>
                        <p className="text-[10px] text-[#79857B]">{animal.breed}</p>
                      </div>
                    </div>
                    {getHealthBadge(animal.healthStatus)}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-[#F8F6F1] p-2.5 dark:bg-[#1C2C20]">
                      <span className="text-[9px] uppercase font-bold text-[#79857B]">Weight</span>
                      <p className="font-bold text-[#18251C] dark:text-white">{animal.weightKg} kg</p>
                    </div>
                    <div className="rounded-xl bg-[#F8F6F1] p-2.5 dark:bg-[#1C2C20]">
                      <span className="text-[9px] uppercase font-bold text-[#79857B]">Age / Sex</span>
                      <p className="font-bold text-[#18251C] dark:text-white capitalize">
                        {animal.ageMonths}m • {animal.gender}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-[#556358] dark:text-[#9FB1A2]">
                    <p>
                      <strong className="text-[#18251C] dark:text-white">Location:</strong>{' '}
                      {animal.pastureLocation}
                    </p>
                    <p className="mt-1">
                      <strong className="text-[#18251C] dark:text-white">Next Due:</strong>{' '}
                      {animal.nextVaccinationDate
                        ? formatDateIndian(animal.nextVaccinationDate)
                        : 'Up to date'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DAILY MILK COLLECTION */}
      {activeTab === 'milk' && (
        <div className="space-y-6">
          {/* Milk KPI Cards */}
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
            <div className="rounded-2xl border border-[#ECE6DB] bg-white p-4 shadow-xs dark:border-[#233528] dark:bg-[#162319]">
              <span className="text-[10px] font-bold uppercase text-[#79857B]">Today's Milk</span>
              <div className="mt-1 text-xl font-extrabold text-[#173426] dark:text-[#22C55E]">
                {todayLitres > 0 ? todayLitres.toFixed(1) : '38.5'} Litres
              </div>
              <p className="text-[10px] text-[#79857B]">Morning + Evening collection</p>
            </div>

            <div className="rounded-2xl border border-[#ECE6DB] bg-white p-4 shadow-xs dark:border-[#233528] dark:bg-[#162319]">
              <span className="text-[10px] font-bold uppercase text-[#79857B]">Average Fat %</span>
              <div className="mt-1 text-xl font-extrabold text-[#0D9488] dark:text-[#2DD4BF]">
                {avgFat}% Fat
              </div>
              <p className="text-[10px] text-[#79857B]">Premium A2 Gir Standard</p>
            </div>

            <div className="rounded-2xl border border-[#ECE6DB] bg-white p-4 shadow-xs dark:border-[#233528] dark:bg-[#162319]">
              <span className="text-[10px] font-bold uppercase text-[#79857B]">Average SNF %</span>
              <div className="mt-1 text-xl font-extrabold text-[#D97706] dark:text-[#FBBF24]">
                {avgSnf}% SNF
              </div>
              <p className="text-[10px] text-[#79857B]">Above 8.5% coop norm</p>
            </div>

            <div className="rounded-2xl border border-[#ECE6DB] bg-white p-4 shadow-xs dark:border-[#233528] dark:bg-[#162319]">
              <span className="text-[10px] font-bold uppercase text-[#79857B]">Today Payout</span>
              <div className="mt-1 text-xl font-extrabold text-[#16A34A] dark:text-[#4ADE80]">
                {formatCurrencyINR(todayRevenue > 0 ? todayRevenue : 1617)}
              </div>
              <p className="text-[10px] text-[#79857B]">₹42 / Litre base rate</p>
            </div>
          </div>

          {/* Milk Entries Table */}
          <div className="overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-sm dark:border-[#233528] dark:bg-[#152219]">
            <div className="flex items-center justify-between border-b border-[#ECE6DB] px-5 py-4 dark:border-[#233528]">
              <div>
                <h3 className="text-sm font-bold text-[#18251C] dark:text-white">
                  Daily Milk Log
                </h3>
                <p className="text-xs text-[#79857B]">Individual animal fat, SNF and co-op billing</p>
              </div>

              {user?.role !== 'worker' && (
                <button
                  onClick={() => setIsAddMilkModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-[#173426] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#204433] dark:bg-[#22C55E] dark:text-black"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Collection</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#ECE6DB] bg-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider text-[#79857B] dark:border-[#233528] dark:bg-[#111C14] dark:text-[#8E9F92]">
                  <tr>
                    <th className="px-5 py-3.5">Date & Session</th>
                    <th className="px-4 py-3.5">Animal Tag & Breed</th>
                    <th className="px-4 py-3.5">Quantity</th>
                    <th className="px-4 py-3.5">Fat %</th>
                    <th className="px-4 py-3.5">SNF %</th>
                    <th className="px-4 py-3.5">Rate / L</th>
                    <th className="px-4 py-3.5">Total Payout</th>
                    <th className="px-4 py-3.5">Purchaser</th>
                    <th className="px-4 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE0] dark:divide-[#1F3024]">
                  {milkEntries.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-xs text-[#79857B]">
                        No milk collection records found.
                      </td>
                    </tr>
                  ) : (
                    milkEntries.map((m) => (
                      <tr key={m.id} className="transition-colors hover:bg-[#FBF9F4] dark:hover:bg-[#1C2C20]">
                        <td className="px-5 py-3.5 font-bold text-[#18251C] dark:text-white">
                          <div>
                            <span className="capitalize">{m.session}</span>
                            <span className="block text-[10px] font-normal text-[#79857B]">
                              {formatDateIndian(m.date)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-[#18251C] dark:text-white">
                          <div>
                            <span>{m.tagId}</span>
                            <span className="block text-[10px] text-[#79857B]">{m.animalBreed}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-[#173426] dark:text-[#22C55E]">
                          {m.quantityLitres} Litres
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-[#0D9488]">{m.fatPercentage}%</td>
                        <td className="px-4 py-3.5 font-semibold text-[#D97706]">{m.snfPercentage}%</td>
                        <td className="px-4 py-3.5 text-[#556358] dark:text-[#9FB1A2]">
                          {formatCurrencyINR(m.ratePerLitre)}/L
                        </td>
                        <td className="px-4 py-3.5 font-bold text-[#18251C] dark:text-white">
                          {formatCurrencyINR(m.totalAmount)}
                        </td>
                        <td className="px-4 py-3.5 text-[#556358] dark:text-[#9FB1A2]">
                          {m.purchaserName}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => deleteMilkEntry(m.id)}
                            className="rounded-lg p-1 text-[#DF5D52] hover:bg-[#FEECEC] dark:hover:bg-[#3E1A1A]"
                            title="Delete entry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Animal Detail Modal */}
      {selectedAnimal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#ECE6DB] px-6 py-4 dark:border-[#233528]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E6F8F3] text-[#0D9488] font-bold">
                  <PawPrint className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#18251C] dark:text-white flex items-center gap-1.5">
                    <BadgeCheck className="h-4 w-4 text-[#22C55E]" />
                    <span>{selectedAnimal.tagId} • {selectedAnimal.breed}</span>
                  </h3>
                  <p className="text-xs text-[#79857B] dark:text-[#8E9F92]">
                    {selectedAnimal.pastureLocation} • {selectedAnimal.weightKg} kg
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {user?.role !== 'worker' && (
                  <button
                    onClick={() => {
                      deleteLivestock(selectedAnimal.id);
                      setSelectedAnimal(null);
                      showToast('Deleted livestock record');
                    }}
                    className="p-1.5 text-[#DE5B50] hover:bg-[#FEECEC] rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setSelectedAnimal(null)}
                  className="p-1.5 text-[#79857B] hover:bg-[#F3EFE7] rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-[#F8F6F1] p-3 dark:bg-[#1C2C20]">
                  <p className="text-[10px] uppercase font-bold text-[#79857B]">Feed Schedule</p>
                  <p className="text-xs font-semibold text-[#18251C] dark:text-white mt-1">
                    {selectedAnimal.feedSchedule}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#F8F6F1] p-3 dark:bg-[#1C2C20]">
                  <p className="text-[10px] uppercase font-bold text-[#79857B]">
                    Last Vaccination
                  </p>
                  <p className="text-xs font-semibold text-[#18251C] dark:text-white mt-1">
                    {selectedAnimal.lastVaccinationDate
                      ? formatDateIndian(selectedAnimal.lastVaccinationDate)
                      : 'N/A'}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#F8F6F1] p-3 dark:bg-[#1C2C20]">
                  <p className="text-[10px] uppercase font-bold text-[#79857B]">Next Booster</p>
                  <p className="text-xs font-bold text-[#0D9488] dark:text-[#2DD4BF] mt-1">
                    {selectedAnimal.nextVaccinationDate
                      ? formatDateIndian(selectedAnimal.nextVaccinationDate)
                      : 'Scheduled'}
                  </p>
                </div>
              </div>

              {/* Health records subtable */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#18251C] dark:text-white flex items-center gap-2">
                    <Syringe className="h-4 w-4 text-[#0D9488]" />
                    <span>Veterinary & Vaccination Records</span>
                  </h4>
                  {user?.role !== 'worker' && (
                    <button
                      onClick={() => setIsHealthModalOpen(true)}
                      className="rounded-full bg-[#173426] px-3 py-1 text-[11px] font-semibold text-white dark:bg-[#22C55E] dark:text-black"
                    >
                      + Add Health Record
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {healthRecords
                    .filter((hr) => hr.livestockId === selectedAnimal.id)
                    .map((hr) => (
                      <div
                        key={hr.id}
                        className="flex items-center justify-between rounded-xl border border-[#ECE6DB] p-3 text-xs dark:border-[#233528]"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#18251C] dark:text-white">
                              {hr.treatment}
                            </span>
                            <span className="text-[10px] text-[#79857B]">{formatDateIndian(hr.date)}</span>
                          </div>
                          <p className="text-[11px] text-[#556358] dark:text-[#A7B8AA] mt-0.5">
                            {hr.notes}
                          </p>
                        </div>
                        <div className="text-right text-[11px] font-semibold text-[#18251C] dark:text-white">
                          {hr.dosage}
                          <span className="block text-[9px] font-normal text-[#79857B]">
                            by {hr.veterinarian}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Livestock */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
            <div className="flex items-center justify-between border-b border-[#ECE6DB] px-6 py-4 dark:border-[#233528]">
              <div>
                <h3 className="text-base font-bold text-[#18251C] dark:text-white">
                  Register Livestock
                </h3>
                <p className="text-xs text-[#79857B]">Desi Cows, Buffaloes & Pashu Aadhaar</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-[#79857B]" />
              </button>
            </div>

            <form onSubmit={handleCreateAnimal} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Pashu Aadhaar / Tag ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MH-NSK-GIR-03"
                    value={newAnimal.tagId}
                    onChange={(e) => setNewAnimal({ ...newAnimal, tagId: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Animal Category
                  </label>
                  <select
                    value={newAnimal.animalType}
                    onChange={(e) =>
                      setNewAnimal({ ...newAnimal, animalType: e.target.value as any })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  >
                    <option value="Cattle">Cattle / Cow</option>
                    <option value="Buffalo">Buffalo</option>
                    <option value="Goat">Goat</option>
                    <option value="Sheep">Sheep</option>
                    <option value="Poultry">Poultry</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Desi Breed *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gir Cow / Murrah Buffalo"
                    value={newAnimal.breed}
                    onChange={(e) => setNewAnimal({ ...newAnimal, breed: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={newAnimal.weightKg}
                    onChange={(e) =>
                      setNewAnimal({ ...newAnimal, weightKg: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Gender
                  </label>
                  <select
                    value={newAnimal.gender}
                    onChange={(e) =>
                      setNewAnimal({ ...newAnimal, gender: e.target.value as any })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Shed / Pasture
                  </label>
                  <input
                    type="text"
                    value={newAnimal.pastureLocation}
                    onChange={(e) =>
                      setNewAnimal({ ...newAnimal, pastureLocation: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#173426] py-2.5 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
              >
                Register Livestock
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Milk Collection */}
      {isAddMilkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
            <div className="flex items-center justify-between border-b border-[#ECE6DB] px-6 py-4 dark:border-[#233528]">
              <div>
                <h3 className="text-base font-bold text-[#18251C] dark:text-white">
                  Daily Milk Logging
                </h3>
                <p className="text-xs text-[#79857B]">Record collection, Fat% and SNF%</p>
              </div>
              <button onClick={() => setIsAddMilkModalOpen(false)}>
                <X className="h-5 w-5 text-[#79857B]" />
              </button>
            </div>

            <form onSubmit={handleAddMilk} className="p-6 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#18251C] dark:text-white">
                    Animal Tag
                  </label>
                  <select
                    value={newMilk.tagId}
                    onChange={(e) => {
                      const matched = livestock.find((l) => l.tagId === e.target.value);
                      setNewMilk({
                        ...newMilk,
                        tagId: e.target.value,
                        animalBreed: matched?.breed || 'Gir Cow',
                      });
                    }}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  >
                    {livestock.map((l) => (
                      <option key={l.id} value={l.tagId}>
                        {l.tagId} ({l.breed.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#18251C] dark:text-white">
                    Session
                  </label>
                  <select
                    value={newMilk.session}
                    onChange={(e) =>
                      setNewMilk({ ...newMilk, session: e.target.value as any })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  >
                    <option value="morning">Morning</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-[#18251C] dark:text-white">
                    Litres
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newMilk.quantityLitres}
                    onChange={(e) =>
                      setNewMilk({ ...newMilk, quantityLitres: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#18251C] dark:text-white">
                    Fat %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newMilk.fatPercentage}
                    onChange={(e) =>
                      setNewMilk({ ...newMilk, fatPercentage: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#18251C] dark:text-white">
                    SNF %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newMilk.snfPercentage}
                    onChange={(e) =>
                      setNewMilk({ ...newMilk, snfPercentage: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#18251C] dark:text-white">
                    Rate per Litre (₹)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newMilk.ratePerLitre}
                    onChange={(e) =>
                      setNewMilk({ ...newMilk, ratePerLitre: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#18251C] dark:text-white">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newMilk.date}
                    onChange={(e) => setNewMilk({ ...newMilk, date: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#18251C] dark:text-white">
                  Dairy Society / Purchaser
                </label>
                <input
                  type="text"
                  value={newMilk.purchaserName}
                  onChange={(e) => setNewMilk({ ...newMilk, purchaserName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                />
              </div>

              <div className="rounded-xl bg-[#FAF8F5] p-3 text-xs dark:bg-[#111A13]">
                <div className="flex justify-between font-bold text-[#18251C] dark:text-white">
                  <span>Calculated Amount:</span>
                  <span className="text-[#16A34A] dark:text-[#4ADE80]">
                    {formatCurrencyINR(newMilk.quantityLitres * newMilk.ratePerLitre)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#173426] py-2.5 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
              >
                Save Milk Entry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Health Record */}
      {isHealthModalOpen && selectedAnimal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
            <div className="flex items-center justify-between border-b border-[#ECE6DB] px-6 py-4 dark:border-[#233528]">
              <h3 className="text-base font-bold text-[#18251C] dark:text-white">
                Log Health for {selectedAnimal.tagId}
              </h3>
              <button onClick={() => setIsHealthModalOpen(false)}>
                <X className="h-5 w-5 text-[#79857B]" />
              </button>
            </div>

            <form onSubmit={handleAddHealth} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Record Type
                </label>
                <select
                  value={newHealthRecord.recordType}
                  onChange={(e) =>
                    setNewHealthRecord({ ...newHealthRecord, recordType: e.target.value as any })
                  }
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                >
                  <option value="Vaccination">Vaccination</option>
                  <option value="Treatment">Medical Treatment</option>
                  <option value="Checkup">General Vet Checkup</option>
                  <option value="Breeding">Artificial Insemination</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Treatment / Protocol Details
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FMD Booster 2ml s/c"
                  value={newHealthRecord.treatment}
                  onChange={(e) =>
                    setNewHealthRecord({ ...newHealthRecord, treatment: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Veterinarian
                </label>
                <input
                  type="text"
                  value={newHealthRecord.veterinarian}
                  onChange={(e) =>
                    setNewHealthRecord({ ...newHealthRecord, veterinarian: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#173426] py-2.5 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
              >
                Save Health Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
