const BLOCK_SIZE = 30;
const PRE_STARTX = 300;
const PRE_STARTY = 20;
const X_SIZE = 21;
const Y_SIZE = 35;
const STARTX = 0;
const STARTY = 145;
const XLength = 640;
const YLength = 660;
const START_BLOCKX = STARTX + 150;
const START_BLOCKY = STARTY;
const TETRISMAP_LEFT = STARTX;
const TETRISMAP_TOP = STARTY;
const TETRISMAP_RIGHT = STARTX + XLength;
const TETRISMAP_DOWN = STARTY + YLength;
const MAP_BLOCK = 1;
const TETRISBLOCK_0 = 0; //OO
						 //00
						 //00
						 //00
const TETRISBLOCK_1 = 1; //00
						 //0000
						 //00
const TETRISBLOCK_2 = 2; //  00
						 //0000
						 //00
const TETRISBLOCK_3 = 3; //00
						 //0000
						 //  00
const TETRISBLOCK_4 = 4; //0000
						 //00
						 //00
const TETRISBLOCK_5 = 5; //0000
						 //0000
const TETRISBLOCK_6 = 6; //0000
						 //  00
						 //  00

// block class
class TETRISBLOCK {
	constructor() {
		this.x = 0;
		this.y = 0;
	}
}

var TetrisBlock = new Array(4);
var TetrisMoveBlock = new Array(4);

for (var i = 0; i < TetrisBlock.length; i++) {
	TetrisBlock[i] = new Array(5);
	TetrisMoveBlock[i] = new Array(5);
} 
for (var i = 0; i < 4; i++) {
	for (var j = 0; j < 5; j++) {
		TetrisBlock[i][j] = new TETRISBLOCK();
		TetrisMoveBlock[i][j] = new TETRISBLOCK();
	}
}

var TetrisBlockMap = new Array(X_SIZE);
var TetrisColorMap = new Array(X_SIZE);
for (var i = 0; i < TetrisColorMap.length; i++) {
	TetrisBlockMap[i] = new Array(Y_SIZE);
	TetrisColorMap[i] = new Array(Y_SIZE);
}
for (var i = 0; i < X_SIZE; i ++) {
	for (var j = 0; j < Y_SIZE; j++) {
		TetrisBlockMap[i][j] = 0;
		TetrisColorMap[i][j] = 0;
	}
}

var context = null;
var blockViewBitmap = 0;
var blockMoveBitmap = 0;
var xVPos = [];
var yVPos = [];
var xMPos = [];
var yMPos = [];
var xMoveBlock = 0;
var yMoveBlock = 0;
var currBlockState = 0;
var oldBlockState = 0;
var frameTopLeftX = TETRISMAP_LEFT;
var frameTopLeftY = TETRISMAP_TOP;
var frameTopRightX = TETRISMAP_RIGHT;
var frameTopRightY = TETRISMAP_TOP;
var frameDownLeftX = TETRISMAP_LEFT;
var frameDownLeftY = TETRISMAP_DOWN;
var frameDownRightX = TETRISMAP_RIGHT;
var frameDownRightY = TETRISMAP_DOWN;

var currentViewX = PRE_STARTX + 200;
var currentViewY = PRE_STARTY + 5;
var currentMoveX = 0;
var currentMoveY = 0;
var bReachButtom = false;
var currentButtomY = 0;

var interval = null;

var currViewBlockForm = -1
var currMoveBlockForm = -1;

function onTetrisStart(ctx) {
	context = ctx;
	initBitmap();
	initTetris();
}
var bMoveLeft = false;
var bMoveRight = false;
var bMoveDown = false;

var iCurrentTetrisScore = 0;
var oldTetrisScore = 0;
var currentLevel = 1;

var downSpeed = 1.0;

