/**
 * useHistory Hook
 * 
 * Manages journal entry history:
 * - Get all entries
 * - Get recent entries
 * - Delete entries
 * - Export data
 */

import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import StorageService from '../services/StorageService';
import ErrorHandlingService from '../services/ErrorHandlingService';

export function useHistory() {
  const { entries, refreshEntries } = useContext(AppContext);

  const getRecentEntries = (count = 10) => {
    return StorageService.getRecentEntries(count);
  };

  const getEntriesByDateRange = (startDate, endDate) => {
    return StorageService.getEntriesByDateRange(startDate, endDate);
  };

  const deleteEntry = (id) => {
    const result = StorageService.deleteEntry(id);
    
    if (result.success) {
      refreshEntries();
      ErrorHandlingService.showSuccessToast('Entry deleted');
      return { success: true };
    } else {
      ErrorHandlingService.handleStorageError({ message: result.error });
      return { success: false, error: result.error };
    }
  };

  const clearAllEntries = () => {
    const result = StorageService.clearAllEntries();
    
    if (result.success) {
      refreshEntries();
      ErrorHandlingService.showSuccessToast('All entries cleared');
      return { success: true };
    } else {
      ErrorHandlingService.handleStorageError({ message: result.error });
      return { success: false, error: result.error };
    }
  };

  const exportAsJSON = () => {
    try {
      const json = StorageService.exportAsJSON();
      downloadFile(json, 'mindmirror-export.json', 'application/json');
      ErrorHandlingService.showSuccessToast('Data exported as JSON');
      return { success: true };
    } catch (error) {
      ErrorHandlingService.showErrorToast('Export failed');
      return { success: false, error: error.message };
    }
  };

  const exportAsCSV = () => {
    try {
      const csv = StorageService.exportAsCSV();
      downloadFile(csv, 'mindmirror-export.csv', 'text/csv');
      ErrorHandlingService.showSuccessToast('Data exported as CSV');
      return { success: true };
    } catch (error) {
      ErrorHandlingService.showErrorToast('Export failed');
      return { success: false, error: error.message };
    }
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStorageStats = () => {
    return StorageService.getStorageStats();
  };

  return {
    entries,
    getRecentEntries,
    getEntriesByDateRange,
    deleteEntry,
    clearAllEntries,
    exportAsJSON,
    exportAsCSV,
    getStorageStats,
    refreshEntries,
  };
}
