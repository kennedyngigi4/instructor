"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import { useSession } from 'next-auth/react'
import React from 'react'

interface SharingMeetingLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SharingMeetingLinkModal = ({ isOpen, onClose }: SharingMeetingLinkModalProps) => {
    const { data:session } = useSession();
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <Button>Share link</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {session?.user?.id}
                    </DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default SharingMeetingLinkModal