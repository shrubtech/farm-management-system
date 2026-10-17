'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFarmStore } from '@/hooks/useFarmStore';

export function CropDonut() {
  const { crops } = useFarmStore();

  const totalAcres = crops.reduce((sum, c) => sum + c.areaAcres, 0);

  const data = crops.map((c) => ({
    name: c.name,
    value: c.areaAcres,
    percentage: Math.round((c.areaAcres / (totalAcres || 450)) * 100),
    color: c.color || '#2E7D47',
  }));

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#18251C] dark:text-white">
            Crop Distribution
          </h2>
          <span className="text-xs font-semibold text-[#7A877C] dark:text-[#8E9F92]">
            {totalAcres || 450} Total Acres
          </span>
        </div>
        <p className="mt-0.5 text-xs text-[#7A877C] dark:text-[#8E9F92]">
          Acreage occupancy & yield projection
        </p>

        {/* Donut Chart with Center Text */}
        <div className="relative mt-2 h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(val: any) => [`${val} Acres`, '']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #ECE6DB',
                  fontSize: '12px',
                }}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-[#18251C] dark:text-white">
              {totalAcres || 450}
            </span>
            <span className="text-[10px] font-bold tracking-wider text-[#7A877C] uppercase dark:text-[#8E9F92]">
              Acres Active
            </span>
          </div>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="mt-3 grid grid-cols-2 gap-y-2.5 gap-x-4 border-t border-[#F2ECE2] pt-3.5 text-xs dark:border-[#1F3024]">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-[#49574D] dark:text-[#B1C3B4] truncate">
                {item.name}
              </span>
            </div>
            <span className="text-xs font-semibold text-[#18251C] dark:text-white">
              {item.percentage}% ({item.value} Ac)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
