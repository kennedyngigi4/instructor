"use client"
import axios from 'axios';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ActionsProps {
    disabled: boolean;
    courseId: string;
    is_published: boolean;
}


const Actions = ({ disabled, courseId, is_published } : ActionsProps) => {
    const { data: session, status } = useSession();
    const [ isLoading, setIsLoading] = useState(false);
    const router = useRouter();


    const onClick = async () => {
        if (is_published) {
            const data = {
                "is_published": false,
            }
            await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/instructor/courses/${courseId}/`, data, {
                headers: {
                    'Authorization': `Token ${session?.accessToken}`
                }
            });
            toast.success("Course unpublished");
            location.reload();

        } else {
            const data = {
                "is_published": true,
            }
            await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/instructor/courses/${courseId}/`, data, {
                headers: {
                    'Authorization': `Token ${session?.accessToken}`
                }
            });
            toast.success("Course published");
            location.reload();
        }
    }


    const onDelete = async() => {
        try{
            setIsLoading(true);
            await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/instructor/courses/${courseId}/`, {
                headers: {
                    'Authorization': `Token ${session?.accessToken}`
                }
            });

            toast.success("Course deleted");
            router.push(`/courses`);
        } catch {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false);
        }
    }
  
    return (
    <div className="flex items-center gap-x-3">
        <Button
            onClick={onClick}
            disabled={disabled || isLoading}
            variant="outline"
            size="sm"
        >
            {is_published ? "Unpublish" : "Publish"}
        </Button>

        <ConfirmModal onConfirm={onDelete}>
            <Button size="sm" disabled={isLoading}>
                <Trash  className="h-4 w-4"/>
            </Button>
        </ConfirmModal>
    </div>
  )
}

export default Actions