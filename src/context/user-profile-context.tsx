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
  const [userImage, setUserImageState] = useState('https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&h=200&auto=format&fit=crop');

  useEffect(() => {
    const updateProfile = () => {
      let finalName = 'Guest';
      let finalImage = 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&h=200&auto=format&fit=crop';

      // 1. Check Local Storage First (Fastest)
      try {
        const savedProfile = localStorage.getItem(`userMedicalProfile_local`);
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          if (parsed.name) finalName = parsed.name;
          if (parsed.image) finalImage = parsed.image;
        }
      } catch (e) {
        console.error("Local profile parse error", e);
      }

      // 2. Auth user sync
      if (user) {
        if (finalName === 'Guest' || finalName === 'Guest User') {
           finalName = user.displayName || user.email?.split('@')[0] || 'User';
        }
        if (user.photoURL && (finalImage.includes('unsplash') || finalImage.includes('picsum') || finalImage === '')) {
            finalImage = user.photoURL;
        }
      }

      setUserNameState(finalName);
      setUserImageState(finalImage);
    };

    updateProfile();
    // Watch for potential auth delay
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
