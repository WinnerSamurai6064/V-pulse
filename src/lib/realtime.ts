type Listener = (data: any) => void;

class VPulseRealtime {
  private socket: WebSocket | null = null;
  private listeners = new Map<string, Set<Listener>>();
  private reconnectTimer: number | null = null;

  connect() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.host;

    this.socket = new WebSocket(`${protocol}://${host}`);

    this.socket.onopen = () => {
      this.emitLocal("socket:open", { connected: true });
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.emitLocal(data.type, data);
        this.emitLocal("*", data);
      } catch {
        this.emitLocal("socket:error", {
          message: "Invalid server message"
        });
      }
    };

    this.socket.onclose = () => {
      this.emitLocal("socket:close", { connected: false });

      if (this.reconnectTimer) {
        window.clearTimeout(this.reconnectTimer);
      }

      this.reconnectTimer = window.setTimeout(() => {
        this.connect();
      }, 1500);
    };

    this.socket.onerror = () => {
      this.emitLocal("socket:error", {
        message: "Realtime connection error"
      });
    };
  }

  send(type: string, payload: Record<string, any> = {}) {
    const message = JSON.stringify({
      type,
      ...payload
    });

    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn("V-PULSE socket not connected yet");
      return;
    }

    this.socket.send(message);
  }

  on(type: string, listener: Listener) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }

    this.listeners.get(type)!.add(listener);

    return () => {
      this.listeners.get(type)?.delete(listener);
    };
  }

  private emitLocal(type: string, data: any) {
    this.listeners.get(type)?.forEach((listener) => listener(data));
  }
}

export const realtime = new VPulseRealtime();
