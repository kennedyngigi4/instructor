"use client"

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import { Banner } from '@/components/banner';
import { useRouter } from 'next/navigation';
import TitleForm from './_components/title-form';
import DescriptionForm from './_components/description-form';
import CategoryForm from './_components/category-form';
import LevelForm from './_components/level-form';
import ImageForm from './_components/image-form';
import { ListChecks } from 'lucide-react';
import SkillsForm from './_components/skills-form';
import ChaptersForm from './_components/chapters-form';
import ChapterForm from './_components/chapter-form';
import Actions from './_components/actions';

const CourseIdPage = ({
    params
}: {
    params: { courseId: string }
}) => {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const { data: session, status} = useSession();
  const [ course, setCourse ] = useState(null);

  useEffect(() => {
    
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/instructor/courses/${resolvedParams.courseId}/`, {
        headers: {
          'Authorization': `Token ${session?.accessToken}`
        }
      }).then((response) => {
        console.log(response.data)
        setCourse(response.data)
      })
      
    
  }, [resolvedParams.courseId]);


  const categories = [
    { id: "1", name: "Computer Science" },
    { id: "2", name: "IT" },
    { id: "3", name: "Data Analysis" },
    { id: "4", name: "Animations" },
    { id: "5", name: "Graphic Design" },
  ]


  const levels = [
    { id: "1", name: "Early Education", },
    { id: "2", name: "Middle School", },
    { id: "3", name: "High School", },
    { id: "4", name: "Pre-University", },
  ]


  const requiredFields = [
    course?.title,
    course?.level,
    course?.category,
    course?.description,
    course?.image,
    course?.chapters.some((chapter: { is_published: any; }) => chapter.is_published)
  ]

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  if(status != "authenticated") router.push("/signin");

  return (
    <>
      {!course?.is_published && (
        <Banner
          label="This course is unpublished. It will not be visible to students."
        />
      )}

      <div className="p-6 z-20">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">
              Course setup

              
            </h1>
            <span className="text-sm text-slate-700">Complete all fields {completionText}</span>
          </div>
          {/* <Actions
            disabled={!isComplete}
            courseId={resolvedParams?.courseId}
            is_published={course?.is_published}
          /> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <h2 className="text-xl">Customize your course</h2>
            </div>

            <TitleForm 
              initialData={course}
              courseId={course?.course_id}
            />

            <ImageForm 
              initialData={course}
              courseId={course?.course_id}
            />


            <CategoryForm
              initialData={course}
              courseId={course?.course_id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.name,
              }))}
            />

            <LevelForm
              initialData={course}
              courseId={course?.course_id}
              options={levels.map((level) => ({
                label: level.name,
                value: level.name,
              }))}
            />

          </div>

          <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <ListChecks className="w-4 h-4 mr-2"/>
                  <h2 className="text-xl">Course chapters</h2>
                </div>
                <ChapterForm
                  initialData={course}
                  courseId={course?.course_id}
                />
              </div>

              <SkillsForm 
                initialData={course}
                courseId={course?.course_id}
              />

          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-4">
          <div>
            <DescriptionForm 
              initialData={course}
              courseId={course?.course_id}
            />
          </div>
        </div>

      </div>

    </>
  )
}

export default CourseIdPage