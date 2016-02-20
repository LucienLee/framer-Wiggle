require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Wiggle":[function(require,module,exports){

/*
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
 */
var Wiggle,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Wiggle = (function(superClass) {
  extend(Wiggle, superClass);

  Wiggle.define("freq", {
    get: function() {
      return this._freq;
    },
    set: function(value) {
      if (_.isNumber(value) && value > 0) {
        this._freq = value;
        return this._updateWiggleAniamtion();
      }
    }
  });

  Wiggle.define("amp", {
    get: function() {
      return this._amp;
    },
    set: function(value) {
      if (_.isNumber(value)) {
        this._amp = value;
        return this._updateWiggleAniamtion();
      }
    }
  });

  Wiggle.define("variance", {
    get: function() {
      return this._variance;
    },
    set: function(value) {
      if (_.isNumber(value)) {
        this._variance = value;
        return this._updateWiggleAniamtion();
      }
    }
  });

  Wiggle.define("wiggleWhenDragging", {
    get: function() {
      return this._keepWiggling;
    },
    set: function(value) {
      if (_.isBoolean(value)) {
        return this._keepWiggling = value;
      }
    }
  });

  Wiggle.define("isWiggling", {
    get: function() {
      return this._isWiggling || false;
    }
  });

  function Wiggle(layer) {
    this.layer = layer;
    Wiggle.__super__.constructor.apply(this, arguments);
    this.freq = 6;
    this.amp = 2;
    this.variance = 1;
    this._keepWiggling = false;
    this.oringinalRotate = this.layer.rotation;
    this.layer.on(Events.TapStart, (function(_this) {
      return function() {
        if (_this.layer.draggable.enabled === true) {
          if (_this._isWiggling && !_this._keepWiggling) {
            return _this._resetFrame();
          }
        }
      };
    })(this));
    this.layer.on(Events.DragStart, (function(_this) {
      return function() {
        if (_this._keepWiggling) {
          return Utils.randomChoice(_this.Animations).start();
        }
      };
    })(this));
    this.layer.on(Events.DragEnd, (function(_this) {
      return function() {
        if (_this._isWiggling && !_this._keepWiggling) {
          return Utils.randomChoice(_this.Animations).start();
        }
      };
    })(this));
  }

  Wiggle.prototype._updateWiggleAniamtion = function() {
    var animation, halfDuration, i, index, j, k, len, length, originShift, ref, ref1, results, rotationShift;
    this.Animations = [];
    length = 4;
    halfDuration = 1 / this.freq / 2;
    originShift = 0.25;
    for (i = j = 0, ref = length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      rotationShift = Utils.randomNumber(-this.variance, this.variance);
      this.Animations[2 * i] = new Animation({
        layer: this.layer,
        properties: {
          rotation: this.amp + rotationShift,
          originX: 0.5 - originShift
        },
        time: halfDuration
      });
      this.Animations[2 * i + 1] = new Animation({
        layer: this.layer,
        properties: {
          rotation: -(this.amp + rotationShift),
          originX: 0.5 + originShift
        },
        time: halfDuration
      });
    }
    ref1 = this.Animations;
    results = [];
    for (index = k = 0, len = ref1.length; k < len; index = ++k) {
      animation = ref1[index];
      if (index === this.Animations.length - 1) {
        results.push(animation.on(Events.AnimationEnd, this.Animations[0].start));
      } else {
        results.push(animation.on(Events.AnimationEnd, (function(index) {
          return this.Animations[index + 1].start();
        }).bind(this, index)));
      }
    }
    return results;
  };

  Wiggle.prototype._resetFrame = function() {
    this.layer.rotation = this.oringinalRotate;
    return this.layer.originX = .5;
  };

  Wiggle.prototype.start = function() {
    Utils.randomChoice(this.Animations).start();
    return this._isWiggling = true;
  };

  Wiggle.prototype.stop = function() {
    var animation, j, len, ref;
    ref = this.Animations;
    for (j = 0, len = ref.length; j < len; j++) {
      animation = ref[j];
      animation.stop();
    }
    this._resetFrame();
    return this._isWiggling = false;
  };

  return Wiggle;

})(Framer.BaseClass);

