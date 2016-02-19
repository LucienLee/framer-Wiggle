###
Wiggle Module for FramerJS
Created by Lucien Lee (@luciendeer), Feb. 17th, 2016
https://github.com/LucienLee/framer-Wiggle

Wiggle Module help you creating wiggle effect in FramerJS.

Add the following line to your project in Framer Studio.
  require 'Wiggle'

[Configure wiggle]
layer.wiggle =
  freq: 6 //wiggle frequence (per sec)
  amp: 1 // wiggle amplitude
  variance: 2 // wiggle amplitude variance
  wiggleWhenDragging: false // keep wiggling when dragging or not

[Wiggle!]
layer.wiggle.start()
layer.wiggle.stop()

[Check wiggle state]
layer.wiggle.isWiggling //return true or false
###

class Wiggle extends Framer.BaseClass

  # wiggle frequence (per sec)
  @define "freq",
    get: -> @_freq,
    set: (value)->
      if _.isNumber(value) and value > 0
        @_freq = value
        @_updateWiggleAniamtion()

  # wiggle amplitude
  @define "amp",
    get: -> @_amp,
    set: (value)->
      if _.isNumber(value)
        @_amp = value
        @_updateWiggleAniamtion()

  # wiggle amplitude variance
  @define "variance",
    get: -> @_variance,
    set: (value)->
      if _.isNumber(value)
        @_variance = value
        @_updateWiggleAniamtion()

  # keep wiggling when dragging
  @define "wiggleWhenDragging",
    get: -> @_keepWiggling
    set: (value)-> @_keepWiggling = value if _.isBoolean value

  @define "isWiggling", get: -> @_isWiggling or false

  constructor: (@layer)->
    super

    @freq = 6
    @amp = 1
    @variance = 2

    @_keepWiggling = false
    @oringinalRotate = @layer.rotation

    @layer.on Events.TouchStart, =>
      if @layer.draggable.enabled is true
        if @_isWiggling and not @_keepWiggling then @_resetFrame()

    @layer.on Events.DragStart, =>
        if @_keepWiggling then Utils.randomChoice(@Animations).start()

    @layer.on Events.DragEnd, =>
      if @_isWiggling and not @_keepWiggling then Utils.randomChoice(@Animations).start()

  _updateWiggleAniamtion: ->
    @Animations = []
    length = 4
    halfDuration = 1/@freq/2
    originShift = 0.25

    for i in [0...length]
      rotationShift = Utils.randomNumber(0, @variance)

      @Animations[2*i] = new Animation
        layer: @layer
        properties:
          rotation: @amp+rotationShift
          originX: 0.5-originShift
        time: halfDuration

      @Animations[2*i+1] = new Animation
        layer: @layer
        properties:
          rotation: -(@amp+rotationShift)
          originX: 0.5+originShift
        time: halfDuration

    for animation, index in @Animations
      if index is @Animations.length-1
        animation.on(Events.AnimationEnd, @Animations[0].start )
      else
        animation.on( Events.AnimationEnd, ((index)->
          @Animations[index+1].start()
        ).bind(this, index))

  _resetFrame: ->
    @layer.rotation = @oringinalRotate
    @layer.originX = .5

  start: ->
    Utils.randomChoice(@Animations).start()
    @_isWiggling = true

  stop: ->
    for animation in @Animations
      animation.stop()
    @_resetFrame()
    @_isWiggling = false

# Add extension method to Layer
Layer.define "wiggle",
  get: -> @_wiggle ?= new Wiggle(@)
  set: (options) ->
    @wiggle.freq = options.freq if options.freq
    @wiggle.amp = options.amp if options.amp
    @wiggle.wiggleWhenDragging = options.wiggleWhenDragging if options.wiggleWhenDragging