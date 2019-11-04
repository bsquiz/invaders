class InvadersCover extends GameObject {
	constructor() {
		super();
		this.isDestroyed = false;
		this.rows = 16;
		this.cols = 16;
		this.structure = [
			' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',
			' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',
			' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',
			' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',
			' ',' ',' ',' ',' ',' ','*','*','*','*',' ',' ',' ',' ',' ',' ',
			' ',' ','*','*','*','*','*','*','*','*','*','*','*','*',' ',' ',
			' ',' ','*','*','*','*','*','*','*','*','*','*','*','*',' ',' ',
			'*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*',
			'*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*',
			'*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*',
			'*','*','*','*','*','*','*',' ',' ','*','*','*','*','*','*','*',
			'*','*','*','*','*','*',' ',' ',' ',' ','*','*','*','*','*','*',
			'*','*','*','*',' ',' ',' ',' ',' ',' ',' ',' ','*','*','*','*',
			'*','*',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','*','*',
			'*','*',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','*','*',
			'*','*',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','*','*'
		];
	}

	getStructure() { return this.structure; }

	hitTestTile(x, y) {
		const rowIndex = parseInt(x / this.tileScale);
		const colIndex = parseInt(y / this.tileScale);
		const structureIndex = rowIndex * this.cols + colIndex;
	
		if (this.structure[structureIndex] === '*') {
			this.takeDamage(structureIndex);

			return true;
		}

		return false;
	}

	destroyTile() {
		for (let i=0; i<this.rows; i++) {
			for(let j=0; i<this.cols; j++) {
				let tileIndex = i * this.cols + j;
			
				if (this.structure[tileIndex] === '*') {
					this.structure[tileIndex] = ' ';
					
					return false;
				}
			}
		}

		return true;
	}

	takeDamage(structureIndex) {
		if (this.destroyTile()) {
			this.isDestroyed = true;
		}
	}

	getIsDestroyed() { return this.isDestroyed; }
}
