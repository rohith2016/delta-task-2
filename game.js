var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var canvasWidth = canvas.getAttribute("width");
var canvasHeight = canvas.getAttribute("height");

var framerate = 0;
var mouseX = 50;
var mouseY = 100;
var oldMouseX = 100;
var oldMouseY = 300;
var oldHeroX = 100;
var oldHeroY = 300;
var animVariable = 0;
var deepWidth = 50;
var deepHeight = 70;
var hitmanWidth = 65;
var hitmanHeight = 90;
var projectileWidth = 30;
var projectileHeight = 30;
var deepX = mouseX;
var deepY = mouseY;

var radius = 30;//Character's radius
var score = 0;//score of the character

var level = 1;
var levelText="LEVEL="+level;
var nWalls = 6;//Number of walls to be generated initially
var speed = 1;
var heroVelocity = 3;

var obstacleDist = 190;
var nTwoWalls = 0;

var enter = false;
var space = false;
var spaceListen = false;
var mouseDown = false;
var hasTwoWalls = false;
var wallDist = 130;
var collision = false;
var active = false;
var allowed = false;

var pause = false;
var quit = false;
var gameOver = false;


var obstacleArray = new Array();
var twoWall = new Array();
var levelUpdated = new Array();

var x;
var x1;
var y;
var side;//stores north or south
//var orient;//orientation of hitman
var direction;
//var n;//n order of hitman
var n1;
var n2;
var breadth = 50;//Breadth of wall obstacle 
var length;//Length of wall obstacle
var twoWallLength = 500;
var i = 0;
var j = 0;
var k = 0;
var rand;

var deep = new Image();
deep.src = "assets/deep.jpg";



speed = 1;


for (i = 2; i < 6; i++) {
	levelUpdated[i] = false;
}


document.addEventListener("keydown", function (event) {

	if (event.keyCode == 13) {//enter keyCode
		enter = true;
	}



	if (event.keyCode == 32) {//space keyCode
		if (spaceListen == true) {
			spaceListen = false;
			animation();
		}
	}

	if (event.keyCode == 82) {// R keyCode
		//stopAudio(dead);
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
			pauseGameDraw();
		}
	}

	if (event.keyCode == 81 && enter == true) {
		quit = true;
	}

}, false);

canvas.addEventListener("mousemove", function (event) {
	mouseX = event.pageX;
	mouseY = event.pageY;
	//deepX=mouseX;
	deepY = mouseY - 200;

}, false);



function stopAudio(audio) {    //Function to stop audio the current audio from playing
	audio.pause();
	audio.currentTime = 0;
}



