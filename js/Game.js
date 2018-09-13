// // 定义游戏类
// Game
// ctx画笔
// bird 鸟类
// pipe 管子
// land 地面
// mountain 山背景
// 
// 
function Game(ctx, bird, pipe, land, mountain) {
	this.ctx = ctx;
	this.bird = bird;
	// 因为管子有多根， 所以我们将它存放在数组中
	this.pipeArr =  [pipe];
	this.land = land;
	this.mountain = mountain;
	console.log(mountain);
	this.iframe = 0;
	this.timer = null;
	this.init();
}


// 初始化方法
Game.prototype.init = function() {

	this.start();
	this.bindEvent();

}

// 渲染背景mountain
Game.prototype.renderMountain = function() {
	// 绘制图片
	// 这里绘制的不是this.mountain 而是this.moutain.img
	// 定义变量简化书写
	var img = this.mountain.img;
	this.mountain.x -= this.mountain.step;
	// console.log(img)
	// 判断
	if (this.mountain.x < -img.width) {
		this.mountain.x = 0;
	}
	this.ctx.drawImage(img, this.mountain.x, this.mountain.y);
	this.ctx.drawImage(img, this.mountain.x + img.width, this.mountain.y);
	this.ctx.drawImage(img, this.mountain.x + img.width * 2, this.mountain.y);

}

// 渲染地面
Game.prototype.renderLand = function() {
	var img = this.land.img;
	this.land.x -= this.land.step;
	// 判断
	if (this.land.x < -img.width) {
		this.land.x = 0;
	}
	this.ctx.drawImage(img, this.land.x, this.land.y);
	this.ctx.drawImage(img, this.land.x + img.width, this.land.y);
	this.ctx.drawImage(img, this.land.x + img.width * 2, this.land.y);
}

// 游戏开始
Game.prototype.start = function() {
	var me = this;
	this.timer = setInterval(function() {
		// 帧自加
		me.iframe ++;

		// 清屏
		me.clear();
		me.renderMountain();
		me.renderLand();
		me.renderBird();
		// console.log(me.iframe)
		if ((me.iframe % 5) === 0) {
			console.log(2222);
			me.bird.fly();
		}
		// me.bird.fly();
		me.bird.fallDown();

		// 渲染管子
		// 定时器中的iframe执行65此 创建一个根管子
		if(!(me.iframe % 65)) {
			me.createPipe();
		}
		// 移动管子
		me.movePipe();
		// 清除管子
		me.clearPipe();
		// 渲染管子
		me.renderPipe();
		// 渲染鸟的四个点
		// me.renderPoints();
		// 渲染上管子的四个点
		// me.renderPipePoints();
		// 碰撞检测
		me.checkBoom();


	}, 20)
}

// 清屏
Game.prototype.clear = function() {
	this.ctx.clearRect(0, 0, 360, 512);
}
// 渲染鸟
Game.prototype.renderBird = function() {
	// 获取鸟的图片
	var img = this.bird.img;
	// 保存状态
	this.ctx.save();
	this.ctx.translate(this.bird.x, this.bird.y);
	// 定义变量简化书写
	var deg = this.bird.state === "D" ? this.bird.speed * Math.PI / 180 : -this.bird.speed * Math.PI / 180;
	// 鸟的旋转
	this.ctx.rotate(deg);
	this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
	this.ctx.restore();
}

// 添加点击事件
Game.prototype.bindEvent = function() {
	var me = this;
	this.ctx.canvas.onclick = function() {
		me.bird.goUp();
	// console.log(44444)

	}
}

