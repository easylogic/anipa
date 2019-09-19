import { second, timecode, framesToTimecode } from "../util/functions/time";
import { createInterpolateFunction, createTimingFunction } from "./util/interpolate";
import Dom from "../util/Dom";
import { isNotUndefined, isArray, isUndefined } from "../util/functions/func";

export class Timeline {
  constructor (animations = [], options = { container: 'body'}) {
    this.animations = animations; 
    this.compiledAnimation = [] 
    this.options = options 
    this.debug = options.debug || false;

    this.fps = options.fps || 60
    this.totalTime = second(this.fps, options.totalTimecode);
    this.totalTimecode = options.totalTimecode || '00:00:00:00'
    this.currentTime = 0; 
    this.currentTimecode = '00:00:00:00'
    this.startTime = 0 ;
    this.endTime = this.totalTime; 

    this.initialize();
  }

  log () {
    if (this.debug) {
      console.log(...arguments);
    }
  }

  searchBySelector (selector, $container) {
    return $container.$$(selector);
  }

  createContainerElement (container) {
    container = container === 'body' ? document.body : container; 
    var $container = Dom.create(container);

    return $container;
  }

  initialize() {
    this.animations.forEach(animation => {
      var $container = this.createContainerElement(animation.container || this.options.container || 'body');
      var elements = this.searchBySelector(animation.selector, $container);
      animation.compiled = {}
      animation.properties.forEach(p => {
        animation.compiled[`${p.property}`] = this.compiledTimingFunction(elements, p, $container);
      })
    })
    this.log('timeline is initialized.');
  }
  

  searchTimelineOffset (time) {
    var filteredAnimations = [] 
    this.animations.forEach(animation => {
      animation.properties.forEach(p => {
        var list = animation.compiled[`${p.property}`];
        filteredAnimations.push(...list.filter(keyframe => {
          if (keyframe.isOnlyTime && keyframe.startTime == time) return true; 

          return keyframe.startTime <= time && time < keyframe.endTime
        }))
      })
    })

    return filteredAnimations.filter(it => it);
  }

  parseOffset (layer, property, offset)  {
    if (isArray(offset)) {
      var [time, value, timing] = offset 

      if (isUndefined(value)) {
        value = layer.css(property)
      }

      return { time, value, timing }
    } 

    if (offset && isUndefined(offset.value)) {
      offset.value = layer.css(property)
    }

    return offset; 
  }

  compiledTimingFunction (elements = [], p, container) {

    let compiledFunctions = [] 

    if (p.keyframes.length === 1) {
      return compiledFunctions;
    }

    elements.forEach((layer, layerIndex) => {
      compiledFunctions.push(...p.keyframes.map( (offset, index) => {

        var currentOffset = this.parseOffset(layer, p.property, offset);
        var nextOffset = this.parseOffset(layer, p.property, p.keyframes[index + 1]);

        if (!nextOffset) {
          nextOffset = { time: currentOffset.time, value: currentOffset.value + ''};
        }

        var it = {
          layer,
          layerIndex,
          property: p.property,
          isResetFunction: this.checkResetInterpolateFunction(p.property),
          isAttributeFunction: this.checkResetAttributeFunction(p.property),
          isOnlyTime: currentOffset.time === nextOffset.time,
          startTime: currentOffset.time,
          endTime: nextOffset.time, 
          startValue: currentOffset.value,
          endValue: nextOffset.value,
          timing: currentOffset.timing,
          interpolateFunction: createInterpolateFunction(layer, p.property, currentOffset.value, nextOffset.value, container),
          timingFunction: createTimingFunction(currentOffset.timing)
        }

        it.func = this.makeTimingFunction(it);      
    
        return it; 
      }).filter(it => it));


    })

    return compiledFunctions
  }

  makeTimingFunction (it) {
    // 시작시간 끝 시간이 있음 . 그리고 현재 시간이 있음 
    return (time) => {
      var totalT = (it.endTime - it.startTime);
      var t = 1; 
      if (totalT !== 0) {
        t = (time - it.startTime)/totalT;
      }

      return it.interpolateFunction(it.timingFunction(t), t, it.timingFunction);
    }
  }

  checkResetInterpolateFunction (property) {

    switch(property) {
    case 'offset-path':
    case 'background-image':
    case 'border':
      return true; 
    }

    return false; 
  }

  checkResetAttributeFunction (property) {

    switch(property) {
    case 'd':
    case 'points':
      return true; 
    }

    return false; 
  }  

  seek (frameOrCode = null, filterFunction = (it => it)) {


    if (isNotUndefined(frameOrCode) || frameOrCode !== null) {
      this.setTimelineCurrentTime(frameOrCode);
    }

    var time = this.currentTime * 1000;
    this.log('seek start : ', time);
    var filteredList = this.searchTimelineOffset(time).filter(filterFunction)

    var layerSet = new WeakMap();
    var layerList = [] 
    filteredList.forEach(it => {
      if (!layerSet.has(it.layer)) {
        layerSet.set(it.layer, {});
        layerList.push(it.layer);
      }

      var layerCss = layerSet.get(it.layer)


      if (it.isAttributeFunction) {
        it.func(time, it.layer, it.layerIndex);
      } else if (it.isResetFunction) {
        var obj =  it.func(time, it.layer, it.layerIndex);
        Object.assign(layerCss, obj);
      } else {
        Object.assign(layerCss, {
          [it.property]: it.func(time, it.layer, it.layerIndex)
        });        
      }
    });

    layerList.forEach(layer => {
      layer.css(layerSet.get(layer));
      this.log(layer, layerSet.get(layer))
    }) 
    this.log('seek end : ', time);
  }
 

