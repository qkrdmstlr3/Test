export enum EventType {
  // mouse event
  click = 'click',
  dblclick = 'dblclick',
  mousedown = 'mousedown',
  mouseup = 'mouseup',
  mouseover = 'mouseover',
  mouseout = 'mouseout',
  mousemove = 'mousemove',

  // keyboard event
  keydown = 'keydown',
  keyup = 'keyup',
  keypress = 'keypress',

  // form event
  submit = 'submit',
  reset = 'reset',
  change = 'change',
  focus = 'focus',
  blur = 'blur',

  // document/window event
  load = 'load',
  resize = 'resize',
  scroll = 'scroll',
  unload = 'unload',
}

export interface EventFuncType {
  className: string;
  func: (args: unknown) => void; // <T = unknown, R = unknown>(args?: T) => R;
  type: EventType;
}

export interface RenderType {
  html: string;
  eventFuncs: EventFuncType[];
  css: string;
}
