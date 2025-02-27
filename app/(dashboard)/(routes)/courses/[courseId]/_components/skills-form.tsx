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


interface SkillsFormProps{
    initialData: {
        skills: string;
    },
    courseId: string;
}

const formSchema = z.object({
    skills: z.string({ required_error: 'Course skills is required' })
        .min(1, { message: "Course skills is required" })
})

const SkillsForm = ({
    initialData, courseId
} : SkillsFormProps) => {
    const { data: session, status } = useSession();
    const router = useRouter()
    const [isEditing, setEditing] = useState(false);

    const toggleEdit = () => setEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/instructor/courses/${courseId}/`, values, {
                headers: {
                    'Authorization': `Token ${session.accessToken}`
                }
            });
            toast.success("Course updated");
            toggleEdit();
            location.reload();
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <section className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course skills
                
            </div>
            {!isEditing && (
                <p className={cn("text-sm mt-2", !initialData && "text-slate-500 italic")}>
                    {initialData?.skills || "No skills"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="skills"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Python, JavaScript, HTML'"
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



export default SkillsForm