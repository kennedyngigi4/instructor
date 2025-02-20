"use client"


import axios from 'axios'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import { useSession, signIn, signOut } from "next-auth/react";

const CoursesPage = () => {

  const { data: session, status } = useSession();
  const [ courses, setCourses ] = useState([]);
  

  useEffect(() => {
    async function fetchCourses(){
      const response =  await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/instructor/assigned_courses`, {
          headers: {
            'Authorization': `Token ${session?.accessToken}`
          }
        })
      setCourses(response.data);
    }
    fetchCourses()
  }, []);


  return (
    <section className="flex flex-col h-screen p-6 w-full">
      <div className="">
        <DataTable columns={columns} data={courses} />
      </div>
      
    </section>
  )
}

export default CoursesPage