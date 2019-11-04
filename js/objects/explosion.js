class InvadersExplosion extends AnimatedGameObject {
	constructor() {
		super();
		
		this.MAX_ANIMATION_FRAMES = 6;
		this.animationTime = 0;
		this.maxAnimationTime = 2;
	}

	isFinished() {
		return this.animationFrame === this.MAX_ANIMATION_FRAMES;
	}

	animate() {
		if (this.animationTime === this.maxAnimationTime) {
			if (this.animationFrame < this.MAX_ANIMATION_FRAMES) {
				this.animationFrame++;
			}
			this.animationTime = 0;
		}
		this.animationTime++;
	}
	reset() {
		this.x = 0;
		this.y = 0;
		this.animationFrame = 0;
		this.isActive = false;
	}
}
