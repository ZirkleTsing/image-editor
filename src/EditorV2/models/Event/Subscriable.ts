import { action, makeObservable, observable } from 'mobx';

class Subscriable<Event = (...args: any[]) => any, Payload = Event extends (payload: infer S) => any ? S : any> {
  eventQueue: Event[] = [];

  constructor() {
    makeObservable(this, {
      eventQueue: observable,
      registerEvent: action,
      unregisterEvent: action,
      dispatch: action,
    });
  }

  registerEvent = (event: Event) => {
    this.eventQueue.push(event);
  };

  unregisterEvent = (event: Event) => {
    this.eventQueue.splice(this.eventQueue.indexOf(event), 1);
  };

  dispatch = (payload: Payload) => {
    this.eventQueue.forEach((handler: any) => {
      handler(payload);
    });
  };
}

export abstract class Event {
  abstract attach: () => any
  abstract detach: () => any
}

export default Subscriable;