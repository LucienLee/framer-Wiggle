# import wiggle module
require 'Wiggle'

# Set device background
Screen.backgroundColor = "#25d4fd"

#--- Constants ---#
PROPERTIES =
	Frequency: 
		min: 0.5
		max: 20
		default: 6
	Amplitude: 
		min: 0
		max: 20
		default: 2
	Variance: 
		min: 0
		max: 20
		default: 1

LEADING = 28		
MARGIN = 32
ROW = 48
KNOBSIZE = 24

# style



#--- Variable Sets ---#
controllers = {}

#--- Functions ---#

# Slider Constructor
sliderFactory = (parentLayer, name, parameters, index) ->
	rowHeight = (parentLayer.height - LEADING*2) / 4
	
	controller = new Layer
		name: name
		parent: parentLayer
		backgroundColor: null
		width: parentLayer.width
		height: rowHeight
		y: LEADING + ROW*index
		
	controller.slider = new SliderComponent
		name: 'slider'
		parent: controller
		knobSize: KNOBSIZE
		min: parameters.min
		max: parameters.max
		value: parameters.default
		width: 180
		height: 6
		x: Align.center(KNOBSIZE)
		y: Align.center
		backgroundColor: "rgba(0,0,0,0.1)"
		style: 
			"boxShadow": "inset 0 0 1px 1px rgba(0,0,0,0.05)"
	
	controller.slider.fill.backgroundColor = '#666'
	controller.slider.knob.draggable.momentum = false
	
	controller.label = new Layer
		name: 'label'
		parent: controller
		html: name
		width: 80
		height: rowHeight
		x: MARGIN
		backgroundColor: null
		style: 
			"color": "#888"
			"font": "500 16px/#{ROW}px SF UI Text, Helvetica Neue"
	
	controller.value = new Layer
		name: 'value'
		parent: controller
		html: parameters.default
		backgroundColor: null
		width: 40
		height: rowHeight
		x: controller.slider.maxX + KNOBSIZE*1.4
		style: 
			"color": "#aaa"
			"font": "500 16px/#{ROW}px SF UI Text, Helvetica Neue"
	
	controller.slider.on('change:value', (->
		updateValue(@value, @slider)
	).bind(controller))

	return controller

# round value to 0.1
updateValue = (value, slider) ->
	value.html = Math.round(slider.value*10)/10


#--- Instances ---#

# Panel layer
panel = new Layer
	backgroundColor: "#fff"
	borderRadius: 6
	width: 420
	height: 240
	x: Align.center
	y: Align.bottom(-50)
panel.style.boxShadow = "0 1px 1px rgba(0,0,0,0.1), 0 6px 20px rgba(0,0,0,0.1)"

# Github Link
link = new Layer
	width: 210
	height: 28
	html: "Check wiggle module on Github"
	backgroundColor: null
	x: Align.center
	y: Align.bottom
	style: 
		"font": "100 14px/1 SF UI Text, Helvetica Neue"
		"text-align": "center"
		"text-decoration": "underline"

link.onClick ->
	document.location = "https://github.com/LucienLee/framer-Wiggle"	

# Slider layer
index = 0
for property, parameters of PROPERTIES	
	controllers[property] = sliderFactory( panel, property, parameters, index )
	index++

# Switch layer 
switchController = new Layer
	name: 'DraggingSwitch'
	parent: panel
	backgroundColor: null
	width: panel.width
	height: (panel.height - LEADING*2) / 4
	y: LEADING + ROW*index

switchLabel = new Layer
	name: 'label'
	parent: switchController
	backgroundColor: null
	html: 'Wiggle When Dragging'
	x: MARGIN
	style: 
		"color": "#888"
		"font": "500 16px/#{ROW}px SF UI Text, Helvetica Neue"

switchLayer = new SliderComponent
	parent: switchController
	knobSize: KNOBSIZE
	height: KNOBSIZE
	width: KNOBSIZE * 1.5
	x: Align.right(-MARGIN-KNOBSIZE/5)
	y: Align.center
switchLayer.fill.backgroundColor = '#25d4fd'

# Snap as switch	
switchLayer.knob.draggable.updatePosition = (point) ->
	if switchLayer.valueForPoint(point.x) < 0.5
		point.x = -KNOBSIZE/2
	else
		point.x = switchLayer.width - KNOBSIZE/2
	return point

# enable toggle by clicking
switchLayer.onTouchStart ->
	@prev = @value
switchLayer.onTouchEnd ->
	if not @knob.draggable.isDragging
		@value = if @prev is 1 then 0 else 1


# Wiggle!!!
wiggleLayer = new Layer
	x: Align.center
	y: Align.center(-100)
	borderRadius: 8
	backgroundColor: "#fff"
	shadowColor: "rgba(0,0,0,0.1)"
	shadowSpread: 2
	shadowY: 2
	shadowBlur: 8

wiggleLayer.draggable.enabled = true
wiggleLayer.wiggle.start()

# Upate wiggle parameters from controls
controllers.Frequency.slider.on 'change:value', ->
	wiggleLayer.wiggle.freq = Math.round(@value*10)/10

controllers.Amplitude.slider.on 'change:value', ->
	wiggleLayer.wiggle.amp = Math.round(@value*10)/10

controllers.Variance.slider.on 'change:value', ->
	wiggleLayer.wiggle.variance = Math.round(@value*10)/10
	
switchLayer.on 'change:value', ->
	if @value is 1
		wiggleLayer.wiggle.wiggleWhenDragging = true
	else 
		wiggleLayer.wiggle.wiggleWhenDragging = false
