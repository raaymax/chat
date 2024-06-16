

class Bus {
  listeners = []

  emit(ev: any) {
    this.listeners.forEach((listener) => listener(ev));
  }

  
}
