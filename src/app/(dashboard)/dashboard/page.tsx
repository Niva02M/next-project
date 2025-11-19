'use client';

import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

// Dynamically import the UIKitProvider with SSR disabled
const UIKitProvider = dynamic(
  () => import('agora-chat-uikit').then((mod) => mod.UIKitProvider),
  { ssr: false },
);

// Dynamically import ChatApp as well
const ChatApp = dynamic(() => import('components/agora-chat/ChatApp'), {
  ssr: false,
});
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const appKey = process.env.NEXT_PUBLIC_AGORA_APP_KEY as string;

  if (status === 'loading') return <div>Loading...</div>;
  if (!session?.user?.id) return <div>You must be logged in to view chat.</div>;

  return (
    <UIKitProvider
      initConfig={{ appKey }}
      features={{
        chat: {
          messageInput: {
            picture: true,
            file: true,
            video: false,
            record: true,
            contactCard: false,
            emoji: true,
            moreAction: true,
          },
        },
      }}
    >
      <ChatApp currentUser={session.user.id} />
    </UIKitProvider>
  );
}