// 绘制管子
Game.prototype.renderPipe = function() {
	var me = this;
	// 因为管子有多根，所以要循环渲染
	this.pipeArr.forEach(function(value, index) {
		// vlaue 表示的是每一根管子
		// 获取上管子图片
		var img_up = value.pipe_up;
		var img_x = 0;
		var img_y = img_up.height - value.up_height;
		var img_w = img_up.width;
		var img_h = value.up_height;
		// 图片在canvas上的值
		var canvas_x = me.ctx.canvas.width - value.step * value.count;
		var canvas_y = 0;
		var canvas_w = img_up.width;
		var canvas_h = img_h;

		// 体现在管子身上
		me.ctx.drawImage(img_up, img_x, img_y, img_w, img_h, canvas_x, canvas_y, canvas_w, canvas_h);



		// 获取下管子的图片
		var down_img = value.pipe_down;
		// 下管子图片x值
		var down_img_x = 0;
		// 下管子图片y值
		var down_img_y = 0;
		// 下管子图片宽
		var down_img_w = down_img.width;
		// 下管子图片高
		var down_img_h = 250 - value.up_height;
		// 图片在canvas上的x值
		var down_canvas_x = me.ctx.canvas.width - value.step * value.count;
		// 图片在canvas上的y值
		var down_canvas_y = img_h + 150;
		// 图片在canvas上的宽
		var down_canvas_w = img_w;
		// 图片在canvas上的高
		var down_canvas_h = 250 - img_h;
		
		// 体现在管子身上
		me.ctx.drawImage(down_img, down_img_x, down_img_y, down_img_w, down_img_h, down_canvas_x, down_canvas_y, down_canvas_w, down_canvas_h);


	})
}


// 管子移动方法
Game.prototype.movePipe = function() {
	this.pipeArr.forEach(function(value, index){
		value.count++;
	})
}


// 创建多根管子
Game.prototype.createPipe = function() {
	// 创建管子
	var pipe = this.pipeArr[0].createPipe();
	// 放入到PipeArr中
	this.pipeArr.push(pipe);
}


// 移除管子
Game.prototype.clearPipe = function() {
	for (var i = 0; i < this.pipeArr.length; i++) {
		// 获取一根管子
		var pipe = this.pipeArr[i];
		if (pipe.x - pipe.step * pipe.count < -pipe.pipe_up.width) {
			this.pipeArr.splice(i, 1);
			console.log(this.pipeArr);
			return;
		}
	}
}

// 绘制鸟在原始坐标系的四个点
// Game.prototype.renderPoints = function() {
// 	// 获取鸟的图片
// 	// 绘制bird的四个点
// 	var bird_A = {
// 		x: this.bird.x - this.bird.img.width / 2 + 10,
// 		y: this.bird.y - this.bird.img.height / 2  + 10
// 	}
// 	var bird_B = {
// 		x: this.bird.x + this.bird.img.width / 2 - 10,
// 		y: this.bird.y - this.bird.img.height / 2 + 10
// 	}
// 	var bird_C = {
// 		x: this.bird.x - this.bird.img.width / 2 + 10,
// 		y: this.bird.y + this.bird.img.height / 2 - 10
// 	}
// 	var bird_D = {
// 		x: this.bird.x + this.bird.img.width / 2 - 10,
// 		y: this.bird.y + this.bird.img.height / 2 - 10
// 	}
// 	this.ctx.beginPath();
// 	this.ctx.moveTo(bird_A.x, bird_A.y);
// 	this.ctx.lineTo(bird_B.x, bird_B.y);
// 	this.ctx.lineTo(bird_D.x, bird_D.y);
// 	this.ctx.lineTo(bird_C.x, bird_C.y);
// 	this.ctx.closePath();
// 	this.ctx.strokeStyle = "blue";
// 	this.ctx.stroke();

// }

// // 绘制管子的8个点
// Game.prototype.renderPipePoints = function() {
// 	for (var i = 0; i < this.pipeArr.length; i++) {
// 		// 获取一根管子
// 		var pipe = this.pipeArr[i];
// 		// 绘制上管子的4个点
// 		var pipe_up_A = {
// 			x: this.ctx.canvas.width - pipe.step * pipe.count,
// 			y: 0
// 		}
// 		var pipe_up_B = {
// 			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
// 			y: 0
// 		}
// 		var pipe_up_C = {
// 			x: this.ctx.canvas.width - pipe.step * pipe.count,
// 			y: pipe.up_height
// 		}
// 		var pipe_up_D = {
// 			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
// 			y: pipe.up_height

