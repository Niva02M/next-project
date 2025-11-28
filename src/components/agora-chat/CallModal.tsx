import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Avatar,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  CallEnd,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
} from '@mui/icons-material';
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';
import axios from 'axios';

interface CallModalProps {
  open: boolean;
  onClose: () => void;
  callType: 'audio' | 'video';
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  currentUserId: string;
}

export default function CallModal({
  open,
  onClose,
  callType,
  recipientId,
  recipientName,
  recipientAvatar,
  currentUserId,
}: CallModalProps) {
  const theme = useTheme();
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localAudioTrack, setLocalAudioTrack] =
    useState<IMicrophoneAudioTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] =
    useState<ICameraVideoTrack | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<Set<string>>(new Set());

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  // Channel name: use sorted IDs to ensure both users join same channel
  const channelName = [currentUserId, recipientId].sort().join('_');

  useEffect(() => {
    if (!open) return;

    const initCall = async () => {
      try {
        setIsConnecting(true);

        // Get RTC token first
        const tokenResponse = await axios.post('/api/agora/rtc-token', {
          userId: currentUserId,
          channel: channelName,
        });

        const { rtcToken, appId } = tokenResponse.data;

        if (!appId) {
          throw new Error('App ID not returned from server');
        }

        // Create Agora client
        const agoraClient = AgoraRTC.createClient({
          mode: 'rtc',
          codec: 'vp8',
        });
        setClient(agoraClient);

        // Set up event listeners
        agoraClient.on('user-published', async (user, mediaType) => {
          try {
            await agoraClient.subscribe(user, mediaType);

            setRemoteUsers((prev) => new Set(prev).add(user.uid.toString()));

            if (mediaType === 'video' && remoteVideoRef.current) {
              user.videoTrack?.play(remoteVideoRef.current);
            }
            if (mediaType === 'audio') {
              user.audioTrack?.play();
            }
          } catch (err) {
            console.error('Error subscribing to user:', err);
          }
        });

        agoraClient.on('user-unpublished', (user) => {
          setRemoteUsers((prev) => {
            const updated = new Set(prev);
            updated.delete(user.uid.toString());
            return updated;
          });
        });

        agoraClient.on('user-left', (user) => {
          setRemoteUsers((prev) => {
            const updated = new Set(prev);
            updated.delete(user.uid.toString());
            return updated;
          });
        });

        // Join channel - using null for uid to auto-generate
        await agoraClient.join(appId, channelName, rtcToken, null);

        // Create and publish tracks
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        setLocalAudioTrack(audioTrack);

        if (callType === 'video') {
          const videoTrack = await AgoraRTC.createCameraVideoTrack();
          setLocalVideoTrack(videoTrack);

          if (localVideoRef.current) {
            videoTrack.play(localVideoRef.current);
          }

          await agoraClient.publish([audioTrack, videoTrack]);
        } else {
          await agoraClient.publish([audioTrack]);
        }

        setIsConnecting(false);
        setIsConnected(true);
      } catch (error: any) {
        console.error('Call initialization error:', error);
        console.error('Error details:', error.message, error.code);
        setIsConnecting(false);
        alert(
          `Failed to start call: ${error.message || 'Please check your Agora credentials and try again.'}`,
        );
        onClose();
      }
    };

    initCall();

    return () => {
      // Cleanup function
      if (client) {
        client.leave().catch(console.error);
        client.removeAllListeners();
      }
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
      }
    };
  }, [open, callType, channelName, currentUserId]);

  const handleEndCall = async () => {
    if (client) {
      await client.leave();
    }
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    onClose();
  };

  const toggleAudio = () => {
    if (localAudioTrack) {
      if (isAudioMuted) {
        localAudioTrack.setEnabled(true);
      } else {
        localAudioTrack.setEnabled(false);
      }
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleVideo = () => {
    if (localVideoTrack) {
      if (isVideoMuted) {
        localVideoTrack.setEnabled(true);
      } else {
        localVideoTrack.setEnabled(false);
      }
      setIsVideoMuted(!isVideoMuted);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleEndCall}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1a1a1a',
          color: 'white',
          borderRadius: 3,
          minHeight: '500px',
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative', height: '500px' }}>
        {isConnecting ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            gap={2}
          >
            <CircularProgress sx={{ color: theme.palette.primary.main }} />
            <Typography>Connecting...</Typography>
          </Box>
        ) : (
          <>
            {/* Remote video container */}
            <Box
              ref={remoteVideoRef}
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: '#2a2a2a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {remoteUsers.size === 0 && (
                <Box textAlign="center">
                  <Avatar
                    src={recipientAvatar}
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: theme.palette.primary.main,
                      fontSize: '40px',
                      margin: '0 auto',
                      mb: 2,
                    }}
                  >
                    {recipientName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h6">{recipientName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Calling...
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Local video preview (bottom right corner) */}
            {callType === 'video' && (
              <Box
                ref={localVideoRef}
                sx={{
                  position: 'absolute',
                  bottom: 100,
                  right: 20,
                  width: 150,
                  height: 150,
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '2px solid white',
                  bgcolor: '#000',
                }}
              >
                {isVideoMuted && (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#2a2a2a',
                    }}
                  >
                    <VideocamOff sx={{ fontSize: 40, color: '#666' }} />
                  </Box>
                )}
              </Box>
            )}

            {/* Call controls */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 2,
                bgcolor: 'rgba(0,0,0,0.5)',
                borderRadius: 3,
                p: 1,
              }}
            >
              <IconButton
                onClick={toggleAudio}
                sx={{
                  bgcolor: isAudioMuted
                    ? theme.palette.error.main
                    : 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    bgcolor: isAudioMuted
                      ? theme.palette.error.dark
                      : 'rgba(255,255,255,0.3)',
                  },
                  color: 'white',
                }}
              >
                {isAudioMuted ? <MicOff /> : <Mic />}
              </IconButton>

              {callType === 'video' && (
                <IconButton
                  onClick={toggleVideo}
                  sx={{
                    bgcolor: isVideoMuted
                      ? theme.palette.error.main
                      : 'rgba(255,255,255,0.2)',
                    '&:hover': {
                      bgcolor: isVideoMuted
                        ? theme.palette.error.dark
                        : 'rgba(255,255,255,0.3)',
                    },
                    color: 'white',
                  }}
                >
                  {isVideoMuted ? <VideocamOff /> : <Videocam />}
                </IconButton>
              )}

              <IconButton
                onClick={handleEndCall}
                sx={{
                  bgcolor: theme.palette.error.main,
                  '&:hover': { bgcolor: theme.palette.error.dark },
                  color: 'white',
                }}
              >
                <CallEnd />
              </IconButton>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
