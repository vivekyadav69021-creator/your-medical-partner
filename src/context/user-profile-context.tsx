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
    // Logic to determine the best name and image
    const updateProfile = () => {
      let finalName = 'Guest';
      let finalImage = 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&h=200&auto=format&fit=crop';

      // 1. Check Local Storage First (Fastest, handles fresh signup redirect)
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

      // 2. If Auth user exists, use it as the source of truth if local is empty
      if (user) {
        // Only override if local name is still default or we are logged in as someone else
        if (finalName === 'Guest' || finalName === 'Guest User') {
           finalName = user.displayName || (user.isAnonymous ? 'Guest User' : user.email?.split('@')[0] || 'User');
        }
        if (user.photoURL && (finalImage.includes('unsplash') || finalImage.includes('picsum'))) {
            finalImage = user.photoURL;
        }
      }

      setUserNameState(finalName);
      setUserImageState(finalImage);
    };

    updateProfile();
    
    // Set a small interval to re-check if name has propagated from Firebase (rare edge case)
    const timer = setTimeout(updateProfile, 1000);
    return () => clearTimeout(timer);

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
