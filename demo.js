/* globals Instrument, ArpBoard, ArpButton */

// -------------------------- arp buttons -------------------------- //

var defaultArps = [
  [0,4,7,0,4,7,0,7],
  [0,2,4,6,7,6,4,2],
  [0,0,7,7,0,0,7,7],
  [0,2,0,4,0,2,0,7],
  [0,3,5,7,3,0,5,7],
  [7,6,4,1,7,6,4,1],
  [0,-2,0,-2,0,4,0,4],
  [0,1,0,2,0,-1,0,4],
];

var arpButtons = [];

defaultArps.forEach( function( arp ) {
  var arpButton = new ArpButton( arp );
  arpButtons.push( arpButton );
})


// -------------------------- arp boards -------------------------- //

var arpBoardContainer = document.querySelector('.arp-board-container');
var arpBoard0 = new ArpBoard( arpBoardContainer );

arpButtons[0].select();

// -------------------------- addArpButton -------------------------- //


addArpButton.onclick = function() {
  var arpButton = new ArpButton( arpBoard0.arpeggio, true );
  arpButtons.push( arpButton );
};


// -------------------------- synth -------------------------- //

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
  settings.attackTime = parseFloat( attackRange.value );
};

onAttackRangeInput();

var releaseRange = document.querySelector('.release-range');
var onReleaseRangeInput = releaseRange.oninput = function() {
  var value = parseFloat( releaseRange.value );
  settings.releaseTime = value * value * 2; // parabolic 2 seconds
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
  var bpm = parseInt( bpmRange.value, 10 );
  settings.beatTime = 60 * 1000 / ( bpm * 2 );
};
onBpmRangeInput();

var holdRange = document.querySelector('.hold-range');
var onHoldRangeInput = holdRange.oninput = function() {
  settings.holdTime = parseFloat( holdRange.value );
};
onHoldRangeInput();

var shapeSelect = document.querySelector('.shape-select');
var onShapeSelectChange = shapeSelect.onchange = function() {
  synth.voices[0].setType( shapeSelect.value );
  synth.voices[1].setType( shapeSelect.value );
};

onShapeSelectChange();

// -------------------------- visualizer -------------------------- //

var vizCanvas = document.querySelector('.viz-canvas');
var canvasWidth = vizCanvas.width = window.innerWidth - 20;
var canvasHeight = vizCanvas.height = 200;
var ctx = vizCanvas.getContext('2d');

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
