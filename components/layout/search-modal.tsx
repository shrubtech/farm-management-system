'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Sprout,
  PawPrint,
  PackageOpen,
  Tractor,
  CheckSquare,
  Users,
} from 'lucide-react';
import { useFarmStore } from '@/hooks/useFarmStore';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { crops, livestock, inventory, equipment, tasks, workers } = useFarmStore();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matches: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: string;
      link: string;
      icon: any;
    }> = [];

    // Search Crops
    crops.forEach((c) => {
      if (c.name.toLowerCase().includes(q) || c.variety.toLowerCase().includes(q) || c.fieldPlot.toLowerCase().includes(q)) {
        matches.push({
          id: c.id,
          title: c.name,
          subtitle: `${c.variety} • ${c.fieldPlot} (${c.areaAcres} Ac)`,
          category: 'Crops',
          link: '/crops',
          icon: Sprout,
        });
      }
    });

    // Search Livestock
    livestock.forEach((l) => {
      if (l.tagId.toLowerCase().includes(q) || l.breed.toLowerCase().includes(q) || l.animalType.toLowerCase().includes(q)) {
        matches.push({
          id: l.id,
          title: `${l.tagId} (${l.breed})`,
          subtitle: `${l.animalType} • ${l.pastureLocation} • Status: ${l.healthStatus}`,
          category: 'Livestock',
          link: '/livestock',
          icon: PawPrint,
        });
      }
    });

    // Search Inventory
    inventory.forEach((i) => {
      if (i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q)) {
        matches.push({
          id: i.id,
          title: i.name,
          subtitle: `${i.quantity} ${i.unit} in stock • Location: ${i.storageLocation}`,
          category: 'Inventory',
          link: '/inventory',
          icon: PackageOpen,
        });
      }
    });

    // Search Equipment
    equipment.forEach((e) => {
      if (e.name.toLowerCase().includes(q) || e.model.toLowerCase().includes(q) || e.serialNumber.toLowerCase().includes(q)) {
        matches.push({
          id: e.id,
          title: e.name,
          subtitle: `${e.model} • Status: ${e.status.replace('_', ' ')} • Operator: ${e.assignedOperator}`,
          category: 'Equipment',
          link: '/equipment',
          icon: Tractor,
        });
      }
    });

    // Search Tasks
    tasks.forEach((t) => {
      if (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || (t.relatedPlot && t.relatedPlot.toLowerCase().includes(q))) {
        matches.push({
          id: t.id,
          title: t.title,
          subtitle: `Assigned: ${t.assignedToName} • Due: ${t.dueDate} • Priority: ${t.priority}`,
          category: 'Tasks',
          link: '/tasks',
          icon: CheckSquare,
        });
      }
    });

    // Search Workers
    workers.forEach((w) => {
      if (w.fullName.toLowerCase().includes(q) || w.role.toLowerCase().includes(q) || w.email.toLowerCase().includes(q)) {
        matches.push({
          id: w.id,
          title: w.fullName,
          subtitle: `Role: ${w.role.toUpperCase()} • ${w.phone} • Status: ${w.attendanceStatus || 'Active'}`,
          category: 'Staff',
          link: '/workers',
          icon: Users,
        });
      }
    });

    return matches.slice(0, 10);
  }, [query, crops, livestock, inventory, equipment, tasks, workers]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 pt-16 sm:pt-24 animate-in fade-in">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
        {/* Search Input Box */}
        <div className="relative flex items-center border-b border-[#ECE6DB] px-4 py-3 dark:border-[#233528]">
          <Search className="h-5 w-5 text-[#79857B] dark:text-[#8E9F92]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search crops, animals, equipment, inventory, tasks..."
            className="w-full bg-transparent px-3 text-sm font-medium text-[#18251C] placeholder-[#79857B] focus:outline-none dark:text-white dark:placeholder-[#8E9F92]"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-[#79857B]">
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 rounded-lg bg-[#F4EFEB] px-2 py-1 text-[10px] font-semibold text-[#576459] hover:bg-[#EAE4DC] dark:bg-[#1F2F23] dark:text-[#A7B8AA]"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3">
          {query.trim() === '' ? (
            <div className="py-8 text-center">
              <p className="text-xs font-medium text-[#79857B] dark:text-[#8E9F92]">
                Type keywords like &quot;Corn&quot;, &quot;Tractor&quot;, &quot;Urea&quot;, &quot;Dairy&quot;, or &quot;Pivot&quot;
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-xs text-[#79857B] dark:text-[#8E9F92]">
                No matching farm records found for &quot;{query}&quot;.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {results.map((res) => {
                const Icon = res.icon;
                return (
                  <button
                    key={`${res.category}-${res.id}`}
                    onClick={() => {
                      onClose();
                      router.push(res.link);
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors hover:bg-[#F8F5EE] dark:hover:bg-[#1F2F23]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0EAE0] text-[#173426] dark:bg-[#203426] dark:text-[#22C55E]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-xs font-semibold text-[#18251C] dark:text-white">
                          {res.title}
                        </p>
                        <span className="rounded-md bg-[#ECE6DB] px-1.5 py-0.5 text-[9px] font-semibold uppercase text-[#546256] dark:bg-[#283C2D] dark:text-[#90A594]">
                          {res.category}
                        </span>
                      </div>
                      <p className="truncate text-[11px] text-[#6A786E] dark:text-[#8E9F92]">
                        {res.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
