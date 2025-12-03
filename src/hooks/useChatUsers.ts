import { useState, useEffect } from 'react';
import axios from 'axios';
import { AgoraUser, UserProfile } from '../types/chat';

export const useChatUsers = () => {
  const [allUsers, setAllUsers] = useState<AgoraUser[]>([]);
  const [userProfilesMap, setUserProfilesMap] = useState<
    Map<string, UserProfile>
  >(new Map());

  const fetchUsersWithProfiles = async () => {
    const res = await axios.get('/api/agora/users');
    const userList = res.data.entities || [];

    const users: AgoraUser[] = [];
    const profilesMap = new Map<string, UserProfile>();

    for (const u of userList) {
      let meta;
      try {
        const metaRes = await axios.get(
          `/api/agora/get-user?userId=${u.username}`,
        );
        meta = metaRes.data.data;
      } catch {
        meta = null;
      }

      const userProfile: UserProfile = {
        nickname: meta?.nickname || u.username,
        avatarurl: meta?.avatarurl || '',
      };

      const fullUser: AgoraUser = {
        userId: u.username,
        type: u.type,
        created: u.created,
        modified: u.modified,
        activated: u.activated,
        username: u.username,
        nickname: userProfile.nickname,
        avatarurl: userProfile.avatarurl,
      };

      users.push(fullUser);
      profilesMap.set(u.username, userProfile);
    }

    setUserProfilesMap(profilesMap);
    return users;
  };

  useEffect(() => {
    fetchUsersWithProfiles().then(setAllUsers);
  }, []);

  const getUserProfileFromMap = (id: string): UserProfile => {
    return userProfilesMap.get(id) || { nickname: id, avatarurl: '' };
  };

  return { allUsers, userProfilesMap, getUserProfileFromMap };
};
