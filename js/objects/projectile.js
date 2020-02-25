class InvadersProjectile extends GameObject {
	constructor() {
		super();
		this.isActive = false;
		this.isMoving = true;
		this.xSpeed = 0;
		this.ySpeed = 3;
	}

	setIsActive(active) {
		this.isActive = active;
	}

	getIsActive() { return this.isActive; }

	reset() {
		this.isActive = false;
	}
}
