"use client"

import React from 'react';
// import { auth } from '@/auth';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import {
    Form, FormField, FormControl, FormDescription, FormItem, FormLabel, FormMessage
} from '@/components/ui/form'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";
import toast from 'react-hot-toast';


const formSchema = z.object({
    title: z.string({ required_error: "Course title is required" })
            .min(2, "Course title is required")
})

const CreateCoursePage = () => {
    const router = useRouter()
    const { data: session, status } = useSession();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ''
        }
    });

    const { isValid, isSubmitting } = form.formState;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {

        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/instructor/courses/`, values, {
            headers: {
                'Authorization': `Token ${session.accessToken}`
            }
        });

        if (res.data.status_code == 201){
            toast.success("Course created successfully.");
            router.push(`/courses/${res.data.course}`)
        } else {
            toast.error("Something went wrong");
        }
        
    }

  return (
    <section className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
        <div>
            <h1 className="text-2xl">
                Name your course
            </h1>
            <p className="text-sm text-slate-600">
                  What would you like to name your course? Don't worry, you can change this later.
            </p>


            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                    <FormField 
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Course title</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="text"
                                        disabled={isSubmitting}
                                        placeholder="e.g. 'Advance web development'"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    What will you teach in this course?
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <div>
                        <Link href="/courses"><Button variant="ghost" type="button">Cancel</Button></Link>
                        <Button type="submit" disabled={!isValid || isSubmitting}>Continue</Button>
                    </div>
                </form>
            </Form>

        </div>
    </section>
  )
}

export default CreateCoursePage