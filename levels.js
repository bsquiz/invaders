const InvadersLevels = {
	alienRows: 5,
	alienCols: 5,
	alienPadding: 16,
	aliensStartX: 0,
	aliensStartY: 0,

	makeAliens(gameHeight) {
		let sx = this.aliensStartX;
		let sy = this.aliensStartY;
		let points = 60;
		const aliens = [];

		for (let i=0; i<this.alienRows; i++) {
			for (let j=0; j<this.alienCols; j++) {	
				const a = new InvadersAlien(i);
				a.setPoints(points);
				a.setX(sx);
				a.setY(sy);
				sx += a.getWidth() + this.alienPadding;
				aliens.push(a);
			}
			points -= 10;
			sy += this.alienPadding * 2;
			sx = this.aliensStartX;
		}

		return aliens;
	},

	makeCovers(gameWidth, gameHeight) {
		const covers = [];
		const diff = parseInt(gameWidth / 6);
		let x = parseInt(diff / 2) - 8;
	
		for (let i=0; i<6; i++) {
			const c = new InvadersCover();
		
			c.setX(x);
			c.setY(gameHeight - parseInt(gameHeight / 6));
			covers.push(c);

			x += diff;
		}	
		return covers;	
	},
	
	parseLevel(level = [], gameWidth, gameHeight) {
		const aliens = this.makeAliens(gameWidth, gameHeight);
		const cover = this.makeCovers(gameWidth, gameHeight);

		return {
			aliens: aliens,
			covers: cover
		};
	},
	
	init(gameWidth, gameHeight) {
		this.aliensStartX = parseInt((gameWidth / 2) - (this.alienPadding * 2 * this.alienCols / 2));
		this.aliensStartY = parseInt(gameHeight / 6);
	}
}
