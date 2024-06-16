type Listener = {
  userId: string;
  handler: (ev: any) => void;
}



class Bus {
  listeners = []

  emit(ev: any) {
    this.listeners.forEach((listener) => listener.handler(ev));
  }

  addListener(listener: any) {
    this.listeners.push(listener);
  }
}

