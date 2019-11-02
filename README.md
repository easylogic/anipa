# Anipa


JS Animation Library with timeline 

[![](https://data.jsdelivr.com/v1/package/npm/@easylogic/anipa/badge)](https://www.jsdelivr.com/package/npm/@easylogic/anipa)

## How to use in Browser 

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@easylogic/anipa@0.0.6/dist/main.js"></script>
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
| {border-radius} | 10px <br /> 10px 10px 10px 10px |
| {border} | border:1px solid black;border-top:10px solid yellow; .... |
| {filter} | blur({length}) hue-rotate({rotate}) ... | 
| {clip-path} | none <br />circle() <br /> ellipse() <br /> inset() <br /> polygon() <br />, ... | 
| {transform} | translateX({length}) translateY({length}) rotate({$rotate}) ... | 
| {path} | "M 20 30 L 20 50 Z" | 
| {polygon} | "30,20 50,80 90,200" | 
| {text} | "Insert a text" | 

## Animatable Properties

### Single Value Type 

| Property | Value Type | 
|----------|--------------|
| background-color | {color} | 
| color | {color} | 
| text-fill-color | {color} | 
| text-stroke-color | {color} | 
| fill | {color} | 
| stroke | {color} | 
| border-color | {color} |
| border-top-color | {color} |
| border-left-color | {color} |
| border-right-color | {color} |
| border-bottom-color | {color} |

| Property | Value Type | 
|----------|--------------|
| left | {length} | 
| top | {length} | 
| width | {length} | 
| height | {length} | 
| perspective | {length} | 
| font-size | {length} | 
| font-stretch | {length} | 
| font-weight | {length} | 
| text-stroke-width | {length} | 
| border-width | {length} |
| border-top-width | {length} |
| border-left-width | {length} |
| border-right-width | {length} |
| border-bottom-width | {length} |

| Property | Value Type | 
|----------|--------------|
| fill-opacity | {number} | 
| opacity | {number} | 
| stroke-dashoffset | {number} | 

| Property | Value Type | 
|----------|--------------|
| mix-blend-mode | {boolean} | 
| fill-rule | {boolean} | 
| stroke-linecap | {boolean} | 
| stroke-linejoin | {boolean} |
| border-style | {boolean} |
| border-top-style | {boolean} |
| border-left-style | {boolean} |
| border-right-style | {boolean} |
| border-bottom-style | {boolean} |

| Property | Value Type | 
|----------|--------------|
| rotate | {rotate} | 

| Property | Value Type | 
|----------|--------------|
| text | {text} | 

### Multi Value Type 

| Property | Value Type | 
|----------|--------------|
| background-image |  background-image: {image}; <br /> background-position: {length} {length}; <br /> background-size: {length} {length};  <br /> background-repeat: {boolean}; <br /> background-blend-mode: {boolean} | 
| offset-path | {pathLayerId},{distance:length},{rotateStatus:boolean},{rotate:rotate} | 
| box-shadow | {offsetX:length} {offsetY:length} {blurRadius:length} {spreadRadius:length} color:color} <br />, ... | 
| text-shadow | {offsetX:length} {offsetY:length} {blurRadius:length} {color:color} <br />, ... | 
| border-radius | {border-radius} | 
| border | {border} | 
| filter | {filter} | 
| backdrop-filter | {filter} | 
| clip-path | {clip-path} | 
| transform | {transform} | 
| transform-origin | {length} {length} |
| perspective-origin | {length} {length} |
| stroke-dasharray | {number} {number} |
| d | {path} |
| points | {polygon} |


# Development 

```
git clone https://github.com/easylogic/anipa 
cd anipa
npm install 
npm run dev 
```

# Build 

```
npm run build
```


# License : MIT