function characterWallCollide(charX, charY, charWidth, charHeight, wallX, wallY, wallSide, wallLength, wallBreadth, hasTwoWalls, n2) {
	//Checking for normal walls(right side)

	if (((charX + charWidth >= wallX) && (charX <= wallX)) && ((charY <= wallY + wallLength) && (wallSide == "north"))) {
		if (charY - (wallY + wallLength) != 0) {
			charX = wallX - charWidth;

		}
	}

	if (((charX + charWidth >= wallX) && (charX <= wallX)) && ((charY + charHeight >= wallY) && (wallSide == "south"))) {
		if (charY + charHeight - wallY != 0) {
			charX = wallX - charWidth;
		}
	}

	//Checking for normal walls(left side)
	if (((charX - (wallX + wallBreadth) < 0) && (charX > wallX)) && ((charY <= wallY + wallLength) && (wallSide == "north"))) {
		if (charY - (wallY + wallLength) != 0) {
			charX = wallX + wallBreadth + 2;			
		}
	}
	if (((charX - (wallX + wallBreadth) < 0) && (charX > wallX)) && ((charY + charHeight >= wallY) && (wallSide == "south"))) {
		if (charY + charHeight - wallY != 0) {
			charX = wallX + wallBreadth + 2;
		}
	}

	//Checking for normal walls(top and bottom side)
	if (((charX + charWidth >= wallX) && (charX <= wallX + wallBreadth)) && ((charY - (wallY + wallLength) == 0) && (wallSide == "north"))) {//North wall's bottom condn
		charY = wallY + wallLength;
	}
	if (((charX + charWidth >= wallX) && (charX <= wallX + wallBreadth)) && ((charY + charHeight - wallY == 0) && (wallSide == "south"))) {//South wall's top condn
		charY = wallY - charHeight;	
	}

	//Checking for extra wall in a Two wall system
	if (hasTwoWalls == true) {
		if (((charX + charWidth >= wallX) && (charX <= wallX)) && ((charY + charHeight >= wallY + wallLength + wallDist))) {
			if (charY + charHeight - wallY != 0) {
				charX = wallX - charWidth;				
			}
		}
	}
	if (((charX - (wallX + wallBreadth) < 0) && (charX > wallX)) && ((charY + charHeight >= wallY + wallLength + wallDist))) {
		charX = wallX + wallBreadth + 2;
	}


	deepX = charX;
	deepY = charY;
}
function obstacle(x, y, breadth, length, side, hasTwoWalls) {
	this.x = x;
	this.y = y;
	this.breadth = breadth;
	this.length = length;
	this.side = side;
	this.hasTwoWalls = hasTwoWalls;

	this.update = function () {
		if (this.x < -breadth) {
			this.x = canvasWidth;
			if (this.side == "north") {
				this.length = 280 + Math.random() * 140;
				if (this.hasTwoWalls == true) {
					this.hasTwoWalls == false;
					nTwoWalls--;
				}
			}
			else {
				this.length = 500;
				this.y = 240 + Math.random() * 100;
			}
		}
		else if (this.hasTwoWalls == true && this.side == "north") {
			nTwoWalls++;
			context.fillStyle = "white";
			context.fillRect(this.x, this.y + this.length + wallDist, this.breadth, twoWallLength);
		}
	}


	this.wallCollide = function () {//For level>0 -- Hacker mode
		characterWallCollide(deepX, deepY, deepWidth, deepHeight, this.x, this.y, this.side, this.length, this.breadth, this.hasTwoWalls, 0);
	}



	this.wallpush = function () {
		//Checking for normal walls(right side squeeze)
		if (((deepX + deepWidth >= this.x) && ((deepX <= this.x) && deepX <= 0)) && ((deepY <= this.y + this.length) && (this.side == "north"))) {
			gameOver = true;
		}

		if (((deepX + deepWidth >= this.x) && ((deepX <= this.x) && deepX <= 0)) && ((deepY + deepHeight >= this.y) && (this.side == "south"))) {
			gameOver = true;
		}

		//Checking for extra wall in a Two wall system(right side squeeze)
		if (this.hasTwoWalls == true) {
			if (((deepX + deepWidth >= this.x) && ((deepX <= this.x) && deepX <= 0)) && ((deepY + deepHeight >= this.y + this.length + wallDist))) {
				gameOver = true;
			}
		}
	}
}



function obstaclePosition(i) {
	x = canvasWidth - obstacleDist * i;
	x += 250;
	hasTwoWalls = false;
	if (i % 2 == 0) {
		side = "north";
		y = 0;
		length = 240 + Math.random() * 100;
	}
	else {
		side = "south";
		y = 240 + Math.random() * 100;
		length = 500;
	}
	obstacleArray.push(new obstacle(x, y, breadth, length, side, hasTwoWalls));
}


for (i = 0; i < nWalls; i++) {
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
	
	context.fillStyle = "orange";
	context.font = "bold 20px Times New Roman";
	context.fillText("Pause : P", 1000, 50);
	context.fillText("Quit : Q", 1000, 80);
	context.fillText("Restart : R", 1000, 110);
}

function drawCharacter() {
	context.clearRect(0, 0, canvasWidth, canvasHeight);

	context.drawImage(deep, deepX, deepY, deepWidth, deepHeight);

}

function drawObstacles(x, y, breadth, length) {
	context.fillStyle = "white";
	context.fillRect(x, y, breadth, length);
}



