
import {
  isString,
  isUndefined,
  isNotString,
  isNotUndefined
} from "./functions/func";
import { Length } from "../editor/unit/Length";

let counter = 0;
let cached = [];

export default class Dom {
  constructor(tag, className, attr) {
    if (isNotString(tag)) {
      this.el = tag;
    } else {
      var el = document.createElement(tag);
      this.uniqId = counter++;

      if (className) {
        el.className = className;
      }

      attr = attr || {};

      for (var k in attr) {
        el.setAttribute(k, attr[k]);
      }

      this.el = el;
    }
  }

  static create (tag, className, attr) {
    return new Dom(tag, className, attr);
  }

  static getScrollTop() {
    return Math.max(
      window.pageYOffset,
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
  }

  static getScrollLeft() {
    return Math.max(
      window.pageXOffset,
      document.documentElement.scrollLeft,
      document.body.scrollLeft
    );
  }

  static parse(html) {
    var parser = DOMParser();
    return parser.parseFromString(html, "text/htmll");
  }

  static body () {
    return Dom.create(document.body)
  }

  data (key, value) {

    var newKey = key.split('-').map( (it, index) => {
      if (index === 0) { return it }

      return it.substr(0, 1).toUpperCase() + it.substr(1);
    }).join(''); 

    if (arguments.length === 1) {
      return this.el.dataset(newKey);
    } else {
      this.el.dataset(newKey, value);
    }
    
  }

  attr(key, value) {
    if (arguments.length == 1) {
      return this.el.getAttribute(key);
    }

    this.el.setAttribute(key, value);

    return this;
  }

  attrKeyValue(keyField) {
    return {
      [this.el.getAttribute(keyField)]: this.val()
    }
  }

  attrs(...args) {
    return args.map(key => {
      return this.el.getAttribute(key);
    });
  }

  styles(...args) {
    return args.map(key => {
      return this.el.style[key];
    });
  }  

  removeAttr(key) {
    this.el.removeAttribute(key);

    return this;
  }

  removeStyle(key) {
    this.el.style.removeProperty(key);
    return this;
  }

  is(checkElement) {
    return this.el === (checkElement.el || checkElement);
  }

  isTag(tag) {
    return this.el.tagName.toLowerCase() === tag.toLowerCase()
  }

  closest(cls) {
    var temp = this;
    var checkCls = false;

    while (!(checkCls = temp.hasClass(cls))) {
      if (temp.el.parentNode) {
        temp = Dom.create(temp.el.parentNode);
      } else {
        return null;
      }
    }

    if (checkCls) {
      return temp;
    }

    return null;
  }

  parent() {
    return Dom.create(this.el.parentNode);
  }

  hasParent () {
    return !!this.el.parentNode
  }

  removeClass(...args) {
    this.el.classList.remove(...args);
    return this;
  }

  hasClass(cls) {
    if (!this.el.classList) return false;
    return this.el.classList.contains(cls);
  }

  addClass(...args) {
    this.el.classList.add(...args);

    return this;
  }

  onlyOneClass(cls) {
    var parent = this.parent();
    var selected = parent.$(`.${cls}`);
    if (selected) selected.removeClass(cls);
    this.addClass(cls);
  }

  toggleClass(cls, isForce) {
    this.el.classList.toggle(cls, isForce);
  }

  html(html) {
    if (isUndefined(html)) {
      return this.el.innerHTML;
    }

    if (isString(html)) {
      this.el.innerHTML = html;
    } else {
      this.empty().append(html);
    }

    return this;
  }

  find(selector) {
    return this.el.querySelector(selector);
  }

  $(selector) {
    var node = this.find(selector);
    return node ? Dom.create(node) : null;
  }

  findAll(selector) {
    return this.el.querySelectorAll(selector);
  }

  $$(selector) {
    return [...this.findAll(selector)].map(node => {
      return Dom.create(node);
    });
  }

  empty() {
    while (this.el.firstChild) this.el.removeChild(this.el.firstChild);
    return this;
  }

  append(el) {
    if (isString(el)) {
      this.el.appendChild(document.createTextNode(el));
    } else {
      this.el.appendChild(el.el || el);
    }

    return this;
  }

  prepend(el) {
    if (isString(el)) {
      this.el.prepend(document.createTextNode(el));
    } else {
      this.el.prepend(el.el || el);
    }

    return this;    
  }

  appendHTML(html) {
    var $dom = Dom.create("div").html(html);

    this.append($dom.createChildrenFragment());
  }

  /**
   * create document fragment with children dom
   */
  createChildrenFragment() {
    const list = this.children();

    var fragment = document.createDocumentFragment();
    list.forEach($el => fragment.appendChild($el.el));

    return fragment;
  }

  appendTo(target) {
    var t = target.el ? target.el : target;

    t.appendChild(this.el);

    return this;
  }

  remove() {
    if (this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }

    return this;
  }

  removeChild(el) {
    this.el.removeChild(el.el || el);
    return this; 
  }

  text(value) {
    if (isUndefined(value)) {
      return this.el.textContent;
    } else {
      var tempText = value;

      if (value instanceof Dom) {
        tempText = value.text();
      }

      this.el.textContent = tempText;
      return this;
    }
  }

  /**
   *
   * $el.css`
   *  border-color: yellow;
   * `
   *
   * @param {*} key
   * @param {*} value
   */

  css(key, value) {
    if (isNotUndefined(key) && isNotUndefined(value)) {
      this.el.style[key] = value;
    } else if (isNotUndefined(key)) {
      if (isString(key)) {
        return getComputedStyle(this.el)[key];
      } else {

        Object.assign(this.el.style, key);

        // var keys = Object.keys(key || {});

        // for (var i = 0, len = keys.length; i < len; i++) {
        //   var k = keys[i];
        //   this.el.style[k] = key[k];
        // }
      }
    }

    return this;
  }

  getComputedStyle (...list) {
    var css = getComputedStyle(this.el);

    var obj = {}
    list.forEach(it => {
      obj[it] = css[it]
    })

    return obj; 
  }

  getStyleList(...list) {
    var style = {};

    var len = this.el.style.length;
    for (var i = 0; i < len; i++) {
      var key = this.el.style[i];

      style[key] = this.el.style[key];
    }

    list.forEach(key => {
      style[key] = this.css(key);
    });

    return style;
  }

  cssText(value) {
    if (isUndefined(value)) {
      return this.el.style.cssText;
    }

    if (value != this.el.tempCssText) {
      this.el.style.cssText = value;
      this.el.tempCssText = value; 
    } 

    return this;
  }

  cssArray(arr) {
    if (arr[0]) this.el.style[arr[0]] = arr[1];
    if (arr[2]) this.el.style[arr[2]] = arr[3];
    if (arr[4]) this.el.style[arr[4]] = arr[5];
    if (arr[6]) this.el.style[arr[6]] = arr[7];
    if (arr[8]) this.el.style[arr[8]] = arr[9];

    return this;
  }

  cssFloat(key) {
    return parseFloat(this.css(key));
  }

  cssInt(key) {
    return parseInt(this.css(key));
  }

  px(key, value) {
    return this.css(key, Length.px(value));
  }

  rect() {
    return this.el.getBoundingClientRect();
  }

  offsetRect() {
    return {
      top: this.el.offsetTop,
      left: this.el.offsetLeft,
      width: this.el.offsetWidth,
      height: this.el.offsetHeight
    };
  }

  offset() {
    var rect = this.rect();

    var scrollTop = Dom.getScrollTop();
    var scrollLeft = Dom.getScrollLeft();

    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft
    };
  }

