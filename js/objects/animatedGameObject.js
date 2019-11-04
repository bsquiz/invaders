class AnimatedGameObject extends GameObject {
	constructor() {
		super();
		
		this.animationFrame = 0;
		this.MAX_ANIMATION_FRAMES = 2;
	}
	
	getAnimationFrame() { return this.animationFrame; }
	setAnimationFrame(frame) { this.animationFrame = frame; }
	
	animate() {
		if (this.animationFrames < this.MAX_ANIMATION_FRAMES) {
			this.animationFrame++;
		}
	}
}
