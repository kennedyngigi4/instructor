"use client"

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';


const formSchema = z.object({
    award: z.string({ required_error: "Award badge is required" }),
    note: z.string({ required_error: "Make a note" })
})

const AddBadge = ({ params } : { params: { studentId: string } }) => {
    const resolvedParams = React.use(params);
    const { data:session } = useSession();
    const [ allBadges, setallBadges ] = useState([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            award: "",
            note: "",
        }
    });

    const { isValid, isSubmitting } = form.formState;



    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/competitions/badges`)
            .then((response) => {
                setallBadges(response.data)
            })
    }, [])

    const handleSubmit = async(values: z.infer<typeof formSchema>) => {
        const data = {
            award_badge: values.award,
            note: values.note,
            awarded_to: `${resolvedParams?.studentId}`
        }

        try{
            axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/competitions/instructor/award_student`, data, {
                headers: {
                    "Authorization": `Token ${session?.accessToken}`
                }
            }).then(() => {
                toast.success("Added successfully!");
                location.reload();
            })
        } catch(error) {
            toast.error("Something went wrong");
        }
    }


    return (
        <section className="flex justify-center items-center p-6">
            <div className="pt-4 w-[50%]">
                <div className="py-4">
                    <h1 className="text-xl font-semibold">Add Award</h1>
                    <p className="text-slate-500">The award will be listed in the students profile</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <FormField 
                            control={form.control}
                            name="award"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Choose badge</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select badge" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {allBadges.map((badge) => (
                                                    <SelectItem key={badge.name} value={badge?.badge_id}>{badge?.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Add note</FormLabel>
                                    <FormControl>
                                        <Textarea

                                            placeholder="Add a note"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div>
                            <Button variant="default" type="submit" disabled={!isValid || isSubmitting}>Submit</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </section>
    );
}

export default AddBadge