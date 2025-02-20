import Logo from '@/app/(dashboard)/_components/logo'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const HomePage = () => {
  return (
    <div>

      <Logo />
      <Link href="/signin">
        <Button variant="destructive">Sign in</Button>
      </Link>
      
    </div>
  )
}

export default HomePage