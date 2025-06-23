"use client";
import React, { ReactNode } from 'react'

// custom componetns
// import CommonUserLayout from '@/components/common/CommonUserLayout';

// Constant
import { ROLE } from '@/utils/constant';
import CommonUserLayout from '@/components/common/CommonUserLayout';
import AdminSidebar from '@/components/common/AdminSidebar';

const Layout : React.FC<{children : ReactNode}> = ( { children }) => {
  return (
    <div className='h-screen'>
      <CommonUserLayout role={ROLE.Admin}>
          {children}
      </CommonUserLayout>
    </div>
  );
}

export default Layout