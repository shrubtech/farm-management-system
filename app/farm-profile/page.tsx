'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Building2,
  MapPin,
  Maximize2,
  Layers,
  Sprout,
  Upload,
  Edit2,
  Check,
  Users,
  ShieldCheck,
  Compass,
  Droplets,
  Scale,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { useFarmStore } from '@/hooks/useFarmStore';
import { useAuth } from '@/components/auth-provider';
import { AreaUnit, IrrigationType, FarmerCategory } from '@/types';
import { convertArea, formatAreaWithUnit } from '@/lib/units';

export default function FarmProfilePage() {
  const { farm, updateFarm, setDefaultAreaUnit, workers } = useFarmStore();
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: farm.name,
    ownerName: farm.ownerName,
    location: farm.location,
    village: farm.village || 'Pimpalgaon Baswant',
    taluka: farm.taluka || 'Niphad',
    district: farm.district || 'Nashik',
    state: farm.state || 'Maharashtra',
    pincode: farm.pincode || '422209',
    surveyNumber: farm.surveyNumber || 'Gat No. 142/2A',
    satbara712: farm.satbara712 || 'MH-NSK-142',
    latitude: farm.latitude,
    longitude: farm.longitude,
    totalAreaAcres: farm.totalAreaAcres,
    defaultAreaUnit: (farm.defaultAreaUnit || 'acre') as AreaUnit,
    soilType: farm.soilType || 'Black Cotton (Regur)',
    farmType: farm.farmType || 'Diversified Cash Crops, Horticulture & Desi Dairy',
    irrigationType: (farm.irrigationType || 'drip') as IrrigationType,
    farmerCategory: (farm.farmerCategory || 'small') as FarmerCategory,
  });
  const [logoPreview, setLogoPreview] = useState(farm.logoUrl || '');
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateFarm({
      ...formData,
      logoUrl: logoPreview,
    });
    setDefaultAreaUnit(formData.defaultAreaUnit);
    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };

  // Live Unit Conversion Calculations for 25 Acres
  const gunthaValue = convertArea(formData.totalAreaAcres, 'acre', 'guntha');
  const hectareValue = convertArea(formData.totalAreaAcres, 'acre', 'hectare');
  const bighaValue = convertArea(formData.totalAreaAcres, 'acre', 'bigha');

  return (
    <div className="space-y-6 pb-12">
      {/* Toast */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#173426] px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-in fade-in">
          <Check className="h-4 w-4 text-[#22C55E]" />
          <span>Farm Profile updated successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-[#18251C] dark:text-white">
            Farm Profile & Land Records
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#67756B] dark:text-[#97A79A]">
            Comprehensive operational parameters, Gat/Survey land records, soil type and irrigation geography.
          </p>
        </div>

        {user?.role !== 'worker' && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-2 rounded-full border border-[#D5CEC0] bg-white px-4 py-2 text-xs font-semibold text-[#18251C] shadow-sm hover:bg-[#F8F5EE] dark:border-[#2D4032] dark:bg-[#162319] dark:text-white"
          >
            <Edit2 className="h-3.5 w-3.5 text-[#5D6B60]" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        )}
      </div>

      {/* Farm Banner & Overview Card */}
      <div className="relative overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-sm dark:border-[#233528] dark:bg-[#152219]">
        {/* Banner image */}
        <div className="relative h-44 w-full bg-gradient-to-r from-[#173426] via-[#204533] to-[#2E7D47]">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* Floating Farm Info */}
        <div className="px-6 pb-6 pt-0 sm:flex sm:items-end sm:justify-between">
          <div className="flex items-end gap-4 -mt-12 sm:-mt-14">
            <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-3xl border-4 border-white bg-[#FAF8F3] shadow-lg dark:border-[#152219] dark:bg-[#1F3124] overflow-hidden">
              {logoPreview ? (
                <Image src={logoPreview} alt="Farm Logo" fill className="object-cover" />
              ) : (
                <Building2 className="h-12 w-12 text-[#2E7D47] dark:text-[#4ADE80]" />
              )}
            </div>

            <div className="mb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-[#18251C] dark:text-white">
                  {farm.name}
                </h2>
                <span className="rounded-full bg-[#E8F5E9] px-2.5 py-0.5 text-[10px] font-bold text-[#1B5E20] dark:bg-[#1E3E26] dark:text-[#4ADE80]">
                  NPOP Organic
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-xs text-[#6A786E] dark:text-[#8E9F92] mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-[#22C55E]" />
                <span>
                  {farm.village}, {farm.taluka}, {farm.district}, {farm.state} - {farm.pincode}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-4 text-xs font-medium text-[#6A786E] dark:text-[#8E9F92]">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#79857B]">
                Registered Owner
              </span>
              <span className="font-bold text-[#18251C] dark:text-white">{farm.ownerName}</span>
            </div>
            <div className="h-8 w-px bg-[#ECE6DB] dark:bg-[#233528]" />
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#79857B]">
                7/12 Satbara Extract
              </span>
              <span className="font-bold text-[#18251C] dark:text-white">
                {farm.satbara712} ({farm.surveyNumber})
              </span>
            </div>
            <div className="h-8 w-px bg-[#ECE6DB] dark:bg-[#233528]" />
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#79857B]">
                Total Land Holding
              </span>
              <span className="font-bold text-[#18251C] dark:text-white">
                {farm.totalAreaAcres} Acres ({gunthaValue.toFixed(0)} Gunthas)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Area Conversions Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-3xl border border-[#ECE6DB] bg-white p-4 shadow-xs dark:border-[#233528] dark:bg-[#162319]">
        <div className="rounded-2xl bg-[#FAF8F5] p-3 text-center dark:bg-[#111A13]">
          <span className="text-[10px] font-bold uppercase text-[#79857B]">Acres</span>
          <div className="text-base font-extrabold text-[#173426] dark:text-[#22C55E]">
            {farm.totalAreaAcres} Acres
          </div>
        </div>
        <div className="rounded-2xl bg-[#FAF8F5] p-3 text-center dark:bg-[#111A13]">
          <span className="text-[10px] font-bold uppercase text-[#79857B]">Gunthas</span>
          <div className="text-base font-extrabold text-[#173426] dark:text-[#22C55E]">
            {gunthaValue.toFixed(0)} Gunthas
          </div>
        </div>
        <div className="rounded-2xl bg-[#FAF8F5] p-3 text-center dark:bg-[#111A13]">
          <span className="text-[10px] font-bold uppercase text-[#79857B]">Hectares</span>
          <div className="text-base font-extrabold text-[#173426] dark:text-[#22C55E]">
            {hectareValue.toFixed(2)} Ha
          </div>
        </div>
        <div className="rounded-2xl bg-[#FAF8F5] p-3 text-center dark:bg-[#111A13]">
          <span className="text-[10px] font-bold uppercase text-[#79857B]">Bighas</span>
          <div className="text-base font-extrabold text-[#173426] dark:text-[#22C55E]">
            {bighaValue.toFixed(1)} Bighas
          </div>
        </div>
      </div>

      {/* Profile Form (if Editing) or Parameter Grid */}
      {isEditing ? (
        <form
          onSubmit={handleSave}
          className="rounded-3xl border border-[#ECE6DB] bg-white p-6 shadow-sm dark:border-[#233528] dark:bg-[#152219] space-y-4"
        >
          <h3 className="text-sm font-bold text-[#18251C] dark:text-white border-b border-[#ECE6DB] pb-3 dark:border-[#233528]">
            Edit Farm Details & Land Records
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                Farm Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                Owner Full Name
              </label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                Survey / Gat Number
              </label>
              <input
                type="text"
                required
                value={formData.surveyNumber}
                onChange={(e) => setFormData({ ...formData, surveyNumber: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                7/12 Extract Number
              </label>
              <input
                type="text"
                required
                value={formData.satbara712}
                onChange={(e) => setFormData({ ...formData, satbara712: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                Village
              </label>
              <input
                type="text"
                required
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                Taluka
              </label>
              <input
                type="text"
                required
                value={formData.taluka}
                onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                District
              </label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                State
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                Pincode
              </label>
              <input
                type="text"
                required
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                Total Area (Acres)
              </label>
              <input
                type="number"
                required
                value={formData.totalAreaAcres}
                onChange={(e) =>
                  setFormData({ ...formData, totalAreaAcres: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                Default Area Unit
              </label>
              <select
                value={formData.defaultAreaUnit}
                onChange={(e) =>
                  setFormData({ ...formData, defaultAreaUnit: e.target.value as AreaUnit })
                }
                className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
              >
                <option value="acre">Acre</option>
                <option value="guntha">Guntha</option>
                <option value="hectare">Hectare</option>
                <option value="bigha">Bigha</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                Soil Classification
              </label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
              >
                <option value="Black Cotton (Regur)">
                  Black Cotton (Regur)
                </option>
                <option value="Red Soil">Red Soil</option>
                <option value="Alluvial Soil">Alluvial Soil</option>
                <option value="Laterite Soil">Laterite Soil</option>
                <option value="Sandy Loam">Sandy Loam</option>
                <option value="Clay Loam">Clay Loam</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                Irrigation System
              </label>
              <select
                value={formData.irrigationType}
                onChange={(e) =>
                  setFormData({ ...formData, irrigationType: e.target.value as IrrigationType })
                }
                className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
              >
                <option value="drip">Drip Irrigation</option>
                <option value="sprinkler">Sprinkler</option>
                <option value="borewell">Borewell</option>
                <option value="canal">Canal</option>
                <option value="farm_pond">Farm Pond</option>
                <option value="rainfed">Rainfed</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                Farmer Category
              </label>
              <select
                value={formData.farmerCategory}
                onChange={(e) =>
                  setFormData({ ...formData, farmerCategory: e.target.value as FarmerCategory })
                }
                className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
              >
                <option value="marginal">Marginal (&lt; 1 Hectare / 2.5 Ac)</option>
                <option value="small">Small (1-2 Hectares / 2.5 - 5 Ac)</option>
                <option value="medium">Medium (2-10 Hectares / 5 - 25 Ac)</option>
                <option value="large">Large (&gt; 10 Hectares / 25+ Ac)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                Farm Cropping Pattern
              </label>
              <input
                type="text"
                value={formData.farmType}
                onChange={(e) => setFormData({ ...formData, farmType: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#ECE6DB] dark:border-[#233528]">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-xl border border-[#D5CEC0] px-4 py-2 text-xs font-semibold text-[#18251C] hover:bg-[#F8F5EE] dark:border-[#2D4032] dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#173426] px-5 py-2 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Agronomy & Geography */}
          <div className="rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
            <div className="flex items-center gap-2 mb-3">
              <Compass className="h-4 w-4 text-[#2E7D47] dark:text-[#4ADE80]" />
              <h3 className="text-sm font-bold text-[#18251C] dark:text-white">
                Agronomy & Coordinates
              </h3>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[10px] uppercase font-semibold text-[#79857B]">
                  GPS Coordinates
                </p>
                <p className="font-semibold text-[#18251C] dark:text-white">
                  {farm.latitude.toFixed(4)}° N, {farm.longitude.toFixed(4)}° E (Nashik, MH)
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-[#79857B]">
                  Soil Classification
                </p>
                <p className="font-semibold text-[#18251C] dark:text-white">{farm.soilType}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-[#79857B]">
                  Irrigation System
                </p>
                <p className="font-semibold text-[#18251C] dark:text-white capitalize">
                  {farm.irrigationType}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-[#79857B]">Farm System</p>
                <p className="font-semibold text-[#18251C] dark:text-white">{farm.farmType}</p>
              </div>
            </div>
          </div>

          {/* Card 2: Operations & Compliance */}
          <div className="rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-4 w-4 text-[#2E7D47] dark:text-[#4ADE80]" />
              <h3 className="text-sm font-bold text-[#18251C] dark:text-white">
                Certifications & Compliance
              </h3>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-[#F8F6F1] p-2.5 dark:bg-[#1C2C20]">
                <span className="font-medium text-[#18251C] dark:text-white">
                  NPOP Indian Organic
                </span>
                <span className="rounded-md bg-[#E8F5E9] px-2 py-0.5 text-[10px] font-bold text-[#1B5E20] dark:bg-[#1B3624] dark:text-[#4ADE80]">
                  Active (2026)
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#F8F6F1] p-2.5 dark:bg-[#1C2C20]">
                <span className="font-medium text-[#18251C] dark:text-white">PGS-India Green</span>
                <span className="rounded-md bg-[#E8F5E9] px-2 py-0.5 text-[10px] font-bold text-[#1B5E20] dark:bg-[#1B3624] dark:text-[#4ADE80]">
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#F8F6F1] p-2.5 dark:bg-[#1C2C20]">
                <span className="font-medium text-[#18251C] dark:text-white">
                  FSSAI Food Safety Lic.
                </span>
                <span className="rounded-md bg-[#E8F5E9] px-2 py-0.5 text-[10px] font-bold text-[#1B5E20] dark:bg-[#1B3624] dark:text-[#4ADE80]">
                  Valid (11523034000122)
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Key Personnel */}
          <div className="rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-[#2E7D47] dark:text-[#4ADE80]" />
              <h3 className="text-sm font-bold text-[#18251C] dark:text-white">
                Farm Roster ({workers.length})
              </h3>
            </div>
            <div className="space-y-2">
              {workers.slice(0, 3).map((w) => (
                <div key={w.id} className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-[#18251C] dark:text-white">{w.fullName}</p>
                    <p className="text-[10px] text-[#79857B]">{w.phone || w.email}</p>
                  </div>
                  <span className="rounded-lg bg-[#F0EAE0] px-2 py-0.5 text-[10px] font-bold uppercase text-[#173426] dark:bg-[#223528] dark:text-[#4ADE80]">
                    {w.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
