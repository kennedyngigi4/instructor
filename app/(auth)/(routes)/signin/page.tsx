"use client"

import React, { useState } from 'react';
import axios from 'axios';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react';


const formSchema = z.object({
  email: z.string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
  password: z.string({ required_error: "Password is required" })
          .min(1, "Password is required")
          .min(6, "Password must be more than 6 characters")
          .max(32, "Password must be less than 32 characters")
})

const SignInPage = () => {
  const [passwordView, setPasswordView] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    console.log(res)
    if(res.error){
      console.log(res)
    } else {
      router.push('/');
    }
  }

  return (
    <section className="flex flex-col space-y-10">
      <div>
        <h6 className="text-2xl font-bold text-isky_orange">Log in</h6>
        <p className="text-slate-500">Welcome back to empowering innovators!</p>
      </div>


      <div className="w-[90%]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField 
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      disabled={isSubmitting}
                      placeholder="e.g. johndoe@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={passwordView ? "text" : "password"}
                        disabled={isSubmitting}
                        placeholder="********"
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-right">
              <Link className="text-isky_blue py-2" href="/reset-password">Forgot Password?</Link>
            </div>

            <Button type="submit" className="bg-isky_orange" disabled={!isValid || isSubmitting}>Log in</Button>
          </form>
        </Form>
        <div className="mt-3">
          <p className=" text-black py-5 text-lg font-lato font-normal">Don't have an account? <Link className="text-isky_blue font-bold" href="/signup">Sign up</Link></p>
        </div>
      </div>

    </section>
  )
}

export default SignInPage