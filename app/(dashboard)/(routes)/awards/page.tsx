"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'

const InstructorAwardsPage = () => {
  const { data:session } = useSession();
  const [badges, setBadges] = useState([]);
  const [ awards, setAwards] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/competitions/badges`)
      .then((response) => {
        setBadges(response.data);
      })
  }, [])


  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/competitions/instructor/all_awards`, {
      headers: {
        "Authorization": `Token ${session?.accessToken}`
      }
    })
      .then((response) => {
        console.log(response.data);
        setAwards(response.data);
      })
  }, [session?.accessToken])

  return (
    <section className="p-6">
      <section className="">
        <div>
          <h1 className="text-2xl font-bold">All Badges</h1>
          <p className="text-slate-500">Badges you can award to your students</p>
        </div>

        <Carousel className="w-full">
          <CarouselContent className="-ml-1">
            {badges.map((badge) => (
              <CarouselItem key={badge?.name} className="pl-1 md:basis-1/6 lg:basis-1/6">
                <Card className="">
                  <CardContent>
                    <Image src={badge?.imagePath} width={150} height={150} alt={badge.name} />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

      </section>


      <section className="pt-10">
        <div>
          <h1 className="text-xl font-bold">Students you awarded badges</h1>
          <div>
            <DataTable columns={columns} data={awards} />
          </div>
        </div>

      </section>


    </section>
  )
}

export default InstructorAwardsPage