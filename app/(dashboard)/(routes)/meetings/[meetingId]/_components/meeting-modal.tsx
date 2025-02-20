"use client"

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';



interface MeetingModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    className?: string;
    children?: React.ReactNode;
    handleClick?: () => void;
    buttonText?: string;
    image?: string;
    buttonIcon?: string;
}

const MeetingModal = ({ isOpen, onClose, title, className, children, handleClick, buttonText, image, buttonIcon }: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-white px-6 py-9 text-slate-800">
            <div className="flex flex-col gap-6">
                {image && (
                    <div className="flex justify-center">
                        <Image src={image} alt="image" width={72} height={72} />
                    </div>
                )}
                <h1 className={cn("text-xl font-bold leading-[42px]", className)}>{title}</h1>
                {children}
                <Button className="bg-isky_blue focus-visible:ring-0 focus-visible:ring-offset-0" onClick={handleClick}>
                    {buttonIcon && (
                        <Image src={buttonIcon} alt="icon" width={13} height={13} />
                    )} &nbsp;
                    {buttonText}
                </Button>
            </div>
        </DialogContent>
    </Dialog>

  )
}

export default MeetingModal