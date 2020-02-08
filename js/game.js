const Invaders = {
	score: 0,
	lives: 3,
	level: 1,
	player: null,
	covers: null,
	level: 0,
	levels: [],
	aliens: [],
	spaceship: null,
	playerProjectiles: [],
	alienProjectiles: [],
	explosions: [],
	isRunning: false,

	isTransitioningLevel: false,
	levelTransitionTimer: 60,
	MAX_LEVEL_TRANSITION_TIMER: 60,

	gameWidth: 300,
	gameHeight: 300,
	minCoverY: 200,
	maxCoverY: 300,
	maxHUD: 25,
	scale: 1,

	graphics: null,
	alienUpdateDelay: 0,
	maxAlienUpdateDelay: 10,
	scaleFactor: 0,
	startGame() {
		this.isRunning = true;
	},

	stopGame() {
		this.isRunning = false;
	},

	gameOver() {
		this.stopGame();
	},

	loseLife() {
		if (this.lives > 0) {
			this.lives--;
			this.graphics.setLives(this.lives);
			this.graphics.scheduleHUDRefresh();
		}
	},

	startNextLevel() {
		this.level++;
		this.isTransitioningLevel = true;
		this.aliens = this.levels[this.level - 1];
		this.graphics.setAliens(this.aliens);
		InvadersAliens.setAliens(this.aliens);
		InvadersAudio.resetMusic();
		this.graphics.drawLevelTransition(this.level);
	},

	startExplosion(x, y) {
		for (let i=0; i<this.explosions.length; i++) {
			const e = this.explosions[i];

			if (!e.getIsActive()) {
				const et = 100;

				e.setX(x);
				e.setY(y);
				e.setIsActive(true);
				InvadersAudio.playExplosionSnd();

				return;
			}	
		}
	},

	shootProjectile(projectiles, launchX, launchY) {
		for (let i=0; i<projectiles.length; i++) {
			const projectile = projectiles[i];

			if (!projectile.getIsActive()) {
				projectile.setIsActive(true);
				projectile.setX(launchX);
				projectile.setY(launchY);	
				return true;
			}
		}
		
		return false;
	},

	playerShoot() {
		if (
			this.shootProjectile(
				this.playerProjectiles,
				this.player.getX(),
				this.player.getY()
			)
		) {
			InvadersAudio.playPlayerShootSnd();
		}
	},

	hitTestWithCovers(object) {
		for (let i=0; i<this.covers.length; i++) {
			const c = this.covers[i];

			if (
				object.hitTest(
					c.getX(),
					c.getY(),
					c.getWidth(),
					c.getHeight()
				)
			) {
				c.destroyTile();
				
				if (c.getIsDestroyed()) {
					this.covers.splice(i, 1);
				}
			
				this.graphics.preloadCover(i);

				return true;
			}
		}
		
		return false;
	},

	updateProjectile(projectile, hitTestObjects, hitCallback = () => {}) {
		if (!projectile.getIsActive()) return;

		projectile.move();

		const x = projectile.getX();
		const y = projectile.getY();
		const w = projectile.getWidth();
		const h = projectile.getHeight();

		if (y < this.maxHUD || y > this.gameHeight) {
			projectile.setIsActive(false);

			return;
		}

		if (y > this.minCoverY && y < this.maxCoverY) {
			if (this.hitTestWithCovers(projectile)) {
				projectile.setIsActive(false);

				return;
			}
		}

		for (let i=0; i<hitTestObjects.length; i++) {
			const ob = hitTestObjects[i];
			const ox = ob.getX();
			const oy = ob.getY();
			const ow = ob.getWidth();
			const oh = ob.getHeight();

			if (
				projectile.hitTest(ox, oy, ow, oh)
			) {
				projectile.setIsActive(false);
				ob.takeDamage(1);
				
				if (ob.getIsDestroyed()) {
					hitTestObjects.splice(i, 1);
					this.startExplosion(ox, oy);
				}

				hitCallback(ob);

				return;
			}
		}
	},

	updateProjectiles() {
		this.playerProjectiles.forEach(
			projectile => {
				this.updateProjectile(projectile, this.aliens, (alien) => {
					this.graphics.scheduleHUDRefresh();
					this.graphics.setScore(this.score);
					this.score += alien.getPoints();
					InvadersAliens.speedUpAliens();
					InvadersAudio.speedUpMusic();
				});

				// flying saucer enemy
				if (this.spaceship.getIsActive()) {
					if (
						projectile.hitTest(
						this.spaceship.getX(),
						this.spaceship.getY(),
						this.spaceship.getWidth(),
						this.spaceship.getHeight()
					)
					) {
						this.score += this.spaceship.getPoints();
						this.spaceship.reset();
				}
				}
			}
		);
		
		this.alienProjectiles.forEach(
			projectile => {
				this.updateProjectile(projectile, [this.player], () => {
					this.player.setIsInvincible(true);
					this.loseLife();
				});
			}
		);
	},
	
	controlPlayerWithKeyboard() {
		this.player.setXSpeed(0);

		if (BInput.keyIsDown(BInput.Keys.LEFT)) {
			this.player.setXSpeed(this.player.getDefaultXSpeed());
			console.log('left');
		} else if (BInput.keyIsDown(BInput.Keys.RIGHT)) {
			this.player.setXSpeed(this.player.getDefaultXSpeed() * -1);
		}

		if (BInput.keyIsDown(BInput.Keys.SPACE)) {
			this.player.shoot();
		}
	},

	controlPlayerWithMouse() {
			this.player.setX(
				BInput.getMouseX() * this.scaleFactor
			);
			
			if (BInput.getMouseClicked()) {
				this.playerShoot();
			}
	},
	
	controlPlayerWithGamepad() {
		const axes = BInput.getGamepadAxisState(BInput.AXES.LEFT);
		
		if (axes === 1) {
			this.player.setXSpeed(this.player.getDefaultXSpeed());	
		} else if (axes === -1) {
			this.player.setXSpeed(this.player.getDefaultXSpeed() * -1);	
		}

		if (axes === -1 || axes === 1) {
			const x = this.player.getX();
			const speed = this.player.getXSpeed();
			const newX = x + speed;

			this.player.setIsMoving(true);

			if (newX > 0 && newX < this.gameWidth) {
				this.player.move();
			}
		}

		if (BInput.getGamepadButtonIsDown(BInput.Buttons.X)) {
			this.playerShoot();
		}
	},

	update() {
		if (!this.isRunning) {
			return;
		}

		if (this.isTransitioningLevel) {
			this.levelTransitionTimer--;
			
			if (this.levelTransitionTimer < 0) {
				this.levelTransitionTimer = this.MAX_LEVEL_TRANSITION_TIMER;
				this.isTransitioningLevel = false;
				this.graphics.forceClear();
				this.graphics.drawHUD();
			}
			
			return;
		}

		if (this.lives === 0) {
			this.gameOver();
			
			return;
		}

		if (this.player.getIsDestroyed()) {
			this.player.updateDestroyedTimer();
		}
		
		if (this.player.getIsInvincible()) {
			this.player.updateInvincibleTimer();
		}

		if (BInput.getGamepadConnected()) {
			this.controlPlayerWithGamepad();
		} else {
//			this.controlPlayerWithKeyboard();
			this.controlPlayerWithMouse();
		}

		this.alienUpdateDelay--;
		if (this.alienUpdateDelay === 0) {
			this.alienUpdateDelay = this.maxAlienUpdateDelay;

			if (InvadersAliens.updateAliens()) {
				this.gameOver();
			}
		}

		const s = Math.floor(Math.random() * 1000);
			
		if (s === 0 && !this.spaceship.getIsActive()) {
			this.spaceship.setIsActive(true);
		}

		if (this.spaceship.getIsActive()) {
			this.spaceship.move();
			InvadersAudio.progressSpaceshipSnd();
			const x = this.spaceship.getX();

			if (
				x > this.gameWidth
				|| x < 0
			) {
				this.spaceship.reset();
			}
		} 

		this.explosions.forEach(
			explosion => {
				if (explosion.getIsActive()) {
					explosion.animate();

					if (explosion.isFinished()) {
						explosion.reset();
					}
				}
			}
		);

		this.updateProjectiles();

		InvadersAudio.progressMusic();
		this.graphics.draw(this.gameWidth, this.gameHeight);
		
		if (this.aliens.length === 0) {
			this.startNextLevel();
		}
	},

	reset() {
		this.player.setX(
			this.gameWidth / 2
		);
		this.player.setY(
			this.gameHeight - this.player.getHeight()
		);
		this.alienUpdateDelay = this.maxAlienUpdateDelay;
	},
	
	initProjectiles() {
		const pp = new InvadersProjectile();
		pp.setYSpeed(-5);
		this.playerProjectiles.push(pp);

		for (let i=0; i<5; i++) {
			const ap = new InvadersProjectile();
			this.alienProjectiles.push(ap);
		}	
	},

	init() {
		InvadersLevels.init(this.gameWidth, this.gameHeight);
		const $canvas = document.getElementById('canvas');
		for (let i=1; i<99; i++) {
			let rows = (i < 7) ? i : 6;
			this.levels.push(
				InvadersLevels.makeAliens(rows, this.gameHeight)
			);
		}

		this.scaleFactor = 0.5;

		this.graphics = new InvadersGraphics($canvas);
		this.player = new InvadersPlayer();
		this.initProjectiles();

		this.spaceship = new InvadersSpaceship(
			this.maxHUD + 18
		);

		for (let i=0; i<3; i++) {
			this.explosions.push(new InvadersExplosion());
		}

		this.covers = InvadersLevels.makeCovers(this.gameWidth, this.gameHeight);

		this.graphics.setPlayer(this.player);
		this.graphics.setSpaceship(this.spaceship);
		this.graphics.setPlayerProjectiles(this.playerProjectiles);
		this.graphics.setAlienProjectiles(this.alienProjectiles);
		this.graphics.setCovers(this.covers);
		this.graphics.setExplosions(this.explosions);
		this.graphics.init();

		InvadersAliens.setGameWidth(this.gameWidth);
		InvadersAliens.setGameHeight(this.gameHeight);
		InvadersAliens.setGameOverY(this.gameHeight - this.player.getHeight());
		InvadersAliens.setProjectiles(this.alienProjectiles);
		InvadersAliens.setShootFunction(this.shootProjectile);

		BAudio.init();
		BInput.init();
		this.reset();
		this.startNextLevel();
	}
};
