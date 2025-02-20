"use client"

import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import MeetingSetup from './_components/meeting-setup';
import MeetingRoom from './_components/meeting-room';
import { useGetCallById } from '@/hooks/useGetCallById';
import Loader from '@/components/Loader';


const MeetingIdPage = ({
    params
} : { params: { meetingId: string } }) => {
    const resolvedParams = React.use(params);
    const { data:session, status } = useSession();
    const [isSetupComplete, setIsSetupComplete ] = useState(false);
    const { call, isCallLoading } = useGetCallById(resolvedParams?.meetingId)

    if(isCallLoading) return <Loader />

    return (
        <main className="h-screen w-full">
            <StreamCall call={call}>
                <StreamTheme>
                    {!isSetupComplete ? (
                        <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
                    ) : (
                        <MeetingRoom />
                    )}
                </StreamTheme>
            </StreamCall>
        </main>
    )
}

export default MeetingIdPage