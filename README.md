# framer-Wiggle
A module to create wiggle effect in Framer.

## Demo
[Playground demo ](http://share.framerjs.com/n7k5kfdjmbyv/) with  parameters. 

![playground](https://github.com/LucienLee/framer-Wiggle/blob/demo/playground-demo.gif)

 [Interaction demo](http://share.framerjs.com/c8c5j010d2r4/).

![demo](https://github.com/LucienLee/framer-Wiggle/blob/demo/demo.gif)

The source codes are in [demo](https://github.com/LucienLee/framer-Wiggle/tree/demo) branch, please check it.

## Getting started
### Add it in your Framer project
- Create a new Framer project
- Download [Wiggle.coffee](https://github.com/LucienLee/framer-Wiggle/blob/master/wiggle.coffee) and put it in the module folder of the project
- At the top of your code, write `require "Wiggle.coffee"`

#### Install with npm
If you're familiar with npm, you could install with following commands.

```Shell
$ cd <myProject>.framer
$ npm install framer-wiggle
$ ln node_modules/framer-wiggle/Wiggle.coffee modules/
```

### Quickstart
No more setup, enable wiggling for the layer straightly.

```coffeescript
layerA = new Layer
layerA.wiggle.start()
```

### Usage
Wiggling effect can be setted with properties: frequency, amplitude, amplitude variance and whether keep wiggling when being dragged.

```coffeescript
layerA = new Layer

# wiggle frequency per sec, default is 6
layerA.wiggle.freq = 6

# wiggle amplitude, default is 2
layerA.wiggle.amp = 2

# wiggle amplitude variance, which make wiggling more randomly, default is 1
# Wiggle strength range would be in [amp+variance, amp-variance]
layerA.wiggle.variance = 1

# Keep wiggling while the layer being dragged, default is false
layerA.wiggle.wiggleWhenDragging = false


# You could set up all propery with an object
layerA.wiggle = 
	freq: 4 
	amp: 3
	variance: 2
	wiggleWhenDragging: true  
```

#### Control wiggling effect
Enable or disable wiggling effet

```coffeescript
layerA = new Layer
# Start wiggling 
layerA.wiggle.start()
# Stop wiggling
layerA.wiggle.stop()
```

#### Check wiggling state
Whether the layer is currently wiggling

```coffeescript
layerA = new Layer
layerA.wiggle.start()

# Check if layerA is wiggling 
print layerA.wiggle.isWiggling
```

## Feedback
Feel free to contact me if you have any questions about this project.   
Please send a message to me here on GitHub, [@luciendeer](https://twitter.com/luciendeer) on Twitter. Cheers!
