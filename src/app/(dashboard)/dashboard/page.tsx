'use client';

import { UIKitProvider } from 'agora-chat-uikit';
import ChatApp from 'components/agora-chat/ChatApp';
import { useSession } from 'next-auth/react';

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
          messageInput: { picture: true, file: true, video: false, record: true, contactCard: false, emoji: true, moreAction: true }
        }
      }}
    >
      <ChatApp currentUser={session.user.id} />
    </UIKitProvider>
  );
}
