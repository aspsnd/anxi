export class AnxiEvent<EventName extends string | number | symbol = string | number | symbol>{
  intercepted = false
  data
  constructor(public name: EventName, ...data: any[]) {
    this.data = data;
  }
  intercept() {
    this.intercepted = true;
  }
}