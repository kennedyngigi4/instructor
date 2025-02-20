import React from 'react'
import Image from 'next/image'

const Logo = () => {
  return (
    <div>
      <Image src="/logo1.png" alt="Instructor logo" width={80} height={50} />
    </div>
  )
}

export default Logo