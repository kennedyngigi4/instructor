"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { columns } from './_components/columns';
import { DataTable } from './_components/datatable';
import { object } from 'zod';
import { ProjectColumns } from './_components/projects_columns';
import { ProjectsDataTable } from './_components/projects_datatable';
import Link from 'next/link';


const StudentDetailsPage = ({ params } : { params: { studentId: string } }) => {
    const resolvedParams = React.use(params);
    const { data:session } = useSession();
    const [studentData, setStudentData] = useState({});
    const [courses, setCourses] = useState([]);
    const [projects, setProjects] = useState([]);
    
    useEffect(() => {
        const getDetails = async () => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/instructor/student_details/${resolvedParams?.studentId}`, {
                headers: {
                    "Authorization": `Token ${session?.accessToken}`
                }
            });
            
            setStudentData(response.data);
            setCourses(response.data.courses)
            setProjects(response.data.projects)
            console.log(response.data)
        }
        getDetails();

    }, [session?.accessToken])

    

    return (
        <section className="flex flex-col p-6">
            <div className="grid md:grid-cols-12 grid-cols-1 gap-5">
                <div className="md:col-span-4">
                    <div className="flex flex-col space-y-2">
                        <h1 className="text-lg font-semibold">{studentData?.student_details?.fullname}</h1>
                        <h4>{studentData?.student_details?.email}</h4>
                        <p className="text-sm text-slate-500"><strong>Joined:</strong> {new Date(studentData?.student_details?.date_joined).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="md:col-span-3">
                    <Card>
                        <CardContent className="py-5">
                            <h1 className="text-3xl font-semibold">{studentData?.courses?.length}</h1>
                            <h2>Enrolled Courses</h2>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-3">
                    <Card>
                        <CardContent className="py-5">
                            <h1 className="text-3xl font-semibold">{studentData?.projects?.length}</h1>
                            <h2>Completed Projects</h2>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2">
                    <Link href={`/students/${resolvedParams?.studentId}/add-badge`}>
                        <Card>
                            <CardHeader>
                                <CardTitle></CardTitle>
                            </CardHeader>
                            <CardContent>
                                <h2>Add Badge</h2>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>

            <div className="w-full py-8">
                <div>
                    <h1 className="font-semibold">Enrolled courses</h1>
                </div>
                <DataTable columns={columns} data={courses} />
            </div>


            <div className="w-full py-8">
                <div>
                    <h1 className="font-semibold">Completed projects</h1>
                </div>
                <ProjectsDataTable columns={ProjectColumns} data={projects} />
            </div>
        </section>
    )
}

export default StudentDetailsPage