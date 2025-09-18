"use client";

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useNotification } from "../hooks/useNotification";


const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const {notification,setNotification,removeNotificaton} = useNotification();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        removeNotificaton()
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <>
      {children}
      {notification && (
        <div className="fixed top-5 right-5 z-50 max-w-xs w-full bg-white text-gray-800 shadow-lg border border-gray-200 rounded-lg p-4 animate-slide-in">
          <div className="flex items-start space-x-3">
            <div>
              {notification.type === "Success" && (
                <span className="text-green-500 font-bold text-xl">✓</span>
              )}
              {notification.type === "Error" && (
                <span className="text-red-500 font-bold text-xl">✗</span>
              )}
              {notification.type === "Info" && (
                <span className="text-blue-500 font-bold text-xl">i</span>
              )}
            </div>
            <div className="flex-1 pt-1">
              <p className="text-sm text-gray-700">{notification.message}</p>
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

export default NotificationProvider