// bitmap initialize
function initBitmap() {
	var i = (Math.ceil(Math.random() * 10)) % 8;
	switch (i) {
		case 0:
			blockViewBitmap = document.getElementById("russblue");
			break;
		case 1:
			blockViewBitmap = document.getElementById("russgrey");
			break;
		case 2:
			blockViewBitmap = document.getElementById("russorange");
			break;
		case 3:
			blockViewBitmap = document.getElementById("russred");
			break;
		case 4:
			blockViewBitmap = document.getElementById("russthinblue");
			break;
		case 5:
			blockViewBitmap = document.getElementById("russthingreen");
			break;
		case 6:
			blockViewBitmap = document.getElementById("russthinpurple");
			break;
		case 7:
			blockViewBitmap = document.getElementById("russwhite");
			break;
	}

}

// tetris initialization
function initTetris() {
	drawViewBlock(1);
	drawViewBlock(2);
	drawMoveBlock();
	interval = setInterval(drawMove, 1000.0/downSpeed)
}

// draw view block
function drawViewBlock(times) {
	context.clearRect(currentViewX, currentViewY, 4*BLOCK_SIZE, 5*BLOCK_SIZE);
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 5; j++) {
			TetrisMoveBlock[i][j].x = TetrisBlock[i][j].x;
			TetrisMoveBlock[i][j].y = TetrisBlock[i][j].y;
		}
	}
	currMoveBlockForm = currViewBlockForm;
	blockMoveBitmap = blockViewBitmap;

	preTetrisBlock();
	initBitmap();
	if (times != 1) {
		context.beginPath();
		for (var i = 0; i < 4; i ++) {
			xVPos[i] = PRE_STARTX + 200 + BLOCK_SIZE * TetrisBlock[0][i].x;
			yVPos[i] = PRE_STARTY + 5 + BLOCK_SIZE * TetrisBlock[0][i].y;
			if (blockViewBitmap != null) {
				context.drawImage(blockViewBitmap, xVPos[i], yVPos[i])
			}
		}
		context.closePath();
	}	

}


// draw move block
function drawMoveBlock() {	
	xMoveBlock = START_BLOCKX;
	yMoveBlock = START_BLOCKY;
	currBlockState = 0;
	context.beginPath();
	for (var i = 0; i < 4; i++) {
		xMPos[i] = xMoveBlock + BLOCK_SIZE * TetrisMoveBlock[currBlockState][i].x;
		yMPos[i] = yMoveBlock + BLOCK_SIZE * TetrisMoveBlock[currBlockState][i].y;
		TetrisBlockMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
						[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] = MAP_BLOCK;
		TetrisColorMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
						[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] = blockMoveBitmap;
		context.drawImage(blockMoveBitmap, xMPos[i], yMPos[i])
	}
	context.closePath();
	currentMoveX = xMPos[0] - BLOCK_SIZE;
	currentMoveY = yMPos[0];

	//drawMove();
}
	
// draw move
function drawMove() {
	if (bReachButtom == false) {
		context.clearRect(STARTX, STARTY, XLength, YLength);
	}

	context.beginPath();
	context.fillStyle = "white"
	context.font = "30px Arial";
	var name = "Level " + currentLevel;
	context.fillText(name, 200, 50);
	for (var i = 0; i < X_SIZE; i++) {
		for (var j = 0; j < Y_SIZE; j++) {
			if (TetrisColorMap[i][j] != 0) {
				var bmp = TetrisColorMap[i][j];
				context.drawImage(bmp, STARTX + i * BLOCK_SIZE, STARTY + j * BLOCK_SIZE);
			}
		}
	}

	var pScores = document.getElementById("scores");
	pScores.innerHTML = "Scores: " + iCurrentTetrisScore;

	currentMoveX = xMPos[0] - BLOCK_SIZE;
	currentMoveY = yMPos[0];

	update();
}

