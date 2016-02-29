# Web Audio Arpeggiator

I wanted my own arpeggiator after hearing [these M83](https://www.youtube.com/watch?v=UB6dmk6G2dk) [arpeggiator tracks](https://soundcloud.com/desandro-1/m83-disney-concert-hall-instrumental-5).

+ Create a tone sequence, then play that sequence relative to a key
+ Save sequences to list. Uses localStorage to save over browser sessions
+ Adjust multiple options
  - **Attack** - time tone reachs full volume
  - **Hold** - time tone plays within its beat
  - **Release** - time tone reaches 0 volume after stopped
  - **Filter** - cut offs frequencies
  - **Resonance** - increase harmonic frequencies around cutoff
  - **Speed** - speed of playing arpeggio
  - **Shape** - sound wave shape of the oscillator: square, sawtooth, triangle, & sine

Made with [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

Works well in Chrome and Firefox.

The code is a bit of a mess. I made this for fun.
