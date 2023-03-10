
export class Event {
  private handled = false;
  preventDefault(){
    this.handled = true;
  }
  isHandled() {
    return this.handled;
  }
}

