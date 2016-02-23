/* globals Instrument */

var synth = new Instrument();

/**/
synth.addVoice({
  type: 'square',
  volume: 0.1
});

synth.addVoice({
  type: 'square',
  volume: 0.1,
  octaveOffset: -1,
  detune: -5
});

var filter = synth.createFilter();
filter.type = 'lowpass';
filter.Q.value = 2;

synth.output.connect( filter );

var end = filter;

end.connect( synth.destination );

// -------------------------- option inputs -------------------------- //

var attackRange = document.querySelector('.attack-range');
var onAttackRangeInput = attackRange.oninput = function() {
  synth.attackTime = parseFloat( attackRange.value );
};

onAttackRangeInput();

var releaseRange = document.querySelector('.release-range');
var onReleaseRangeInput = releaseRange.oninput = function() {
  var value = parseFloat( releaseRange.value );
  synth.releaseTime = value * value * 3;
};

onReleaseRangeInput();

var filterFreqRange = document.querySelector('.filter-freq-range');
var onFilterFreqRangeInput = filterFreqRange.oninput = function() {
  var value = parseFloat( filterFreqRange.value );
  filter.frequency.value = value * value * 20000;
};

onFilterFreqRangeInput();

var bpmRange = document.querySelector('.bpm-range');
var onBpmRangeInput = bpmRange.oninput = function() {
  synth.bpm = parseInt( bpmRange.value, 10 );
};
onBpmRangeInput();

var holdRange = document.querySelector('.hold-range');
var onHoldRangeInput = holdRange.oninput = function() {
  synth.hold = parseFloat( holdRange.value );
};
onHoldRangeInput();

var shapeSelect = document.querySelector('.shape-select');
var onShapeSelectChange = shapeSelect.onchange = function() {
  synth.voices[0].setType( shapeSelect.value );
  synth.voices[1].setType( shapeSelect.value );
}

// -------------------------- arp boards -------------------------- //

var arpContainer = document.querySelector('.arp-container');
var arpBoard0 = new ArpBoard( arpContainer );

arpBoard0.setArpeggio([0,4,7,0,4,7,0,7]);

// -------------------------- visualizer -------------------------- //

var canvas = document.querySelector('canvas');
var canvasWidth = canvas.width = window.innerWidth - 20;
var canvasHeight = canvas.height = 200;
var ctx = canvas.getContext('2d');

var analyzer = synth.audio.createAnalyser();
end.connect( analyzer );

analyzer.minDecibels = -90;
analyzer.maxDecibels = -10;
analyzer.smoothingTimeConstant = 0.85;

analyzer.fftSize = 512;
var bufferLength = analyzer.frequencyBinCount;
var dataArray = new Uint8Array( bufferLength );

// ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
ctx.fillStyle = 'white';
ctx.fillRect( 0, 0, canvasWidth, canvasHeight );

function render() {
  analyzer.getByteFrequencyData( dataArray );

  // shift down
  var canvasImageData = ctx.getImageData( 0, 0, canvasWidth, canvasHeight );
  ctx.putImageData( canvasImageData, 0, 6 );

  ctx.fillStyle = 'black';
  ctx.fillRect( 0, 0, canvasWidth, canvasHeight );

  var barWidth = Math.ceil( canvasWidth / bufferLength);

  for ( var i = 0; i < bufferLength; i++ ) {
    var x = Math.floor( i * barWidth );
    var amp = dataArray[i] / 256; // should be 256
    var hue = Math.round( amp * 210 + 210 );
    // var sat = 50 + ( 1- amp) * 50;
    // var alpha = amp;
    ctx.fillStyle = 'hsla(' + hue + ', 100%, ' + 50 + '%, ' + 1 + ')';
    var barHeight = amp * canvasHeight;
    var y = canvasHeight - barHeight;
    ctx.fillRect( x, y, barWidth, barHeight );
  }

  requestAnimationFrame( render );
}

render();
