'use client';
import { Provider } from 'react-redux';
import { store, persistor } from '@/redux';
import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';

if (typeof window !== 'undefined') {
  (window as any).__PERSISTOR = persistor;
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
} 