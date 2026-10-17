'use client';

import React from 'react';
import { Droplet, Truck, Cpu, FileText } from 'lucide-react';
import { useFarmStore } from '@/hooks/useFarmStore';

export function FieldLogs() {
  const { fieldLogs } = useFarmStore();

  const getLogIcon = (module: string) => {
    switch (module) {
      case 'Irrigation':
      case 'Crops':
        return {
          icon: Droplet,
          bg: 'bg-[#E7F6ED] text-[#227B44] dark:bg-[#1C3625] dark:text-[#4ADE80]',
        };
      case 'Logistics':
      case 'Inventory':
        return {
          icon: Truck,
          bg: 'bg-[#FDF3E7] text-[#D97706] dark:bg-[#342413] dark:text-[#FBBF24]',
        };
      case 'IoT Mesh':
      case 'Telemetry':
        return {
          icon: Cpu,
          bg: 'bg-[#173426] text-[#22C55E] dark:bg-[#203D2A] dark:text-[#4ADE80]',
        };
      default:
        return {
          icon: FileText,
          bg: 'bg-[#EBF2EC] text-[#3E6547] dark:bg-[#1A2D20] dark:text-[#78A783]',
        };
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#18251C] dark:text-white">
              Recent Field Logs
            </h2>
            <span className="flex h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
          </div>
        </div>
        <p className="mt-0.5 text-xs text-[#7A877C] dark:text-[#8E9F92]">
          Continuous audit stream
        </p>

        {/* Audit Log Stream */}
        <div className="mt-4 space-y-3">
          {fieldLogs.slice(0, 4).map((log) => {
            const { icon: Icon, bg } = getLogIcon(log.module);
            return (
              <div key={log.id} className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${bg}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#18251C] dark:text-white leading-snug">
                    <strong className="font-bold text-[#18251C] dark:text-white">
                      {log.userName}
                    </strong>{' '}
                    {log.action}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#7A877C] dark:text-[#8E9F92]">
                    {log.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
