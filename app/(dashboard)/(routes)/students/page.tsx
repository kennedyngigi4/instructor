
import React from 'react'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'


const students: any[] = [

]


const InstructorStudentsPage = async() => {

  const allStudents = students;

  return (
    <section className="p-6">
      <section className="">
        <h1 className="text-2xl font-bold">All Students</h1>
        <p className="text-slate-500">These are students enrolled for a course you are assigned to.</p>
      </section>

      <div className="">
        <DataTable columns={columns} data={allStudents} />
      </div>
    </section>
  )
}

export default InstructorStudentsPage
