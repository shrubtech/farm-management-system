'use client';

import React from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  CheckCircle,
  Sun,
  Cloud,
  CloudRain,
  Tractor,
} from 'lucide-react';

export function TelemetryCard() {
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-[#2E7D47] dark:text-[#4ADE80]" />
            <h2 className="text-base font-bold text-[#18251C] dark:text-white">
              Field Telemetry & Atmosphere
            </h2>
          </div>
          <span className="rounded-full bg-[#E7F6ED] px-2.5 py-0.5 text-[10px] font-bold text-[#1D7A40] dark:bg-[#1E3B27] dark:text-[#4ADE80]">
            Plot Sensor Grid Live
          </span>
        </div>
        <p className="mt-0.5 text-xs text-[#7A877C] dark:text-[#8E9F92]">
          Real-time micrometeorological array (Oakridge Center)
        </p>

        {/* 4 Sensors Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-[#F8F6F1] p-3 text-left dark:bg-[#1C2C20]">
            <p className="text-[11px] font-medium text-[#7A877C] dark:text-[#8E9F92]">Air Temp</p>
            <p className="mt-0.5 text-xl font-extrabold text-[#18251C] dark:text-white">24°C</p>
            <p className="mt-0.5 text-[10px] text-[#7A877C] dark:text-[#8E9F92]">High: 27°C</p>
          </div>

          <div className="rounded-2xl bg-[#F8F6F1] p-3 text-left dark:bg-[#1C2C20]">
            <p className="text-[11px] font-medium text-[#7A877C] dark:text-[#8E9F92]">Humidity</p>
            <p className="mt-0.5 text-xl font-extrabold text-[#18251C] dark:text-white">62%</p>
            <p className="mt-0.5 text-[10px] text-[#7A877C] dark:text-[#8E9F92]">Moderate</p>
          </div>

          <div className="rounded-2xl bg-[#F8F6F1] p-3 text-left dark:bg-[#1C2C20]">
            <p className="text-[11px] font-medium text-[#7A877C] dark:text-[#8E9F92]">Wind Vector</p>
            <p className="mt-0.5 text-xl font-extrabold text-[#18251C] dark:text-white">11 km/h</p>
            <p className="mt-0.5 text-[10px] text-[#7A877C] dark:text-[#8E9F92]">Direction NW</p>
          </div>

          <div className="rounded-2xl bg-[#F8F6F1] p-3 text-left dark:bg-[#1C2C20]">
            <p className="text-[11px] font-medium text-[#7A877C] dark:text-[#8E9F92]">Soil Moisture</p>
            <p className="mt-0.5 text-xl font-extrabold text-[#18251C] dark:text-white">38%</p>
            <p className="mt-0.5 text-[10px] font-bold text-[#228445] dark:text-[#4ADE80]">
              Optimal Zone
            </p>
          </div>
        </div>

        {/* Spraying Condition Recommendation Banner */}
        <div className="mt-3.5 flex items-center justify-between rounded-2xl bg-[#EDF6EE] p-3.5 dark:bg-[#1B3524]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#227B44] shadow-sm dark:bg-[#23422E] dark:text-[#4ADE80]">
              <Tractor className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#18251C] dark:text-white">
                Spraying Condition: Ideal Window
              </p>
              <p className="text-[11px] text-[#55695A] dark:text-[#A7BAAB]">
                Recommended before wind pick-up at 4:00 PM
              </p>
            </div>
          </div>
          <CheckCircle className="h-5 w-5 text-[#227B44] dark:text-[#4ADE80]" />
        </div>
      </div>

      {/* 3-day weather strip footer */}
      <div className="mt-4 flex items-center justify-between border-t border-[#F2ECE2] pt-3 text-xs dark:border-[#1F3024]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#18251C] dark:text-white">Thu</span>
          <Sun className="h-3.5 w-3.5 text-[#E7AC38]" />
          <span className="text-[#647266] dark:text-[#8FA193]">26° / 17°</span>
          <span className="text-[10px] text-[#869689]">(0% rain)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#18251C] dark:text-white">Fri</span>
          <Cloud className="h-3.5 w-3.5 text-[#7A877C]" />
          <span className="text-[#647266] dark:text-[#8FA193]">23° / 16°</span>
          <span className="text-[10px] text-[#869689]">(20% rain)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#18251C] dark:text-white">Sat</span>
          <CloudRain className="h-3.5 w-3.5 text-[#3B82F6]" />
          <span className="text-[#647266] dark:text-[#8FA193]">21° / 14°</span>
          <span className="text-[10px] font-medium text-[#2E7D47] dark:text-[#4ADE80]">
            (85% rain - 12mm)
          </span>
        </div>
      </div>
    </div>
  );
}