// 		}
// 		// 绘制下管子的4个点
// 		var pipe_down_A = {
// 			x: this.ctx.canvas.width - pipe.step * pipe.count,
// 			y: 150 + pipe.up_height
// 		}
// 		var pipe_down_B = {
// 			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
// 			y: 150 + pipe.up_height
// 		}
// 		var pipe_down_C = {
// 			x: this.ctx.canvas.width - pipe.step * pipe.count,
// 			y: 400
// 		}
// 		var pipe_down_D = {
// 			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
// 			y: 400
// 		}
// 		this.ctx.beginPath();
// 		this.ctx.moveTo(pipe_up_A.x, pipe_up_A.y);
// 		this.ctx.lineTo(pipe_up_B.x, pipe_up_B.y);
// 		this.ctx.lineTo(pipe_up_D.x, pipe_up_D.y);
// 		this.ctx.lineTo(pipe_up_C.x, pipe_up_C.y);
// 		this.ctx.closePath();
// 		this.ctx.strokeStyle = "red";
// 		this.ctx.stroke();

// 		this.ctx.beginPath();
// 		this.ctx.moveTo(pipe_down_A.x, pipe_down_A.y);
// 		this.ctx.lineTo(pipe_down_B.x, pipe_down_B.y);
// 		this.ctx.lineTo(pipe_down_D.x, pipe_down_D.y);
// 		this.ctx.lineTo(pipe_down_C.x, pipe_down_C.y);
// 		this.ctx.closePath();
// 		this.ctx.strokeStyle = "red";
// 		this.ctx.stroke();
// 	}
// }

// 检测小鸟与管子是否碰撞
Game.prototype.checkBoom = function() {
	for (var i = 0; i < this.pipeArr.length; i++) {
		// 获取一根管子
		var pipe = this.pipeArr[i];
		// 绘制上管子的4个点
		var pipe_up_A = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: 0
		}
		var pipe_up_B = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: 0
		}
		var pipe_up_C = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: pipe.up_height
		}
		var pipe_up_D = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: pipe.up_height
		}

		
		// 绘制下管子的4个点
		var pipe_down_A = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: 150 + pipe.up_height
		}
		var pipe_down_B = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: 150 + pipe.up_height 
		}
		var pipe_down_C = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: 400
		}
		var pipe_down_D = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: 400
		}
	
		var bird_A = {
			x: this.bird.x - this.bird.img.width / 2 + 15,
			y: this.bird.y - this.bird.img.height / 2  + 15
		}
		var bird_B = {
			x: this.bird.x + this.bird.img.width / 2 - 15,
			y: this.bird.y - this.bird.img.height / 2 + 15
		}
		var bird_C = {
			x: this.bird.x - this.bird.img.width / 2 + 15,
			y: this.bird.y + this.bird.img.height / 2 - 15
		}
		var bird_D = {
			x: this.bird.x + this.bird.img.width / 2 - 15,
			y: this.bird.y + this.bird.img.height / 2 - 15
		}


		// 碰撞检测
		// 让鸟的B点和上管子的C点做比较
		if (bird_B.x >= pipe_up_C.x && bird_B.y <= pipe_up_C.y && bird_A.x <= pipe_up_D.x) {
			console.log("撞到上管子了");
			this.gameOver();
			return;
		}
		// / 让鸟的D点和下管子的A点做比较
		if (bird_D.x >= pipe_down_A.x && bird_D.y >= pipe_down_A.y && bird_C.x <= pipe_down_B.x) {
			console.log("撞到下管子了");
			this.gameOver();
			return;
		}
	}
}

// 游戏结束
Game.prototype.gameOver = function() {
	clearInterval(this.timer);
} 