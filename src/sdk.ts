import { io, Socket } from "socket.io-client";
import { RetryOptions } from "./types";

export class MySocketSDK {
  private socket: Socket;
  private connected = false;

  constructor(
    private baseUrl: string,
    private options: Record<string, any> = {},
    private retryOptions: RetryOptions = { retries: Infinity, delay: 2000 }
  ) {
    this.socket = io(this.baseUrl, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: this.retryOptions.retries,
      reconnectionDelay: this.retryOptions.delay,
      ...this.options,
    });

    this.handleEvents();
  }

  private handleEvents() {
    this.socket.on("connect", () => {
      this.connected = true;
      console.log(`[SDK] Connected to ${this.baseUrl}`);
    });

    this.socket.on("disconnect", (reason) => {
      this.connected = false;
      console.warn(`[SDK] Disconnected: ${reason}`);
    });

    this.socket.on("connect_error", (err) => {
      console.error(`[SDK] Connection error: ${err.message}`);
    });

    this.socket.io.on("reconnect_attempt", (attempt) => {
      console.log(`[SDK] Reconnection attempt #${attempt}`);
    });

    this.socket.io.on("reconnect_failed", () => {
      console.error("[SDK] Reconnection failed.");
    });
  }

  connect() {
    if (!this.connected) {
      this.socket.connect();
    }
  }

  disconnect() {
    this.socket.disconnect();
  }

  on<T>(event: string, callback: (data: T) => void) {
    this.socket.on(event, callback);
  }

  off(event: string, callback?: Function) {
    this.socket.off(event, callback as any);
  }

  emit<T>(event: string, payload: T) {
    this.socket.emit(event, payload);
  }
}
