import React, { ReactNode } from 'react'
import CommonUserLayout from '@/components/common/CommonUserLayout';
import { ROLE } from '@/utils/constant';

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