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
import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Combobox } from '@/components/ui/combobox';
import toast from 'react-hot-toast';

interface LevelFormProps {
    initialData: {
        level: string;
    };
    courseId: string;
    options: { label: string, value: string; }[];
}

const formSchema = z.object({
    level: z.string({ required_error: 'Course level is required' })
        .min(1, { message: "Course level is required" })
})

const LevelForm = ({
    initialData, courseId, options
}: LevelFormProps) => {
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

    const selectedOption = options.find((option) => option.value === initialData?.level)

    return (
        <section className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course level
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                                Edit level
                        </>
                    )}

                </Button>
            </div>
            {!isEditing && (
                <p className={cn("text-sm mt-2", !initialData?.level && "text-slate-500 italic")}>
                    {selectedOption?.label || "No level"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Combobox
                                            options={...options}
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



export default LevelForm