  offsetLeft() {
    return this.offset().left;
  }

  offsetTop() {
    return this.offset().top;
  }

  position() {
    if (this.el.style.top) {
      return {
        top: parseFloat(this.css("top")),
        left: parseFloat(this.css("left"))
      };
    } else {
      return this.rect();
    }
  }

  size() {
    return [this.width(), this.height()];
  }

  width() {
    return this.el.offsetWidth || this.rect().width;
  }

  contentWidth() {
    return (
      this.width() -
      this.cssFloat("padding-left") -
      this.cssFloat("padding-right")
    );
  }

  height() {
    return this.el.offsetHeight || this.rect().height;
  }

  contentHeight() {
    return (
      this.height() -
      this.cssFloat("padding-top") -
      this.cssFloat("padding-bottom")
    );
  }

  val(value) {
    if (isUndefined(value)) {
      return this.el.value;
    } else if (isNotUndefined(value)) {
      var tempValue = value;

      if (value instanceof Dom) {
        tempValue = value.val();
      }

      this.el.value = tempValue;
    }

    return this;
  }


  get value() {
    return this.el.value;
  }

  get naturalWidth () {
    return this.el.naturalWidth
  }

  get naturalHeight () {
    return this.el.naturalHeight
  }  

  scrollIntoView () {
    this.el.scrollIntoView()
  }

  addScrollLeft (dt) {
    this.el.scrollLeft += dt; 
    return this; 
  }

  addScrollTop (dt) {
    this.el.scrollTop += dt; 
    return this; 
  }  

  setScrollTop(scrollTop) {
    this.el.scrollTop = scrollTop;
    return this;
  }

  setScrollLeft(scrollLeft) {
    this.el.scrollLeft = scrollLeft;
    return this;
  }

  scrollTop() {
    if (this.el === document.body) {
      return Dom.getScrollTop();
    }

    return this.el.scrollTop;
  }

  scrollLeft() {
    if (this.el === document.body) {
      return Dom.getScrollLeft();
    }

    return this.el.scrollLeft;
  }

  scrollHeight() {
    return this.el.scrollHeight;
  }

  scrollWidth() {
    return this.el.scrollWidth;
  }  

  getElement() {
    return this.el;
  }

  createChild(tag, className = '', attrs = {}, css = {}) {
    let $element = Dom.create(tag, className, attrs);
    $element.css(css);

    this.append($element);

    return $element;
  }

  firstChild() {
    return Dom.create(this.el.firstElementChild);
  }

  children() {
    var element = this.el.firstElementChild;

    if (!element) {
      return [];
    }

    var results = [];

    do {
      results.push(Dom.create(element));
      element = element.nextElementSibling;
    } while (element);

    return results;
  }

  childLength() {
    return this.el.children.length;
  }

  replace(newElement) {

    if (this.el.parentNode) {
      this.el.parentNode.replaceChild(newElement.el || newElement, this.el);
    }

    return this;
  }

  replaceChild(oldElement, newElement) {
    this.el.replaceChild(newElement.el || newElement, oldElement.el || oldElement);

    return this;
  }  


}
