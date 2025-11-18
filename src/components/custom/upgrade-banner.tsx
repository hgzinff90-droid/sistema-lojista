'use client';

import { AlertCircle } from 'lucide-react';

interface UpgradeBannerProps {
  message: string;
}

export function UpgradeBanner({ message }: UpgradeBannerProps) {
  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 md:px-8 shadow-lg">
      <div className="flex items-center justify-center gap-3 max-w-7xl mx-auto">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm md:text-base font-medium text-center">
          {message}
        </p>
      </div>
    </div>
  );
}
