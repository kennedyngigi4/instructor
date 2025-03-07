"use client"

import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { CallControls, CallParticipantsList, PaginatedGridLayout, SpeakerLayout } from '@stream-io/video-react-sdk';
import { LayoutList, Users } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import EndCallButton from './end-call-button';

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [ showParticipants, setShowParticipants ] = useState(false);

  const CallLayout = () => {
    switch(layout){
      case "grid":
        return <PaginatedGridLayout />
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />
      default:
        return <SpeakerLayout participantsBarPosition="right" />
    }
  }


  return (
    <section className="relative h-screen w-full overflow-hidden p-4">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div className={cn("h-[calc(100vh-60px)] hidden z-50 bg-slate-200 p-5 rounded-lg ml-2", { "block": showParticipants })}>
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
        <CallControls />

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl px-4 py-2 bg-[#19232d] hover:bg-[#4c535b]">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          
          <DropdownMenuContent className="border-slate-50 bg-slate-50 text-white">
            {[ 'Grid', 'Speaker-left', 'Speaker-right'].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem className="cursor-pointer"
                  onClick={() => {
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }}
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-slate-50" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <button onClick={() => setShowParticipants((prev) => !prev)}>
            <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
              <Users size={20} className="text-white" />
            </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  )
}

export default MeetingRoom