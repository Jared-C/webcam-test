/* exported WebcamCanvas */

class WebcamCanvas {
	constructor(canvas) {
		this.canvas = canvas;

		this.ctx = this.canvas.getContext('2d');

		this.resizeCanvas();
		window.addEventListener('load', this.resizeCanvas);
		window.addEventListener('resize', this.resizeCanvas);

		this.initialiseVideo();

		this.draw();
	}

	resizeCanvas() {
		const width = window.innerWidth;
		const height = window.innerHeight;

		this.canvas.width = width;
		this.canvas.height = height;
	}

	initialiseVideo() {
		this.video = document.createElement('VIDEO');

		navigator.mediaDevices.getUserMedia({
			audio: false,
			video: true
		}).then((stream) => {
			this.video.srcObject = stream;
			this.video.play();
		});
	}

	draw() {
		this.ctx.fillStyle = '#000';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		if (this.video) {
			this.drawMediaCover(this.video);
		}

		window.requestAnimationFrame(() => {
			this.draw();
		});
	}

	drawMediaCover(media) {
		const cw = this.ctx.canvas.width;
		const ch = this.ctx.canvas.height;
		const cr = cw / ch;
		let iw;
		let ih;
		let w;
		let h;
		let x;
		let y;

		if (media.tagName === 'VIDEO') {
			iw = media.videoWidth;
			ih = media.videoHeight;
		} else {
			iw = media.width;
			ih = media.height;
		}

		const ir = iw / ih;

		if (cr >= ir) {
			w = cw;
			h = (cw / iw) * ih;
			x = 0;
			y = (ch - h) / 2;
		} else {
			w = (ch / ih) * iw;
			h = ch;
			x = (cw - w) / 2;
			y = 0;
		}

		this.ctx.drawImage(media, x, y, w, h);
	}
}
