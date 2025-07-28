'use client';

import React from 'react';
import ChatPage from '@/app/(protected)/chat/page';

function AdminChat() {
  return (
    <div className='h-[calc(100vh-210px)]'>
      <ChatPage />
    </div>
  )
}

export default AdminChat;