'use client';

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Input,
  Button,
  Alert,
} from '@supply-chain-system/ui';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send password reset email');
      }

      setSuccess(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('An error occurred while sending the password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Supply Chain System</h1>
          <p className="mt-2 text-sm text-gray-600">Reset your password</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {success ? (
                <Alert variant="success" title="Email Sent">
                  If an account exists with this email, you will receive password reset
                  instructions.
                </Alert>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                  </p>
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              {!success && (
                <Button type="submit" fullWidth isLoading={isLoading}>
                  Send Reset Link
                </Button>
              )}
              <Link
                href="/auth/login"
                className="text-sm text-center text-indigo-600 hover:text-indigo-500"
              >
                Back to Sign In
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
