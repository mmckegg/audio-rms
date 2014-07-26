document.body.innerHTML = "<meter id='L' min='-20' class='.left' high='0' value='-20' max='6' ></meter><meter id='R' min='-20' class='.right' high='0' value='-20' max='6' ></meter>"

var AudioRMS = require('./index')

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