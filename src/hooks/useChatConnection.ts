// hooks/useChatConnection.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useClient } from 'agora-chat-uikit';

export const useChatConnection = (currentUser: string) => {
  const client = useClient();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    axios
      .post('/api/agora/token', { userId: currentUser })
      .then((res) => {
        setToken(res.data.token);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Token error:', err.response?.data || err.message);
        setError('Failed to authenticate. Please try again.');
        setLoading(false);
      });
  }, [currentUser]);

  useEffect(() => {
    if (!client || !token) return;
    client
      .open({ user: currentUser, accessToken: token })
      .then(() => {
        setIsConnected(true);
      })
      .catch((err: unknown) => {
        console.error('Connection error:', err);
        setError('Failed to connect to chat service.');
      });
  }, [client, token, currentUser]);

  return { token, loading, error, isConnected };
};
