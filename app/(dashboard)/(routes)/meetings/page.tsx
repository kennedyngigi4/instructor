"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import MeetingModal from './[meetingId]/_components/meeting-modal';
import { Textarea } from '@/components/ui/textarea';
import DatePicker from "react-datepicker";
import { CalendarCheckIcon, PlusSquareIcon, RocketIcon, Share2 } from 'lucide-react';
import SharingMeetingLinkModal from './_components/sharing-link-modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { Select, SelectItem, SelectLabel, SelectTrigger } from '@/components/ui/select';
import { SelectContent, SelectGroup, SelectValue } from '@radix-ui/react-select';
import Link from 'next/link';


const MeetingsPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const client = useStreamVideoClient();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const [ upcomingValues, setUpcomingValues ] = useState({
    link: "",
    schedule: new Date(),
    course: "",
    description: "",
  });
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoinMeeting' | undefined>();
  const [assignedCourses, setAssignedCourses ] = useState([]);
  const [callDetails, setCallDetails] = useState<Call>();
  const [allUpcomingClasess, setAllUpcomingClasess] = useState([]);

  const createMeeting = async () => {
    if (!client) return;

    try {
      const id = crypto.randomUUID();
      const call = client.call('default', id)

      if (!call) throw new Error("Failed to create a call");

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

      if (!values.description) {
        router.push(`/meetings/${call.id}`);
      }

      toast.success("Meeting created")
    } catch (error) {
      toast.error("Failed to create meeting", { style: { background: "#ff0000", color: "#ffffff" } });
    }
  }

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meetings/${callDetails?.id}`;


  // Get all courses
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/instructor/assigned_courses`, {
      headers: {
        'Authorization': `Token ${session?.accessToken}`
      }
    }).then((response) => {
      setAssignedCourses(response.data);
    }).catch((error) => {
      toast.error("Something went wrong");
    })

  }, [session?.accessToken]);


  const handleSharingLink = async () => {
    console.log(upcomingValues);
    await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/instructor/add_onlineclass`, upcomingValues, {
      headers: {
        "Authorization": `Token ${session?.accessToken}`
      }
    }).then((response) => {
      toast.success("Listed successfully");
      location.reload();
    })
  }


  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/instructor/add_onlineclass`, {
      headers: {
        "Authorization": `Token ${session?.accessToken}`
      }
    }).then((response) => {
      setAllUpcomingClasess(response.data);
    })
  }, [session?.accessToken])


  return (
    <section className="p-6">

      <div className="grid md:grid-cols-12 grid-cols-1 gap-8">
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
          <div>
            <Card className="bg-isky_orange text-white">
              <CardHeader className="pb-14">
                <CalendarCheckIcon />
                <CardTitle>Schedule meeting</CardTitle>
                <CardDescription className="text-white">Schedule meeting and share link</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setMeetingState("isScheduleMeeting")}>Schedule a meeting</Button>
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
                    setValues({ ...values, description: e.target.value })
                  }}
                />
              </div>
              <div className="flex w-full flex-col gap-2.5">
                <label className="text-base text-normal leading-[22px]">Select Date and Time</label>
                <DatePicker
                  selected={values.dateTime}
                  onChange={(date) => setValues({ ...values, dateTime: date! })}
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


      <div className="flex flex-row justify-between pt-16">
        <h1 className="font-semibold text-xl">Upcoming online classes</h1>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Share2 className="h-4 w-4 mr-3" /> Share link</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold leading-[42px]">Share meeting link with students</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-1 grid-cols-1 pt-4 space-y-5">
                <div className="flex w-full flex-col gap-2.5">
                  <label className="text-base text-normal leading-[22px]">Meeting link</label>
                  <Input 
                    placeholder="Meeting link" 
                    className="border-none bg-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0" 
                    onChange={(e) => {
                      setUpcomingValues({ ...upcomingValues, link: e.target.value })
                    }}
                  />
                </div>

                <div className="flex w-full flex-col gap-2.5">
                  <label className="text-base text-normal leading-[22px]">Select Date and Time</label>
                  <DatePicker
                    selected={upcomingValues.schedule}
                    onChange={(date) => setUpcomingValues({ ...upcomingValues, schedule: date! })}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full rounded bg-slate-200 p-2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-base text-normal leading-[22px]">Course</label>
                  <Select onValueChange={
                    (e) => {
                      
                      setUpcomingValues({ ...upcomingValues, course: e })
                    }
                  }>
                    <SelectTrigger className="border-none bg-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0 w-full">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent className="bg-white p-5 w-full">
                      <SelectGroup>
                        <SelectLabel>Courses</SelectLabel>
                        {assignedCourses.map((course) => (
                          <SelectItem 
                            key={course?.course_id} 
                            value={course?.course_id}>
                              {course?.title}
                          </SelectItem>

                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2.5">
                  <label className="text-base text-normal leading-[22px]">Meeting description</label>
                  <Textarea
                    className="border-none bg-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                    onChange={(e) => {
                      setUpcomingValues({ ...upcomingValues, description: e.target.value })
                    }}
                  />
                </div>

                <div>
                  <Button className="w-full" onClick={handleSharingLink}>Share Now</Button>
                </div>
                
              </div>
              
            </DialogContent>
          </Dialog>
          
        </div>
      </div>


      <div className="grid md:grid-cols-3 grid-cols-1 gap-6 pt-4">
        {allUpcomingClasess.map((onlineClass) => (
          <div key={onlineClass?.class_id}>
            <Link href={onlineClass?.sharedLink}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <RocketIcon className="h-8 w-8 text-isky_blue" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <h1 className="text-isky_orange font-semibold truncate text-lg">{onlineClass?.coursetitle}</h1>
                    <p className="text-slate-400">{ new Date(onlineClass?.schedule).toLocaleString()  }</p>

                    <p className="text-slate-500 pt-3 line-clamp-2">{onlineClass?.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        ))}
      </div>



    </section>
  )
}

export default MeetingsPage