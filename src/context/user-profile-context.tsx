'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUser } from '@/firebase';

type UserProfileContextType = {
  userName: string;
  userImage: string;
  setUserName: (name: string) => void;
  setUserImage: (image: string) => void;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [userName, setUserNameState] = useState('Guest');
  const [userImage, setUserImageState] = useState('');

  useEffect(() => {
    const updateProfile = () => {
      let finalName = 'Guest';
      let finalImage = '';

      // 1. Check Auth user sync (Highest Priority)
      if (user) {
        finalName = user.displayName || user.email?.split('@')[0] || 'User';
        finalImage = user.photoURL || '';
      }

      // 2. Check Local Storage for extended profile data if not in Auth
      try {
        const savedProfile = localStorage.getItem(`userMedicalProfile_local`);
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          if (!finalImage && parsed.image) finalImage = parsed.image;
          if (finalName === 'Guest' && parsed.name) finalName = parsed.name;
        }
      } catch (e) {
        console.error("Local profile parse error", e);
      }

      setUserNameState(finalName);
      setUserImageState(finalImage);
    };

    updateProfile();
    const timer = setTimeout(updateProfile, 500);
    return () => clearTimeout(timer);

  }, [user]);

  const setUserName = (name: string) => setUserNameState(name);
  const setUserImage = (image: string) => setUserImageState(image);

  return (
    <UserProfileContext.Provider value={{ userName, userImage, setUserName, setUserImage }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}