# Anipa


JS Animation Library with timeline 


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
