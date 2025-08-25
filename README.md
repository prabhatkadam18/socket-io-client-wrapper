# Socket Wrapper SDK

A lightweight WebSocket SDK wrapper with auto-retry support for React applications.

## Installation

```bash
npm install socket-wrapper-sdk
```

## Usage

### Basic Example

```typescript
import { useEffect } from "react";
import { MySocketSDK } from "socket-wrapper-sdk";

const socket = new MySocketSDK(
  "http://localhost:3000",
  {},
  { retries: 5, delay: 3000 }
);

export default function ChatPage() {
  useEffect(() => {
    socket.connect();

    socket.on<{ message: string }>("message", (data) => {
      console.log("New message:", data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Chat App with Auto Retry</div>;
}
```

### Advanced Configuration

```typescript
import { MySocketSDK } from "socket-wrapper-sdk";

const connectionOptions = {
  transports: ["websocket", "polling"],
  auth: {
    token: "your-auth-token",
  },
};

const retryOptions = {
  retries: 10,
  delay: 1000,
};

const socket = new MySocketSDK(
  "wss://your-server.com",
  connectionOptions,
  retryOptions
);
```

### API Methods

```typescript
// Connect to server
socket.connect();

// Listen to events
socket.on<{ message: string }>("message", (data) => {
  console.log(data.message);
});

// Emit events
socket.emit<{ message: string }>("send_message", { message: "Hello!" });

// Disconnect
socket.disconnect();
```

### React Hook Example

```typescript
import { useEffect, useState } from "react";
import { MySocketSDK } from "socket-wrapper-sdk";

export function useSocket(url: string) {
  const [socket, setSocket] = useState<MySocketSDK | null>(null);

  useEffect(() => {
    const socketInstance = new MySocketSDK(url);
    setSocket(socketInstance);
    socketInstance.connect();

    return () => {
      socketInstance.disconnect();
    };
  }, [url]);

  return socket;
}
```
