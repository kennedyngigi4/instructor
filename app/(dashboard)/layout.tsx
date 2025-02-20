"use client"

import React, { useEffect } from 'react'
import Navbar from './_components/navbar'
import Sidebar from './_components/sidebar'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import StreamVideoProvider from '@/providers/StreamClientProvider';

const DashboardLayout = ({
    children
}: Readonly<{ children: React.ReactNode }> ) => {

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status != "authenticated") {
      router.push("/signin");
    }
  }, [status]);


  return (
    <section className="h-full">
      <div className="h-[50px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <div className="md:pl-56 pt-[50px]">
        <StreamVideoProvider>
          {children}
        </StreamVideoProvider>
      </div>
    </section>
  )
}

export default DashboardLayout