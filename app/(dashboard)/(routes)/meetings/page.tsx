"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import MeetingModal from './[meetingId]/_components/meeting-modal';
import { Textarea } from '@/components/ui/textarea';
import DatePicker from "react-datepicker";
import { CalendarCheckIcon, PlusSquareIcon } from 'lucide-react';

const MeetingsPage = () => {
  const router = useRouter();
  const { data:session } = useSession();
  const client = useStreamVideoClient();
  const [ values, setValues ] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const [ meetingState, setMeetingState ] = useState<'isScheduleMeeting' | 'isJoinMeeting' | undefined >();

  const [ callDetails, setCallDetails ] = useState<Call>();

  const createMeeting = async() => {
    if(!client) return;

    try {
      const id = crypto.randomUUID();
      const call = client.call('default', id)

      if(!call) throw new Error("Failed to create a call");

      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description
          }
        }
      });

      setCallDetails(call);

      if(!values.description) {
        router.push(`/meetings/${call.id}`);
      }

      toast.success("Meeting created")
    } catch(error){
      console.log(error);
      toast.error("Filed to create meeting",{ style: { background: "#ff0000", color: "#ffffff"}});
    }
  }

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meetings/${callDetails?.id}`;

  return (
    <section className="p-6">

      <div className="grid md:grid-cols-12 grid-cols-12 gap-8">
        <div className="md:col-span-4 col-span-12">
          <Card className="bg-isky_blue text-white">
            <CardHeader className="pb-14">
              <PlusSquareIcon />
              <CardTitle>New meeting</CardTitle>
              <CardDescription className="text-white">Create an instant meeting</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={createMeeting}>Start a meeting</Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-4 col-span-12">
          <div onClick={() => setMeetingState("isScheduleMeeting")}>
            <Card className="bg-isky_orange text-white">
              <CardHeader className="pb-14">
                <CalendarCheckIcon />
                <CardTitle>Schedule meeting</CardTitle>
                <CardDescription className="text-white">Schedule meeting and share link</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={createMeeting}>Schedule a meeting</Button>
              </CardContent>
            </Card>
          </div>
          
          {!callDetails ? (
            <MeetingModal
              isOpen={meetingState === "isScheduleMeeting"}
              onClose={() => setMeetingState(undefined)}
              title="Start a meeting"
              buttonText="Schedule meeting"
              handleClick={createMeeting}
            >
              <div className="flex flex-col gap-2.5">
                <label className="text-base text-normal leading-[22px]">Add a description</label>
                <Textarea 
                  className="border-none bg-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0" 
                  onChange={(e) => {
                    setValues({...values, description: e.target.value})
                  }} 
                />
              </div>
              <div className="flex w-full flex-col gap-2.5">
                <label className="text-base text-normal leading-[22px]">Select Date and Time</label>
                <DatePicker 
                  selected={values.dateTime} 
                  onChange={(date) => setValues({...values, dateTime: date!})} 
                  showTimeSelect 
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="w-full rounded bg-slate-200 p-2 focus:outline-none"
                />
              </div>
            </MeetingModal>
          ) : (
              <MeetingModal
                isOpen={meetingState === "isScheduleMeeting"}
                onClose={() => setMeetingState(undefined)}
                title="Meeting Created"
                className="text-center"
                buttonText="Copy meeting link"
                handleClick={() => {
                  navigator.clipboard.writeText(meetingLink)
                  toast.success("Link copied")
                }}
              />
          )}

          
        </div>
        <div className="md:col-span-4 col-span-12">
          
        </div>
      </div>


      <div className="flex pt-16">
          <h1 className="font-semibold text-xl">Upcoming online classes</h1>
      </div>
    </section>
  )
}

export default MeetingsPage