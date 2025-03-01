import "../styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { TranslationProvider } from '../context/TranslationContext';

export default function App({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <TranslationProvider>
        <Component {...pageProps} />
      </TranslationProvider>
    </GoogleOAuthProvider>
  );
}
