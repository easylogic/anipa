import { makeTimer, timecode } from "./util/functions/time";
import { isFunction, isUndefined } from "./util/functions/func";
import { Timeline } from "./editor/Timeline";

export function Player (animations = [], options = {fps: 60, duration: 1000, container: 'body'}) {

  var fps = isUndefined(options.fps) ? 60 : +options.fps;
  var container = isUndefined(options.container)? 'body' : options.container;
  var speed = isUndefined(options.speed) ? 1 : +options.speed;
  var duration = isUndefined(options.duration) ? 1000 : +options.duration;
  var iterationCount = isUndefined(options.iterationCount) ? 1 : +options.iterationCount;
  var direction = isUndefined(options.direction) ?  'normal' : options.direction;
  var debug = isUndefined(options.debug) ? false : options.debug;

  var onTick = () => {}
  var onStart = () => {}
  var onEnd = () => {}
  var onFirst = () => {}
  var onLast = () => {}

  if (isFunction(options.onTick)) { onTick = options.onTick; }  
  if (isFunction(options.onStart)) { onStart = options.onStart; }  
  if (isFunction(options.onEnd)) { onEnd = options.onEnd; }  
  if (isFunction(options.onFirst)) { onFirst = options.onFirst; }  
  if (isFunction(options.onLast)) { onLast = options.onLast; }    

  var timeline = new Timeline(animations, {
    debug,
    fps,
    container,
    totalTimecode: timecode(fps, duration/1000),
  })
 
  var timer = makeTimer({
    speed,
    duration,
    iterationCount, 
    direction,
    startCallback: onStart,
    endCallback: onEnd,
    firstCallback: onFirst,
    lastCallback: onLast,
    tick: (elapsed, timer) => {
      timeline.seek(timecode(timeline.fps, elapsed / 1000))
      onTick(elapsed, timer, fps);
      if (debug) {
        console.log('tick : ', timeline.fps, elapsed, timer);
      }
    }    
  })

  return {
    get elapsed () { return timer.elapsed },
    get fps () { return timeline.fps },
    get totalTime () { return timeline.totalTime },
    get currentTime () { return timeline.currentTime },
    play () { timer.play() },
    stop () { timer.stop() },
    pause () { timer.pause() }
  }; 
}

export default { Player } 