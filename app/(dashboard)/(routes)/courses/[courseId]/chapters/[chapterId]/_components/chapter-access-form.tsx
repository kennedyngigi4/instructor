"use client"

import React, { useState } from 'react'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import {
    Form, FormField, FormControl, FormItem, FormMessage,
    FormDescription
} from '@/components/ui/form';
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Checkbox } from '@/components/ui/checkbox'


interface ChapterAccessFormProps{
    initialData: {
        description: string;
    },
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    is_free: z.boolean().default(false)
})

const ChapterAccessForm = ({
    initialData, courseId, chapterId
} : ChapterAccessFormProps) => {
    const { data: session, status } = useSession();
    const router = useRouter()
    const [isEditing, setEditing] = useState(false);

    const toggleEdit = () => setEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            is_free: !!initialData?.is_free
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
                Chapter access
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit access
                        </>
                    )}

                </Button>
            </div>
            {!isEditing && (
                <p className={cn("text-sm mt-2", !initialData?.is_free && "text-slate-500 italic")}>
                    {initialData?.is_free ? (
                        <>This chapter is free for preview</>
                    ) : (
                        <>This chapter is not free</>
                    )}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="is_free"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-0">
                                        <FormDescription>
                                            Check this box if you want to make the chapter free for preview
                                        </FormDescription>
                                    </div>
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



export default ChapterAccessForm