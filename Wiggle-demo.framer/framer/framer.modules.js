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
    this.layer.on(Events.DragSessionStart, (function(_this) {
      return function() {
        if (!_this._keepWiggling) {
          return _this.stop();
        }
      };
    })(this));
    this.layer.on(Events.DragSessionEnd, (function(_this) {
      return function() {
        if (!_this._keepWiggling) {
          return _this.start();
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvTHVjaWVuL1Byb2plY3QvZnJhbWVyLVdpZ2dsZS9XaWdnbGUtZGVtby5mcmFtZXIvbW9kdWxlcy9XaWdnbGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBLE1BQUE7RUFBQTs7O0FBeUJNOzs7RUFHSixNQUFDLENBQUEsTUFBRCxDQUFRLE1BQVIsRUFDRTtJQUFBLEdBQUEsRUFBSyxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUosQ0FBTDtJQUNBLEdBQUEsRUFBSyxTQUFDLEtBQUQ7TUFDSCxJQUFHLENBQUMsQ0FBQyxRQUFGLENBQVcsS0FBWCxDQUFBLElBQXNCLEtBQUEsR0FBUSxDQUFqQztRQUNFLElBQUMsQ0FBQSxLQUFELEdBQVM7ZUFDVCxJQUFDLENBQUEsc0JBQUQsQ0FBQSxFQUZGOztJQURHLENBREw7R0FERjs7RUFRQSxNQUFDLENBQUEsTUFBRCxDQUFRLEtBQVIsRUFDRTtJQUFBLEdBQUEsRUFBSyxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUosQ0FBTDtJQUNBLEdBQUEsRUFBSyxTQUFDLEtBQUQ7TUFDSCxJQUFHLENBQUMsQ0FBQyxRQUFGLENBQVcsS0FBWCxDQUFIO1FBQ0UsSUFBQyxDQUFBLElBQUQsR0FBUTtlQUNSLElBQUMsQ0FBQSxzQkFBRCxDQUFBLEVBRkY7O0lBREcsQ0FETDtHQURGOztFQVFBLE1BQUMsQ0FBQSxNQUFELENBQVEsVUFBUixFQUNFO0lBQUEsR0FBQSxFQUFLLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSixDQUFMO0lBQ0EsR0FBQSxFQUFLLFNBQUMsS0FBRDtNQUNILElBQUcsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxLQUFYLENBQUg7UUFDRSxJQUFDLENBQUEsU0FBRCxHQUFhO2VBQ2IsSUFBQyxDQUFBLHNC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QW5FO2FBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBUixHQUE2QixPQUFPLENBQUMsbUJBQXJDOztFQUhHLENBREw7Q0FERiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIyNcbldpZ2dsZSBNb2R1bGUgZm9yIEZyYW1lckpTXG5DcmVhdGVkIGJ5IEx1Y2llbiBMZWUgKEBsdWNpZW5kZWVyKSwgRmViLiAxN3RoLCAyMDE2XG5odHRwczovL2dpdGh1Yi5jb20vTHVjaWVuTGVlL2ZyYW1lci1XaWdnbGVcblxuV2lnZ2xlIE1vZHVsZSBoZWxwIHlvdSBjcmVhdGluZyB3aWdnbGUgZWZmZWN0IGluIEZyYW1lckpTLlxuXG5BZGQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIHlvdXIgcHJvamVjdCBpbiBGcmFtZXIgU3R1ZGlvLlxuICByZXF1aXJlICdXaWdnbGUnXG5cbltDb25maWd1cmUgd2lnZ2xlXVxubGF5ZXIud2lnZ2xlID1cbiAgZnJlcTogNiAvL3dpZ2dsZSBmcmVxdWVuY2UgKHBlciBzZWMpXG4gIGFtcDogMSAvLyB3aWdnbGUgYW1wbGl0dWRlXG4gIHZhcmlhbmNlOiAyIC8vIHdpZ2dsZSBhbXBsaXR1ZGUgdmFyaWFuY2VcbiAgd2lnZ2xlV2hlbkRyYWdnaW5nOiBmYWxzZSAvLyBrZWVwIHdpZ2dsaW5nIHdoZW4gZHJhZ2dpbmcgb3Igbm90XG5cbltXaWdnbGUhXVxubGF5ZXIud2lnZ2xlLnN0YXJ0KClcbmxheWVyLndpZ2dsZS5zdG9wKClcblxuW0NoZWNrIHdpZ2dsZSBzdGF0ZV1cbmxheWVyLndpZ2dsZS5pc1dpZ2dsaW5nIC8vcmV0dXJuIHRydWUgb3IgZmFsc2VcbiMjI1xuXG5jbGFzcyBXaWdnbGUgZXh0ZW5kcyBGcmFtZXIuQmFzZUNsYXNzXG5cbiAgIyB3aWdnbGUgZnJlcXVlbmNlIChwZXIgc2VjKVxuICBAZGVmaW5lIFwiZnJlcVwiLFxuICAgIGdldDogLT4gQF9mcmVxLFxuICAgIHNldDogKHZhbHVlKS0+XG4gICAgICBpZiBfLmlzTnVtYmVyKHZhbHVlKSBhbmQgdmFsdWUgPiAwXG4gICAgICAgIEBfZnJlcSA9IHZhbHVlXG4gICAgICAgIEBfdXBkYXRlV2lnZ2xlQW5pYW10aW9uKClcblxuICAjIHdpZ2dsZSBhbXBsaXR1ZGVcbiAgQGRlZmluZSBcImFtcFwiLFxuICAgIGdldDogLT4gQF9hbXAsXG4gICAgc2V0OiAodmFsdWUpLT5cbiAgICAgIGlmIF8uaXNOdW1iZXIodmFsdWUpXG4gICAgICAgIEBfYW1wID0gdmFsdWVcbiAgICAgICAgQF91cGRhdGVXaWdnbGVBbmlhbXRpb24oKVxuXG4gICMgd2lnZ2xlIGFtcGxpdHVkZSB2YXJpYW5jZVxuICBAZGVmaW5lIFwidmFyaWFuY2VcIixcbiAgICBnZXQ6IC0+IEBfdmFyaWFuY2UsXG4gICAgc2V0OiAodmFsdWUpLT5cbiAgICAgIGlmIF8uaXNOdW1iZXIodmFsdWUpXG4gICAgICAgIEBfdmFyaWFuY2UgPSB2YWx1ZVxuICAgICAgICBAX3VwZGF0ZVdpZ2dsZUFuaWFtdGlvbigpXG5cbiAgIyBrZWVwIHdpZ2dsaW5nIHdoZW4gZHJhZ2dpbmdcbiAgQGRlZmluZSBcIndpZ2dsZVdoZW5EcmFnZ2luZ1wiLFxuICAgIGdldDogLT4gQF9rZWVwV2lnZ2xpbmdcbiAgICBzZXQ6ICh2YWx1ZSktPiBAX2tlZXBXaWdnbGluZyA9IHZhbHVlIGlmIF8uaXNCb29sZWFuIHZhbHVlXG5cbiAgQGRlZmluZSBcImlzV2lnZ2xpbmdcIiwgZ2V0OiAtPiBAX2lzV2lnZ2xpbmcgb3IgZmFsc2VcblxuICBjb25zdHJ1Y3RvcjogKEBsYXllciktPlxuICAgIHN1cGVyXG5cbiAgICBAZnJlcSA9IDZcbiAgICBAYW1wID0gMlxuICAgIEB2YXJpYW5jZSA9IDFcblxuICAgIEBfa2VlcFdpZ2dsaW5nID0gZmFsc2VcbiAgICBAb3JpbmdpbmFsUm90YXRlID0gQGxheWVyLnJvdGF0aW9uXG5cbiAgICBAbGF5ZXIub24gRXZlbnRzLkRyYWdTZXNzaW9uU3RhcnQsID0+XG4gICAgICBpZiBub3QgQF9rZWVwV2lnZ2xpbmcgdGhlbiBAc3RvcCgpXG5cbiAgICBAbGF5ZXIub24gRXZlbnRzLkRyYWdTZXNzaW9uRW5kLCA9PlxuICAgICAgaWYgbm90IEBfa2VlcFdpZ2dsaW5nIHRoZW4gQHN0YXJ0KClcblxuXG4gIF91cGRhdGVXaWdnbGVBbmlhbXRpb246IC0+XG4gICAgQEFuaW1hdGlvbnMgPSBbXVxuICAgIGxlbmd0aCA9IDRcbiAgICBoYWxmRHVyYXRpb24gPSAxL0BmcmVxLzJcbiAgICBvcmlnaW5TaGlmdCA9IDAuMjVcblxuICAgIGZvciBpIGluIFswLi4ubGVuZ3RoXVxuICAgICAgcm90YXRpb25TaGlmdCA9IFV0aWxzLnJhbmRvbU51bWJlcigtQHZhcmlhbmNlLCBAdmFyaWFuY2UpXG5cbiAgICAgIEBBbmltYXRpb25zWzIqaV0gPSBuZXcgQW5pbWF0aW9uXG4gICAgICAgIGxheWVyOiBAbGF5ZXJcbiAgICAgICAgcHJvcGVydGllczpcbiAgICAgICAgICByb3RhdGlvbjogQGFtcCtyb3RhdGlvblNoaWZ0XG4gICAgICAgICAgb3JpZ2luWDogMC41LW9yaWdpblNoaWZ0XG4gICAgICAgIHRpbWU6IGhhbGZEdXJhdGlvblxuXG4gICAgICBAQW5pbWF0aW9uc1syKmkrMV0gPSBuZXcgQW5pbWF0aW9uXG4gICAgICAgIGxheWVyOiBAbGF5ZXJcbiAgICAgICAgcHJvcGVydGllczpcbiAgICAgICAgICByb3RhdGlvbjogLShAYW1wK3JvdGF0aW9uU2hpZnQpXG4gICAgICAgICAgb3JpZ2luWDogMC41K29yaWdpblNoaWZ0XG4gICAgICAgIHRpbWU6IGhhbGZEdXJhdGlvblxuXG4gICAgZm9yIGFuaW1hdGlvbiwgaW5kZXggaW4gQEFuaW1hdGlvbnNcbiAgICAgIGlmIGluZGV4IGlzIEBBbmltYXRpb25zLmxlbmd0aC0xXG4gICAgICAgIGFuaW1hdGlvbi5vbihFdmVudHMuQW5pbWF0aW9uRW5kLCBAQW5pbWF0aW9uc1swXS5zdGFydCApXG4gICAgICBlbHNlXG4gICAgICAgIGFuaW1hdGlvbi5vbiggRXZlbnRzLkFuaW1hdGlvbkVuZCwgKChpbmRleCktPlxuICAgICAgICAgIEBBbmltYXRpb25zW2luZGV4KzFdLnN0YXJ0KClcbiAgICAgICAgKS5iaW5kKHRoaXMsIGluZGV4KSlcblxuICBfcmVzZXRGcmFtZTogLT5cbiAgICBAbGF5ZXIucm90YXRpb24gPSBAb3JpbmdpbmFsUm90YXRlXG4gICAgQGxheWVyLm9yaWdpblggPSAuNVxuXG4gIHN0YXJ0OiAtPlxuICAgIFV0aWxzLnJhbmRvbUNob2ljZShAQW5pbWF0aW9ucykuc3RhcnQoKVxuICAgIEBfaXNXaWdnbGluZyA9IHRydWVcblxuICBzdG9wOiAtPlxuICAgIGZvciBhbmltYXRpb24gaW4gQEFuaW1hdGlvbnNcbiAgICAgIGFuaW1hdGlvbi5zdG9wKClcbiAgICBAX3Jlc2V0RnJhbWUoKVxuICAgIEBfaXNXaWdnbGluZyA9IGZhbHNlXG5cbiMgQWRkIGV4dGVuc2lvbiBtZXRob2QgdG8gTGF5ZXJcbkxheWVyLmRlZmluZSBcIndpZ2dsZVwiLFxuICBnZXQ6IC0+IEBfd2lnZ2xlID89IG5ldyBXaWdnbGUoQClcbiAgc2V0OiAob3B0aW9ucykgLT5cbiAgICBAd2lnZ2xlLmZyZXEgPSBvcHRpb25zLmZyZXEgaWYgb3B0aW9ucy5mcmVxXG4gICAgQHdpZ2dsZS5hbXAgPSBvcHRpb25zLmFtcCBpZiBvcHRpb25zLmFtcFxuICAgIEB3aWdnbGUud2lnZ2xlV2hlbkRyYWdnaW5nID0gb3B0aW9ucy53aWdnbGVXaGVuRHJhZ2dpbmcgaWYgb3B0aW9ucy53aWdnbGVXaGVuRHJhZ2dpbmciXX0=
