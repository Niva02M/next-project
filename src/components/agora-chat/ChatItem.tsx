import { Avatar } from 'agora-chat-uikit';
import React, { useState } from 'react';
import CallMessageBubble from './CallMessageBubble';

type RawMessage = {
  from?: string;
  to?: string;
  time?: number;
  timestamp?: number;
  msg?: string;
  content?: string;
  body?: string;
  type?: string;
  status?: string;
  url?: string;
  thumb?: string;
  filename?: string;
  file?: File;
  file_length?: number;
  length?: number;
  addr?: string;
  ext?: any;
};

type UserProfile = {
  nickname?: string;
  avatarurl?: string;
};

type ChatItemProps = {
  msg: RawMessage;
  currentUser: string;
  userProfiles?: Map<string, UserProfile>;
  getUserProfileFromMap: (id: string) => UserProfile | undefined;
};

function extractMessageProperties(msg: RawMessage): RawMessage {
  if (!msg || typeof msg !== 'object') return msg;
  try {
    return {
      from: msg.from,
      to: msg.to,
      time: msg.time,
      timestamp: msg.timestamp,
      msg: msg.msg,
      content: msg.content,
      body: msg.body,
      type: msg.type,
      status: msg.status,
      url: msg.url,
      thumb: msg.thumb,
      filename: msg.filename,
      file: msg.file,
      file_length: msg.file_length,
      length: msg.length,
      addr: msg.addr,
      ext: msg.ext,
    };
  } catch {
    try {
      return JSON.parse(JSON.stringify(msg));
    } catch {
      return {};
    }
  }
}