Layer.define("wiggle", {
  get: function() {
    return this._wiggle != null ? this._wiggle : this._wiggle = new Wiggle(this);
  },
  set: function(options) {
    if (options.freq) {
      this.wiggle.freq = options.freq;
    }
    if (options.amp) {
      this.wiggle.amp = options.amp;
    }
    if (options.wiggleWhenDragging) {
      return this.wiggle.wiggleWhenDragging = options.wiggleWhenDragging;
    }
  }
});


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvTHVjaWVuL1Byb2plY3QvZnJhbWVyLVdpZ2dsZS9XaWdnbGUtZGVtby5mcmFtZXIvbW9kdWxlcy9XaWdnbGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBLE1BQUE7RUFBQTs7O0FBeUJNOzs7RUFHSixNQUFDLENBQUEsTUFBRCxDQUFRLE1BQVIsRUFDRTtJQUFBLEdBQUEsRUFBSyxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUosQ0FBTDtJQUNBLEdBQUEsRUFBSyxTQUFDLEtBQUQ7TUFDSCxJQUFHLENBQUMsQ0FBQyxRQUFGLENBQVcsS0FBWCxDQUFBLElBQXNCLEtBQUEsR0FBUSxDQUFqQztRQUNFLElBQUMsQ0FBQSxLQUFELEdBQVM7ZUFDVCxJQUFDLENBQUEsc0JBQUQsQ0FBQSxFQUZGOztJQURHLENBREw7R0FERjs7RUFRQSxNQUFDLENBQUEsTUFBRCxDQUFRLEtBQVIsRUFDRTtJQUFBLEdBQUEsRUFBSyxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUosQ0FBTDtJQUNBLEdBQUEsRUFBSyxTQUFDLEtBQUQ7TUFDSCxJQUFHLENBQUMsQ0FBQyxRQUFGLENBQVcsS0FBWCxDQUFIO1FBQ0UsSUFBQyxDQUFBLElBQUQsR0FBUTtlQUNSLElBQUMsQ0FBQSxzQkFBRCxDQUFBLEVBRkY7O0lBREcsQ0FETDtHQURGOztFQVFBLE1BQUMsQ0FBQSxNQUFELENBQVEsVUFBUixFQUNFO0lBQUEsR0FBQSxFQUFLLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSixDQUFMO0lBQ0EsR0FBQSxFQUFLLFNBQUMsS0FBRDtNQUNILElBQUcsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxLQUFYLENBQUg7UUFDRSxJQUFDLENBQUEsU0FBRCxHQUFhO2VBQ2IsSUFBQyxDQUFBLHNC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QUQsR0FBZTtFQUpYOzs7O0dBNUZhLE1BQU0sQ0FBQzs7QUFtRzVCLEtBQUssQ0FBQyxNQUFOLENBQWEsUUFBYixFQUNFO0VBQUEsR0FBQSxFQUFLLFNBQUE7a0NBQUcsSUFBQyxDQUFBLFVBQUQsSUFBQyxDQUFBLFVBQWUsSUFBQSxNQUFBLENBQU8sSUFBUDtFQUFuQixDQUFMO0VBQ0EsR0FBQSxFQUFLLFNBQUMsT0FBRDtJQUNILElBQStCLE9BQU8sQ0FBQyxJQUF2QztNQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixHQUFlLE9BQU8sQ0FBQyxLQUF2Qjs7SUFDQSxJQUE2QixPQUFPLENBQUMsR0FBckM7TUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLEdBQVIsR0FBYyxPQUFPLENBQUMsSUFBdEI7O0lBQ0EsSUFBMkQsT0FBTyxDQUFDLGtCQUFuRTthQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQVIsR0FBNkIsT0FBTyxDQUFDLG1CQUFyQzs7RUFIRyxDQURMO0NBREYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIyMjXG5XaWdnbGUgTW9kdWxlIGZvciBGcmFtZXJKU1xuQ3JlYXRlZCBieSBMdWNpZW4gTGVlIChAbHVjaWVuZGVlciksIEZlYi4gMTd0aCwgMjAxNlxuaHR0cHM6Ly9naXRodWIuY29tL0x1Y2llbkxlZS9mcmFtZXItV2lnZ2xlXG5cbldpZ2dsZSBNb2R1bGUgaGVscCB5b3UgY3JlYXRpbmcgd2lnZ2xlIGVmZmVjdCBpbiBGcmFtZXJKUy5cblxuQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby5cbiAgcmVxdWlyZSAnV2lnZ2xlJ1xuXG5bQ29uZmlndXJlIHdpZ2dsZV1cbmxheWVyLndpZ2dsZSA9XG4gIGZyZXE6IDYgLy93aWdnbGUgZnJlcXVlbmNlIChwZXIgc2VjKVxuICBhbXA6IDEgLy8gd2lnZ2xlIGFtcGxpdHVkZVxuICB2YXJpYW5jZTogMiAvLyB3aWdnbGUgYW1wbGl0dWRlIHZhcmlhbmNlXG4gIHdpZ2dsZVdoZW5EcmFnZ2luZzogZmFsc2UgLy8ga2VlcCB3aWdnbGluZyB3aGVuIGRyYWdnaW5nIG9yIG5vdFxuXG5bV2lnZ2xlIV1cbmxheWVyLndpZ2dsZS5zdGFydCgpXG5sYXllci53aWdnbGUuc3RvcCgpXG5cbltDaGVjayB3aWdnbGUgc3RhdGVdXG5sYXllci53aWdnbGUuaXNXaWdnbGluZyAvL3JldHVybiB0cnVlIG9yIGZhbHNlXG4jIyNcblxuY2xhc3MgV2lnZ2xlIGV4dGVuZHMgRnJhbWVyLkJhc2VDbGFzc1xuXG4gICMgd2lnZ2xlIGZyZXF1ZW5jZSAocGVyIHNlYylcbiAgQGRlZmluZSBcImZyZXFcIixcbiAgICBnZXQ6IC0+IEBfZnJlcSxcbiAgICBzZXQ6ICh2YWx1ZSktPlxuICAgICAgaWYgXy5pc051bWJlcih2YWx1ZSkgYW5kIHZhbHVlID4gMFxuICAgICAgICBAX2ZyZXEgPSB2YWx1ZVxuICAgICAgICBAX3VwZGF0ZVdpZ2dsZUFuaWFtdGlvbigpXG5cbiAgIyB3aWdnbGUgYW1wbGl0dWRlXG4gIEBkZWZpbmUgXCJhbXBcIixcbiAgICBnZXQ6IC0+IEBfYW1wLFxuICAgIHNldDogKHZhbHVlKS0+XG4gICAgICBpZiBfLmlzTnVtYmVyKHZhbHVlKVxuICAgICAgICBAX2FtcCA9IHZhbHVlXG4gICAgICAgIEBfdXBkYXRlV2lnZ2xlQW5pYW10aW9uKClcblxuICAjIHdpZ2dsZSBhbXBsaXR1ZGUgdmFyaWFuY2VcbiAgQGRlZmluZSBcInZhcmlhbmNlXCIsXG4gICAgZ2V0OiAtPiBAX3ZhcmlhbmNlLFxuICAgIHNldDogKHZhbHVlKS0+XG4gICAgICBpZiBfLmlzTnVtYmVyKHZhbHVlKVxuICAgICAgICBAX3ZhcmlhbmNlID0gdmFsdWVcbiAgICAgICAgQF91cGRhdGVXaWdnbGVBbmlhbXRpb24oKVxuXG4gICMga2VlcCB3aWdnbGluZyB3aGVuIGRyYWdnaW5nXG4gIEBkZWZpbmUgXCJ3aWdnbGVXaGVuRHJhZ2dpbmdcIixcbiAgICBnZXQ6IC0+IEBfa2VlcFdpZ2dsaW5nXG4gICAgc2V0OiAodmFsdWUpLT4gQF9rZWVwV2lnZ2xpbmcgPSB2YWx1ZSBpZiBfLmlzQm9vbGVhbiB2YWx1ZVxuXG4gIEBkZWZpbmUgXCJpc1dpZ2dsaW5nXCIsIGdldDogLT4gQF9pc1dpZ2dsaW5nIG9yIGZhbHNlXG5cbiAgY29uc3RydWN0b3I6IChAbGF5ZXIpLT5cbiAgICBzdXBlclxuXG4gICAgQGZyZXEgPSA2XG4gICAgQGFtcCA9IDJcbiAgICBAdmFyaWFuY2UgPSAxXG5cbiAgICBAX2tlZXBXaWdnbGluZyA9IGZhbHNlXG4gICAgQG9yaW5naW5hbFJvdGF0ZSA9IEBsYXllci5yb3RhdGlvblxuXG4gICAgQGxheWVyLm9uIEV2ZW50cy5UYXBTdGFydCwgPT5cbiAgICAgIGlmIEBsYXllci5kcmFnZ2FibGUuZW5hYmxlZCBpcyB0cnVlXG4gICAgICAgIGlmIEBfaXNXaWdnbGluZyBhbmQgbm90IEBfa2VlcFdpZ2dsaW5nIHRoZW4gQF9yZXNldEZyYW1lKClcblxuICAgIEBsYXllci5vbiBFdmVudHMuRHJhZ1N0YXJ0LCA9PlxuICAgICAgICBpZiBAX2tlZXBXaWdnbGluZyB0aGVuIFV0aWxzLnJhbmRvbUNob2ljZShAQW5pbWF0aW9ucykuc3RhcnQoKVxuXG4gICAgQGxheWVyLm9uIEV2ZW50cy5EcmFnRW5kLCA9PlxuICAgICAgaWYgQF9pc1dpZ2dsaW5nIGFuZCBub3QgQF9rZWVwV2lnZ2xpbmcgdGhlbiBVdGlscy5yYW5kb21DaG9pY2UoQEFuaW1hdGlvbnMpLnN0YXJ0KClcblxuICBfdXBkYXRlV2lnZ2xlQW5pYW10aW9uOiAtPlxuICAgIEBBbmltYXRpb25zID0gW11cbiAgICBsZW5ndGggPSA0XG4gICAgaGFsZkR1cmF0aW9uID0gMS9AZnJlcS8yXG4gICAgb3JpZ2luU2hpZnQgPSAwLjI1XG5cbiAgICBmb3IgaSBpbiBbMC4uLmxlbmd0aF1cbiAgICAgIHJvdGF0aW9uU2hpZnQgPSBVdGlscy5yYW5kb21OdW1iZXIoLUB2YXJpYW5jZSwgQHZhcmlhbmNlKVxuXG4gICAgICBAQW5pbWF0aW9uc1syKmldID0gbmV3IEFuaW1hdGlvblxuICAgICAgICBsYXllcjogQGxheWVyXG4gICAgICAgIHByb3BlcnRpZXM6XG4gICAgICAgICAgcm90YXRpb246IEBhbXArcm90YXRpb25TaGlmdFxuICAgICAgICAgIG9yaWdpblg6IDAuNS1vcmlnaW5TaGlmdFxuICAgICAgICB0aW1lOiBoYWxmRHVyYXRpb25cblxuICAgICAgQEFuaW1hdGlvbnNbMippKzFdID0gbmV3IEFuaW1hdGlvblxuICAgICAgICBsYXllcjogQGxheWVyXG4gICAgICAgIHByb3BlcnRpZXM6XG4gICAgICAgICAgcm90YXRpb246IC0oQGFtcCtyb3RhdGlvblNoaWZ0KVxuICAgICAgICAgIG9yaWdpblg6IDAuNStvcmlnaW5TaGlmdFxuICAgICAgICB0aW1lOiBoYWxmRHVyYXRpb25cblxuICAgIGZvciBhbmltYXRpb24sIGluZGV4IGluIEBBbmltYXRpb25zXG4gICAgICBpZiBpbmRleCBpcyBAQW5pbWF0aW9ucy5sZW5ndGgtMVxuICAgICAgICBhbmltYXRpb24ub24oRXZlbnRzLkFuaW1hdGlvbkVuZCwgQEFuaW1hdGlvbnNbMF0uc3RhcnQgKVxuICAgICAgZWxzZVxuICAgICAgICBhbmltYXRpb24ub24oIEV2ZW50cy5BbmltYXRpb25FbmQsICgoaW5kZXgpLT5cbiAgICAgICAgICBAQW5pbWF0aW9uc1tpbmRleCsxXS5zdGFydCgpXG4gICAgICAgICkuYmluZCh0aGlzLCBpbmRleCkpXG5cbiAgX3Jlc2V0RnJhbWU6IC0+XG4gICAgQGxheWVyLnJvdGF0aW9uID0gQG9yaW5naW5hbFJvdGF0ZVxuICAgIEBsYXllci5vcmlnaW5YID0gLjVcblxuICBzdGFydDogLT5cbiAgICBVdGlscy5yYW5kb21DaG9pY2UoQEFuaW1hdGlvbnMpLnN0YXJ0KClcbiAgICBAX2lzV2lnZ2xpbmcgPSB0cnVlXG5cbiAgc3RvcDogLT5cbiAgICBmb3IgYW5pbWF0aW9uIGluIEBBbmltYXRpb25zXG4gICAgICBhbmltYXRpb24uc3RvcCgpXG4gICAgQF9yZXNldEZyYW1lKClcbiAgICBAX2lzV2lnZ2xpbmcgPSBmYWxzZVxuXG4jIEFkZCBleHRlbnNpb24gbWV0aG9kIHRvIExheWVyXG5MYXllci5kZWZpbmUgXCJ3aWdnbGVcIixcbiAgZ2V0OiAtPiBAX3dpZ2dsZSA/PSBuZXcgV2lnZ2xlKEApXG4gIHNldDogKG9wdGlvbnMpIC0+XG4gICAgQHdpZ2dsZS5mcmVxID0gb3B0aW9ucy5mcmVxIGlmIG9wdGlvbnMuZnJlcVxuICAgIEB3aWdnbGUuYW1wID0gb3B0aW9ucy5hbXAgaWYgb3B0aW9ucy5hbXBcbiAgICBAd2lnZ2xlLndpZ2dsZVdoZW5EcmFnZ2luZyA9IG9wdGlvbnMud2lnZ2xlV2hlbkRyYWdnaW5nIGlmIG9wdGlvbnMud2lnZ2xlV2hlbkRyYWdnaW5nIl19
