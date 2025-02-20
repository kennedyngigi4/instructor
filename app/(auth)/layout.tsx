import React from 'react'
import Image from 'next/image';

const AuthLayout = ({
    children
} : Readonly<{ children: React.ReactNode }>) => {
  return (
    <section className="grid md:grid-cols-2 grid-cols-1 min-h-screen w-full">
      <div className="bg-[url('/images/bg/1.jpeg')] bg-cover bg-center">
        <div className="flex flex-col items-center justify-center space-y-80 bg-black bg-opacity-75 min-h-screen">
          <Image src="/images/others/logo-white.png" alt="ISKY TECH INSTRUCTORS" width={400} height={300} />
          <p className="text-white">&copy;2025 ISKY TECH | All Rights Reserved</p>
        </div>
        
      </div>
      <div className="p-10 flex items-center">
        <div>{children}</div>
      </div>
    </section>
  )
}

export default AuthLayout;