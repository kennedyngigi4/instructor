"use client"

import React, { useState } from 'react'
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import {
    Form, FormField, FormControl, FormItem, FormLabel, FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useToast } from "@/hooks/use-toast";


interface TitleFormProps {
    initialData: {
        title: string;
    };
    courseId: string;
}


const formSchema = z.object({
    title: z.string({ required_error: 'Course title is required' })
            .min(1, { message: "Course title is required" })
})


const TitleForm = ({ initialData, courseId } : TitleFormProps) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const toast = useToast();
    const [ isEditing, setEditing ] = useState(false);

    const toggleEdit = () => setEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    });

    const { isValid, isSubmitting } = form.formState;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try{
            
            await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/instructor/courses/${courseId}/`, values, {
                headers: {
                    'Authorization': `Token ${session.accessToken}`
                }
            });
            
            toggleEdit()
            location.reload()
        } catch {
            console.log("Something went wrong")
        }
    }

  return (
    <section className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Course title

            
            <Button onClick={toggleEdit} variant="ghost">
                {isEditing ? (
                    <>Cancel</>
                ) : (
                    <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit title
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
            <p className="text-sm mt-2">{initialData?.title}</p>
        )}

        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <FormField 
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input 
                                        placeholder="e.g. Advanced web development"
                                        disabled={isSubmitting}
                                        className="bg-white"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center gap-x-2">
                        <Button disabled={!isValid || isSubmitting} type="submit">Save</Button>
                    </div>
                </form>
            </Form>
        )}

    </section>
  )
}

export default TitleForm