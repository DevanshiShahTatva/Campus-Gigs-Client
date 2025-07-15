// Dynamic import for socket.io-client to avoid SSR issues and ensure type safety
let io: typeof import("socket.io-client").io;
let Socket: typeof import("socket.io-client").Socket;

try {
  // Try to import normally (ESM)
  ({ io, Socket } = require("socket.io-client"));
} catch {
  // Fallback for ESM import
  io = (await import("socket.io-client")).io;
  Socket = (await import("socket.io-client")).Socket;
}

let socket: InstanceType<typeof Socket> | null = null;

export const getSocket = (
  namespace: string,
  token: string
): InstanceType<typeof Socket> => {
  const wsUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("http", "ws");
  const normalizedNamespace = namespace.startsWith("/") ? namespace : namespace;

  // Always create a new socket if disconnected
  socket = io(`${wsUrl}${normalizedNamespace}`, {
    transports: ["websocket"],
    auth: { token },
    withCredentials: true,
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
