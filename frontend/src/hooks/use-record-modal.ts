'use client';

import { useState } from 'react';

export type ModalMode = 'create' | 'view' | 'edit' | null;

export function useRecordModal<T extends { id: string }>() {
  const [mode, setMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<T | null>(null);

  const openCreate = () => {
    setSelected(null);
    setMode('create');
  };

  const openView = (record: T) => {
    setSelected(record);
    setMode('view');
  };

  const openEdit = (record: T) => {
    setSelected(record);
    setMode('edit');
  };

  const close = () => {
    setMode(null);
    setSelected(null);
  };

  const switchToEdit = () => {
    if (selected) setMode('edit');
  };

  return {
    mode,
    selected,
    isOpen: mode !== null,
    isCreate: mode === 'create',
    isView: mode === 'view',
    isEdit: mode === 'edit',
    openCreate,
    openView,
    openEdit,
    close,
    switchToEdit,
  };
}