const Bubble = ({
  isCurrentUser,
  style,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  isCurrentUser: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div
      {...rest}
      style={{
        padding: '12px 16px',
        borderRadius: isCurrentUser
          ? '16px 16px 4px 16px'
          : '16px 16px 16px 4px',
        backgroundColor: isCurrentUser ? '#1C1F26' : '#F3F4F6',
        color: isCurrentUser ? '#F3F4F6' : '#1C1F26',
        fontSize: '14px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Timestamp = ({
  isCurrentUser,
  time,
  children,
}: {
  isCurrentUser: boolean;
  time: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      style={{
        fontSize: '11px',
        color: '#9CA3AF',
        marginTop: '4px',
        padding: '0 4px',
        textAlign: isCurrentUser ? 'right' : 'left',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
      }}
    >
      {time}
      {children}
    </div>
  );
};

const MediaPreviewModal = ({
  open,
  type,
  url,
  onClose,
}: {
  open: boolean;
  type: string;
  url: string;
  onClose: () => void;
}) => {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '10px',
          padding: '20px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {type === 'img' && (
          <img
            src={url}
            alt=""
            style={{
              maxWidth: '80vw',
              maxHeight: '70vh',
              objectFit: 'contain',
            }}
          />
        )}

        {type === 'audio' && (
          <audio
            controls
            src={url}
            style={{
              width: '300px',
            }}
          />
        )}

        {type === 'file' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                fontSize: '15px',
                color: '#444',
                wordBreak: 'break-all',
                textAlign: 'center',
              }}
            >
              File ready to download
            </div>

            <a
              href={url}
              download
              style={{
                background: '#33383b',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '15px',
              }}
            >
              Download file
            </a>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            alignSelf: 'center',
            marginTop: '8px',
            padding: '8px 16px',
            background: '#e0e0e0',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const ChatItem = ({
  msg,
  currentUser,
  userProfiles = new Map(),
  getUserProfileFromMap,
}: ChatItemProps) => {
  const [preview, setPreview] = useState<{
    open: boolean;
    type: string;
    url: string;
  }>({
    open: false,
    type: '',
    url: '',
  });

  const safeMsg = extractMessageProperties(msg);

  if (msg?.status === 'read') {
    localStorage.setItem('latest_read', msg?.time + '==' + msg?.to);
  }

  if (!safeMsg) return null;

  const userProfile = userProfiles.get(safeMsg.from || '') || {};
  const userAvatar = userProfile.avatarurl;
  const userNickname = userProfile.nickname;

  const fallbackProfile = getUserProfileFromMap(safeMsg.from || '');
  const avatarUrl = userAvatar || fallbackProfile?.avatarurl || '';
  const displayName = userNickname || fallbackProfile?.nickname || '...';
  const isCurrentUser = safeMsg.from === currentUser;

  const messageTime = safeMsg.time
    ? new Date(safeMsg.time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '11:23 AM';

  const getIsReadStatus = () => {
    const latest_read = localStorage.getItem('latest_read');
    const current_id = msg?.time + '==' + msg.to;
    return current_id == latest_read ? 'read' : msg.status;
  };

  const ReadReceipt = () => {
    if (!isCurrentUser) return null;
    const finalStatus = getIsReadStatus();
    if (finalStatus === 'read') {
      return (
        <div
          style={{ display: 'flex', alignItems: 'center', marginLeft: '4px' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 8L5 11L9 7"
              stroke="#868585ff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 8L9 11L13 7"
              stroke="#868585ff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{ fontSize: '9px', color: '#868585ff', marginLeft: '2px' }}
          >
            seen
          </span>
        </div>
      );
    }
    if (finalStatus === 'received') {
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{ marginLeft: '4px' }}
        >
          <path
            d="M2 8L5 11L9 7"
            stroke="#868585ff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 8L9 11L13 7"
            stroke="#868585ff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    if (finalStatus === 'sent') {
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{ marginLeft: '4px' }}
        >
          <path
            d="M3 8L6 11L13 4"
            stroke="#868585ff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    return null;
  };

  if (msg.ext?.type === 'VOICE_CALL_INVITE') {
    return (
      <>
        <MediaPreviewModal
          open={preview.open}
          type={preview.type}
          url={preview.url}
          onClose={() => setPreview({ open: false, type: '', url: '' })}
        />

        <div
          style={{
            display: 'flex',
            marginTop: '8px',
            marginBottom: '8px',
            justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
            alignItems: 'flex-end',
            gap: '8px',
            padding: '0 16px',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {!isCurrentUser && avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              style={{
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Avatar
              style={{
                width: 32,
                height: 32,
                display: isCurrentUser ? 'none' : 'block',
              }}
            >
              {displayName?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
          )}

          <div
            style={{
              maxWidth: '60%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
            }}
          >
            <CallMessageBubble
              message={msg}
              currentUserId={currentUser}
              getUserProfileFromMap={getUserProfileFromMap}
            />
          </div>
        </div>
      </>
    );
  }

  const renderMessageContent = () => {
    if (safeMsg.type === 'txt') {
      return (
        <Bubble isCurrentUser={isCurrentUser}>
          {safeMsg.msg || safeMsg.content || safeMsg.body || '(Empty message)'}
          <Timestamp isCurrentUser={isCurrentUser} time={messageTime}>
            <ReadReceipt />
          </Timestamp>
        </Bubble>
      );
    }

    if (safeMsg.type === 'img') {
      return (
        <div
          onClick={() =>
            setPreview({
              open: true,
              type: 'img',
              url: safeMsg.url || safeMsg.thumb || '',
            })
          }
        >
          <img
            src={safeMsg.url || safeMsg.thumb}
            alt="Shared image"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '400px',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          <Timestamp isCurrentUser={isCurrentUser} time={messageTime}>
            <ReadReceipt />
          </Timestamp>
        </div>
      );
    }

    if (safeMsg.type === 'file') {
      return (
        <Bubble
          isCurrentUser={isCurrentUser}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
          onClick={() => {
            if (!msg.url) return;
            setPreview({ open: true, type: 'file', url: msg.url });
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          >
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '500' }}>{msg.filename || 'File'}</div>
            {msg.file_length && (
              <div style={{ fontSize: '12px', color: '#6B7280' }}>
                {(msg.file_length / 1024).toFixed(2)} KB
              </div>
            )}
          </div>
          <Timestamp isCurrentUser={isCurrentUser} time={messageTime}>
            <ReadReceipt />
          </Timestamp>
        </Bubble>
      );
    }

    if (safeMsg.type === 'audio') {
      return (
        <Bubble
          isCurrentUser={isCurrentUser}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '200px',
            cursor: 'pointer',
          }}
          onClick={() =>
            msg.url &&
            setPreview({
              open: true,
              type: 'audio',
              url: msg.url,
            })
          }
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#667eea 0,#764ba2 100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '500' }}>
              {msg.filename || 'Audio message'}
            </div>
            {msg.length && (
              <div style={{ fontSize: '12px', color: '#6B7280' }}>
                {msg.length}s
              </div>
            )}
          </div>
          <Timestamp isCurrentUser={isCurrentUser} time={messageTime}>
            <ReadReceipt />
          </Timestamp>
        </Bubble>
      );
    }

    return (
      <Bubble isCurrentUser={isCurrentUser}>
        Unknown message type: {safeMsg.type}
        <Timestamp isCurrentUser={isCurrentUser} time={messageTime}>
          <ReadReceipt />
        </Timestamp>
      </Bubble>
    );
  };

  return (
    <>
      <MediaPreviewModal
        open={preview.open}
        type={preview.type}
        url={preview.url}
        onClose={() => setPreview({ open: false, type: '', url: '' })}
      />

      <div
        style={{
          display: 'flex',
          marginTop: '8px',
          marginBottom: '8px',
          justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
          alignItems: 'flex-end',
          gap: '8px',
          padding: '0 16px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {!isCurrentUser && avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            style={{
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Avatar
            style={{
              width: 32,
              height: 32,
              display: isCurrentUser ? 'none' : 'block',
            }}
          >
            {displayName?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
        )}

        <div
          style={{
            maxWidth: '60%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
          }}
        >
          {renderMessageContent()}
        </div>
      </div>
    </>
  );
};

export default ChatItem;
