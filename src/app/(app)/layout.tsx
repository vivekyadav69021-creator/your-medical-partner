import MainLayout from '@/components/layout/main-layout';
import { UserProfileProvider } from '@/context/user-profile-context';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProfileProvider>
      <MainLayout>{children}</MainLayout>
    </UserProfileProvider>
  );
}
