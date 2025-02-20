"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import {
  Form, FormField, FormLabel, FormControl, FormItem, FormMessage
} from "@/components/ui/form"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff } from 'lucide-react';
import CustomPhoneInput from '@/components/ui/phoneinput';
import toast from 'react-hot-toast';


const formSchema = z.object({
  fullname: z.string({ required_error: "Student name is required" })
    .min(1, { message: "Student name is required" }),
  email: z.string({ required_error: "Email address is required" })
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  phone: z.string({ required_error: "Phone number is required" })
    .min(1, { message: "Phone number is required" }),
  password: z.string({ required_error: "Password is required" })
    .min(1, { message: "Password must be more than 6 characters" })
    .max(32, { message: "Password must be less than 32 characters" })
})

const SignupPage = () => {
  const [passwordView, setPasswordView] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      phone: "",
      password: "",
    }
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    let studentData = {
      fullname: values.fullname,
      email: values.email,
      phone: values.phone,
      password: values.password,
      gender: "Male",
      role: "Instructor",
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/account/register/`, studentData)
        .then(async (response) => {
          if (response.data == 201) {
            toast.success("Sign up successful");
            const user = await signIn('credentials', { email: values.email, password: values.password, redirect: false });
            if (user.error) {
              toast.error("Something went wrong", { style: { background: "red", color: "#ffffff" } })
            } else {
              toast.success("Sign in successful");
              router.push("/")
            }
          }
        }).catch((error) => {
          toast.error("Something went wrong", { style: { background: "red", color: "#ffffff" } })
        })

    } catch {
      toast.error("Something went wrong", { style: { background: "red", color: "#ffffff" } })
    }
  }

  return (
    <section className="flex flex-col space-y-10">
      <div>
        <h6 className="text-2xl font-bold text-isky_orange">Sign up</h6>
        <p className="text-slate-500">Join our community</p>
      </div>


      <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => {
                  return <FormItem>
                    <FormLabel>Instructor Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="e.g. John Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-red-600' />
                  </FormItem>
                }}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  return <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="e.g. johndoe@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-red-600' />
                  </FormItem>
                }}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => {
                  return <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <CustomPhoneInput
                        value=""
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-red-600' />
                  </FormItem>
                }}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  return <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={passwordView ? "text" : "password"}
                          placeholder="*********"
                          {...field}
                        />
                        {passwordView ? (
                          <Eye
                            className="absolute right-3 top-2 z-50 cursor-pointer text-gray-400"
                            onClick={() => {
                              setPasswordView(!passwordView)
                            }}
                          />
                        ) : (
                          <EyeOff
                            className="absolute right-3 top-2 z-50 cursor-pointer text-gray-400"
                            onClick={() => {
                              setPasswordView(!passwordView)
                            }}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className='text-red-600' />
                  </FormItem>
                }}
              />

              <div className="mt-3 text-center">
                <Button className="bg-isky_orange hover:bg-isky_blue py-5 text-lg px-28 rounded-3xl font-lato font-bold">Sign up</Button>
              </div>
            </form>
          </Form>
          <div className="mt-3">
            <p className=" text-black py-5 text-lg font-lato font-normal">Already having an account? <Link className="text-isky_blue font-bold" href="/signin">Sign in</Link></p>
          </div>
        </div>
    </section>
  )
}

export default SignupPage