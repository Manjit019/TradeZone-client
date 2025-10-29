import { SOCKET_URL } from '@services/API';
import { refresh_token } from '@services/apiConfig';
import { token_storage } from '@store/storage';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface WSService {
  initializeSocket: () => void;
  emit: (event: string, data?: Record<string, unknown>) => void;
  on: (event: string, cb: (data: any) => void) => void;
  off: (event: string) => void;
  removeListner: (listenerName: string) => void;
  updateAccessToken: () => void;
}

const WSClient = createContext<WSService | undefined>(undefined);

export const WSProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socketAccessToken, setSocketAccessToken] = useState<string | null>(
    null,
  );
  const [changedToken, setChangedToken] = useState<boolean>(false);

  const socket = useRef<Socket>(null);

  useEffect(() => {
    socket.current = io(SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true,
      extraHeaders: {
        access_token: socketAccessToken || '',
      },
    });

    if (socketAccessToken) {
      socket.current.on('connect_error', error => {
        if (error.message === 'Authentication error') {
          console.log('Auth connection error', error.message);
          refresh_token('socket', true, updateAccessToken);
        }
      });
    }
  }, [socketAccessToken]);

  useEffect(() => {
    const token = token_storage.getString('socket_access_token') as any;
    setSocketAccessToken(token);
  }, [changedToken]);

  const emit = (event: string, data: Record<string, unknown> = {}) => {
    socket.current?.emit(event, data);
  };
  const on = (event: string, cb: (data: any) => void) => {
    socket.current?.on(event, cb);
  };

  const off = (event: string) => {
    socket.current?.off(event);
  };

  const removeListner = (listenerName: string) => {
    socket.current?.removeListener(listenerName);
  };

  const updateAccessToken = () => {
    setChangedToken(!changedToken);
  };

  const socketService: WSService = {
    initializeSocket: () => {},
    emit,
    off,
    on,
    removeListner,
    updateAccessToken,
  };

  return (
    <WSClient.Provider value={socketService}>{children}</WSClient.Provider>
  );
};


export const useWS = () => {
  const context = useContext(WSClient);
  if (!context) {
    throw new Error('useWS must be used within a WSProvider');
  }
  return context;
};
