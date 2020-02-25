const BInput = {
	keysDown: {
		'37': false,
		'39': false,
		'32': false,
		'80': false,
		'82': false
	},
	Keys: {
		LEFT: 37,
		RIGHT: 39,
		SPACE: 32,
		P: 80,
		R: 82
	},
	KeysByCode: {
		32: 'SPACE',
		37: 'LEFT',
		39: 'RIGHT',
		80: 'P',
		82: 'R'
	},
	mouse: {
		x: 0,
		y: 0,
		isDown: false,
		clickX: 0,
		clickY: 0,
		clicked: false
	},
	Buttons: {
		A: 3,
		B: 0,
		Y: 1,
		X: 2
	},
	AXES: {
		LEFT: 0,
		UP: 1
	},
	gamepadConnected: false,
	getGamepadConnected() { return this.gamepadConnected; },
	getMouseX() {
		return this.mouse.x;
	},
	getMouseClicked() {
		let clicked = false;

		if (this.mouse.clicked) {
			clicked = true;
			this.mouse.clicked = false;
		}

		return clicked;
	},	
	keyIsDown(key) {
		return this.keysDown[key];
	},
	getGamepadAxisState(axis) {
		const gp = navigator.getGamepads()[0];

		if (!gp) return 0;	
		return gp.axes[axis];
	},
	getGamepadButtonIsDown(button) {
		const gp = navigator.getGamepads()[0];

		if (!gp) return false;	
		return gp.buttons[button].pressed;
	},
	keyExists(keyCode) {
		return this.Keys[keyCode];
	},
	turnOffKeys() {
		for (let prop in this.Keys) {
			if (!this.Keys.hasOwnProperty(prop)) continue;
			
			this.Keys[prop] = false;
		}
	},
	setKeyDown(keyCode, isDown) {
		if (this.keysDown[keyCode] === undefined) return;

		this.keysDown[keyCode] = isDown;
	},
	onMouseMove(e) {
		this.mouse.x = e.pageX;
	},
	onClick(e) {
		this.mouse.clickX = e.pageX;
		this.mouse.clickY = e.pageY;
		this.mouse.clicked = true;
	},
	onGamepadConnected(e) {
		this.gamepadConnected = true;	
	},
	onGamepadDisconnected(e) {
		this.gamepadConnected = false;
	},
	init() {
		const $canvas = document.getElementById('canvas');

		window.addEventListener(
			'keydown',
			e => this.setKeyDown(e.keyCode, true)
		);  
		window.addEventListener(
			'keyup',
			e => this.setKeyDown(e.keyCode, false)
		);

		window.addEventListener('gamepadconnected', e => this.onGamepadConnected(e));
		window.addEventListener('gamepaddisconnected', e => this.onGamepadDisconnected(e));
		$canvas.addEventListener('mousemove', e => this.onMouseMove(e));
		$canvas.addEventListener('click', e => this.onClick(e));
	}
};
