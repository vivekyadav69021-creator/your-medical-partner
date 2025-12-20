
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUser, useDoc, useMemoFirebase, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

type UserProfile = {
  name?: string;
  profileCompleted?: boolean;
  // Add other profile fields here as needed
}

type UserProfileContextType = {
  userName: string;
  userImage: string;
  profileCompleted: boolean;
  setUserName: (name: string) => void;
  setUserImage: (image: string) => void;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  
  const userProfileRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const [userName, setUserNameState] = useState('User');
  const [userImage, setUserImage] = useState('https://picsum.photos/seed/user/100/100');
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !isProfileLoading) {
      if (user) {
        // Set user name from profile if available, otherwise from auth, finally fallback
        setUserNameState(userProfile?.name || user.displayName || user.email || 'User');
        setUserImage(user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`);
        setProfileCompleted(userProfile?.profileCompleted || false);
      } else {
        // Reset on logout
        setUserNameState('User');
        setUserImage('https://picsum.photos/seed/user/100/100');
        setProfileCompleted(false);
      }
    }
  }, [user, userProfile, isUserLoading, isProfileLoading]);

  const setUserName = (name: string) => {
      setUserNameState(name);
  };

  return (
    <UserProfileContext.Provider value={{ userName, userImage, profileCompleted, setUserName, setUserImage }}>
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
