###
Wiggle Module for FramerJS
Created by Lucien Lee (@luciendeer), Feb. 17th, 2016
###
class Wiggle extends Framer.BaseClass

  @define "freq",
    get: -> @_freq,
    set: (value)->
      if _.isNumber(value) and value > 0
        @_freq = value
        @_updateWiggleAniamtion()

  @define "amp",
    get: -> @_amp,
    set: (value)->
      if _.isNumber(value)
        @_amp = value
        @_updateWiggleAniamtion()

  @define "isWiggling", get: -> @_isWiggling or false
  @define "wiggleWhenDragging",
    get: -> @_keepWiggling
    set: (value)-> @_keepWiggling = value if _.isBoolean value

  constructor: (@layer)->
    super

    @freq = .075
    @amp = 3
    @_keepWiggling = false
    @oringinalRotate = @layer.rotation

    @layer.on Events.TouchStart, =>
      if @layer.draggable.enabled is true
        if @_isWiggling and not @_keepWiggling then @_resetFrame()

    @layer.on Events.DragStart, =>
        if @_keepWiggling then @left.start()

    @layer.on Events.DragEnd, =>
      if @_isWiggling and not @_keepWiggling then @left.start()

  _updateWiggleAniamtion: ->
    @left = new Animation
      layer: @layer
      properties:
        rotation: @amp
        originX: .4
      time: @freq

    @right = new Animation
      layer: @layer
      properties:
        rotation: -@amp
        originX: .6
      time: @freq

    @left.on( Events.AnimationEnd, @right.start )
    @right.on( Events.AnimationEnd, @left.start )

  _resetFrame: ->
    @layer.rotation = @oringinalRotate

  start: ->
    @left.start()
    @_isWiggling = true

  stop: ->
    @left.stop()
    @right.stop()
    @_resetFrame()
    @_isWiggling = false

# Add extension method to Layer
Layer.define "wiggle",
  get: -> @_wiggle ?= new Wiggle(@)
  set: (options) ->
    @wiggle.freq = options.freq if options.freq
    @wiggle.amp = options.amp if options.amp
    @wiggle.wiggleWhenDragging = options.wiggleWhenDragging if options.wiggleWhenDragging