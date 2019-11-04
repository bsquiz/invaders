class InvadersPlayer extends GameObject {
	constructor() {
		super();
		this.defaultYSpeed = 0;
		this.ySpeed = 0;
		this.isInvincible = false;
		this.invincibleTimer = 0;
		this.MAX_INVINCIBLE_TIME = 30;
		this.destroyedTimer = 0;
		this.MAX_DESTROYED_TIME = 10;
	}

	updateInvincibleTimer() {
		if (this.invincibleTimer < this.MAX_INVINCIBLE_TIME) {
			this.invincibleTimer++;
		} else {
			this.isInvincible = false;
			this.invincibleTimer = 0;
		}
	}

	updateDestroyedTimer() {
		if (this.destroyedTimer < this.MAX_DESTROYED_TIME) {
			this.destroyedTimer++;
		} else {
			this.destroyedTimer = 0;
			this.isDestroyed = false;
		}
	}

	shoot() {}
}
