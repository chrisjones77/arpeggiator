# Web Audio Arpeggiator

I wanted my own arpeggiator after hearing [these M83](https://www.youtube.com/watch?v=UB6dmk6G2dk) [arpeggiator tracks](https://soundcloud.com/desandro-1/m83-disney-concert-hall-instrumental-5).

+ Create a tone sequence, then play that sequence relative to a key
+ Save sequences to list. Uses localStorage to save over browser sessions
+ Adjust multiple options
  - **Attack** - time for tone to reach full volume
  - **Hold** - time tone plays within its beat
  - **Release** - time fot tone to reach 0 volume after stopped
  - **Filter** - cutoffs frequencies
  - **Resonance** - increase harmonic frequencies around cutoff
  - **Speed** - speed of arpeggio played
  - **Shape** - sound wave shape of the oscillator: square, sawtooth, triangle, & sine

Made with [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

Works well in Chrome and Firefox.

The code is a bit of a mess. I made this for fun.
