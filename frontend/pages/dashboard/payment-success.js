import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from "../../components/DashboardLayout";
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from "../../context/TranslationContext";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(5);
  const plan = searchParams.get('plan') || 'standard';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <DashboardLayout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-[#1E1B29] rounded-2xl shadow-xl overflow-hidden p-8 space-y-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <CheckCircleIcon className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-white">
                {t('paymentSuccessful')}
              </h2>
              <p className="mt-2 text-base text-gray-400">
                {t('thankYouForSubscribing', { plan: t(plan) })}
              </p>
              <div className="mt-6 text-sm text-gray-400">
                {t('redirectingIn', { seconds: countdown })}
              </div>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium shadow-lg hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition-all duration-200 hover:scale-105"
                >
                  {t('goToDashboard')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 