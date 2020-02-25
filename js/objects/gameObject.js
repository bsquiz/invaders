class GameObject {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.tileScale = 3;
		this.width = 16;
		this.height = 16;
		this.hp = 0;
		this.defaultXSpeed = 1;
		this.defaultYSpeed = 1;
		
		this.reset();
	}

	reset() {
		this.xSpeed = 1;
		this.ySpeed = 1;
		this.isMoving = false;
		this.isDestroyed = false;
		this.isActive = false;
		this.isInvincible = false;
	}

	getIsInvincible() { return this.isInvincible; }
	setIsInvincible(isInvincible) { this.isInvincible = isInvincible; }

	getIsActive() { return this.isActive; }
	setIsActive(isActive) { this.isActive = isActive; }

	getIsDestroyed() { return this.isDestroyed; }
	getDefaultXSpeed() { return this.defaultXSpeed; }
	getDefaultYSpeed() { return this.defaultYSpeed; }

	getX() { return this.x; }
	setX(x) { this.x = x; }
	getY() { return this.y; }
	setY(y) { this.y = y; }

	getWidth() { return this.width; }
	setWidth(width) { this.width = width; }
	getHeight() { return this.height; }
	setHeight(height) { this.height = height; }

	getHP() { return this.hp; }
	getXSpeed() { return this.xSpeed; }
	getYSpeed() { return this.ySpeed; }

	setIsMoving(isMoving) { this.isMoving = isMoving; }
	setXSpeed(speed) {
		this.xSpeed = speed;
	}

	setYSpeed(speed) {
		this.ySpeed = speed;
	}

	takeDamage(damage) {
		this.hp -= damage;
		
		if (this.hp <= 0) {
			this.isDestroyed = true;
		}
	}

	

	hitTest(tx, ty, tw, th) {
		// check intersection with center of object
		let checkX = this.x + (this.width / 2);
		let checkY = this.y + (this.height / 2);

		// Check intersection in place where object will be,
		// this is to avoid object getting stuck in a hitTest
		// loop inside of the other object.
		checkX += this.xSpeed;
		checkY += this.ySpeed;

		if (
			checkX >= tx &&
			checkX < (tx + tw) &&
			checkY > ty &&
			checkY < (ty + th)
		) {
			return true;
		}

		return false;
	}

	move() {
		if (this.isMoving) {
			this.x += this.xSpeed;
			this.y += this.ySpeed;
		}
	}
}
