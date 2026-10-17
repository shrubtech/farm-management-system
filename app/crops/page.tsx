'use client';

import React, { useState, useMemo } from 'react';
import {
  Sprout,
  Plus,
  Search,
  Filter,
  Calendar,
  Layers,
  TrendingUp,
  X,
  Check,
  Trash2,
  Edit,
  History,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { useFarmStore } from '@/hooks/useFarmStore';
import { useAuth } from '@/components/auth-provider';
import { Crop, CropStatus, CropSeason } from '@/types';
import { formatDateIndian } from '@/lib/units';

export default function CropsPage() {
  const { crops, addCrop, updateCrop, deleteCrop, cropLogs, addCropLog, farm } = useFarmStore();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [seasonFilter, setSeasonFilter] = useState<string>('all');
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Form states for new crop with Indian agricultural parameters
  const [newCrop, setNewCrop] = useState({
    name: 'Cotton',
    variety: 'Bt Cotton RCH-659 BG II',
    fieldPlot: 'Gat No. 142/2A Plot 1',
    season: 'Kharif' as CropSeason,
    areaAcres: 5,
    plantingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: new Date(Date.now() + 150 * 86400000).toISOString().split('T')[0],
    status: 'growing' as CropStatus,
    estimatedYield: 75,
    yieldUnit: 'Quintals',
    notes: 'Drip fertigation with 19:19:19. Monitored for Pink Bollworm.',
  });

  // Form states for crop activity log
  const [newLog, setNewLog] = useState({
    activityType: 'Fertilizer' as const,
    description: '',
    quantity: 25,
    unit: 'Liters',
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const filteredCrops = useMemo(() => {
    return crops.filter((crop) => {
      const matchesSearch =
        crop.name.toLowerCase().includes(search.toLowerCase()) ||
        crop.variety.toLowerCase().includes(search.toLowerCase()) ||
        crop.fieldPlot.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || crop.status === statusFilter;
      const matchesSeason = seasonFilter === 'all' || crop.season === seasonFilter;
      return matchesSearch && matchesStatus && matchesSeason;
    });
  }, [crops, search, statusFilter, seasonFilter]);

  const handleCreateCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrop.name) return;
    addCrop({
      ...newCrop,
      color: '#227B44',
    });
    setIsAddModalOpen(false);
    showToast(`Added ${newCrop.name} successfully!`);
    setNewCrop({
      name: 'Soybean',
      variety: 'JS-335 / JS-9305',
      fieldPlot: 'Gat No. 142/2A Plot 2',
      season: 'kharif' as CropSeason,
      areaAcres: 5,
      plantingDate: new Date().toISOString().split('T')[0],
      expectedHarvestDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      status: 'growing',
      estimatedYield: 50,
      yieldUnit: 'Quintals',
      notes: '',
    });
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCrop) return;
    addCropLog({
      cropId: selectedCrop.id,
      cropName: selectedCrop.name,
      activityType: newLog.activityType,
      description: newLog.description || `${newLog.activityType} completed`,
      quantity: Number(newLog.quantity),
      unit: newLog.unit,
      appliedBy: user?.fullName || 'Sarah Jenkins',
      date: new Date().toISOString().split('T')[0],
    });
    setIsLogModalOpen(false);
    showToast('Activity logged for ' + selectedCrop.name);
  };

  const getStatusBadge = (status: CropStatus) => {
    switch (status) {
      case 'growing':
        return (
          <span className="rounded-full bg-[#E7F6ED] px-2.5 py-0.5 text-[10px] font-bold text-[#1D7A40] dark:bg-[#1E3B27] dark:text-[#4ADE80]">
            Growing
          </span>
        );
      case 'planted':
        return (
          <span className="rounded-full bg-[#FEF7E6] px-2.5 py-0.5 text-[10px] font-bold text-[#D97706] dark:bg-[#382613] dark:text-[#FBBF24]">
            Planted
          </span>
        );
      case 'harvested':
        return (
          <span className="rounded-full bg-[#EBF2EC] px-2.5 py-0.5 text-[10px] font-bold text-[#3E6547] dark:bg-[#1A2D20] dark:text-[#78A783]">
            Harvested
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-[#F3EFE7] px-2.5 py-0.5 text-[10px] font-bold text-[#556358] dark:bg-[#203023] dark:text-[#A1B2A5]">
            Fallow
          </span>
        );
    }
  };

  const totalAcres = crops.reduce((sum, c) => sum + c.areaAcres, 0);

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
            Crop Records
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#67756B] dark:text-[#97A79A]">
            Active plantings across {totalAcres} acres with vegetative growth stages and yield tracking.
          </p>
        </div>

        {user?.role !== 'worker' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[#173426] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add New Crop</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#ECE6DB] bg-white p-3 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#79857B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crop name, variety, or field plot..."
            className="w-full rounded-xl border border-[#ECE6DB] bg-[#FAF8F5] py-2 pl-9 pr-3 text-xs text-[#18251C] focus:border-[#173426] focus:bg-white focus:outline-none dark:border-[#263A2B] dark:bg-[#121D15] dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Season Filter Dropdown */}
          <select
            value={seasonFilter}
            onChange={(e) => setSeasonFilter(e.target.value)}
            className="rounded-xl border border-[#ECE6DB] bg-[#FAF8F5] px-3 py-2 text-xs font-semibold text-[#18251C] dark:border-[#263A2B] dark:bg-[#121D15] dark:text-white"
          >
            <option value="all">All Seasons</option>
            <option value="Kharif">Kharif (June–October)</option>
            <option value="Rabi">Rabi (October–March)</option>
            <option value="Zaid">Zaid (March–June)</option>
            <option value="Perennial">Annual / Perennial</option>
          </select>

          <Filter className="h-4 w-4 text-[#79857B]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[#ECE6DB] bg-[#FAF8F5] px-3 py-2 text-xs font-semibold text-[#18251C] dark:border-[#263A2B] dark:bg-[#121D15] dark:text-white"
          >
            <option value="all">All Growth Stages</option>
            <option value="growing">Growing</option>
            <option value="planted">Planted</option>
            <option value="harvested">Harvested</option>
            <option value="fallow">Fallow</option>
          </select>
        </div>
      </div>

      {/* Crops Table */}
      <div className="overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-sm dark:border-[#233528] dark:bg-[#152219]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#ECE6DB] bg-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider text-[#79857B] dark:border-[#233528] dark:bg-[#111C14] dark:text-[#8E9F92]">
              <tr>
                <th className="px-5 py-3.5">Crop & Variety</th>
                <th className="px-4 py-3.5">Season</th>
                <th className="px-4 py-3.5">Field / Plot</th>
                <th className="px-4 py-3.5">Acreage</th>
                <th className="px-4 py-3.5">Planting Date</th>
                <th className="px-4 py-3.5">Expected Harvest</th>
                <th className="px-4 py-3.5">Stage</th>
                <th className="px-4 py-3.5">Est. Yield</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE0] dark:divide-[#1F3024]">
              {filteredCrops.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-xs text-[#79857B]">
                    No crops found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredCrops.map((crop) => (
                  <tr
                    key={crop.id}
                    onClick={() => setSelectedCrop(crop)}
                    className="cursor-pointer transition-colors hover:bg-[#FBF9F4] dark:hover:bg-[#1C2C20]"
                  >
                    <td className="px-5 py-3.5 font-bold text-[#18251C] dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="h-3 w-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: crop.color || '#2E7D47' }}
                        />
                        <div>
                          <p className="font-bold text-[#18251C] dark:text-white">{crop.name}</p>
                          <p className="text-[10px] font-normal text-[#79857B]">{crop.variety}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-md bg-[#E8F5E9] px-2 py-0.5 text-[10px] font-bold text-[#1B5E20] dark:bg-[#1C3D26] dark:text-[#81C784]">
                        {crop.season || 'Kharif'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-[#49574D] dark:text-[#B1C3B4]">
                      {crop.fieldPlot}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-[#18251C] dark:text-white">
                      {crop.areaAcres} Ac
                    </td>
                    <td className="px-4 py-3.5 text-[#556358] dark:text-[#9FB1A2]">
                      {formatDateIndian(crop.plantingDate)}
                    </td>
                    <td className="px-4 py-3.5 text-[#556358] dark:text-[#9FB1A2]">
                      {formatDateIndian(crop.expectedHarvestDate)}
                    </td>
                    <td className="px-4 py-3.5">{getStatusBadge(crop.status)}</td>
                    <td className="px-4 py-3.5 font-semibold text-[#18251C] dark:text-white">
                      {crop.estimatedYield} {crop.yieldUnit}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCrop(crop);
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

      {/* Crop Detail Modal */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#ECE6DB] px-6 py-4 dark:border-[#233528]">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-2xl text-white font-bold"
                  style={{ backgroundColor: selectedCrop.color || '#173426' }}
                >
                  <Sprout className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#18251C] dark:text-white">
                    {selectedCrop.name} • {selectedCrop.variety}
                  </h3>
                  <p className="text-xs text-[#79857B] dark:text-[#8E9F92]">
                    {selectedCrop.fieldPlot} ({selectedCrop.areaAcres} Acres)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {user?.role !== 'worker' && (
                  <button
                    onClick={() => {
                      deleteCrop(selectedCrop.id);
                      setSelectedCrop(null);
                      showToast('Deleted crop record');
                    }}
                    className="p-1.5 text-[#DE5B50] hover:bg-[#FEECEC] rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setSelectedCrop(null)}
                  className="p-1.5 text-[#79857B] hover:bg-[#F3EFE7] rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-[#F8F6F1] p-3 dark:bg-[#1C2C20]">
                  <p className="text-[10px] uppercase font-bold text-[#79857B]">Planting Date</p>
                  <p className="text-xs font-bold text-[#18251C] dark:text-white mt-1">
                    {formatDateIndian(selectedCrop.plantingDate)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#F8F6F1] p-3 dark:bg-[#1C2C20]">
                  <p className="text-[10px] uppercase font-bold text-[#79857B]">Expected Harvest</p>
                  <p className="text-xs font-bold text-[#18251C] dark:text-white mt-1">
                    {formatDateIndian(selectedCrop.expectedHarvestDate)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#F8F6F1] p-3 dark:bg-[#1C2C20]">
                  <p className="text-[10px] uppercase font-bold text-[#79857B]">Projected Yield</p>
                  <p className="text-xs font-bold text-[#18251C] dark:text-white mt-1">
                    {selectedCrop.estimatedYield} {selectedCrop.yieldUnit}
                  </p>
                </div>
              </div>

              {selectedCrop.notes && (
                <div className="rounded-2xl border border-[#ECE6DB] p-3.5 text-xs text-[#526054] dark:border-[#233528] dark:text-[#A7B8AA]">
                  <p className="font-semibold text-[#18251C] dark:text-white mb-1">Agronomist Notes:</p>
                  {selectedCrop.notes}
                </div>
              )}

              {/* Logs subtable */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#18251C] dark:text-white flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#2E7D47]" />
                    <span>Application & Activity Logs</span>
                  </h4>
                  {user?.role !== 'worker' && (
                    <button
                      onClick={() => setIsLogModalOpen(true)}
                      className="rounded-full bg-[#173426] px-3 py-1 text-[11px] font-semibold text-white dark:bg-[#22C55E] dark:text-black"
                    >
                      + Add Activity
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {cropLogs
                    .filter((cl) => cl.cropId === selectedCrop.id)
                    .map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between rounded-xl border border-[#ECE6DB] p-3 text-xs dark:border-[#233528]"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#18251C] dark:text-white">
                              {log.activityType}
                            </span>
                            <span className="text-[10px] text-[#79857B]">{log.date}</span>
                          </div>
                          <p className="text-[11px] text-[#556358] dark:text-[#A7B8AA] mt-0.5">
                            {log.description}
                          </p>
                        </div>
                        <div className="text-right text-[11px] font-semibold text-[#18251C] dark:text-white">
                          {log.quantity ? `${log.quantity} ${log.unit}` : ''}
                          <span className="block text-[9px] font-normal text-[#79857B]">
                            by {log.appliedBy}
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

      {/* Modal: Add Crop */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
            <div className="flex items-center justify-between border-b border-[#ECE6DB] px-6 py-4 dark:border-[#233528]">
              <div>
                <h3 className="text-base font-bold text-[#18251C] dark:text-white">
                  Plant New Crop
                </h3>
                <p className="text-xs text-[#79857B]">Kharif, Rabi & Zaid Indian crops</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-[#79857B]" />
              </button>
            </div>

            <form onSubmit={handleCreateCrop} className="p-6 space-y-4">
              {/* Quick Select Buttons */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#79857B]">
                  Quick Pick Indian Crop
                </label>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {[
                    { name: 'Cotton', variety: 'Bt RCH-659', season: 'Kharif', yieldUnit: 'Quintals' },
                    { name: 'Soybean', variety: 'JS-335', season: 'Kharif', yieldUnit: 'Quintals' },
                    { name: 'Wheat', variety: 'Lokwan', season: 'Rabi', yieldUnit: 'Quintals' },
                    { name: 'Red Onion', variety: 'Gavran', season: 'Rabi', yieldUnit: 'Quintals' },
                    { name: 'Tur / Arhar', variety: 'BDN-711', season: 'Kharif', yieldUnit: 'Quintals' },
                    { name: 'Sugarcane', variety: 'Co-86032', season: 'Perennial', yieldUnit: 'Tons' },
                    { name: 'Chana', variety: 'Digvijay', season: 'Rabi', yieldUnit: 'Quintals' },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() =>
                        setNewCrop({
                          ...newCrop,
                          name: preset.name,
                          variety: preset.variety,
                          season: preset.season as CropSeason,
                          yieldUnit: preset.yieldUnit,
                        })
                      }
                      className="rounded-lg border border-[#D5CEC0] bg-[#FAF8F5] px-2.5 py-1 text-[11px] font-medium text-[#18251C] hover:bg-[#173426] hover:text-white dark:border-[#2C3F2E] dark:bg-[#111A13] dark:text-white"
                    >
                      {preset.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Crop Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cotton"
                    value={newCrop.name}
                    onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Variety
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bt BG II / JS-335"
                    value={newCrop.variety}
                    onChange={(e) => setNewCrop({ ...newCrop, variety: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Cropping Season
                  </label>
                  <select
                    value={newCrop.season}
                    onChange={(e) =>
                      setNewCrop({ ...newCrop, season: e.target.value as CropSeason })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  >
                    <option value="Kharif">Kharif (June–October)</option>
                    <option value="Rabi">Rabi (October–March)</option>
                    <option value="Zaid">Zaid (March–June)</option>
                    <option value="Perennial">Annual / Perennial</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Area (Acres) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newCrop.areaAcres}
                    onChange={(e) =>
                      setNewCrop({ ...newCrop, areaAcres: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Field / Plot Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gat No. 142/2A Plot 1"
                    value={newCrop.fieldPlot}
                    onChange={(e) => setNewCrop({ ...newCrop, fieldPlot: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Estimated Yield
                  </label>
                  <div className="flex gap-1.5 mt-1">
                    <input
                      type="number"
                      value={newCrop.estimatedYield}
                      onChange={(e) =>
                        setNewCrop({ ...newCrop, estimatedYield: Number(e.target.value) })
                      }
                      className="w-2/3 rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                    />
                    <select
                      value={newCrop.yieldUnit}
                      onChange={(e) => setNewCrop({ ...newCrop, yieldUnit: e.target.value })}
                      className="w-1/3 rounded-xl border border-[#D5CEC0] px-2 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                    >
                      <option value="Quintals">Qtl</option>
                      <option value="Tons">Tons</option>
                      <option value="Kg">Kg</option>
                      <option value="Crates">Crates</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Planting Date
                  </label>
                  <input
                    type="date"
                    value={newCrop.plantingDate}
                    onChange={(e) => setNewCrop({ ...newCrop, plantingDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Expected Harvest
                  </label>
                  <input
                    type="date"
                    value={newCrop.expectedHarvestDate}
                    onChange={(e) =>
                      setNewCrop({ ...newCrop, expectedHarvestDate: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#173426] py-2.5 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
              >
                Register Crop Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Crop Activity Log */}
      {isLogModalOpen && selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
            <div className="flex items-center justify-between border-b border-[#ECE6DB] px-6 py-4 dark:border-[#233528]">
              <h3 className="text-base font-bold text-[#18251C] dark:text-white">
                Log Activity for {selectedCrop.name}
              </h3>
              <button onClick={() => setIsLogModalOpen(false)}>
                <X className="h-5 w-5 text-[#79857B]" />
              </button>
            </div>

            <form onSubmit={handleAddLog} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Activity Type
                </label>
                <select
                  value={newLog.activityType}
                  onChange={(e) =>
                    setNewLog({ ...newLog, activityType: e.target.value as any })
                  }
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                >
                  <option value="Fertilizer">Fertilizer Application</option>
                  <option value="Pesticide">Pesticide / Spraying</option>
                  <option value="Irrigation">Irrigation Run</option>
                  <option value="Scouting">Crop Scouting & Pests</option>
                  <option value="Harvest">Harvest Yield</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Micronutrient zinc spray applied"
                  value={newLog.description}
                  onChange={(e) => setNewLog({ ...newLog, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={newLog.quantity}
                    onChange={(e) => setNewLog({ ...newLog, quantity: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={newLog.unit}
                    onChange={(e) => setNewLog({ ...newLog, unit: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#173426] py-2.5 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
              >
                Save Log
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
