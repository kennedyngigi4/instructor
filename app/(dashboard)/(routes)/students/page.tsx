"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const students: any[] = [

]


const InstructorStudentsPage = () => {
  const { data:session } = useSession();
  const [ enrolledStudents, setEnrolledStudents ] = useState([]);

  useEffect(() => {
    const fetchStudents = async() => {
      try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/instructor/enrolled_students`, {
          headers: {
            'Authorization': `Token ${session?.accessToken}`
          }
        });
        setEnrolledStudents(response.data)
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
    fetchStudents();

  }, []);

  return (
    <section className="p-6">
      <section className="">
        <h1 className="text-2xl font-bold">All Students</h1>
        <p className="text-slate-500">These are students enrolled for a course you are assigned to.</p>
      </section>

      <div className="">
        <DataTable columns={columns} data={enrolledStudents} />
      </div>
    </section>
  )
}

export default InstructorStudentsPage
