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
  const [userName, setUserName] = useState('User');
  const [userImage, setUserImage] = useState('https://picsum.photos/seed/user/100/100');

  useEffect(() => {
    if (user) {
        setUserName(user.displayName || user.email || 'User');
        setUserImage(user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`);
    }
  }, [user]);

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

    