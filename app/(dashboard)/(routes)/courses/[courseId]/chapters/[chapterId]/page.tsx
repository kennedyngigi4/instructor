"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Banner } from '@/components/banner';
import Link from 'next/link';
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';
import ChapterTitleForm from './_components/chapter-title-form';
import ChapterDescriptionForm from './_components/chapter-description-form';
import ChapterAccessForm from './_components/chapter-access-form';
import ChapterActions from './_components/chapter-actions';


const ChapterId = ({
    params
}: { params: { courseId: string; chapterId: string } }) => {
    const resolvedParams = React.use(params);
    const [ chapter, setChapter ] = useState();

    const { data: session, status } = useSession();


    const requiredFields = [
        chapter?.title,
        chapter?.description,
        // chapter?.video_url,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;
    const isComplete = requiredFields.every(Boolean);


    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/instructor/chapters/${resolvedParams.chapterId}/`, {
            headers: {
                'Authorization': `Token ${session?.accessToken}`
            }
        }).then((response) => {
            setChapter(response.data);
        })
        
    },[])

    

  return (
    <>
        {!chapter?.is_published && (
            <Banner 
                variant="warning"
                label="This chapter is not published. It will not be in the course"
            />
        )}
        <section className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link 
                        href={`/courses/${resolvedParams.courseId}`}
                        className="flex items-center text-sm hover:opacity-75 transition mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to course setup
                    </Link>

                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">Chapter creation</h1>
                            <span className="text-sm text-slate-700">Complete all fields {completionText}</span>
                        </div>
                        {/* <ChapterActions
                            disabled={!isComplete}
                            courseId={resolvedParams.courseId}
                            chapterId={resolvedParams.chapterId}
                            is_published={chapter?.is_published}
                        /> */}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            <h2 className="text-lg">Customize your chapter</h2>
                        </div>
                        <ChapterTitleForm 
                            initialData={chapter}
                            courseId={resolvedParams.courseId}
                            chapterId={resolvedParams.chapterId}
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-x-2">
                            <Video className="h-4 w-4 mr-2" />
                            <h2 className="text-lg">Video</h2>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-x-2">
                        <Eye className="h-4 w-4 mr-2"/>
                        <h2 className="text-lg">Access settings</h2>
                    </div>
                    <ChapterAccessForm 
                        initialData={chapter}
                        courseId={resolvedParams.courseId}
                        chapterId={resolvedParams.chapterId}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="w-full">
                    <ChapterDescriptionForm
                        initialData={chapter}
                        courseId={resolvedParams?.courseId}
                        chapterId={resolvedParams?.chapterId}
                    />
                </div>
                
            </div>

        </section>
    </>
      
  )
}

export default ChapterId