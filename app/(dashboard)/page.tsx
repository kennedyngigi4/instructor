"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Files } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { data:session } = useSession();
  const router = useRouter();
  const [ assignedCourses, setAssignedCourses ] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/instructor/assigned_courses`, {
      headers: {
        'Authorization': `Token ${session?.accessToken}`
      }
    }).then((response) => {
      setAssignedCourses(response.data);
    }).catch((error) => {
      toast.error("Something went wrong");
    })

  }, []);

  return (
    <section className="p-6">
      <section className="">
        <h1 className="text-2xl font-bold">Welcome back, {session?.user?.name}</h1>
        <p className="text-slate-500">Today's quote from the programme manager comes here.</p>
      </section>

      

      <section className="grid md:grid-cols-12 grid-cols-12 py-10 gap-y-8 gap-x-10">
        <div className="col-span-12 md:col-span-9">
          <h1 className="font-semibold text-lg">Courses assigned to you</h1>

          <div className="pt-4">

            {assignedCourses.slice(0,5).map((course) => (
              <div key={course?.course_id} className="grid md:grid-cols-12 grid-cols-12 pb-2 border-b-2 pt-4">
                <div className="col-span-4">
                  <p className="text-sm flex"><Book className="h-4 w-4 text-isky_blue" /> Course</p>
                  <p>{course?.title}</p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm flex"> Level</p>
                  <p className="flex text-sm"><Files className="h-4 w-4 mr-2" /> {course?.level}</p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm flex"> Status</p>
                  <p className="flex text-green-700 text-xs">In progress</p>
                </div>
                <div className="col-span-2">
                  <Button variant="outline" size="sm">Details</Button>
                </div>
              </div>

            ))}

            
          </div>

        </div>
        <div className="col-span-12 md:col-span-3 space-y-6">
          <Card className="shadow-none border">
            <CardHeader>
              <CardTitle className="text-2xl">{assignedCourses.length}</CardTitle>
            </CardHeader>
            <CardContent>
              Courses Assigned
            </CardContent>
          </Card>

          <Card className="shadow-none border">
            <CardHeader>
              <CardTitle className="text-2xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              All Students
            </CardContent>
          </Card>

          <Card className="shadow-none border">
            <CardHeader>
              <CardTitle className="text-2xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              Badges Awarded
            </CardContent>
          </Card>
        </div>
      </section>
    </section>
  )
}

export default DashboardPage