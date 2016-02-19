# framer-Wiggle
A module to create wiggle effect in Framer.

## Demo

## Getting started
### Add it in your Framer project
- Create a new Framer project
- Download [Wiggle.coffee](https://github.com/LucienLee/framer-DynamicLoader/blob/master/DynamicLoader.coffee) and put it in the module folder of the project
- At the top of your code, write `require "Wiggle.coffee"`

### Quickstart
No more setup, enable wiggling for the layer straightly.

```coffeescript
layerA = new Layer
layerA.wiggle.start()
```

### Usage


```coffeescript
layerA = new Layer
layerA.wiggle.
	freq: 4
	amp: 3
	variance: 2
	wiggleWhenDragging: true  

```

Control wiggle effect

```coffeescript
layerA.wiggle.start()
layerA.wiggle.stop()
```

Check wiggling state

```coffeescript
layerA = new Layer
print layerA.wiggle.isWiggling
```

## Feedback
Feel free to contact me if you have any questions about this project.   
Please send a message to me here on GitHub, [@luciendeer](https://twitter.com/luciendeer) on Twitter. Cheers!