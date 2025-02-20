"use client"

import React, { useState } from 'react'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import {
    Form, FormField, FormControl, FormItem, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Textarea } from '@/components/ui/textarea'
import Tiptap from '@/components/Tiptap'
import { Pencil, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import ChaptersList from './chapters-list'


interface ChapterFormProps{
    initialData: {
        chapters: any;
    },
    courseId: string;
}

const formSchema = z.object({
    title: z.string({ required_error: 'Chapter title is required' })
        .min(1, { message: "Chapter title is required" })
})

const ChapterForm = ({
    initialData, courseId
} : ChapterFormProps) => {
    const { data: session, status } = useSession();
    const router = useRouter()
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating ] = useState(false);

    const toggleCreating = () => setIsCreating((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            const chapterData = {
                course: courseId,
                title: values.title
            }

            await axios.post(`http://127.0.0.1:8000/api/courses/instructor/chapters/`, chapterData, {
                headers: {
                    'Authorization': `Token ${session?.accessToken}`
                }
            });
            toast.success("Chapter created");
            toggleCreating();
            location.reload();
        } catch {
            toast.error("Something went wrong");
        }
    }

    const onEdit = (id: string) => {
        router.push(`/courses/${courseId}/chapters/${id}`);
    }

    return (
        <section className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course chapters
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a chapter
                        </>
                    )}

                </Button>
            </div>
            
            {isCreating && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Introduction to the course'"
                                            className="bg-white"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                            <Button disabled={!isValid || isSubmitting} type="submit">
                                Create
                            </Button>
                        
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className="text-slate-500 italic">
                    {!initialData?.chapters.length && "No chapters"}
                    <ChaptersList 
                        onEdit={onEdit}
                        items={initialData?.chapters || []}
                    />
                </div>
            )}
        </section>
    )
}



export default ChapterForm