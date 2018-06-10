var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var canvasWidth = canvas.getAttribute("width");
var canvasHeight = canvas.getAttribute("height");
var framerate = 0;
var mouseX = 100;
var mouseY = 300;
var deepW = 40;
var deepH = 70;
var deepX = mouseX;
var deepY = mouseY;
var score = 0;
var level = 1;
var levelText="LEVEL="+level;
var speed = 1;
var obstacleDist = 200;
var columnno = 0;
var enter = false;
var space = false;
var spaceListen = false;
var twoWalls = false;
var distance = 130;
var collision = false;
var pause = false;
var quit = false;
var gameOver = false;
var obstacleArray = new Array();
var twoWall = new Array();
var levelno = new Array();
var x;
var y;
var side;
var breadth = 50;//Breadth of wall obstacle 
var length;
var twoWallLength = 500;
var i = 0;
var j = 0;
var k = 0;
var random;
var deep = new Image();
deep.src = "assets/deep.jpg";
speed = 1;

for (i = 2; i < 10; i++) {
	levelno[i] = false;
}


function pauseGame() {
	context.fillStyle = "black";
	context.globalAlpha = 0.5;
	context.fillRect(canvasWidth - canvasWidth * 0.73, canvasHeight - canvasHeight * 0.8, 500, 300);
	context.globalAlpha = 1;
	context.fillStyle = "red";
	context.font = "40px Times New Roman";
	context.fillText("GAME PAUSED", canvasWidth - canvasWidth * 0.62, canvasHeight - canvasHeight * 0.65);
	context.font = "30px Times New Roman";
	context.fillStyle = "#FFFFFF";
	context.fillText("Press P to resume", canvasWidth - canvasWidth * 0.62, canvasHeight - canvasHeight * 0.52);
	context.fillText("Press R to restart", canvasWidth - canvasWidth * 0.62, canvasHeight - canvasHeight * 0.40);
}

function quitGame() {
	context.fillStyle = "black";
	context.globalAlpha = 0.5;
	context.fillRect(canvasWidth * 0.27, canvasHeight * 0.2, 500, 300);
	context.globalAlpha = 1;
	context.fillStyle = "red";
	context.font = "40px Times New Roman";
	context.fillText("Do you wan to Quit?", canvasWidth * 0.33,canvasHeight * 0.35);
	context.font = "30px Times New Roman";
	context.fillStyle = "#FFFFFF";
	context.fillText("Press P to resume",canvasWidth * 0.38, canvasHeight * 0.48);
	context.fillText("Press R to restart", canvasWidth * 0.38, canvasHeight * 0.60);
}

function deepDead() {
	context.fillStyle = "black";
	context.globalAlpha = 0.5;
	context.fillRect(canvasWidth * 0.27, canvasHeight * 0.2, 500, 300);
	context.globalAlpha = 1;
	context.fillStyle = "red";
	context.font = "50px Times New Roman";
	context.fillText("GAME OVER", canvasWidth * 0.38, canvasHeight * 0.35);
	context.font = "30px Times New Roman";
	context.fillStyle = "#FFFFFF";
	context.fillText("Score : " + score, canvasWidth * 0.42, canvasHeight * 0.48);
	context.fillText("Press R to restart", canvasWidth * 0.37, canvasHeight * 0.60);
}

function levelUp() {
	context.fillStyle = "black";
	context.globalAlpha = 0.5;
	context.fillRect(canvasWidth * 0.27, canvasHeight * 0.2, 500, 300);
	context.globalAlpha = 1;
	context.fillStyle = "green";
	context.font = "40px Times New Roman";
	context.fillText("LEVEL " + level + " COMPLETED", canvasWidth * 0.35, canvasHeight * 0.35);
	context.font = "30px Times New Roman";
	context.fillStyle = "#FFFFFF";
	context.fillText("Score : " + score, canvasWidth * 0.42, canvasHeight * 0.48);
	context.fillText("Press Space to continue", canvasWidth * 0.38, canvasHeight * 0.60);
}

