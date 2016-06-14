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


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvTHVjaWVuL0Rlc2t0b3AvcGxheWdyb3VuZC5mcmFtZXIvbW9kdWxlcy9XaWdnbGUuY29mZmVlIiwiL1VzZXJzL0x1Y2llbi9EZXNrdG9wL3BsYXlncm91bmQuZnJhbWVyL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBLE1BQUE7RUFBQTs7O0FBeUJNOzs7RUFHSixNQUFDLENBQUEsTUFBRCxDQUFRLE1BQVIsRUFDRTtJQUFBLEdBQUEsRUFBSyxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUosQ0FBTDtJQUNBLEdBQUEsRUFBSyxTQUFDLEtBQUQ7TUFDSCxJQUFHLENBQUMsQ0FBQyxRQUFGLENBQVcsS0FBWCxDQUFBLElBQXNCLEtBQUEsR0FBUSxDQUFqQztRQUNFLElBQUMsQ0FBQSxLQUFELEdBQVM7ZUFDVCxJQUFDLENBQUEsc0JBQUQsQ0FBQSxFQUZGOztJQURHLENBREw7R0FERjs7RUFRQSxNQUFDLENBQUEsTUFBRCxDQUFRLEtBQVIsRUFDRTtJQUFBLEdBQUEsRUFBSyxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUosQ0FBTDtJQUNBLEdBQUEsRUFBSyxTQUFDLEtBQUQ7TUFDSCxJQUFHLENBQUMsQ0FBQyxRQUFGLENBQVcsS0FBWCxDQUFIO1FBQ0UsSUFBQyxDQUFBLElBQUQsR0FBUTtlQUNSLElBQUMsQ0FBQSxzQkFBRCxDQUFBLEVBRkY7O0lBREcsQ0FETDtHQURGOztFQVFBLE1BQUMsQ0FBQSxNQUFELENBQVEsVUFBUixFQUNFO0lBQUEsR0FBQSxFQUFLLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSixDQUFMO0lBQ0EsR0FBQSxFQUFLLFNBQUMsS0FBRDtNQUNILElBQUcsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxL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R0FBUixHQUFjLE9BQU8sQ0FBQyxJQUF0Qjs7SUFDQSxJQUEyRCxPQUFPLENBQUMsa0JBQW5FO2FBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBUixHQUE2QixPQUFPLENBQUMsbUJBQXJDOztFQUhHLENBREw7Q0FERjs7OztBQ3JIQSxPQUFPLENBQUMsS0FBUixHQUFnQjs7QUFFaEIsT0FBTyxDQUFDLFVBQVIsR0FBcUIsU0FBQTtTQUNwQixLQUFBLENBQU0sdUJBQU47QUFEb0I7O0FBR3JCLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMjI1xuV2lnZ2xlIE1vZHVsZSBmb3IgRnJhbWVySlNcbkNyZWF0ZWQgYnkgTHVjaWVuIExlZSAoQGx1Y2llbmRlZXIpLCBGZWIuIDE3dGgsIDIwMTZcbmh0dHBzOi8vZ2l0aHViLmNvbS9MdWNpZW5MZWUvZnJhbWVyLVdpZ2dsZVxuXG5XaWdnbGUgTW9kdWxlIGhlbHAgeW91IGNyZWF0aW5nIHdpZ2dsZSBlZmZlY3QgaW4gRnJhbWVySlMuXG5cbkFkZCB0aGUgZm9sbG93aW5nIGxpbmUgdG8geW91ciBwcm9qZWN0IGluIEZyYW1lciBTdHVkaW8uXG4gIHJlcXVpcmUgJ1dpZ2dsZSdcblxuW0NvbmZpZ3VyZSB3aWdnbGVdXG5sYXllci53aWdnbGUgPVxuICBmcmVxOiA2IC8vd2lnZ2xlIGZyZXF1ZW5jZSAocGVyIHNlYylcbiAgYW1wOiAxIC8vIHdpZ2dsZSBhbXBsaXR1ZGVcbiAgdmFyaWFuY2U6IDIgLy8gd2lnZ2xlIGFtcGxpdHVkZSB2YXJpYW5jZVxuICB3aWdnbGVXaGVuRHJhZ2dpbmc6IGZhbHNlIC8vIGtlZXAgd2lnZ2xpbmcgd2hlbiBkcmFnZ2luZyBvciBub3RcblxuW1dpZ2dsZSFdXG5sYXllci53aWdnbGUuc3RhcnQoKVxubGF5ZXIud2lnZ2xlLnN0b3AoKVxuXG5bQ2hlY2sgd2lnZ2xlIHN0YXRlXVxubGF5ZXIud2lnZ2xlLmlzV2lnZ2xpbmcgLy9yZXR1cm4gdHJ1ZSBvciBmYWxzZVxuIyMjXG5cbmNsYXNzIFdpZ2dsZSBleHRlbmRzIEZyYW1lci5CYXNlQ2xhc3NcblxuICAjIHdpZ2dsZSBmcmVxdWVuY2UgKHBlciBzZWMpXG4gIEBkZWZpbmUgXCJmcmVxXCIsXG4gICAgZ2V0OiAtPiBAX2ZyZXEsXG4gICAgc2V0OiAodmFsdWUpLT5cbiAgICAgIGlmIF8uaXNOdW1iZXIodmFsdWUpIGFuZCB2YWx1ZSA+IDBcbiAgICAgICAgQF9mcmVxID0gdmFsdWVcbiAgICAgICAgQF91cGRhdGVXaWdnbGVBbmlhbXRpb24oKVxuXG4gICMgd2lnZ2xlIGFtcGxpdHVkZVxuICBAZGVmaW5lIFwiYW1wXCIsXG4gICAgZ2V0OiAtPiBAX2FtcCxcbiAgICBzZXQ6ICh2YWx1ZSktPlxuICAgICAgaWYgXy5pc051bWJlcih2YWx1ZSlcbiAgICAgICAgQF9hbXAgPSB2YWx1ZVxuICAgICAgICBAX3VwZGF0ZVdpZ2dsZUFuaWFtdGlvbigpXG5cbiAgIyB3aWdnbGUgYW1wbGl0dWRlIHZhcmlhbmNlXG4gIEBkZWZpbmUgXCJ2YXJpYW5jZVwiLFxuICAgIGdldDogLT4gQF92YXJpYW5jZSxcbiAgICBzZXQ6ICh2YWx1ZSktPlxuICAgICAgaWYgXy5pc051bWJlcih2YWx1ZSlcbiAgICAgICAgQF92YXJpYW5jZSA9IHZhbHVlXG4gICAgICAgIEBfdXBkYXRlV2lnZ2xlQW5pYW10aW9uKClcblxuICAjIGtlZXAgd2lnZ2xpbmcgd2hlbiBkcmFnZ2luZ1xuICBAZGVmaW5lIFwid2lnZ2xlV2hlbkRyYWdnaW5nXCIsXG4gICAgZ2V0OiAtPiBAX2tlZXBXaWdnbGluZ1xuICAgIHNldDogKHZhbHVlKS0+IEBfa2VlcFdpZ2dsaW5nID0gdmFsdWUgaWYgXy5pc0Jvb2xlYW4gdmFsdWVcblxuICBAZGVmaW5lIFwiaXNXaWdnbGluZ1wiLCBnZXQ6IC0+IEBfaXNXaWdnbGluZyBvciBmYWxzZVxuXG4gIGNvbnN0cnVjdG9yOiAoQGxheWVyKS0+XG4gICAgc3VwZXJcblxuICAgIEBmcmVxID0gNlxuICAgIEBhbXAgPSAyXG4gICAgQHZhcmlhbmNlID0gMVxuXG4gICAgQF9rZWVwV2lnZ2xpbmcgPSBmYWxzZVxuICAgIEBvcmluZ2luYWxSb3RhdGUgPSBAbGF5ZXIucm90YXRpb25cblxuICAgIEBsYXllci5vbiBFdmVudHMuRHJhZ1Nlc3Npb25TdGFydCwgPT5cbiAgICAgIGlmIG5vdCBAX2tlZXBXaWdnbGluZyB0aGVuIEBzdG9wKClcblxuICAgIEBsYXllci5vbiBFdmVudHMuRHJhZ1Nlc3Npb25FbmQsID0+XG4gICAgICBpZiBub3QgQF9rZWVwV2lnZ2xpbmcgdGhlbiBAc3RhcnQoKVxuXG5cbiAgX3VwZGF0ZVdpZ2dsZUFuaWFtdGlvbjogLT5cbiAgICBAQW5pbWF0aW9ucyA9IFtdXG4gICAgbGVuZ3RoID0gNFxuICAgIGhhbGZEdXJhdGlvbiA9IDEvQGZyZXEvMlxuICAgIG9yaWdpblNoaWZ0ID0gMC4yNVxuXG4gICAgZm9yIGkgaW4gWzAuLi5sZW5ndGhdXG4gICAgICByb3RhdGlvblNoaWZ0ID0gVXRpbHMucmFuZG9tTnVtYmVyKC1AdmFyaWFuY2UsIEB2YXJpYW5jZSlcblxuICAgICAgQEFuaW1hdGlvbnNbMippXSA9IG5ldyBBbmltYXRpb25cbiAgICAgICAgbGF5ZXI6IEBsYXllclxuICAgICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICAgIHJvdGF0aW9uOiBAYW1wK3JvdGF0aW9uU2hpZnRcbiAgICAgICAgICBvcmlnaW5YOiAwLjUtb3JpZ2luU2hpZnRcbiAgICAgICAgdGltZTogaGFsZkR1cmF0aW9uXG5cbiAgICAgIEBBbmltYXRpb25zWzIqaSsxXSA9IG5ldyBBbmltYXRpb25cbiAgICAgICAgbGF5ZXI6IEBsYXllclxuICAgICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICAgIHJvdGF0aW9uOiAtKEBhbXArcm90YXRpb25TaGlmdClcbiAgICAgICAgICBvcmlnaW5YOiAwLjUrb3JpZ2luU2hpZnRcbiAgICAgICAgdGltZTogaGFsZkR1cmF0aW9uXG5cbiAgICBmb3IgYW5pbWF0aW9uLCBpbmRleCBpbiBAQW5pbWF0aW9uc1xuICAgICAgaWYgaW5kZXggaXMgQEFuaW1hdGlvbnMubGVuZ3RoLTFcbiAgICAgICAgYW5pbWF0aW9uLm9uKEV2ZW50cy5BbmltYXRpb25FbmQsIEBBbmltYXRpb25zWzBdLnN0YXJ0IClcbiAgICAgIGVsc2VcbiAgICAgICAgYW5pbWF0aW9uLm9uKCBFdmVudHMuQW5pbWF0aW9uRW5kLCAoKGluZGV4KS0+XG4gICAgICAgICAgQEFuaW1hdGlvbnNbaW5kZXgrMV0uc3RhcnQoKVxuICAgICAgICApLmJpbmQodGhpcywgaW5kZXgpKVxuXG4gIF9yZXNldEZyYW1lOiAtPlxuICAgIEBsYXllci5yb3RhdGlvbiA9IEBvcmluZ2luYWxSb3RhdGVcbiAgICBAbGF5ZXIub3JpZ2luWCA9IC41XG5cbiAgc3RhcnQ6IC0+XG4gICAgVXRpbHMucmFuZG9tQ2hvaWNlKEBBbmltYXRpb25zKS5zdGFydCgpXG4gICAgQF9pc1dpZ2dsaW5nID0gdHJ1ZVxuXG4gIHN0b3A6IC0+XG4gICAgZm9yIGFuaW1hdGlvbiBpbiBAQW5pbWF0aW9uc1xuICAgICAgYW5pbWF0aW9uLnN0b3AoKVxuICAgIEBfcmVzZXRGcmFtZSgpXG4gICAgQF9pc1dpZ2dsaW5nID0gZmFsc2VcblxuIyBBZGQgZXh0ZW5zaW9uIG1ldGhvZCB0byBMYXllclxuTGF5ZXIuZGVmaW5lIFwid2lnZ2xlXCIsXG4gIGdldDogLT4gQF93aWdnbGUgPz0gbmV3IFdpZ2dsZShAKVxuICBzZXQ6IChvcHRpb25zKSAtPlxuICAgIEB3aWdnbGUuZnJlcSA9IG9wdGlvbnMuZnJlcSBpZiBvcHRpb25zLmZyZXFcbiAgICBAd2lnZ2xlLmFtcCA9IG9wdGlvbnMuYW1wIGlmIG9wdGlvbnMuYW1wXG4gICAgQHdpZ2dsZS53aWdnbGVXaGVuRHJhZ2dpbmcgPSBvcHRpb25zLndpZ2dsZVdoZW5EcmFnZ2luZyBpZiBvcHRpb25zLndpZ2dsZVdoZW5EcmFnZ2luZyIsIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iXX0=
