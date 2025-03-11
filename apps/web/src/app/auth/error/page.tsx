'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Alert,
} from '@supply-chain-system/ui';
import Link from 'next/link';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('An authentication error occurred');

  useEffect(() => {
    const error = searchParams.get('error');

    if (error) {
      switch (error) {
        case 'CredentialsSignin':
          setErrorMessage('Invalid email or password. Please try again.');
          break;
        case 'SessionRequired':
          setErrorMessage('You need to be signed in to access this page.');
          break;
        case 'AccessDenied':
          setErrorMessage('You do not have permission to access this resource.');
          break;
        case 'OAuthSignin':
        case 'OAuthCallback':
        case 'OAuthCreateAccount':
        case 'EmailCreateAccount':
        case 'Callback':
        case 'OAuthAccountNotLinked':
        case 'EmailSignin':
        case 'CredentialsSignup':
        case 'Default':
        default:
          setErrorMessage('An authentication error occurred. Please try again.');
          break;
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Supply Chain System</h1>
          <p className="mt-2 text-sm text-gray-600">Authentication Error</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="error" title="Error">
              {errorMessage}
            </Alert>
            <p className="text-sm text-gray-600">
              Please try signing in again or contact support if the problem persists.
            </p>
          </CardContent>
          <CardFooter>
            <Link
              href="/auth/login"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
