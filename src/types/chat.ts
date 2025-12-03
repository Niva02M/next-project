// types.ts
export interface AgoraUser {
  userId: string;
  type: string;
  created: number;
  modified: number;
  username: string;
  activated: boolean;
  nickname?: string;
  avatarurl?: string;
}

export type UserProfile = {
  nickname: string;
  avatarurl: string;
};

export interface Conversation {
  chatType: 'singleChat' | 'groupChat' | 'chatRoom';
  conversationId: string;
  name: string;
  lastMessage: any;
  unreadCount: number;
  isOnline?: boolean;
}

export interface CreateGroupOptions {
  data: {
    groupname: string;
    desc: string;
    members: string[];
    public: boolean;
    approval: boolean;
    allowinvites: boolean;
    inviteNeedConfirm: boolean;
  };
}