function update() {
	bReachButtom = false;
	for (var i = 0; i < 4; i++) {
		TetrisColorMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
			[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] = 0;
		TetrisBlockMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
			[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] = 0;	
		//context.clearRect(xMPos[i], yMPos[i], BLOCK_SIZE, BLOCK_SIZE);

	}	
	for (var i = 0; i < 4; i++) {
		yMPos[i] += BLOCK_SIZE;
		if (yMPos[i] > frameDownRightY - BLOCK_SIZE
			|| TetrisBlockMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
				[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] != 0) {
			bReachButtom = true;
		}
	}
	if (bReachButtom) {
		for (var i = 0; i < 4; i++) {
			yMPos[i] -= BLOCK_SIZE;
		}
		currentButtomY = yMPos[0];
	}

	for (var i = 0; i < 4; i++) {
		TetrisColorMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
			[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] = blockMoveBitmap;
		TetrisBlockMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
			[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] = MAP_BLOCK;	

	}
	if (bReachButtom) {
		reachButtom();
	}
}

// reach bottom
function reachButtom() {
	bottomBitmap = blockMoveBitmap;
	//clearInterval(interval);

	var lines = clearFullRow();
	getScore(lines);

	drawViewBlock(2);
	drawMoveBlock();

}
// prepare block
function preTetrisBlock() {
	var i = (Math.ceil(Math.random() * 10)) % 7;
	switch(i) {
	case 0:
		TetrisBlock[0][0].x = 0;
		TetrisBlock[0][0].y = 0;
		TetrisBlock[0][1].x = 0;
		TetrisBlock[0][1].y = 1;
		TetrisBlock[0][2].x = 0;
		TetrisBlock[0][2].y = 2;
		TetrisBlock[0][3].x = 0;
		TetrisBlock[0][3].y = 3;
		TetrisBlock[0][4].x = 1;
		TetrisBlock[0][4].y = 4;

		TetrisBlock[1][0].x = 0;
		TetrisBlock[1][0].y = 0;//
		TetrisBlock[1][1].x = 1;//
		TetrisBlock[1][1].y = 0;//
		TetrisBlock[1][2].x = 2;
		TetrisBlock[1][2].y = 0;
		TetrisBlock[1][3].x = 3;
		TetrisBlock[1][3].y = 0;
		TetrisBlock[1][4].x = 4;
		TetrisBlock[1][4].y = 1;

		break;
	case 1:
		TetrisBlock[0][0].x = 0;
		TetrisBlock[0][0].y = 0;
		TetrisBlock[0][1].x = 0;
		TetrisBlock[0][1].y = 1;
		TetrisBlock[0][2].x = 1;
		TetrisBlock[0][2].y = 1;
		TetrisBlock[0][3].x = 0;
		TetrisBlock[0][3].y = 2;
		TetrisBlock[0][4].x = 2;
		TetrisBlock[0][4].y = 3;

		TetrisBlock[1][0].x = 0;
		TetrisBlock[1][0].y = 0;
		TetrisBlock[1][1].x = 1;
		TetrisBlock[1][1].y = 0;
		TetrisBlock[1][2].x = 2;
		TetrisBlock[1][2].y = 0;
		TetrisBlock[1][3].x = 1;
		TetrisBlock[1][3].y = 1;
		TetrisBlock[1][4].x = 3;
		TetrisBlock[1][4].y = 2;

		TetrisBlock[2][0].x = 1;
		TetrisBlock[2][0].y = 0;
		TetrisBlock[2][1].x = 0;
		TetrisBlock[2][1].y = 1;
		TetrisBlock[2][2].x = 1;
		TetrisBlock[2][2].y = 1;
		TetrisBlock[2][3].x = 1;
		TetrisBlock[2][3].y = 2;
		TetrisBlock[2][4].x = 2;
		TetrisBlock[2][4].y = 3;

		TetrisBlock[3][0].x = 1;// 
		TetrisBlock[3][0].y = 0;//
		TetrisBlock[3][1].x = 0;//  
		TetrisBlock[3][1].y = 1;
		TetrisBlock[3][2].x = 1;
		TetrisBlock[3][2].y = 1;
		TetrisBlock[3][3].x = 2;
		TetrisBlock[3][3].y = 1;
		TetrisBlock[3][4].x = 3;
		TetrisBlock[3][4].y = 2;

		break;
	case 2:
		TetrisBlock[0][0].x = 1;// 
		TetrisBlock[0][0].y = 0;//
		TetrisBlock[0][1].x = 0;//
		TetrisBlock[0][1].y = 1;
		TetrisBlock[0][2].x = 1;
		TetrisBlock[0][2].y = 1;
		TetrisBlock[0][3].x = 0;
		TetrisBlock[0][4].x = 2;
		TetrisBlock[0][4].y = 3;

		TetrisBlock[0][3].y = 2;
		TetrisBlock[1][0].x = 0;//
		TetrisBlock[1][0].y = 0;//  
		TetrisBlock[1][1].x = 1;//  
		TetrisBlock[1][1].y = 0;
		TetrisBlock[1][2].x = 1;
		TetrisBlock[1][2].y = 1;
		TetrisBlock[1][3].x = 2;
		TetrisBlock[1][3].y = 1;
		TetrisBlock[1][4].x = 3;
		TetrisBlock[1][4].y = 2;

		break;
	case 3:
		TetrisBlock[0][0].x = 0;//
		TetrisBlock[0][0].y = 0;//
		TetrisBlock[0][1].x = 0;//  
		TetrisBlock[0][1].y = 1;
		TetrisBlock[0][2].x = 1;
		TetrisBlock[0][2].y = 1;
		TetrisBlock[0][3].x = 1;
		TetrisBlock[0][3].y = 2;
		TetrisBlock[0][4].x = 2;
		TetrisBlock[0][4].y = 3;

		TetrisBlock[1][0].x = 1;//  
		TetrisBlock[1][0].y = 0;//
		TetrisBlock[1][1].x = 2;//  
		TetrisBlock[1][1].y = 0;
		TetrisBlock[1][2].x = 0;
		TetrisBlock[1][2].y = 1;
		TetrisBlock[1][3].x = 1;
		TetrisBlock[1][3].y = 1;
		TetrisBlock[1][4].x = 3;
		TetrisBlock[1][4].y = 2;

		break;
	case 4:
		TetrisBlock[0][0].x = 0;//
		TetrisBlock[0][0].y = 0;//
		TetrisBlock[0][1].x = 1;//
		TetrisBlock[0][1].y = 0;
		TetrisBlock[0][2].x = 0;
		TetrisBlock[0][2].y = 1;
		TetrisBlock[0][3].x = 0;
		TetrisBlock[0][3].y = 2;
		TetrisBlock[0][4].x = 2;
		TetrisBlock[0][4].y = 3;

		TetrisBlock[1][0].x = 0;//
		TetrisBlock[1][0].y = 0;//    
		TetrisBlock[1][1].x = 1;//
		TetrisBlock[1][1].y = 0;
		TetrisBlock[1][2].x = 2;
		TetrisBlock[1][2].y = 0;
		TetrisBlock[1][3].x = 2;
		TetrisBlock[1][3].y = 1;	
		TetrisBlock[1][4].x = 3;
		TetrisBlock[1][4].y = 2;

		TetrisBlock[2][0].x = 1;//  
		TetrisBlock[2][0].y = 0;//  
		TetrisBlock[2][1].x = 1;//
		TetrisBlock[2][1].y = 1;
		TetrisBlock[2][2].x = 0;
		TetrisBlock[2][2].y = 2;
		TetrisBlock[2][3].x = 1;
		TetrisBlock[2][3].y = 2;
		TetrisBlock[2][4].x = 2;
		TetrisBlock[2][4].y = 3;

		TetrisBlock[3][0].x = 0;//
		TetrisBlock[3][0].y = 0;//
		TetrisBlock[3][1].x = 0;//
		TetrisBlock[3][1].y = 1;
		TetrisBlock[3][2].x = 1;
		TetrisBlock[3][2].y = 1;
		TetrisBlock[3][3].x = 2;
		TetrisBlock[3][3].y = 1;
		TetrisBlock[3][4].x = 3;
		TetrisBlock[3][4].y = 2;

		break;
	case 5:
		TetrisBlock[0][0].x = 0;//
		TetrisBlock[0][0].y = 0;//
		TetrisBlock[0][1].x = 1;
		TetrisBlock[0][1].y = 0;
		TetrisBlock[0][2].x = 0;
		TetrisBlock[0][2].y = 1;
		TetrisBlock[0][3].x = 1;
		TetrisBlock[0][3].y = 1;
		TetrisBlock[0][4].x = 2;
		TetrisBlock[0][4].y = 2;

		break;

	case 6:
		TetrisBlock[0][0].x = 0;//
		TetrisBlock[0][0].y = 0;//  
		TetrisBlock[0][1].x = 1;//  
		TetrisBlock[0][1].y = 0;
		TetrisBlock[0][2].x = 1;
		TetrisBlock[0][2].y = 1;
		TetrisBlock[0][3].x = 1;
		TetrisBlock[0][3].y = 2;
		TetrisBlock[0][4].x = 2;
		TetrisBlock[0][4].y = 3;

		TetrisBlock[1][0].x = 2;//   
		TetrisBlock[1][0].y = 0;//
		TetrisBlock[1][1].x = 0;//
		TetrisBlock[1][1].y = 1;
		TetrisBlock[1][2].x = 1;
		TetrisBlock[1][2].y = 1;
		TetrisBlock[1][3].x = 2;
		TetrisBlock[1][3].y = 1;	
		TetrisBlock[1][4].x = 3;
		TetrisBlock[1][4].y = 2;

		TetrisBlock[2][0].x = 0;//
		TetrisBlock[2][0].y = 0;//
		TetrisBlock[2][1].x = 0;//
		TetrisBlock[2][1].y = 1;
		TetrisBlock[2][2].x = 0;
		TetrisBlock[2][2].y = 2;
		TetrisBlock[2][3].x = 1;
		TetrisBlock[2][3].y = 2;
		TetrisBlock[2][4].x = 2;
		TetrisBlock[2][4].y = 3;

		TetrisBlock[3][0].x = 0;//
		TetrisBlock[3][0].y = 0;//
		TetrisBlock[3][1].x = 1;//
		TetrisBlock[3][1].y = 0;
		TetrisBlock[3][2].x = 2;
		TetrisBlock[3][2].y = 0;
		TetrisBlock[3][3].x = 0;
		TetrisBlock[3][3].y = 1;
		TetrisBlock[3][4].x = 3;
		TetrisBlock[3][4].y = 2;

		break;
	default:
		break;
	}
	currViewBlockForm = i;
}