document.addEventListener("keydown", function (event) {

	if (event.keyCode == 13) {
		enter = true;
	}



	if (event.keyCode == 32) {
		if (spaceListen == true) {
			spaceListen = false;
			animation();
		}
	}

	if (event.keyCode == 82) {
		window.location.reload();
	}

	if (event.keyCode == 80 && enter == true) {
		if (pause == false) {
			pause = true;
		}
		else {
			pause = false;
			animation();
		}
		if ((quit == true && pause == true) && ((enter == true) && (spaceListen == false))) {
			initialise();
			quit = false;
			pauseGame();
		}
	}

	if (event.keyCode == 81 && enter == true) {
		quit = true;
	}

}, false);

canvas.addEventListener("mousemove", function (event) {
	mouseX = event.pageX;
	mouseY = event.pageY;

	deepY = mouseY - 200;

}, false);




function deepHit(x, y, width, height, wallX, wallY, wallSide, wlength, wbreadth, twoWalls) {
	

	if (((x + width >= wallX) && (x <= wallX)) && ((y <= wallY + wlength) && (wallSide == "top"))) {
		if (y - (wallY + wlength) != 0) {
			x = wallX - width;

		}
	}

	if (((x + width >= wallX) && (x <= wallX)) && ((y + height >= wallY) && (wallSide == "down"))) {
		if (y + height - wallY != 0) {
			x = wallX - width;
		}
	}


	if (((x - (wallX + wbreadth) < 0) && (x > wallX)) && ((y <= wallY + wlength) && (wallSide == "top"))) {
		if (y - (wallY + wlength) != 0) {
			x = wallX + wbreadth + 2;			
		}
	}
	if (((x - (wallX + wbreadth) < 0) && (x > wallX)) && ((y + height >= wallY) && (wallSide == "down"))) {
		if (y + height - wallY != 0) {
			x = wallX + wbreadth + 2;
		}
	}

	
	if (((x + width >= wallX) && (x <= wallX + wbreadth)) && ((y - (wallY + wlength) == 0) && (wallSide == "top"))) {//North wall's bottom condn
		y = wallY + wlength;
	}
	if (((x + width >= wallX) && (x <= wallX + wbreadth)) && ((y + height - wallY == 0) && (wallSide == "down"))) {//South wall's top condn
		y = wallY - height;	
	}

	
	if (twoWalls == true) {
		if (((x + width >= wallX) && (x <= wallX)) && ((y + height >= wallY + wlength + distance))) {
			if (y + height - wallY != 0) {
				x = wallX - width;				
			}
		}
	}
	if (((x - (wallX + wbreadth) < 0) && (x > wallX)) && ((y + height >= wallY + wlength + distance))) {
		x = wallX + wbreadth + 2;
	}


	deepX = x;
	deepY = y;
}
function obstacle(x, y, breadth, length, side, twoWalls) {
	this.x = x;
	this.y = y;
	this.breadth = breadth;
	this.length = length;
	this.side = side;
	this.twoWalls = twoWalls;

	this.update = function () {
		if (this.x < -breadth) {
			this.x = canvasWidth;
			if (this.side == "top") {
				this.length = 280 + Math.random() * 140;
				if (this.twoWalls == true) {
					this.twoWalls == false;
					columnno--;
				}
			}
			else {
				this.length = 500;
				this.y = 240 + Math.random() * 100;
			}
		}
		else if (this.twoWalls == true && this.side == "top") {
			columnno++;
			context.fillStyle = "white";
			context.fillRect(this.x, this.y + this.length + distance, this.breadth, twoWallLength);
		}
	}


	this.wallCollide = function () {
		deepHit(deepX, deepY, deepW, deepH, this.x, this.y, this.side, this.length, this.breadth, this.twoWalls);
	}



	this.wallpush = function () {

		if (((deepX + deepW >= this.x) && ((deepX <= this.x) && deepX <= 0)) && ((deepY <= this.y + this.length) && (this.side == "top"))) {
			gameOver = true;
		}

		if (((deepX + deepW >= this.x) && ((deepX <= this.x) && deepX <= 0)) && ((deepY + deepH >= this.y) && (this.side == "down"))) {
			gameOver = true;
		}

		if (this.twoWalls == true) {
			if (((deepX + deepW >= this.x) && ((deepX <= this.x) && deepX <= 0)) && ((deepY + deepH >= this.y + this.length + distance))) {
				gameOver = true;
			}
		}
	}
}



