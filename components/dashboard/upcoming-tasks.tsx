'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Filter, ArrowRight, Check } from 'lucide-react';
import { useFarmStore } from '@/hooks/useFarmStore';

export function UpcomingTasks() {
  const { tasks, updateTaskStatus } = useFarmStore();
  const [filterPriority, setFilterPriority] = useState<string | null>(null);

  const filteredTasks = filterPriority
    ? tasks.filter((t) => t.priority === filterPriority)
    : tasks;

  const displayTasks = filteredTasks.slice(0, 4);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return (
          <span className="rounded-full bg-[#FEF0EC] px-2.5 py-0.5 text-[10px] font-bold text-[#DE5B50] dark:bg-[#3D1E18] dark:text-[#F87171]">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="rounded-full bg-[#FAF2E6] px-2.5 py-0.5 text-[10px] font-bold text-[#B45309] dark:bg-[#382613] dark:text-[#FBBF24]">
            Medium
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-[#EFF5F0] px-2.5 py-0.5 text-[10px] font-bold text-[#3E7B4D] dark:bg-[#1C3322] dark:text-[#86EFAC]">
            Normal
          </span>
        );
    }
  };

  const getAvatarInitials = (name: string, idx: number) => {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
    const colors = [
      'bg-[#D8F3DC] text-[#1B4332]',
      'bg-[#FFE8D6] text-[#6B4226]',
      'bg-[#E0E7FF] text-[#3730A3]',
      'bg-[#FCE7F3] text-[#831843]',
    ];
    return (
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
          colors[idx % colors.length]
        }`}
      >
        {initials}
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#18251C] dark:text-white">
              Upcoming Farm Tasks
            </h2>
            <p className="mt-0.5 text-xs text-[#7A877C] dark:text-[#8E9F92]">
              5 high-priority activities require sign-off today
            </p>
          </div>

          <button
            onClick={() =>
              setFilterPriority(filterPriority === 'high' ? null : 'high')
            }
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              filterPriority === 'high'
                ? 'border-[#DE5B50] bg-[#FEF0EC] text-[#DE5B50]'
                : 'border-[#D5CEC0] bg-white text-[#4D5A50] hover:bg-[#F8F5EE] dark:border-[#2D4032] dark:bg-[#18251C] dark:text-[#D1E0D4]'
            }`}
          >
            <Filter className="h-3 w-3" />
            <span>{filterPriority ? 'Filtered: High' : 'Filter Priority'}</span>
          </button>
        </div>

        {/* Task List */}
        <div className="mt-4 space-y-2.5">
          {displayTasks.map((task, idx) => {
            const isCompleted = task.status === 'completed';
            return (
              <div
                key={task.id}
                className={`flex items-center justify-between rounded-2xl p-3 border transition-colors ${
                  isCompleted
                    ? 'bg-[#F9F7F2] border-[#ECE6DC] opacity-75 dark:bg-[#121B14] dark:border-[#1E2E21]'
                    : 'bg-[#FCFAF6] border-[#F2ECE0] dark:bg-[#1B291F] dark:border-[#25392B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Custom Checkbox */}
                  <button
                    onClick={() =>
                      updateTaskStatus(task.id, isCompleted ? 'todo' : 'completed')
                    }
                    className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                      isCompleted
                        ? 'bg-[#173426] border-[#173426] text-white dark:bg-[#22C55E] dark:border-[#22C55E] dark:text-black'
                        : 'border-[#CBC3B5] bg-white hover:border-[#173426] dark:border-[#384C3B] dark:bg-[#142017]'
                    }`}
                  >
                    {isCompleted && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </button>

                  <div>
                    <p
                      className={`text-xs font-bold ${
                        isCompleted
                          ? 'line-through text-[#7A877C] dark:text-[#7A877C]'
                          : 'text-[#18251C] dark:text-white'
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-[11px] text-[#6A786E] dark:text-[#8E9F92]">
                      {task.relatedPlot} • Due{' '}
                      {new Date(task.dueDate).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  {getPriorityBadge(task.priority)}
                  {getAvatarInitials(task.assignedToName, idx)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-[#F2ECE2] pt-3 text-xs dark:border-[#1F3024]">
        <span className="text-[#7A877C] dark:text-[#8E9F92]">
          Showing {displayTasks.length} of {tasks.length} assigned tasks
        </span>
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1.5 font-bold text-[#18251C] hover:text-[#2E7D47] dark:text-white dark:hover:text-[#4ADE80]"
        >
          <span>View Task Board</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
