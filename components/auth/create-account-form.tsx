"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Must be a valid email address",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(7, {
      message: "Password must be at least 7 characters",
    })
    .max(12, {
      message: "Password must be at most 12 characters",
    }),
});

export function CreateAccountForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const supabase = createClientComponentClient({});
      const { email, password } = values;

      const {
        error,
        data: { user },
      } = await supabase.auth.signUp({
        email,
        password,
      });

      // this is for email verification
      // options: {
      //     emailRedirectTo: `${location.origin}/auth/callback`,
      //   },

      if (user) {
        form.reset();
        // router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.log("CreateAccountForm", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <span className="text-lg">You will love it</span>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="E-mail" {...field} />
                </FormControl>
                <FormDescription>This is your E-mail</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormDescription>This is your Password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">
            {isLoading ? "Loading..." : "Create Account"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
