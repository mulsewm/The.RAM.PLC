"use client"

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "@/lib/auth-client";
import { GoogleLogin } from "@react-oauth/google"; // Import from @react-oauth/google


// Import UI components individually
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";  

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      setError("");
      const { data, error } = await signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setError(error.message || "Login failed");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Error during login");
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Google sign-in callback
  const handleGoogleSuccess = (response: any) => {
    if (!response.credential) return;
  
    signIn.social({
      provider: "google",
      idToken: response.credential,
      callbackURL: "/dashboard",
    })
      .then(() => router.push("/dashboard"))
      .catch((err) => setError("Google login failed: " + err.message));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <Card className="w-full max-w-lg shadow-xl border">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-3xl font-bold">Welcome...</CardTitle>
            <CardDescription>Login to your account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>

            {/* Google Login Button - Using react-oauth/google component */}
            <div className="my-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed")}
              useOneTap
              shape="pill"
              width="100%"
              theme="outline"
            />
            </div>

            {/* Link to account creation */}
            <div className="mt-4 text-center text-sm">
              Don’t have an account?{" "}
              <Link href="/account-creation" className="text-primary hover:underline">
                Apply for GCC
              </Link>
            </div>
          </CardContent>
        </Card>
      </Suspense>
    </div>
  );
}