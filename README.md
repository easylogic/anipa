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

# License : MIT
