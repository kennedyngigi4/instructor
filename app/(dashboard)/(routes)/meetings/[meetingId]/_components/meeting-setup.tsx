"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'


interface MeetingSetupProps {
  setIsSetupComplete: (value: boolean) => void;
}

const MeetingSetup = ({ setIsSetupComplete }: MeetingSetupProps) => {
  const [isMicCamToggledOn, setIsMicCamToggledOn ] = useState(false);
  const call = useCall();

  if(!call) {
    throw new Error("usecall must be used within StreamCall component");
  }

  useEffect(() => {
    if(isMicCamToggledOn){
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamToggledOn, call?.camera, call?.microphone]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3 px-10 pt-5 pb-20">
      <h1 className="text-2xl font-bold">Setup</h1>
      <p className="pb-4 font-semibold">Set up your camera and microphone before joining</p>
      <VideoPreview />

      <div className="flex h-16 items-center w-full justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <Input 
            type="checkbox"
            className="w-5"
            checked={isMicCamToggledOn}
            onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button className="rounded-md bg-green-500 px-4 py-2.5" onClick={() => {
        call.join();
        setIsSetupComplete(true);
      }}>
        Join meeting
      </Button>
    </div>
  )
}

export default MeetingSetup