  getKeyframeList(callback) {
    this.animations.forEach(animation => {
      animation.properties.forEach(p => {
        p.keyframes.forEach(keyframe => {
          callback && callback (keyframe);
        })
      })
    })
  }

  getSelectedTimelineLastTime () {
    var time = 0; 
    this.getKeyframeList(keyframe => {
      time = Math.max(keyframe.time, time);
    })

    return time; 
  }

  getSelectedTimelineFirstTime () {

    var time = Number.MAX_SAFE_INTEGER; 
    this.getKeyframeList(keyframe => {
      time = Math.min(keyframe.time, time);
    })

    return time; 
  }

  getSelectedTimelinePrevTime () {

    var time = this.getSelectedTimelineFirstTime(); 
    this.getKeyframeList(keyframe => {
      if (timecode(this.fps, keyframe.time) < this.currentTimecode) {
        time = Math.max(keyframe.time, time);
      }      
    })

    return time; 
  }


  getSelectedTimelineNextTime () {
    var time = this.getSelectedTimelineLastTime(); 
    this.getKeyframeList(keyfram => {

      if (timecode(this.fps, keyframe.time) > this.currentTimecode) {
        time = Math.min(keyframe.time, time);
      }      
    })

    return time; 
  }

  getTimelineLayerInfo (fps = 60, endTimecode = '00:00:10:00') {

    var endTime = second(fps, endTimecode);

    return {
      fps,
      currentTimecode: timecode(fps, 0),
      totalTimecode: timecode(fps, endTime),
      currentTime: 0,
      totalTime: endTime,
      displayStartTime: 0,
      displayEndTime: endTime
    }

  }

  setTimelineCurrentTime (frameOrCode) {
    var {fps, totalTimecode} = this

    var frame = frameOrCode;
    var code = frameOrCode; 

    if ((+frame) + '' === frame) {
      frame = +frame; 
      code = framesToTimecode(fps, frame);
    }

    if (code > totalTimecode) {
        code = totalTimecode;
    }

    var currentTime = second(fps, code);

    this.currentTime = currentTime;
    this.currentTimecode = timecode(fps, currentTime);

    
  }

  setDisplayTimeDxRate (dxRate, initStartTime, initEndTime) {
      var timeline = this; 
      var dxTime = dxRate * timeline.totalTime 

      var startTime = initStartTime + dxTime; 
      var endTime = initEndTime + dxTime; 
  
  
      startTime = Math.max(startTime, 0);
      startTime = Math.min(startTime, endTime);        
  
      if (startTime === 0) {
          endTime = initEndTime - initStartTime;
      }
  
      endTime = Math.max(endTime, startTime);                
      endTime = Math.min(endTime, timeline.totalTime);
  
      if (endTime === timeline.totalTime) {
          startTime = timeline.totalTime - (initEndTime - initStartTime);
      }
  
  
      timeline.displayStartTime = startTime;
      timeline.displayEndTime = endTime;

  }

  setDisplayStartTimeRate (rate) {
    var timeline = this; 
    timeline.displayStartTime = rate * timeline.totalTime
  }

  setDisplayEndTimeRate (rate) {
    var timeline = this; 
    timeline.displayEndTime = rate * timeline.totalTime;
  }  

  setTimelineCurrentTimeRate (rate) {
    var timeline = this; 
    var {displayStartTime, displayEndTime, fps} = timeline
    var currentTime = displayStartTime + (displayEndTime - displayStartTime) * rate

    this.setTimelineCurrentTime(timecode(fps, currentTime));
  }  

  setTimelineTotalTime (frameOrCode) {
    var timeline = this; 
    var frame = frameOrCode;
    var code = frameOrCode; 

    if ((+frame) + '' === frame) {
      frame = +frame; 
      code = framesToTimecode(timeline.fps, frame);
    }

    if (second(timeline.fps, code) < timeline.displayEndTime) {
      timeline.displayEndTime = second(timeline.fps, code)
      timeline.displayStartTime = 0; 
    }

    timeline.totalTimecode = code; 
    timeline.totalTime = second(timeline.fps, code);
  }  


  getTimelineObject (layerId) {
    var timeline = this; 
    return timeline.animations.find(it => it.id === layerId) ;
  }

  getDefaultPropertyValue(property) {

    switch(property) {
    case 'mix-blend-mode': 
      return 'normal';
    case 'rotate': 
      return '0deg';
    case 'box-shadow':  
      return '0px 0px 0px 0px rgba(0, 0, 0, 1)';
    case 'text-shadow':  
      return '0px 0px 0px rgba(0, 0, 0, 1)';
    case 'opacity': 
      return 1; 
    // case 'background-color':
    // case 'color':
    // case 'text-fill-color':
    // case 'text-stroke-color':
    // case 'transform': 
    // case 'transform-origin':
    default: 
      return '';
    }

  }


  setFps (fps) {
    var timeline = this;
      timeline.fps = fps; 
      timeline.currentTimecode = timecode(fps, timeline.currentTime);
      timeline.totalTimecode = timecode(fps, timeline.totalTime);
  }
}
