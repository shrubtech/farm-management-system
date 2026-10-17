'use client';

import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Kanban,
  List,
  Calendar,
  Clock,
  User,
  ArrowRight,
  X,
  Check,
  Trash2,
  AlertCircle,
  GripVertical,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { useFarmStore } from '@/hooks/useFarmStore';
import { useAuth } from '@/components/auth-provider';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { formatDate } from '@/lib/utils';

export default function TasksPage() {
  const { tasks, addTask, updateTaskStatus, updateTask, deleteTask, workers, crops, livestock } =
    useFarmStore();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'high' as TaskPriority,
    status: 'todo' as TaskStatus,
    assignedToName: workers[0]?.fullName || 'Marcus Johnson',
    dueDate: new Date().toISOString(),
    relatedPlot: 'Plot B-2 (Sweet Corn)',
    relatedCropName: 'Corn',
    progressPercentage: 0,
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const targetStatus = over.id as TaskStatus;

    if (['todo', 'in_progress', 'completed'].includes(targetStatus)) {
      updateTaskStatus(taskId, targetStatus);
      showToast(`Task moved to ${targetStatus.replace('_', ' ').toUpperCase()}`);
    }
  };

  // Filter tasks based on role: workers see only their assigned tasks
  const visibleTasks = useMemo(() => {
    let result = tasks;
    if (user?.role === 'worker') {
      result = result.filter(
        (t) =>
          t.assignedToName.toLowerCase().includes(user.fullName.toLowerCase()) ||
          t.assignedToId === user.id
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.assignedToName.toLowerCase().includes(q) ||
          (t.relatedPlot && t.relatedPlot.toLowerCase().includes(q))
      );
    }

    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    return result;
  }, [tasks, user, search, priorityFilter]);

  const todoTasks = visibleTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = visibleTasks.filter((t) => t.status === 'in_progress');
  const completedTasks = visibleTasks.filter((t) => t.status === 'completed');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    const workerObj = workers.find((w) => w.fullName === newTask.assignedToName);
    addTask({
      ...newTask,
      assignedToId: workerObj?.id || 'worker-id',
      completed: newTask.status === 'completed',
    });
    setIsAddModalOpen(false);
    showToast(`Created task: ${newTask.title}`);
    setNewTask({
      title: '',
      description: '',
      priority: 'high',
      status: 'todo',
      assignedToName: workers[0]?.fullName || 'Marcus Johnson',
      dueDate: new Date().toISOString(),
      relatedPlot: 'Plot B-2 (Sweet Corn)',
      relatedCropName: 'Corn',
      progressPercentage: 0,
    });
  };

  const getPriorityBadge = (priority: TaskPriority) => {
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
            Tasks & Work Orders
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#67756B] dark:text-[#97A79A]">
            Real-time drag-and-drop Kanban dispatch board synced with farm telemetry and worker rosters.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-full bg-[#173426] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#ECE6DB] bg-white p-3 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#79857B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks, descriptions, workers, or plots..."
            className="w-full rounded-xl border border-[#ECE6DB] bg-[#FAF8F5] py-2 pl-9 pr-3 text-xs text-[#18251C] focus:border-[#173426] focus:bg-white focus:outline-none dark:border-[#263A2B] dark:bg-[#121D15] dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-[#ECE6DB] bg-[#FAF8F5] px-3 py-2 text-xs font-semibold text-[#18251C] dark:border-[#263A2B] dark:bg-[#121D15] dark:text-white"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="normal">Normal</option>
          </select>

          {/* Kanban / List Toggle */}
          <div className="flex rounded-xl border border-[#ECE6DB] p-0.5 dark:border-[#263A2B]">
            <button
              onClick={() => setViewMode('kanban')}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-[#173426] text-white dark:bg-[#22C55E] dark:text-black'
                  : 'text-[#79857B]'
              }`}
            >
              <Kanban className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#173426] text-white dark:bg-[#22C55E] dark:text-black'
                  : 'text-[#79857B]'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* VIEW: KANBAN BOARD */}
      {viewMode === 'kanban' ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* COLUMN 1: TO DO */}
            <div
              id="todo"
              className="flex flex-col rounded-3xl border border-[#ECE6DB] bg-[#FAF8F4] p-4 dark:border-[#233528] dark:bg-[#121D15]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DB] dark:border-[#233528]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#DE5B50]" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#18251C] dark:text-white">
                    To Do
                  </h3>
                </div>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-[#18251C] shadow-sm dark:bg-[#1E2E22] dark:text-white">
                  {todoTasks.length}
                </span>
              </div>

              <div className="mt-3 space-y-3 min-h-[350px]">
                {todoTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onSelect={() => setSelectedTask(task)}
                    onStatusChange={(status) => updateTaskStatus(task.id, status)}
                  />
                ))}
              </div>
            </div>

            {/* COLUMN 2: IN PROGRESS */}
            <div
              id="in_progress"
              className="flex flex-col rounded-3xl border border-[#ECE6DB] bg-[#FAF8F4] p-4 dark:border-[#233528] dark:bg-[#121D15]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DB] dark:border-[#233528]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#E7AC38]" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#18251C] dark:text-white">
                    In Progress
                  </h3>
                </div>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-[#18251C] shadow-sm dark:bg-[#1E2E22] dark:text-white">
                  {inProgressTasks.length}
                </span>
              </div>

              <div className="mt-3 space-y-3 min-h-[350px]">
                {inProgressTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onSelect={() => setSelectedTask(task)}
                    onStatusChange={(status) => updateTaskStatus(task.id, status)}
                  />
                ))}
              </div>
            </div>

            {/* COLUMN 3: COMPLETED */}
            <div
              id="completed"
              className="flex flex-col rounded-3xl border border-[#ECE6DB] bg-[#FAF8F4] p-4 dark:border-[#233528] dark:bg-[#121D15]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DB] dark:border-[#233528]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#18251C] dark:text-white">
                    Completed
                  </h3>
                </div>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-[#18251C] shadow-sm dark:bg-[#1E2E22] dark:text-white">
                  {completedTasks.length}
                </span>
              </div>

              <div className="mt-3 space-y-3 min-h-[350px]">
                {completedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onSelect={() => setSelectedTask(task)}
                    onStatusChange={(status) => updateTaskStatus(task.id, status)}
                  />
                ))}
              </div>
            </div>
          </div>
        </DndContext>
      ) : (
        /* VIEW: LIST */
        <div className="overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-sm dark:border-[#233528] dark:bg-[#152219]">
          <div className="divide-y divide-[#F2ECE0] dark:divide-[#1F3024]">
            {visibleTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#FBF9F4] dark:hover:bg-[#1C2C20] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateTaskStatus(
                        task.id,
                        task.status === 'completed' ? 'todo' : 'completed'
                      );
                    }}
                    className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                      task.status === 'completed'
                        ? 'bg-[#173426] border-[#173426] text-white dark:bg-[#22C55E] dark:text-black'
                        : 'border-[#CBC3B5] bg-white'
                    }`}
                  >
                    {task.status === 'completed' && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </button>

                  <div>
                    <h4
                      className={`text-xs font-bold ${
                        task.status === 'completed' ? 'line-through text-[#79857B]' : 'text-[#18251C] dark:text-white'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-[#6A786E] dark:text-[#8E9F92]">
                      {task.relatedPlot} • Assigned: {task.assignedToName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getPriorityBadge(task.priority)}
                  <span className="text-xs font-semibold capitalize text-[#556358] dark:text-[#9FB1A2]">
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: New Task */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
            <div className="flex items-center justify-between border-b border-[#ECE6DB] px-6 py-4 dark:border-[#233528]">
              <h3 className="text-base font-bold text-[#18251C] dark:text-white">Create Farm Task</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-[#79857B]" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inspect South Pivot Irrigation Lines"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] p-3 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Assign Worker
                  </label>
                  <select
                    value={newTask.assignedToName}
                    onChange={(e) => setNewTask({ ...newTask, assignedToName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  >
                    {workers.map((w) => (
                      <option key={w.id} value={w.fullName}>
                        {w.fullName} ({w.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value as TaskPriority })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Plot / Field Location
                  </label>
                  <input
                    type="text"
                    value={newTask.relatedPlot}
                    onChange={(e) => setNewTask({ ...newTask, relatedPlot: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Initial Status
                  </label>
                  <select
                    value={newTask.status}
                    onChange={(e) =>
                      setNewTask({ ...newTask, status: e.target.value as TaskStatus })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#173426] py-2.5 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
            <div className="flex items-center justify-between border-b border-[#ECE6DB] px-6 py-4 dark:border-[#233528]">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-[#2E7D47]" />
                <h3 className="text-base font-bold text-[#18251C] dark:text-white">Task Details</h3>
              </div>
              <button onClick={() => setSelectedTask(null)}>
                <X className="h-5 w-5 text-[#79857B]" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-bold text-sm text-[#18251C] dark:text-white">
                  {selectedTask.title}
                </h4>
                <p className="mt-1 text-xs text-[#526054] dark:text-[#A7B8AA]">
                  {selectedTask.description}
                </p>
              </div>

              <div className="rounded-2xl bg-[#F8F6F1] p-3 space-y-2 text-xs dark:bg-[#1C2C20]">
                <div className="flex justify-between">
                  <span className="text-[#79857B]">Assigned To:</span>
                  <span className="font-bold text-[#18251C] dark:text-white">
                    {selectedTask.assignedToName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#79857B]">Location:</span>
                  <span className="font-bold text-[#18251C] dark:text-white">
                    {selectedTask.relatedPlot || 'Oakridge Center'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#79857B]">Status:</span>
                  <span className="font-bold capitalize text-[#18251C] dark:text-white">
                    {selectedTask.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Status Switcher */}
              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Change Status
                </label>
                <div className="mt-1 grid grid-cols-3 gap-2">
                  {(['todo', 'in_progress', 'completed'] as TaskStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updateTaskStatus(selectedTask.id, st);
                        setSelectedTask({ ...selectedTask, status: st });
                        showToast(`Status updated to ${st.replace('_', ' ')}`);
                      }}
                      className={`rounded-xl py-2 text-xs font-semibold capitalize transition-colors ${
                        selectedTask.status === st
                          ? 'bg-[#173426] text-white dark:bg-[#22C55E] dark:text-black'
                          : 'bg-[#F2ECE0] text-[#4F5D52] hover:bg-[#EAE2D4] dark:bg-[#1C2B20] dark:text-[#D1E0D4]'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-[#ECE6DB] dark:border-[#233528]">
                <button
                  onClick={() => {
                    deleteTask(selectedTask.id);
                    setSelectedTask(null);
                    showToast('Task deleted');
                  }}
                  className="text-xs text-[#DE5B50] hover:underline"
                >
                  Delete Task
                </button>

                <button
                  onClick={() => setSelectedTask(null)}
                  className="rounded-xl bg-[#173426] px-4 py-2 text-xs font-bold text-white dark:bg-[#22C55E] dark:text-black"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Single Draggable Task Card in Kanban
function TaskCard({
  task,
  onSelect,
  onStatusChange,
}: {
  task: Task;
  onSelect: () => void;
  onStatusChange: (status: TaskStatus) => void;
}) {
  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return (
          <span className="rounded-full bg-[#FEF0EC] px-2 py-0.5 text-[9px] font-bold text-[#DE5B50]">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="rounded-full bg-[#FAF2E6] px-2 py-0.5 text-[9px] font-bold text-[#B45309]">
            Med
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-[#EFF5F0] px-2 py-0.5 text-[9px] font-bold text-[#3E7B4D]">
            Norm
          </span>
        );
    }
  };

  return (
    <div
      onClick={onSelect}
      className="group cursor-pointer rounded-2xl border border-[#ECE6DB] bg-white p-3.5 shadow-sm transition-all hover:shadow-md dark:border-[#233528] dark:bg-[#162319]"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-bold text-xs text-[#18251C] dark:text-white leading-snug line-clamp-2">
          {task.title}
        </h4>
        {getPriorityBadge(task.priority)}
      </div>

      <p className="mt-1 text-[11px] text-[#6A786E] dark:text-[#8E9F92] line-clamp-2">
        {task.description}
      </p>

      <div className="mt-3 flex items-center justify-between border-t border-[#F2ECE0] pt-2 text-[10px] text-[#79857B] dark:border-[#1F3024]">
        <div className="flex items-center gap-1.5">
          <User className="h-3 w-3" />
          <span className="font-medium text-[#18251C] dark:text-white">
            {task.assignedToName.split(' ')[0]}
          </span>
        </div>
        <span>{task.relatedPlot || 'Field B'}</span>
      </div>
    </div>
  );
}