function obstaclesUpdate() {
	if (nTwoWalls == 0) {
		rand = Math.random();
		if (rand <= 0.2) {
			k = 0;
		}
		else if (rand > 0.2 && rand < 0.6) {
			k = 2;
		}
		else {
			k = 4;
		}
		obstacleArray[k].hasTwoWalls = true;
		obstacleArray[k].length = 50 + Math.random() * 100;
	}
	for (j = 0; j < nWalls; j++) {
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
	context.fillStyle = "white";
	context.font = "25px bold Times New Roman";
	context.fillText("Score : " + score, canvasWidth - canvasWidth * 0.12, canvasHeight - canvasHeight * 0.05);
	context.fillStyle = "#ff1744";
}



function levelDraw() {
	context.fillStyle = "white";
	context.font = "25px bold Times New Roman";
	context.fillText("Level : " + level, 0.9 * canvasWidth, 0.07 * canvasHeight);
}

function levelUpdate() {
	if (score > 100 && levelUpdated[2] == false) {
		spaceListen = true;
		level = 2;
		speed = 2;
	
		levelUpdated[2] = true;
	}
	else if (score > 200 && levelUpdated[3] == false) {
		spaceListen = true;
		level = 3;
		speed = 3;
		levelUpdated[3] = true;
	}
	else if (score > 300 && levelUpdated[4] == false) {
		spaceListen = true;
		level = 4;
		speed = 4;
		levelUpdated[4] = true;
	}
	else if (score > 400 && levelUpdated[5] == false) {
		spaceListen = true;
		level = 5;
		speed = 5;
		levelUpdated[5] = true;
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

function pauseGameDraw() {//Function which draws the card placed on game pause
	context.fillStyle = "#000000";
	context.globalAlpha = 0.6;
	context.fillRect(canvasWidth - canvasWidth * 0.73, canvasHeight - canvasHeight * 0.8, 500, 300);
	context.globalAlpha = 1;
	context.fillStyle = "#FF0000";
	context.font = "40px Times New Roman";
	context.fillText("GAME PAUSED", canvasWidth - canvasWidth * 0.62, canvasHeight - canvasHeight * 0.65);
	context.font = "30px Times New Roman";
	context.fillStyle = "#FFFFFF";
	context.fillText("Press P to resume", canvasWidth - canvasWidth * 0.62, canvasHeight - canvasHeight * 0.52);
	context.fillText("Press R to restart", canvasWidth - canvasWidth * 0.62, canvasHeight - canvasHeight * 0.40);
}

function quitGameDraw() {//Function which draws the card placed on game quit
	context.fillStyle = "#000000";
	context.globalAlpha = 0.6;
	context.fillRect(canvasWidth - canvasWidth * 0.73, canvasHeight - canvasHeight * 0.8, 500, 300);
	context.globalAlpha = 1;
	context.fillStyle = "#FF0000";
	context.font = "40px Times New Roman";
	context.fillText("Are you sure to Quit?", canvasWidth - canvasWidth * 0.67, canvasHeight - canvasHeight * 0.65);
	context.font = "30px Times New Roman";
	context.fillStyle = "#FFFFFF";
	context.fillText("Press P to resume", canvasWidth - canvasWidth * 0.62, canvasHeight - canvasHeight * 0.52);
	context.fillText("Press R to restart", canvasWidth - canvasWidth * 0.62, canvasHeight - canvasHeight * 0.40);
}

function gameOverDraw() {//end screen to draw on canvas when the game is over
	context.fillStyle = "#000000";
	context.globalAlpha = 0.6;
	context.fillRect(canvasWidth - canvasWidth * 0.73, canvasHeight - canvasHeight * 0.8, 500, 300);
	context.globalAlpha = 1;
	context.fillStyle = "#FF0000";
	context.font = "40px Times New Roman";
	context.fillText("GAME OVER", canvasWidth - canvasWidth * 0.61, canvasHeight - canvasHeight * 0.65);
	context.font = "30px Times New Roman";
	context.fillStyle = "#FFFFFF";
	context.fillText("Score : " + score, canvasWidth - canvasWidth * 0.58, canvasHeight - canvasHeight * 0.53);
	context.fillText("Press R to restart", canvasWidth - canvasWidth * 0.63, canvasHeight - canvasHeight * 0.40);
}

function levelUpgradeDraw() {//end screen to draw on canvas when the game is over
	context.fillStyle = "#000000";
	context.globalAlpha = 0.6;
	context.fillRect(canvasWidth - canvasWidth * 0.73, canvasHeight - canvasHeight * 0.8, 500, 300);
	context.globalAlpha = 1;
	context.fillStyle = "green";
	context.font = "40px Times New Roman";
	context.fillText("LEVEL " + level + " COMPLETED", canvasWidth - canvasWidth * 0.65, canvasHeight - canvasHeight * 0.65);
	context.font = "30px Times New Roman";
	context.fillStyle = "#FFFFFF";
	context.fillText("Score : " + score, canvasWidth - canvasWidth * 0.58, canvasHeight - canvasHeight * 0.53);
	context.fillText("Press Space to continue", canvasWidth - canvasWidth * 0.63, canvasHeight - canvasHeight * 0.40);
}



function animation() {

	drawTitleCard();
	if (enter == true) {
		initialise();

		if (pause == true) {
			pauseGameDraw();
			return;
		}

		if (spaceListen == true) {
			levelUpgradeDraw();
			return;
		}

		if (quit == true) {
			pause = true;
			quitGameDraw();
			return;
		}
		if (gameOver == true) {//Gameover condition checking (health==0) dont forget ||

			gameOver = true;
			gameOverDraw();
			return;
		}
		
	}
	framerate += 1;
	requestAnimationFrame(animation);
}

animation();