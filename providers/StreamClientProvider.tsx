"use client"

import { tokenProvider } from "@/actions/stream.actions";
import Loader from "@/components/Loader";
import {
    StreamVideo,
    StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
// const userId = "user-id";
// const token = "authentication-token";
// const user: User = { id: userId };



const StreamVideoProvider = ({ children } : { children: React.ReactNode }) => {
    const { data:session, status } = useSession();
    const [ videoClient, setVideoClient] = useState<StreamVideoClient>();

    useEffect(() => {
        if(status != "authenticated" || !session?.user?.email) return;
        if(!apiKey) throw new Error("Stream API key missing");


        const client = new StreamVideoClient({
            apiKey,
            user: {
                id: String(session?.user?.id),
                name: session?.user?.name || session?.user.id,
                image: "",
            },
            tokenProvider,
        })

        setVideoClient(client)
    }, [session?.user, status])


    if(!videoClient) return <Loader />

    return (
        <StreamVideo client={videoClient}>
            {children}
        </StreamVideo>
    );
};


export default StreamVideoProvider;