'use client';

import { useState, useEffect } from 'react';
import { farmStore } from '@/lib/store';

export function useFarmStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = farmStore.subscribe(() => {
      setTick((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  return {
    farm: farmStore.getFarm(),
    currentUser: farmStore.getCurrentUser(),
    users: farmStore.getUsers(),
    crops: farmStore.getCrops(),
    cropLogs: farmStore.getCropLogs(),
    livestock: farmStore.getLivestock(),
    healthRecords: farmStore.getHealthRecords(),
    inventory: farmStore.getInventory(),
    stockMovements: farmStore.getStockMovements(),
    equipment: farmStore.getEquipment(),
    maintenanceLogs: farmStore.getMaintenanceLogs(),
    tasks: farmStore.getTasks(),
    transactions: farmStore.getTransactions(),
    suppliers: farmStore.getSuppliers(),
    workers: farmStore.getWorkers(),
    attendance: farmStore.getAttendance(),
    notifications: farmStore.getNotifications(),
    fieldLogs: farmStore.getFieldLogs(),
    invites: farmStore.getInvites(),
    milkEntries: farmStore.getMilkEntries(),
    mandiPrices: farmStore.getMandiPrices(),
    schemes: farmStore.getGovernmentSchemes(),
    farmDocuments: farmStore.getFarmDocuments(),
    loans: farmStore.getLoanRecords(),

    // Action Methods
    setCurrentUserRole: (role: any) => farmStore.setCurrentUserRole(role),
    setCurrentUser: (user: any) => farmStore.setCurrentUser(user),
    updateProfile: (updates: any) => farmStore.updateProfile(updates),
    updateFarm: (updates: any) => farmStore.updateFarm(updates),
    setDefaultAreaUnit: (unit: any) => farmStore.setDefaultAreaUnit(unit),
    
    // Invites & Auth
    createInvite: (data: any) => farmStore.createInvite(data),
    revokeInvite: (id: string) => farmStore.revokeInvite(id),
    validateInviteCode: (code: string, expectedRole?: any) => farmStore.validateInviteCode(code, expectedRole),
    registerUser: (data: any) => farmStore.registerUser(data),
    addUserDirectly: (data: any) => farmStore.addUserDirectly(data),
    changePassword: (userId: string) => farmStore.changePassword(userId),
    
    // Crops
    addCrop: (crop: any) => farmStore.addCrop(crop),
    updateCrop: (id: string, updates: any) => farmStore.updateCrop(id, updates),
    deleteCrop: (id: string) => farmStore.deleteCrop(id),
    addCropLog: (log: any) => farmStore.addCropLog(log),

    // Livestock & Milk
    addLivestock: (animal: any) => farmStore.addLivestock(animal),
    updateLivestock: (id: string, updates: any) => farmStore.updateLivestock(id, updates),
    deleteLivestock: (id: string) => farmStore.deleteLivestock(id),
    addHealthRecord: (record: any) => farmStore.addHealthRecord(record),
    addMilkEntry: (entry: any) => farmStore.addMilkEntry(entry),
    deleteMilkEntry: (id: string) => farmStore.deleteMilkEntry(id),

    // Govt Schemes, Documents & Loans
    addFarmDocument: (doc: any) => farmStore.addFarmDocument(doc),
    deleteFarmDocument: (id: string) => farmStore.deleteFarmDocument(id),
    addLoanRecord: (loan: any) => farmStore.addLoanRecord(loan),
    updateLoanRecord: (id: string, updates: any) => farmStore.updateLoanRecord(id, updates),
    deleteLoanRecord: (id: string) => farmStore.deleteLoanRecord(id),

    // Inventory
    addInventoryItem: (item: any) => farmStore.addInventoryItem(item),
    updateInventoryItem: (id: string, updates: any) => farmStore.updateInventoryItem(id, updates),
    deleteInventoryItem: (id: string) => farmStore.deleteInventoryItem(id),
    recordStockMovement: (itemId: string, type: any, qty: number, reason: string) =>
      farmStore.recordStockMovement(itemId, type, qty, reason),

    // Equipment
    addEquipment: (eq: any) => farmStore.addEquipment(eq),
    updateEquipment: (id: string, updates: any) => farmStore.updateEquipment(id, updates),
    deleteEquipment: (id: string) => farmStore.deleteEquipment(id),
    addMaintenanceLog: (log: any) => farmStore.addMaintenanceLog(log),

    // Tasks
    addTask: (task: any) => farmStore.addTask(task),
    updateTaskStatus: (id: string, status: any) => farmStore.updateTaskStatus(id, status),
    updateTask: (id: string, updates: any) => farmStore.updateTask(id, updates),
    deleteTask: (id: string) => farmStore.deleteTask(id),

    // Transactions
    addTransaction: (tx: any) => farmStore.addTransaction(tx),
    deleteTransaction: (id: string) => farmStore.deleteTransaction(id),

    // Suppliers
    addSupplier: (s: any) => farmStore.addSupplier(s),
    updateSupplier: (id: string, updates: any) => farmStore.updateSupplier(id, updates),
    deleteSupplier: (id: string) => farmStore.deleteSupplier(id),

    // Workers
    addWorker: (w: any) => farmStore.addWorker(w),
    updateWorker: (id: string, updates: any) => farmStore.updateWorker(id, updates),
    markAttendance: (id: string, status: any, notes?: string) => farmStore.markAttendance(id, status, notes),

    // Notifications
    markNotificationAsRead: (id: string) => farmStore.markNotificationAsRead(id),
    markAllNotificationsAsRead: () => farmStore.markAllNotificationsAsRead(),

    // Reset
    resetToDefaults: () => farmStore.resetToDefaults(),
  };
}
