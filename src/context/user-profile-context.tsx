
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
  const [userImage, setUserImageState] = useState('https://picsum.photos/seed/user/100/100');

  useEffect(() => {
    if (!user) return;
    try {
      const savedProfile = localStorage.getItem(`userMedicalProfile_${user.uid}`);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        if (parsedProfile.name) setUserNameState(parsedProfile.name);
        if (parsedProfile.image) setUserImageState(parsedProfile.image);
      } else {
        setUserNameState(user.displayName || 'Guest');
        setUserImageState(user.photoURL || 'https://picsum.photos/seed/user/100/100');
      }
    } catch (e) {
      console.error("Failed to load profile from localStorage in context", e);
    }
  }, [user]);

  const setUserName = (name: string) => {
      setUserNameState(name);
  };

  const setUserImage = (image: string) => {
    setUserImageState(image);
  };

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
