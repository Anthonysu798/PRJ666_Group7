import "../styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { TranslationProvider } from '../context/TranslationContext';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <TranslationProvider>
        <Component {...pageProps} />
      </TranslationProvider>
      <Toaster />
    </GoogleOAuthProvider>
  );
}
