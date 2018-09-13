// 鸟类，
function Bird(imgArr, x, y) {
	// 图片数组
	this.imgArr = imgArr;
	// 图片索引
	this.idx = parseInt(Math.random() * imgArr.length);
	// 获取具体的一张图片
	this.img = this.imgArr[this.idx];
	this.x = x;
	this.y = y;
	// 定义鸟的状态
	this.state = "D";  // D Down  U up
	// 为了控制鸟的移动速度，定义speed属性
	this.speed = 0;


}

// 煽动翅膀
Bird.prototype.fly = function() {
	this.idx++;
	if (this.idx >= this.imgArr.length) {
		this.idx = 0;
	}
	this.img = this.imgArr[this.idx];
}


// 鸟下落
Bird.prototype.fallDown = function() {
	if (this.state === "D") {
		this.speed++;
		this.y += Math.sqrt(this.speed);
	} else {
		this.speed--;
		// 如果等于0 修改状态并且停止后续代码执行
		if (this.speed === 0) {
			this.state = "D";
			return;
		}
		this.y -= Math.sqrt(this.speed);
	}
}



// 鸟上升

Bird.prototype.goUp = function() {
	this.state = "U";
	this.speed = 20;

}