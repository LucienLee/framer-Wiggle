# Demo Wiggle Module
require "Wiggle"

margin = 32
size = 160
colors = ['#877FD4', '#33B0F7', '#3AD6AB', '#80DB2E']

# Contain all blocks reference, use array index as layer sequence
layers = []

# init background and container
bg = new BackgroundLayer
canvas = new Layer width: 2*size+margin, height: 2*size+margin, backgroundColor: 'transparent'
canvas.center()
window.onresize = -> canvas.center()

# Caculate position by sequence
getFrameByIndex = (index) ->
	return {x: index%2*(size + margin), y: Math.floor(index/2)*(size + margin)}
# Caculate sequence by postion 
getIndexByFrame = (frame) ->
	rawIndex = parseInt( (frame.x+frame.width/2) / (margin+size) ) + parseInt( (frame.y+frame.height/2) / (margin+size) )*2
	if rawIndex < 0 then return 0
	else if rawIndex >= layers.length then return layers.length-1
	else return rawIndex

# Dragging animation set
DraggingAnimation = 
	hold: (layer) ->
		layer.bringToFront()
		layer.animate
			properties:
				scale: 1.1
			curve: "spring(600,50,0)"
		layer.animate
			properties:
				opacity: .65
				shadowY: 8
				shadowBlur: 12
				backgroundColor: new Color(colors[layer.name.replace('block', '')]).darken(30)
			curve: "ease"
			time: .3		

	release: (layer, frame)->
		layer.animate
			properties:
				scale: 1
			curve: "spring(600,50,0)"
		layer.animate
			properties:
				x: frame.x
				y: frame.y
				opacity: 1
				shadowY: 1
				shadowBlur: 2
				backgroundColor: colors[layer.name.replace('block', '')]
			curve: "ease"
			time: .3

# init blocks
for color, index in colors
	block = new Layer
		superLayer: canvas
		name: "block#{index}"
		backgroundColor: color
		x: index%2*(size + margin)
		y: Math.floor(index/2)*(size + margin)
		width: size
		height: size
		borderRadius: 20
		shadowColor: "rgba(0,0,0,.25)"
		shadowY: 1
		shadowBlur: 2
	# force to new draggable object 	
	block.draggable.enabled = false
	block.draggable.constraints = x: 0, y: 0, width: canvas.width, height: canvas.height
	block.draggable.overdragScale = 0.25

	layers.push block
	
	# Trigger Wiggling by long press 	
	block.onLongPress ->
		if @draggable.enabled then return
		for layer in layers
			layer.wiggle.start()
			layer.draggable.enabled = true
		@animateStop()
		DraggingAnimation.hold @
		
	# Animate block when dragging over another block
	block.onDragMove ->
		previousIndex = _.findIndex layers, @
		currentIndex = getIndexByFrame @frame
		if currentIndex isnt previousIndex
			hoveredLayer = layers[currentIndex]
			layers[currentIndex] = layers[previousIndex]
			layers[previousIndex] = hoveredLayer
			
			hoveredLayer.animate
		        properties: getFrameByIndex(previousIndex)
        		curve: "spring(300,40,0)"
		
	block.onTapStart ->
		if not @draggable.enabled then return
		DraggingAnimation.hold @

	block.onDragEnd ->
		targetFrame = getFrameByIndex _.findIndex layers, @
		DraggingAnimation.release @, targetFrame

# Click background to stop
bg.onClick ->
	# Prevent clicking when dragging on background
	for layer in layers
		if layer.draggable.isDragging then return
	for layer in layers
		layer.wiggle.stop()
		layer.draggable.enabled = false

