class InvadersAlien extends AnimatedGameObject {
	constructor(type) {
		super();
		this.type = type;
		this.xSpeed = 1;
		this.ySpeed = 0;
		this.isMoving = true;
		this.hp = 1;
		this.points = 10;
		this.MAX_X_SPEED = 10;
		this.direction = 1;
	}

	animate() {
		if (this.animationFrame === 0) {
			this.animationFrame = 1;
		} else {
			this.animationFrame = 0;
		}
	}

	turn() {
		this.direction *= -1;
	}
	move() {
		this.x += this.xSpeed * this.direction;
	}
	setPoints(points) { this.points = points; }
	getPoints() { return this.points; }
	getType() { return this.type; }
	
	speedUp() {
		if (this.xSpeed < this.MAX_X_SPEED) {
			this.xSpeed++;
		}
	}	
}
