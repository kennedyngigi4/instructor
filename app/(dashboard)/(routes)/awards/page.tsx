import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import React from 'react'
import Image from 'next/image'

const InstructorAwardsPage = () => {

  const badges = [
    {
      id: 2,
      badge: "/images/badges/2.png",
    },
    {
      id: 3,
      badge: "/images/badges/3.png",
    },
    {
      id: 4,
      badge: "/images/badges/4.png",
    },
    {
      id: 5,
      badge: "/images/badges/5.png",
    },
    {
      id: 6,
      badge: "/images/badges/6.png",
    },
    {
      id: 7,
      badge: "/images/badges/7.png",
    },
    {
      id: 8,
      badge: "/images/badges/8.png",
    },
    {
      id: 9,
      badge: "/images/badges/9.png",
    },
    {
      id: 10,
      badge: "/images/badges/10.png",
    },
    {
      id: 11,
      badge: "/images/badges/11.png",
    },
    {
      id: 12,
      badge: "/images/badges/12.png",
    }
  ]


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
              <CarouselItem key={badge.id} className="pl-1 md:basis-1/6 lg:basis-1/6">
                <Card className="">
                  <CardContent>
                    <Image src={badge.badge} width={150} height={150} alt={badge.badge} />
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
          
        </div>

      </section>


    </section>
  )
}

export default InstructorAwardsPage