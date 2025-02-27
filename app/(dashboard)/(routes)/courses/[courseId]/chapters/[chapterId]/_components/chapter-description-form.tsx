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
import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'


interface ChapterDescriptionFormProps{
    initialData: {
        description: string;
    },
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    description: z.string({ required_error: 'Chapter description is required' })
        .min(1, { message: "Chapter description is required" })
})

const ChapterDescriptionForm = ({
    initialData, courseId, chapterId
} : ChapterDescriptionFormProps) => {
    const { data: session, status } = useSession();
    const router = useRouter()
    const [isEditing, setEditing] = useState(false);

    const toggleEdit = () => setEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: ""
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/instructor/chapters/${chapterId}/`, values, {
                headers: {
                    'Authorization': `Token ${session.accessToken}`
                }
            });
            toast.success("Chapter updated");
            toggleEdit();
            location.reload();
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <section className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter description
                
            </div>
            {!isEditing && (
                <p className={cn("text-sm mt-2", !initialData && "text-slate-500 italic")}>
                    {initialData?.description || "No description"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'This chapter is about ...'"
                                            className="bg-white"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button disabled={!isValid || isSubmitting} type="submit">
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </section>
    )
}



export default ChapterDescriptionForm