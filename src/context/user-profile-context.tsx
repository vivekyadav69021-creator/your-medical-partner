
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserProfileContextType = {
  userName: string;
  userImage: string;
  setUserName: (name: string) => void;
  setUserImage: (image: string) => void;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [userName, setUserNameState] = useState('Guest');
  const [userImage, setUserImage] = useState('https://picsum.photos/seed/user/100/100');

  const setUserName = (name: string) => {
      setUserNameState(name);
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