function moveLeft() {
	bMoveLeft = true;
	bMoveRight = false;
	bMoveDown = false;
	var bLeftStop = false;
	for (var i = 0; i < 4; i++) {
		TetrisColorMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
			[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] = 0;
		TetrisBlockMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
			[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] = 0;			
	}
	if (xMoveBlock == frameTopLeftX) {
		bLeftStop = true;
	}
	else {
		for (var i = 0; i < 4; i++) {
			if (TetrisBlockMap[Math.floor((xMPos[i] - TETRISMAP_LEFT - BLOCK_SIZE)/BLOCK_SIZE)]
				[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] != 0) {
				bLeftStop = true;
			}
		}
	}


	if (!bLeftStop) {
		xMoveBlock -= BLOCK_SIZE;
		for (var i = 0; i < 4; i++) {
			xMPos[i] -= BLOCK_SIZE;
		}

	}

	for (var i = 0; i < 4; i++) {
		TetrisColorMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
			[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] = blockMoveBitmap;
		TetrisBlockMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
			[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] = MAP_BLOCK;		
	}
	drawMove();
}

function moveRight() {
	bMoveRight = true;
	bMoveLeft = false;
	bMoveDown = false;
	var bRightStop = false;
	for (var i = 0; i < 4; i++) {
		TetrisColorMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
			[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] = 0;
		TetrisBlockMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
			[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] = 0;			
	}
	if (xMoveBlock + BLOCK_SIZE * TetrisMoveBlock[currBlockState][4].x == frameTopRightX) {
		bRightStop = true;
	}
	else { 
		for (var i = 0; i < 4; i++) {
			console.log(Math.floor((xMPos[i] - TETRISMAP_LEFT + BLOCK_SIZE)/BLOCK_SIZE));
			console.log(Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE));
			if (TetrisBlockMap[Math.floor((xMPos[i] - TETRISMAP_LEFT + BLOCK_SIZE)/BLOCK_SIZE)]
					[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] != 0) {
				bRightStop = true;
			}
		}
	}


	if (!bRightStop) {
		xMoveBlock += BLOCK_SIZE;
		for (var i = 0; i < 4; i++) {
			xMPos[i] += BLOCK_SIZE;
		}

	}

	for (var i = 0; i < 4; i++) {
		TetrisColorMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
			[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] = blockMoveBitmap;
		TetrisBlockMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
			[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] = MAP_BLOCK;		
	}
	drawMove();
}

