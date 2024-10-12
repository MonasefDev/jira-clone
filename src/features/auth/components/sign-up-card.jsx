import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DottedSeparator } from "@/src/components/dotted-separator";

// Define schema using Zod for validation
const signupSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }), // Name validation
  email: z.string().email({ message: "Invalid email format" }), // Email validation
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }), // Password validation
});

export const SignUpCard = () => {
  // Initialize react-hook-form with zod schema resolver
  const form = useForm({
    resolver: zodResolver(signupSchema), // Use zod for validation
    defaultValues: {
      name: "", // Initial empty value to avoid uncontrolled to controlled warning
      email: "", // Initial empty value
      password: "", // Initial empty value
    },
  });

  // Form submission handler
  const onSubmit = (data) => {
    console.log("Form Data:", data); // Log the form data on successful submission
  };

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl py-4">Sign Up</CardTitle>
        <p>
          By signing up, you agree to the Terms of Service and Privacy Policy.{" "}
          <Link href="/privacy">
            <span className="text-blue-700">Privacy Policy</span>
          </Link>{" "}
          and{" "}
          <Link href="/terms">
            <span className="text-blue-700">Terms of Service</span>
          </Link>
        </p>
      </CardHeader>
      <CardContent className="p-7">
        {/* Form wrapper */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Input */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.name?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            {/* Email Input */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.email?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            {/* Password Input */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.password?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" size="lg" className="w-full">
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7 w-full h-full">
        {/* Separator */}
        <div className="border-t-2 border-gray-300 my-4"></div>
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button size="lg" variant="secondary" className="w-full">
          <FcGoogle className="mr-2 size-5" />
          Sign Up with Google
        </Button>
        <Button size="lg" variant="secondary" className="w-full">
          <FaGithub className="mr-2 size-5" />
          Sign Up with GitHub
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4 items-center justify-center">
        <p>
          Already have an account?
          <Link href="/sign-in">
            <span className="text-blue-700">&nbsp; Sign In</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
