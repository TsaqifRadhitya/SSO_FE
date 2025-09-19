"use client";

import React, { useEffect, ReactNode, useState } from "react";
import { useNotification } from "../hooks/useNotification";

const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { notificationState, removeNotificaton } = useNotification();

  useEffect(() => {
    if (notificationState && !notificationState.isAppear) {
      const timer = setTimeout(() => {
        removeNotificaton();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notificationState]);

  return (
    <>
      {children}
      {notificationState && (
        <div className="fixed top-5 right-5 z-50 max-w-xs w-full bg-white text-gray-800 shadow-lg border border-gray-200 rounded-lg p-4 animate-slide-in">
          <div className="flex items-start space-x-3">
            <div>
              {notificationState.notification.type === "Success" && (
                <span className="text-green-500 font-bold text-xl">✓</span>
              )}
              {notificationState.notification.type === "Error" && (
                <span className="text-red-500 font-bold text-xl">✗</span>
              )}
              {notificationState.notification.type === "Info" && (
                <span className="text-blue-500 font-bold text-xl">i</span>
              )}
            </div>
            <div className="flex-1 pt-1">
              <p className="text-sm text-gray-700">
                {notificationState.notification.message}
              </p>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        @keyframes slide-in {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default NotificationProvider;