function moveDown() {
	bMoveDown = true;
	bMoveLeft = false;
	bMoveRight = false;
	bReachButtom = false;
	for (var i = 0; i < 4; i++) {
		TetrisColorMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
			[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] = 0;
		TetrisBlockMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
			[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] = 0;			
	}
	for (var i = 0; i < 4; i++) {
		yMPos[i] += BLOCK_SIZE;
		if (yMPos[i] > frameDownRightY - BLOCK_SIZE
			|| TetrisBlockMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
				[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] != 0) {
			bReachButtom = true;
		}
	}
	if (bReachButtom) {
		for (var i = 0; i < 4; i++) {
			yMPos[i] -= BLOCK_SIZE;
		}
		currentButtomY = yMPos[0];
	}

	for (var i = 0; i < 4; i++) {
		TetrisColorMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
			[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] = blockMoveBitmap;
		TetrisBlockMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
			[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] = MAP_BLOCK;	

	}
	if (bReachButtom) {
		reachButtom();
	}	
}
// Rotate
function rotateBlock() {
	for (var i = 0; i < 4; i++) {
		TetrisColorMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
			[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] = 0;
		TetrisBlockMap[Math.floor((xMPos[i] - TETRISMAP_LEFT)/BLOCK_SIZE)]
			[Math.floor((yMPos[i] - TETRISMAP_TOP)/BLOCK_SIZE)] = 0;			
	}
	oldBlockState = currBlockState;
	switch (currMoveBlockForm) {
		case TETRISBLOCK_0:
			currBlockState = (currBlockState + 1) % 2;
			break;
		case TETRISBLOCK_1:
			currBlockState = (currBlockState +1) % 4;
			break;
		case TETRISBLOCK_2:
			currBlockState = (currBlockState +1) % 2;
			break;
		case TETRISBLOCK_3:
			currBlockState = (currBlockState +1) % 2;
			break;
		case TETRISBLOCK_4:
			currBlockState = (currBlockState +1) % 4;
			break;
		case TETRISBLOCK_5:
			break;
		case TETRISBLOCK_6:
			currBlockState = (currBlockState +1) % 4;
			break;
		default:
			break;			
	}

	var rightM = 0;
	var rightD = 0;
	for (var i = 0; i < 4; i++) {
		rightM = xMoveBlock + BLOCK_SIZE 
				* TetrisMoveBlock[currBlockState][i].x;
		rightD = yMoveBlock + BLOCK_SIZE
				* TetrisMoveBlock[currBlockState][i].y;
		if ((rightM + BLOCK_SIZE > TETRISMAP_RIGHT)
			|| (TetrisBlockMap[Math.floor((rightM-TETRISMAP_LEFT)/BLOCK_SIZE)]
			                  [Math.floor((rightD-TETRISMAP_TOP)/BLOCK_SIZE)] != 0)) {
			currBlockState = oldBlockState;

			return;
		}	
	}

	xPos = xMPos[0];
	yPos = yMPos[0];
	//Calculate the xMPos,yMPos
	for (var i = 0; i < 4; i++) {
		xMPos[i] = xPos + BLOCK_SIZE * TetrisMoveBlock[currBlockState][i].x;
		yMPos[i] = yPos + BLOCK_SIZE * TetrisMoveBlock[currBlockState][i].y;
	}
	//Set the Map		
	for (var i = 0; i < 4; i++) {
		TetrisBlockMap[Math.floor((xMPos[i]-TETRISMAP_LEFT)/BLOCK_SIZE)]
		 				[Math.floor((yMPos[i]-TETRISMAP_TOP)/BLOCK_SIZE)] = MAP_BLOCK;
		TetrisColorMap[Math.floor((xMPos[i]-TETRISMAP_LEFT)/BLOCK_SIZE)]
		  			 [Math.floor((yMPos[i]-TETRISMAP_TOP)/BLOCK_SIZE)] = blockMoveBitmap;

	}
	for (var i = 0; i < X_SIZE; i++) {
		for (var j = 0; j < Y_SIZE; j++) {
			if (TetrisColorMap[i][j] != 0) {
				var bmp = TetrisColorMap[i][j];
				context.drawImage(bmp, STARTX + i * BLOCK_SIZE, STARTY + j * BLOCK_SIZE);
			}
		}
	}
	//drawMove();
}

