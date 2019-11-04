class InvadersSpaceship extends InvadersAlien {
	constructor(y) {
		super();
	
		this.xSpeed = 1;
		this.points = 100;
		this.y = y; 
	}

	reset() {
		this.isActive = false;
		this.x = 0;
	}
}
