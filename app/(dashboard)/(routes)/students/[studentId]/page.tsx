"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react';


const StudentDetailsPage = ({ params } : { params: { studentId: string } }) => {
    const resolvedParams = React.use(params);
    const [studentDetails, setStudentDetails] = useState({});
    
    useEffect(() => {
        const getDetails = async () => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/instructor/student_details/`)
        }
        getDetails();
    }, [])

    return (
        <section className="p-6">Student {resolvedParams?.studentId}</section>
    )
}

export default StudentDetailsPage