const BGraphics = {
	scale: 1,
	graphicsMap: {
		rows: 16,
		cols: 16
	},

        drawTile(tile, x, y, width, height, ctx) {
                if (tile === '*') {
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + width, y);
                        ctx.lineTo(x + width, y + height);
                        ctx.lineTo(x, y + height);
                        ctx.closePath();
                }
        },

        drawGraphicsMap(map, x, y, ctx) {
                let drawX = x * this.scale;
                let drawY = y * this.scale;
                let tileWidth = this.scale;
                let tileHeight = this.scale;
                let tileIndex;

                ctx.beginPath();

                for (let row=0; row<this.graphicsMap.rows; row++) {
                        for (let col=0; col<this.graphicsMap.cols; col++) {
                                tileIndex = (row * this.graphicsMap.cols) + col;

                                this.drawTile(
                                        map[tileIndex],
                                        drawX,
                                        drawY,
                                        tileWidth,
                                        tileHeight,
                                        ctx
                                );
                                drawX += tileWidth;
                        }

                        drawX = x * this.scale;
                        drawY += tileHeight;
                }

                ctx.fill();
        },

        preloadDraw(sprite, $canvas, width, height) {
                const ctx = $canvas.getContext('2d');
		
		ctx.clearRect(0, 0, $canvas.width, $canvas.height); 		               
                ctx.fillStyle = '#f0f0f0';
                this.drawGraphicsMap(
                        sprite,
                        0,
                        0,
                        ctx
                );
        }
};