function obstaclePosition(i) {
	x = canvasWidth - obstacleDist * i;
	x += 250;
	twoWalls = false;
	if (i % 2 == 0) {
		side = "top";
		y = 0;
		length = 240 + Math.random() * 100;
	}
	else {
		side = "down";
		y = 240 + Math.random() * 100;
		length = 500;
	}
	obstacleArray.push(new obstacle(x, y, breadth, length, side, twoWalls));
}


for (i = 0; i < 6; i++) {
	obstaclePosition(i);
}



function drawTitleCard() {
	context.fillStyle = "black";
	context.fillRect(0, 0, canvasWidth, canvasHeight);
	context.fillStyle = "gold";
	context.font = "bold italic 50px Times New Roman";
	context.fillText("NO ESCAPE", 380, 60);
	context.fillStyle = "violet";
	context.font = "23px Times New Roman";
	context.fillText("CONTROL DEEP USING THE MOUSE", 380, 200);
	context.fillStyle = "red";
	context.font = "bold 30px Times New Roman";	
	context.fillText("THE BACK WALL WILL KILL DEEP", 380, 270);

	context.fillStyle="aquamarine";

	
	context.fillStyle = "white";
	context.font = "bold 30px Times New Roman";
	context.fillText("press SPACE for next level",380,450);
	context.fillText("Press ENTER to start the game", 380, 550);
	
	context.fillStyle = "green";
	context.font = "bold 20px Times New Roman";
	context.fillText("Pause : P", 950, 50);
	context.fillText("Quit : Q", 950, 80);
	context.fillText("Restart : R", 950, 110);
}

function drawCharacter() {
	context.clearRect(0, 0, canvasWidth, canvasHeight);

	context.drawImage(deep, deepX, deepY, deepW, deepH);

}

function drawObstacles(x, y, breadth, length) {
	context.fillStyle = "white";
	context.fillRect(x, y, breadth, length);
}



function obstaclesUpdate() {
	if (columnno == 0) {
		random = Math.random();
		if (random <= 0.2) {
			k = 0;
		}
		else if (random > 0.2 && random < 0.6) {
			k = 2;
		}
		else {
			k = 4;
		}
		obstacleArray[k].twoWalls = true;
		obstacleArray[k].length = 50 + Math.random() * 100;
	}
	for (j = 0; j < 6; j++) {
		obstacleArray[j].update();	
		obstacleArray[j].wallCollide();
		obstacleArray[j].wallpush();	
		drawObstacles(obstacleArray[j].x, obstacleArray[j].y, obstacleArray[j].breadth, obstacleArray[j].length);
		obstacleArray[j].x -= speed;
	}
}






function scoreUpdate() {

	score = Math.round(framerate / 10);

}

function scoreDraw() {
	context.fillStyle = "blue";
	context.font = "25px bold Times New Roman";
	context.fillText("Score : " + score, 0.88 * canvasWidth, 0.07 * canvasHeight);
	context.fillStyle = "#ff1744";
}



function levelDraw() {
	context.fillStyle = "blue";
	context.font = "25px bold Times New Roman";
	context.fillText("Level : " + level, 0.01 * canvasWidth, 0.07 * canvasHeight);
}

function levelUpdate() {
	if (score > 100 && levelno[2] == false) {
		spaceListen = true;
		level = 2;
		speed = 2;
	
		levelno[2] = true;
	}
	else if (score > 200 && levelno[3] == false) {
		spaceListen = true;
		level = 3;
		speed = 3;
		levelno[3] = true;
	}
	else if (score > 300 && levelno[4] == false) {
		spaceListen = true;
		level = 4;
		speed = 4;
		levelno[4] = true;
	}
	else if (score > 400 && levelno[5] == false) {
		spaceListen = true;
		level = 5;
		speed = 5;
		levelno[5] = true;
	}
	
}

function initialise() {
	drawCharacter();
	obstaclesUpdate();
	scoreUpdate();
	scoreDraw();
	levelDraw();
	levelUpdate();

}





function animation() {

	drawTitleCard();
	if (enter == true) {
		initialise();

		if (pause == true) {
			pauseGame();
			return;
		}

		if (spaceListen == true) {
			levelUp();
			return;
		}

		if (quit == true) {
			pause = true;
			quitGame();
			return;
		}
		if (gameOver == true) {

			gameOver = true;
			deepDead();
			return;
		}
		
	}
	framerate += 1;
	requestAnimationFrame(animation);
}

animation();