// window key
window.onkeydown = function(e) {
  let key = e.key || e.keyCode;
  switch(key) {
  	case "Enter":
  	case 13:
  	  rotateBlock();
    case "ArrowLeft":
    case 37: // left arrow keyCode
      moveLeft();
      break;
    case "ArrowRight":
    case 39: // right arrow keyCode
      moveRight();
      break;
    case "ArrowDown":
    case 40: // down arrow keyCode
      moveDown();
      break;
  }
}


function clearFullRow() {
	var i = 0; 
	var j = Y_SIZE - 1;
	var line = 0;
	var bFullRow = true;
	while (j >= 0) {
		for (var i = 0; i < X_SIZE; i++) {
			if (TetrisBlockMap[i][j] == 0) {
				bFullRow = false;
				break;
			}
		}
		if (bFullRow) {
			var k = 0;
			for (var k = j-1; k >= 0; k--) {
				for (i = 0; i < X_SIZE; i++) {
					TetrisBlockMap[i][k+1] = TetrisBlockMap[i][k];
					TetrisColorMap[i][k+1] = TetrisColorMap[i][k];
				}
			}
			for (i = 0; i < X_SIZE; i++) {
				TetrisBlockMap[i][0] = 0;
				TetrisColorMap[i][0] = 0;
			}
			j++;
			line++;
		}
		j--;
		bFullRow = true;
	}

	return line;
}	

// Score
function getScore(line) {
	var score = 1;

	switch (line) {
	case 1:
		score *= 20;
		break;
	case 2:
		score *= 45;
		break;
	case 3:
		score *= 60;
		break;
	case 4:
		score *= 100;
		break;
	default:
		score = 0;
		break;
	}

	iCurrentTetrisScore += score
	if (iCurrentTetrisScore - oldTetrisScore >= 100) {
		levelUp();
	}
		
}

function levelUp() {
	context.beginPath();
	context.fillStyle = "white"
	context.font = "30px Arial";
	var name = "Level " + currentLevel;
	context.fillText(name, 200, 50);	
	oldTetrisScore = iCurrentTetrisScore;
	currentLevel += 1;
	downSpeed += 1.0;
	for (var i = 0; i < X_SIZE; i++) {
		for (var j = 0; j < Y_SIZE; j++) {
			TetrisColorMap[i][j] = 0;
			TetrisBlockMap[i][j] = 0;
		}
	}
}