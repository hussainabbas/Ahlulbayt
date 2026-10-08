import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

import { logger } from '@/core/logging/logger';

type NetworkListener = (isConnected: boolean) => void;

class NetworkManager {
  private isConnected = true;
  private listeners = new Set<NetworkListener>();
  private unsubscribe: (() => void) | null = null;

  async initialize(): Promise<void> {
    const state = await NetInfo.fetch();
    this.isConnected = this.resolveConnected(state);
    logger.info('Network initialized', { isConnected: this.isConnected });

    this.unsubscribe = NetInfo.addEventListener((nextState) => {
      const connected = this.resolveConnected(nextState);
      if (connected !== this.isConnected) {
        this.isConnected = connected;
        logger.info('Network status changed', { isConnected: connected });
        this.listeners.forEach((listener) => listener(connected));
      }
    });
  }

  destroy(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.listeners.clear();
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }

  subscribe(listener: NetworkListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private resolveConnected(state: NetInfoState): boolean {
    // Treat unknown (null) as online; only explicit false is offline.
    return state.isConnected !== false;
  }
}

export const networkManager = new NetworkManager();
