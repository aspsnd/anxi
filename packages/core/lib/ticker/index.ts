export class AnxiTicker {
  static _started = false
  static tickers = new Set<AnxiTicker>()
  static lastTime = performance.now()
  static start() {
    this._started = true;
    this.lastTime = performance.now();
    const next = () => {
      const now = performance.now();
      const cTime = now - this.lastTime;
      this.lastTime = now;
      for (const ticker of this.tickers) {
        ticker.ruuning && ticker.onFrame(cTime);
      }
      requestAnimationFrame(next);
    }
    requestAnimationFrame(next);
  }
  deltaTime: number
  deltaThreshold:number
  lastTime = 0
  lastLastDelta = 0
  constructor(fps: number = 60, public aheadThresholdRate = .5) {
    this.deltaTime = 1000 / fps;
    this.deltaThreshold = aheadThresholdRate * this.deltaTime;
    AnxiTicker.tickers.add(this);
  }

  ruuning = false;
  start(){
    if(!AnxiTicker._started)AnxiTicker.start();
    this.lastTime = AnxiTicker.lastTime;
    this.ruuning = true;
  }
  stop(){
    this.ruuning = false;
  }
  /**
   * @param delta 上一帧到现在的毫秒数
   */
  onFrame(delta: number) {
    let last = delta + this.lastLastDelta;
    while(last > this.deltaThreshold){
      last -= this.deltaTime;
      this.onTime();
      this.lastTime += this.deltaThreshold;
    }
    this.lastLastDelta = last;
  }
  onTime(){

  }
  destroy() {
    AnxiTicker.tickers.delete(this);
  }

}