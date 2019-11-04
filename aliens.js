const InvadersAliens = {
	aliens: [],
	projectiles: [],
	gameWidth: 0,
	gameHeight: 0,
	shootFuntion: null,
	
	setGameWidth(gameWidth) { this.gameWidth = gameWidth; },
	setGameHeight(gameHeight) { this.gameHeight = gameHeight; },
	setAliens(aliens) { this.aliens = aliens; },
	setShootFunction(fn) { this.shootFunction = fn; },
	setProjectiles(projectiles) { this.projectiles = projectiles; },

        speedUpAliens() {
                if (this.aliens.length % 2 !== 0) return;

                this.aliens.forEach(alien => {
                        alien.speedUp();
                });
        },

        updateAliens() {
                let shooting = false;
		let gameOver = false;

                this.aliens.forEach(alien => {
                        alien.move();
                        alien.animate();

                        const y = alien.getY();
                        const x = alien.getX();

                        if (!shooting) {
                                const shouldShoot = Math.floor(Math.random() * 100);

                                if (shouldShoot === 0) {
                                        shooting = true;
                                        this.alienShoot(alien);
                                }
                        }

                        if (
                                x + alien.getWidth() > this.gameWidth
                                || x < 0
                        ) {
                                alien.turn();
                                alien.setY(
                                        y + alien.getHeight()
                                );
                                if (y > this.gameHeight) {
					gameOver = true;
                                }
                        }
                });
		
		return gameOver;
        },

        alienShoot(alien) {
                this.shootFunction(
                        this.projectiles,
                        alien.getX(),
                        alien.getY()
                );
        }
};
