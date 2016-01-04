var inherits = require('util').inherits
var Readable = require('readable-stream').Readable

module.exports = AudioRms

function AudioRms (audioContext) {
  if (!(this instanceof AudioRms)) {
    return new AudioRms(audioContext)
  }
  Readable.call(this, { objectMode: true })

  var self = this

  this.context = audioContext
  this.input = audioContext.createGain()
  this._meter = this.context.createScriptProcessor(512 * 2, 2, 2)
  this.input.connect(this._meter)

  var lastL = 0
  var lastR = 0
  var smoothing = 0.8

  this._processAudio = function (e) {
    var rmsL = 0
    var rmsR = 0

    var inputL = e.inputBuffer.getChannelData(0)
    var inputR = e.inputBuffer.getChannelData(1)

    rmsL = Math.max(rms(inputL), lastL * smoothing)
    rmsR = Math.max(rms(inputR), lastR * smoothing)

    if (rmsL !== lastL || rmsR !== lastR) {
      self.push([rmsL, rmsR])
      lastL = rmsL
      lastR = rmsR
    }
  }

  this._meter.connect(audioContext.destination)
}

inherits(AudioRms, Readable)

function rms (input) {
  var sum = 0
  var total = 0
  for (var i = 0; i < input.length; i++) {
    var x = input[i]
    total += x
    sum += x * x
  }
  return Math.sqrt(sum / input.length)
}

AudioRms.prototype._read = function (e) {
  if (!this._meter.onaudioprocess) {
    this._meter.onaudioprocess = this._processAudio
  }
}
