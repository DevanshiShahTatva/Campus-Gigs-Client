'use client';
import { Provider } from 'react-redux';
import { store, persistor } from '@/redux';
import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
} 