class InvadersGraphics {
	constructor($canvas) {
		const $body = document.getElementsByTagName('body')[0];

		const $sprites = document.getElementById('sprites');
		this.ctx = $canvas.getContext('2d', { alpha: false });
		this.outputWidth = $canvas.width;
		this.outputHeight = $canvas.height;
		this.player = null;
		this.aliens = null;
		this.covers = null;
		this.alienProjectiles = null;
		this.playerProjectiles = null;
		this.explosions = null;
		this.spaceship = null;
		this.alienTypes = InvadersSprites.aliens.length;

		this.refreshHUD = true;
		this.hudPositioning = {
			x: 5,
			y: 5,
			maxY: 25
		};
		this.score = 0;
		this.lives = 3;

		this.scale = 1;

		this.alienCanvas = [];
		this.explosionCanvas = [];
		this.coverCanvas = [];
		function createCanvas(scale) {
			const canvas = document.createElement('canvas');
			canvas.width = 16 * scale;
			canvas.height = 16 * scale;
			// canvas.style.display = 'none';
			$sprites.appendChild(canvas);
		
			return canvas;
		}

		this.$playerCanvas = createCanvas(this.scale);
		this.$projectileCanvas = createCanvas(this.scale);
		this.$spaceshipCanvas = createCanvas(this.scale);

		for (let i=0; i<6; i++) {
			this.coverCanvas.push(createCanvas(this.scale));
		}

		for (let i=0; i<6; i++) {
			this.explosionCanvas.push(createCanvas(this.scale));
		}

		for (let i=0; i<this.alienTypes; i++) {
			const aT = [];
			for (let j=0; j<2; j++) {
				aT.push(createCanvas(this.scale));
			}
			this.alienCanvas.push(aT);
		}
	
		$body.appendChild(this.$playerCanvas);
		$body.appendChild(this.$projectileCanvas);
	}	

	getSpriteRows() {
		return this.graphicsMap.rows;
	}

	getSpriteCols() {
		return this.graphicsMap.cols;
	}	
	setSpaceship(spaceship) { this.spaceship = spaceship; }

	setPlayer(player) {
		this.player = player;
	}
	
	setAliens(aliens) {
		this.aliens = aliens;
	}

	setCovers(covers) {
		this.covers = covers;
	}

	setPlayerProjectiles(projectiles) {
		this.playerProjectiles = projectiles;
	}

	setAlienProjectiles(projectiles) {
		this.alienProjectiles = projectiles;
	}

	setExplosions(explosions) {
		this.explosions = explosions;
	}

	setScore(score) { this.score = score; }
	setLives(lives) { this.lives = lives; }

	scheduleHUDRefresh() { this.refreshHUD = true; }

	drawImage(image, x, y) {
		this.ctx.drawImage(
			image,
			x * this.scale,
			y * this.scale
		);
	}

	drawRectanglesFromArray(arr) {
		for (let i=0; i<arr.length; i++) {
			const a = arr[i];

			this.ctx.fillRect(
				a.getX(),
				a.getY(),
				a.getWidth(),
				a.getHeight()
			);
		}	
	}

	drawCovers() {
		let i = 0;
		this.covers.forEach(cover => {	
			this.drawImage(
				this.coverCanvas[i],
				cover.getX(),
				cover.getY()
			);
			i++;
		});
	}
	
	drawProjectile(projectile) {
		if (projectile.getIsActive()) {
			this.drawImage(
				this.$projectileCanvas,
				projectile.getX(),
				projectile.getY()
			);

		}
	}
	
	drawProjectiles() {
		this.playerProjectiles.forEach(projectile => {
			this.drawProjectile(projectile);
		});
		this.alienProjectiles.forEach(projectile => {
			this.drawProjectile(projectile);
		});
	}


	drawHUD() {
		let drawX = this.hudPositioning.x;

		BFont.drawString(
			`score ${this.score}`,
			drawX * this.scale,
			this.hudPositioning.y * this.scale,
			1,
			this.ctx
		);	

		drawX += 150;

		for (let i=0; i<this.lives; i++) {
			this.drawImage(
				this.$playerCanvas,
				drawX * this.scale,
				(this.hudPositioning.y - 8) * this.scale
			);
			drawX += 20;
		}
	}

	drawAnimatedSprite(object, canvas) {
		const frame = object.getAnimationFrame();

		this.drawImage(
			canvas[frame],
			object.getX(),
			object.getY()
		);
	}

	draw(drawWidth = this.outputWidth, drawHeight = this.outputHeight) {
		let startY = this.hudPositioning.maxY;
		
		if (this.refreshHUD) {
			startY = 0;
		}

		this.ctx.clearRect(
			0,
			startY * this.scale,
			drawWidth * this.scale,
			drawHeight * this.scale
		);

		if (!this.player.getIsDestroyed()) {
			this.drawImage(
				this.$playerCanvas,
				this.player.getX(),
				this.player.getY()
			);
		}

		this.aliens.forEach(alien => {
			this.drawAnimatedSprite(
				alien,
				this.alienCanvas[alien.getType()]
			);
		});
		
		if (this.spaceship.getIsActive()) {
			this.drawImage(
				this.$spaceshipCanvas,
				this.spaceship.getX(),
				this.spaceship.getY()	
			);
		}

		this.drawCovers();
		this.drawProjectiles();
		this.explosions.forEach(
			explosion => {
				if (explosion.getIsActive()) {
						this.drawAnimatedSprite(explosion, this.explosionCanvas);
				}
			}
		);

		if (this.refreshHUD) {
			this.drawHUD();
			this.refreshHUD = false;
		}
	}

	preloadCover(index) {
		BGraphics.preloadDraw(
			this.covers[index].getStructure(),
			this.coverCanvas[index]
		);
	}
	
	init() {
		this.ctx.fillStyle = '#f0f0f0';

		for (let i=0; i<this.alienTypes; i++) {
			for (let j=0; j<2; j++) {
				BGraphics.preloadDraw(
					InvadersSprites.aliens[i][j],
					this.alienCanvas[i][j]
				);
			}
		}
		for (let i=0; i<6; i++) {
			BGraphics.preloadDraw(
				InvadersSprites.explosion[i],
				this.explosionCanvas[i]
			);
		}
		for (let i=0; i<6; i++) {
			this.preloadCover(i);
		}		
		BGraphics.preloadDraw(
			InvadersSprites.projectile,
			this.$projectileCanvas
		);
	
		BGraphics.preloadDraw(
			InvadersSprites.player,
			this.$playerCanvas
		);
		
		BGraphics.preloadDraw(
			InvadersSprites.spaceship,
			this.$spaceshipCanvas
		);
	}			
}
