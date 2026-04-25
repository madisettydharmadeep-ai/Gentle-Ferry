'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../utils/AuthContext';
import LandingPage from './components/LandingPage';

export default function HomePage() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <LandingPage />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
