const InvadersAudio = {
	isMuted: false,
	currentMusicNote: 0,
	nextNoteTime: 0,
	maxNextNoteTime: 50,
	musicNotes: [
		220,
		196,
		174,
		164	
	],
	currentSpaceshipNote: 0,
	nextSpaceshipNoteTime: 0,
	maxNextSpaceshipNoteTime: 10,
	spaceshipNotes: [
		1000,
		800
	],
	sine: BAudio.createOscillator(BAudio.Oscillators.SINE),
	square: BAudio.createOscillator(BAudio.Oscillators.SQUARE),
	triangle: BAudio.createOscillator(BAudio.Oscillators.TRIANGLE),
	sawtooth: BAudio.createOscillator(BAudio.Oscillators.SAWTOOTH),

	toggleMute() { this.isMuted = !this.isMuted; },

	resetMusic() {
		this.maxNextNoteTime = 50;
	},

	progressSpaceshipSnd() {
		if (this.isMuted) return;

		this.nextSpaceshipNoteTime++;

		if (this.nextSpaceshipNoteTime >= this.maxNextSpaceshipNoteTime) {
			BAudio.playOscillator(
				this.sine,
				this.spaceshipNotes[this.currentSpaceshipNote],
				70
			);
			this.currentSpaceshipNote++;

			if (this.currentSpaceshipNote > this.spaceshipNotes.length - 1) {
				this.currentSpaceshipNote = 0;
			}
		
			this.nextSpaceshipNoteTime = 0;
		}
	},

	playPlayerShootSnd() {
		if (this.isMuted) return;

		BAudio.playOscillator(this.sine, 1600);
	},
	playExplosionSnd() {
		if (this.isMuted) return;

		const et = 200;

		BAudio.playOscillator(this.triangle, 200, et);
		window.setTimeout(() => {
			BAudio.playOscillator(this.triangle, 500, et);
		}, et);	
	},
	progressMusic() {
		if (this.isMuted) return;

		this.nextNoteTime++;

		if (this.nextNoteTime >= this.maxNextNoteTime) {
			BAudio.playOscillator(
				this.square,
				this.musicNotes[this.currentMusicNote],
				100,
				0.05
			);
			this.currentMusicNote++;

			if (this.currentMusicNote > this.musicNotes.length - 1) {
				this.currentMusicNote = 0;
			}
		
			this.nextNoteTime = 0;
		}
	},
	speedUpMusic() {
		if (this.maxNextNoteTime > 5) {
			this.maxNextNoteTime--;
		}
	}
};
