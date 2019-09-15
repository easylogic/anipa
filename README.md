# Anipa


JS Animation Library with timeline 

[![](https://data.jsdelivr.com/v1/package/npm/@easylogic/anipa/badge)](https://www.jsdelivr.com/package/npm/@easylogic/anipa)

## How to use in Browser 

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@easylogic/anipa@0.0.1/dist/main.js"></script>
<script type="text/javascript">
var Player = anipa.Player; 
</script>

```

## How to use in es6 

```sh
npm install --save @easylogic/anipa
```

```js
import { Player } from '@easylogic/anipa'
```

## JS Animation 

```js

var player = new anipa.Player([
    {selector: '.sample', properties: [
        {
        property: 'width', 
        keyframes: [ 
            [500, '0%'],
            [3000, '100px'],
            [5000, '10px']
        ]
        },
        {
        property: 'height', 
        keyframes: [ 
            [1000],
            [2000, '100px']
        ] 
        }//,
        // {
        //   property: 'background-image',
        //   keyframes: [
        //     [0, 'background-image: linear-gradient(0deg, white 10%, blue 50%, yellow 100%)'],
        //     [2500, 'background-image: linear-gradient(3600deg, white 10%, blue 20%, red 100%)'],
        //     [5000, 'background-image: linear-gradient(1200deg, white 10%, red 20%, blue 100%)']
        //   ]
        // }
    ]}
    ], {
    duration: 5000,
    iterationCount: 0,
    direction: 'alternate'
})
player.play();

```

## Animatable Type 

| Type | Value | 
|------|-------|
| {color} | rgba(0, 0, 0, 1) <br /> yellow <br /> | 
| {length} | 10px <br /> 10% <br /> 10em <br /> | 
| {number} | 10 <br > 0.3434<br > |
| {boolean} | "alternate" <br /> "normal" <br /> | 
| {rotate} | 10deg <br /> 0.5turn <br /> |
| {filter} | blur({length}) hue-rotate({rotate}) ... | 
| {clip-path} | none <br />circle() <br /> ellipse() <br /> inset() <br /> polygon() <br />, ... | 
| {transform} | translateX({length}) translateY({length}) rotate({$rotate}) ... | 
| {path} | "M 20 30 L 20 50 Z" | 
| {polygon} | "30,20 50,80 90,200" | 

## Animatable Properties

### Single Value Type 

| Property | how to use | 
|----------|--------------|
| background-color | {color} | 
| color | {color} | 
| text-fill-color | {color} | 
| text-stroke-color | {color} | 
| fill | {color} | 
| stroke | {color} | 
| left | {length} | 
| top | {length} | 
| width | {length} | 
| height | {length} | 
| perspective | {length} | 
| font-size | {length} | 
| font-stretch | {length} | 
| font-weight | {length} | 
| text-stroke-width | {length} | 
| fill-opacity | {number} | 
| opacity | {number} | 
| stroke-dashoffset | {number} | 
| mix-blend-mode | {boolean} | 
| fill-rule | {boolean} | 
| stroke-linecap | {boolean} | 
| stroke-linejoin | {boolean} | 
| rotate | {rotate} | 

### Multi Value Type 

| Property | how to use  | 
|----------|--------------|
| background-image |  background-image: {image}; <br /> background-position: {length} {length}; <br /> background-size: {length} {length};  <br /> background-repeat: {boolean}; <br /> background-blend-mode: {boolean} | 
| offset-path |  offset-path: {pathLayerId},{distance:length},{rotateStatus:boolean},{rotate:rotate} | 
| box-shadow | box-shadow: {offsetX:length} {offsetY:length} {blurRadius:length} {spreadRadius:length} color:color} <br />, ... | 
| text-shadow | text-shadow: {offsetX:length} {offsetY:length} {blurRadius:length} {color:color} <br />, ... | 
| filter | filter: {filter} | 
| backdrop-filter | backdrop-filter: {filter} | 
| clip-path | clip-path: {clip-path} | 
| transform | transform: {transform} | 
| transform-origin | transform-origin: {length} {length} |
| perspective-origin | perspective-origin: {length} {length} |
| stroke-dasharray | stroke-dasharray: {number} {number} |
| d | d: {path} |
| points | points: {polygon} |

# License : MIT
