
'use server';

import {
  Auth,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import { redirect } from 'next/navigation';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { z } from 'zod';


// This function is for server-side initialization, which is limited in this context.
function initializeFirebaseOnServer(): { auth: Auth } {
  if (!getApps().length) {
    const firebaseApp = initializeApp(firebaseConfig);
    return { auth: getAuth(firebaseApp) };
  }
  const firebaseApp = getApp();
  return { auth: getAuth(firebaseApp) };
}

async function getFirebaseAuth() {
  const { auth } = initializeFirebaseOnServer();
  return auth;
}


export async function logout() {
  // This function is safe to run on the server.
  try {
    const auth = await getFirebaseAuth();
    await firebaseSignOut(auth);
  } catch (e) {
    console.error("Error signing out: ", e);
  }
  redirect('/login');
}


const resetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export async function sendPasswordResetAction(prevState: any, formData: FormData) {
    const validatedFields = resetSchema.safeParse({
        email: formData.get('email'),
    });

    if (!validatedFields.success) {
        return {
            message: null,
            error: validatedFields.error.flatten().fieldErrors.email?.[0] ?? "Invalid email.",
        };
    }

    try {
        const auth = await getFirebaseAuth();
        await sendPasswordResetEmail(auth, validatedFields.data.email);
        return {
            message: "A password reset link has been sent to your email address.",
            error: null,
        };
    } catch(e: any) {
        console.error("Password reset error:", e);
        if (e.code === 'auth/user-not-found') {
            return {
                message: null,
                error: "No user found with this email address."
            };
        }
        return {
            message: null,
            error: "An error occurred. Please try again."
        }
    }
}
