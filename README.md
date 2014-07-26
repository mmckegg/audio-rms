audio-rms
===

Connect a Web Audio API AudioNode and stream out the realtime RMS audio level.

## Install

```bash
$ npm install audio-rms
```

## Example

Stereo level meter using html5's meter element.

```html
<meter id='L' min='-20' class='.left' high='0' value='-20' max='6' />
<meter id='R' min='-20' class='.right' high='0' value='-20' max='6' />
```

```js
var AudioRMS = require('audio-rms')

var leftMeter = document.getElementById('L')
var rightMeter = document.getElementById('R')

var audioContext = new AudioContext()
var output = audioContext.createGain()
output.gain.value = 0.4
output.connect(audioContext.destination)

var oscillator = audioContext.createOscillator()
oscillator.connect(output)
oscillator.start()

// modulate audio level
var lfo = audioContext.createOscillator()
var amp = audioContext.createGain()
lfo.frequency.value = 1
amp.gain.value = 0.4
lfo.connect(amp)
amp.connect(output.gain)
lfo.start()

var rms = AudioRMS(audioContext)
output.connect(rms.input)

rms.on('data', function(data){
  leftMeter.value = Math.max(-40, getDecibels(data[0]))
  rightMeter.value = Math.max(-40, getDecibels(data[1]))
})

function getDecibels(value) {
  if (value == null) return 0
  return Math.round(Math.round(20 * (0.43429 * Math.log(value)) * 100) / 100 * 100) / 100
}
```