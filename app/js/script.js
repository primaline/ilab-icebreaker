window.onload = function() {
	FastClick.attach(document.body);
	var sections = document.getElementsByTagName("section");
	var newButton = document.getElementById("newbutton");
	var instrButton = document.getElementById("instrbutton");
	var pauseInstrButton = document.getElementById("pauseinstrbutton");
	var zoneTitle = document.getElementById("zone");
	var quitButton = document.getElementById("quitbutton");
	var credsButton = document.getElementById("credbutton");
	var backButton = document.getElementsByClassName("backbutton");
	var indicF1Button = document.getElementById("indicprologue");
	var indicS1Button = document.getElementById("indicinstr");
	var indicF2Button = document.getElementById("indicteam");
	var indicS2Button = document.getElementById("indicress");
	var bgMusic = document.getElementById("bgmusic");
	var gameLocation = document.getElementById("game");
	var timer = document.getElementById("timer");
	var retryButton = document.getElementById("retrybutton");
	var pauseButton = document.getElementById("pausebutton");
	var pauseMenu = document.getElementById("pausemenu");
	var victoryMenu = document.getElementById("victorymenu");
	var looseMenu = document.getElementById("loosemenu");
	var retryButtonInMenu = document.getElementsByClassName("retrybuttoninmenu");
	var nextButtonInMenu = document.getElementsByClassName("nextbuttoninmenu");
	var currentSection;
	var showmenu = true;
	var pause = false;
	var pauseTimeout;
	var timerCount;
	var timerStock;
	var classStock;
	var animationEnded;
	var map = new Object();
		map.totalwidth;
		map.totalheight;
	var boat = new Object();
		boat.classname;
		boat.totalwidth;
		boat.totalheight;
	var docfrag;
	var block;
	var allDoneBlocks = [];
	var tabLength;
	var startHCoord;
	var key;
	var first = 0;
	var firstPress = 0;
	var flag = 0;
	var InnerInterval;
	var outerInterval;
	var pauseInterval;
	var rowNumb;
	var colNumb;
	var rowPx;
	var colPx;
	var stringPos;
	var maxVBlocks = 10;
	var maxHBlocks = 8;
	var stop = true;
	var firstBlock;
	var nextBlock;
	var lastBlock;
	var lastKey;
	var string;
	var blockWidth = 40;
	var blockCountdown = maxHBlocks * maxVBlocks;
	var obstacles = {
		"penguin": 1,
		"mammoth": 2,
		"iceberg": 4
	}
	var start = {};
	var end = {};
	var tracking = false;
	var thresholdTime = 500;
	var thresholdDistance = 100;
	var mapNum = 0;
	var mapsList = [
	{ 
		"BoatCoords": "c1 r0", 
		"Obstacles": [["iceberg","c2 r2"], ["mammoth", "c5 r6"]], 
		"Time": 6100,
	},
	{ 
		"BoatCoords": "c1 r0", 
		"Obstacles": [["mammoth","c5 r2"], ["penguin", "c7 r7"], ["iceberg", "c2 r8"]], 
		"Time": 6000,
	},
	{ 
		"BoatCoords": "c1 r0", 
		"Obstacles": [["penguin","c6 r2"], ["mammoth", "c2 r3"], ["mammoth", "c4 r9"]], 
		"Time": 6200,
	},
	{ 
		"BoatCoords": "c1 r0", 
		"Obstacles": [["mammoth","c7 r1"], ["penguin", "c3 r2"], ["mammoth", "c1 r5"], ["iceberg", "c1 r9"]], 
		"Time": 5800,
	},
	{ 
		"BoatCoords": "c1 r0", 
		"Obstacles": [["iceberg","c1 r2"], ["penguin", "c7 r2"], ["mammoth", "c3 r8"]], 
		"Time": 6000,
	},
		{ 
		"BoatCoords": "c1 r0", 
		"Obstacles": [["iceberg","c2 r2"], ["mammoth", "c5 r5"], ["iceberg", "c6 r7"]], 
		"Time": 5700,
	},
	{ 
		"BoatCoords": "c1 r0", 
		"Obstacles": [["mammoth","c5 r2"], ["iceberg", "c3 r3"], ["penguin", "c6 r5"], ["penguin", "c2 r6"], ["iceberg", "c6 r7"], ["penguin", "c4 r9"]], 
		"Time": 5500,
	},
	{ 
		"BoatCoords": "c1 r0", 
		"Obstacles": [["mammoth","c2 r1"], ["penguin", "c1 r3"], ["penguin", "c6 r3"], ["mammoth", "c4 r5"], ["iceberg", "c1 r6"], ["penguin", "c1 r10"]], 
		"Time": 5700,
	},
	{ 
		"BoatCoords": "c2 r0", 
		"Obstacles": [["penguin","c1 r1"], ["penguin", "c1 r5"]], 
		"Time": 6400,
	}
	];
	

	bgMusic.loop = true;



	doOnOrientationChange = function() {
	    switch(window.orientation) 
	    {  
	      case -90:
	      case 90:
	        break; 
	      default:
	      	window.scrollTo(0,0);
	        break; 
	    }
	}

	keyUp = function(e) {
		key = e.keyCode;
		switch(key) {
			case 38:
				key = "up";
				pressKey();
				break;
			case 39:
				key = "right";
				pressKey();
				break;
			case 40:
				key = "down";
				pressKey();
				break;
			case 37:
				key = "left";
				pressKey();
				break;
			default:
				break;
		}
	}

	gestureStart = function(e) {
		if (e.touches.length>1) {
			tracking = false;
			return;
		} else {
			tracking = true;
			/* Hack - would normally use e.timeStamp but it's whack in Fx/Android */
			start.t = new Date().getTime();
			start.x = e.targetTouches[0].clientX;
			start.y = e.targetTouches[0].clientY;
		}
	};
	
	gestureMove = function(e) {
		if (tracking) {
			e.preventDefault();
			end.x = e.targetTouches[0].clientX;
			end.y = e.targetTouches[0].clientY;
		}
	}
	
	gestureEnd = function(e) {
		tracking = false;
		var now = new Date().getTime();
		var deltaTime = now - start.t;
		var deltaX = end.x - start.x;
		var deltaY = end.y - start.y;
		/* work out what the movement was */
		if (deltaTime > thresholdTime) {
			/* gesture too slow */
			return;
		} else {
			if ((deltaX > thresholdDistance)&&(Math.abs(deltaY) < thresholdDistance)) {
				key = "right";
				pressKey();
			} else if ((-deltaX > thresholdDistance)&&(Math.abs(deltaY) < thresholdDistance)) {
				key = "left";
				pressKey();
			} else if ((deltaY > thresholdDistance)&&(Math.abs(deltaX) < thresholdDistance)) {
				key = "down";
				pressKey();
			} else if ((-deltaY > thresholdDistance)&&(Math.abs(deltaX) < thresholdDistance)) {
				key = "up";
				pressKey();
			} else {
				key = lastKey;
			}
		}
	}

	gestureEndInMenu = function(e) {
		tracking = false;
		var now = new Date().getTime();
		var deltaTime = now - start.t;
		var deltaX = end.x - start.x;
		var deltaY = end.y - start.y;
		if (deltaTime > thresholdTime) {
			return;
		} else {
			if ((deltaX > thresholdDistance)&&(Math.abs(deltaY) < thresholdDistance)) {
				setContentClasses(currentSection, 0);
			} else if ((-deltaX > thresholdDistance)&&(Math.abs(deltaY) < thresholdDistance)) {
				setContentClasses(currentSection, 1);
			} else {
				return
			}
		}
	}

	//source: http://patrickhlauke.github.io/touch/swipe/

	slide = function() {
		var name = this.className;
		if(name == "") {
			name = this.id;
		}
		switch(name) {
			case "newbutton":
				setSectionClasses(3);
				firstMap();
				break;
			case "instrbutton":
				setSectionClasses(1);
				currentSection = 0;
				document.addEventListener('touchend', gestureEndInMenu);
				break;
			case "pauseinstrbutton":
				document.getElementById("pauseinstructions").className = "show";
				break;
			case "nextbuttoninmenu":
				setSectionClasses(0);
				break;
			case "quitbutton":
				setSectionClasses(0);
				break;
			case "leftonbar backbutton":
				setSectionClasses(0);
				document.removeEventListener('touchend', gestureEndInMenu);
				break;
			case "credbutton":
				setSectionClasses(2);
				currentSection = 1;
				document.addEventListener('touchend', gestureEndInMenu);
				break;
			case "indicprologue":
				setContentClasses(0, 0);
				break;
			case "indicinstr":
				setContentClasses(0, 1);
				break;
			case "indicteam":
				setContentClasses(1, 0);
				break;
			case "indicress":
				setContentClasses(1, 1);
				break;
		}
	}

	firstMap = function() {
		if(typeof map.itself != "undefined") {
			map.itself.parentNode.removeChild(map.itself);
			victoryMenu.className = "";
			looseMenu.className = "";
			key = "";
			first = 0;
			firstPress = 0;
			flag = 0;
			mapNum = 0;
			stop = true;
			pause = false;
			pauseMenu.className = "";
			showmenu = true;
			bgMusic.currentTime = 0;
			createMap(blockWidth, mapsList[mapNum]["BoatCoords"], mapsList[mapNum]["Obstacles"], mapsList[mapNum]["Time"]);
			removeInMenuButtEvents();
		}
		else {
			createMap(blockWidth, mapsList[mapNum]["BoatCoords"], mapsList[mapNum]["Obstacles"], mapsList[mapNum]["Time"]);
			removeInMenuButtEvents();
		}
	}

	retryGame = function() {
		clearInterval(innerInterval);
		clearInterval(outerInterval);
		removeEvents();
		removeButtEvents();
		bgMusic.play();
		pauseMenu.className = "";
		victoryMenu.className = "";
		looseMenu.className = "";
		document.getElementById("pauseinstructions").className = "";
		first = 0;
		firstPress= 0;
		flag = 0;
		stop = true;
		pause = false;
		showmenu = true;
		timerCount = timerStock;
		timer.innerHTML = timeToMMSS(timerCount);
		blockCountdown = maxHBlocks * maxVBlocks;
		boat.itself.className = classStock;
		allDoneBlocks = document.getElementsByClassName("block");
		for(i=0 ; i<80 ; i++) {
			if(allDoneBlocks[i].className.indexOf("done") > 0) {
				if(allDoneBlocks[i].className.indexOf("10")) {
					allDoneBlocks[i].className = allDoneBlocks[i].className.substr(0,12);
				}
				else allDoneBlocks[i].className = allDoneBlocks[i].className.substr(0,11);
			}
			if(allDoneBlocks[i].className.indexOf("inactive") > 0) {
				blockCountdown--;
			}
		}
		setTimeout(function() {
			addEvents();
			addButtEvents();
		}, 2100);
		setTimeout(function() {
			key = "down";
			pressKey();
		}, 500);
	}

	pauseGame = function() {
		if(pause == false) {
			pause = true;
			document.getElementById("pauseinstructions").className = "";
			if(showmenu) {
				pauseMenu.className = "show";
			}
			bgMusic.pause();
			clearInterval(innerInterval);
			if(stop == true) {
				clearInterval(outerInterval);
			}
			removeEvents();
		}
		else {
			if(showmenu) {
				pauseMenu.className = "hide";
			}
			bgMusic.play();
			clearTimeout(pauseTimeout);
			pauseTimeout = setTimeout(function() {
				pause = false;
				addEvents();
				pauseMenu.className = "";
				if(animationEnded == true && firstPress > 1) {
					firstPress = 1;
					pressKey();
					keyPressed();
				}
				else if(stop == true && firstPress > 1) {
					firstPress = 1;
					pressKey();
				}
			}, 800);
		}
	}

	nextMap = function() {
		mapNum++;
		map.itself.parentNode.removeChild(map.itself);
		victoryMenu.className = "";
		key = "";
		first = 0;
		firstPress = 0;
		flag = 0;
		pauseGame();
		showmenu = true;
		createMap(blockWidth, mapsList[mapNum]["BoatCoords"], mapsList[mapNum]["Obstacles"], mapsList[mapNum]["Time"]);
		removeInMenuButtEvents();
	}

	init();

	function init() {
		window.addEventListener("keydown", function(e) {
		    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
		        e.preventDefault();
		    }
		}, false);
		window.addEventListener('orientationchange', doOnOrientationChange);
		for(i=0;i<sections.length;i++) {
			sections[i].className = "right";
		}
		sections[0].className = "current";
		addMenuEvents();
	}

	function setSectionClasses(num) {
		for(i=0;i<sections.length;i++) {
			sections[i].className = "right";
		}
		sections[num].className = "current";
	}

	function setContentClasses(section, num) {
		if(section == 0) {
			if(num == 0) {
				indicF1Button.parentNode.className = "selected";
				indicS1Button.parentNode.className = "";
				document.getElementsByClassName("content")[1].className = "content current";
				document.getElementsByClassName("content")[2].className = "content right";
			}
			else {
				indicF1Button.parentNode.className = "";
				indicS1Button.parentNode.className = "selected";
				document.getElementsByClassName("content")[1].className = "content left";
				document.getElementsByClassName("content")[2].className = "content current";
			}
		}
		if(section == 1) {
			if(num == 0) {
				indicF2Button.parentNode.className = "selected";
				indicS2Button.parentNode.className = "";
				document.getElementsByClassName("content")[3].className = "content current";
				document.getElementsByClassName("content")[4].className = "content right";
			}
			else {
				indicF2Button.parentNode.className = "";
				indicS2Button.parentNode.className = "selected";
				document.getElementsByClassName("content")[3].className = "content left";
				document.getElementsByClassName("content")[4].className = "content current";
			}
		}
	}

	function show(menu) {
		var won = false;
		if(menu == "victory") {
			victoryMenu.className = "show";
			won = true;
		}
		else {
			looseMenu.className = "show";
		}
	}

	function timeToMMSS(time) {
		var stocktime = time;
		if(time > 999) {
			time = parseInt(time.toString().substr(0,2));
		}
		else if(time > 99) {
			time = parseInt(time.toString().substr(0,1));
		}
		else time = 0;
	    var seconds = time % 60;
	    if(time < 60) {
	    	seconds = time;
	    }
	    var minutes = Math.floor(time / 60);
	    if(time < 60) {
	    	minutes = 0;
	    }

	    if (minutes < 10) {minutes = "0"+minutes;}
	    if (seconds < 10) {seconds = "0"+seconds;}
	    var timeString    = "00:"+minutes+':'+seconds;
	    if(stocktime < 1 && pause == false) {
	    	show("lost");
	    	showmenu = false;
			pauseGame();
	    }
	    return timeString;
	}

	function createMap(boatWidth, boatCoords, obstaclesList, time) {
		timer.innerHTML = timeToMMSS(time);
		zoneTitle.innerHTML = "Zone "+(mapNum+1);
		timerCount = time;
		timerStock = time;
		classStock = boatCoords;
		map.itself = document.createElement("div");
		boat.itself = document.createElement("div");
		map.itself.id = "map";
		boat.itself.id = "icebreaker";
		boat.itself.className = boatCoords;
		boat.itself.style.width = boatWidth+"px";
		boat.itself.style.height = boatWidth+"px";
		map.itself.style.width = (maxHBlocks * boatWidth)+"px";
		docfrag = document.createDocumentFragment();
		docfrag.appendChild(boat.itself);
		for(r=1; r<=maxVBlocks; r++) {
			for(c=1; c<=maxHBlocks; c++) {
				string = "c"+c+" r"+r;
				block = document.createElement("div");
				block.className = "block "+string;
				docfrag.appendChild(block);
			}
		}

		map.totalwidth = map.itself.width;
		map.totalheight = map.itself.height;
		boat.classname = boat.itself.class;
		boat.totalwidth = boatWidth;
		boat.totalHeight = boatWidth;

		map.itself.appendChild(docfrag);
		gameLocation.appendChild(map.itself);

		docfrag = document.createDocumentFragment();

		blockCountdown = maxHBlocks * maxVBlocks;

		for(lgt=0; lgt<obstaclesList.length; lgt++) {
			string = obstaclesList[lgt][1];
			block = document.createElement("div");
			block.className = string+" "+obstaclesList[lgt][0];
			docfrag.appendChild(block);
			for(nb=0; nb<obstacles[obstaclesList[lgt][0]]; nb++) {
				nextBlock = document.getElementsByClassName(string);
				nextBlock[0].className += " inactive";
				blockCountdown--;
				switch(nb+1) {
					case 0:
						break;
					case 1:
						getRowAndColumn(string);
						colNumb += 1;
						string = "c"+colNumb+" r"+rowNumb;
						break;
					case 2:
						getRowAndColumn(string);
						rowNumb += 1;
						string = "c"+colNumb+" r"+rowNumb;
						break;
					case 3:
						getRowAndColumn(string);
						colNumb -= 1;
						string = "c"+colNumb+" r"+rowNumb;
						break;
				}
			};
		}

		map.itself.appendChild(docfrag);

		startHCoord = boatCoords.substr(0,2);

		bgMusic.play();

		bouncefix.add('nobounce');

		document.addEventListener("animationend", function() {
			if(pause == true) {
				animationEnded = true;
				clearInterval(outerInterval);
			}
		}, false);
		document.addEventListener("webkitAnimationEnd", function() {
			if(pause == true) {
				animationEnded = true;
				clearInterval(outerInterval);
			}
		}, false);


		setTimeout(function() {
			addEvents();
			addButtEvents();
		}, 2100);

		setTimeout(function() {
			key = "down";
			pressKey();
		}, 500);
	}

	function addMenuEvents() {
		newButton.addEventListener("click", slide, false);
		instrButton.addEventListener("click", slide, false);
		pauseInstrButton.addEventListener("click", slide, false);
		quitButton.addEventListener("click", slide, false);
		credsButton.addEventListener("click", slide, false);
		nextButtonInMenu[1].addEventListener("click", slide, false);
		for(i=0;i<backButton.length;i++) {
			backButton[i].addEventListener("click", slide, false);
		}
		indicF1Button.addEventListener("click", slide, false);
		indicS1Button.addEventListener("click", slide, false);
		indicF2Button.addEventListener("click", slide, false);
		indicS2Button.addEventListener("click", slide, false);
		document.addEventListener('touchstart', gestureStart, false);
		document.addEventListener('touchmove', gestureMove, false);
	}

	function addEvents() {
		document.addEventListener('keyup', keyUp, false);
		document.addEventListener('touchend', gestureEnd, false);
		retryButtonInMenu[0].addEventListener("click", retryGame, false);
		retryButtonInMenu[1].addEventListener("click", retryGame, false);
	}

	function removeEvents() {
		document.removeEventListener('keyup', keyUp);
		document.removeEventListener('touchend', gestureEnd);
	}

	function addButtEvents() {
		retryButton.addEventListener("click", retryGame, false);
		pauseButton.addEventListener("click", pauseGame, false);
	}

	function removeButtEvents() {
		retryButton.removeEventListener("click", retryGame);
		pauseButton.removeEventListener("click", pauseGame);
	}

	function addInMenuButtEvents() {
		nextButtonInMenu[0].addEventListener("click", nextMap, false);
	}

	function removeInMenuButtEvents() {
		nextButtonInMenu[0].removeEventListener("click", nextMap, false);
	}

	function getRowAndColumn(className) {
		colNumb = className.substr(1,2);
		if(colNumb.match(/ /) != null) {
			colNumb = colNumb.substr(0,1);
			stringPos = 4;
		}
		else {
			stringPos = 5;
		};
		rowNumb = parseInt(className.substr(stringPos,2));
		colNumb = parseInt(colNumb);
	}

	function pressKey() {
		if(firstPress <= 1) {
			if(firstPress == 1) {
				clearInterval(outerInterval);
				outerInterval = setInterval(function() {
					timerCount -= 10;
					timer.innerHTML = timeToMMSS(timerCount);
				}, 100);
			}
			firstPress++;
		}
		switch(key) {
			case "up":
				lastKey = key;
				if(stop == true) {
					keyPressed();
				}
				break;
			case "right":
				lastKey = key;
				if(stop == true) {
					keyPressed();
				}
				break;
			case "down":
			  	lastKey = key;
			  	if(stop == true) {
					keyPressed();
				}
			  	break;
			case "left":
				lastKey = key;
				if(stop == true) {
					keyPressed();
				}
				break;
			default:
				key = lastKey;
				break;
		}
	};


	function keyPressed() {
		getInactives(key);
		if(first == 0) {
			stop = false;
			first++;
		}
		if(stop == false) {
			switchClasses(key);
			innerInterval = setInterval(function() {
				getInactives(key);
				if(first == 1) {
					stop = true;
					first++;
					blockCountdown--;
					switchClasses(key);
					animationEnded = false;
					clearInterval(innerInterval);
				}
				else if(stop == true) {
					blockCountdown--;
					if(blockCountdown < 1) {
						show("victory");
						addInMenuButtEvents();
						showmenu = false;
						pauseGame();
						bgMusic.pause();
						bgMusic.currentTime = 0;
					}
					clearInterval(innerInterval);
					keyPressed();
				}
				else {
					blockCountdown--;
					switchClasses(key);
					animationEnded = false;
				}
			}, 800);
		}
	};

	function getInactives(direction) {
		boat.classname = boat.itself.className;
		getRowAndColumn(boat.classname);
		switch(direction) {
			case "up":
				if(rowNumb > 1) {
					string = "c"+colNumb+" r"+(rowNumb-1);
					nextBlock = document.getElementsByClassName(string);
					nextBlock = nextBlock[0].className;
					if(nextBlock.indexOf("inactive") > 0) {
						stop = true;
					}
					else stop = false;
				}
				else {
					stop = true;
				}
				break;
			case "right":
				if(colNumb < maxHBlocks) {
					string = "c"+(colNumb+1)+" r"+rowNumb;
					nextBlock = document.getElementsByClassName(string);
					nextBlock = nextBlock[0].className;
					if(nextBlock.indexOf("inactive") > 0) {
						stop = true;
					}
					else stop = false;
				}
				else {
					stop = true;
				}
				break;
			case "down":
				if(rowNumb < maxVBlocks) {
					string = "c"+colNumb+" r"+(rowNumb+1);
					nextBlock = document.getElementsByClassName(string);
					nextBlock = nextBlock[0].className;
					if(nextBlock.indexOf("inactive") > 0) {
						stop = true;
					}
					else stop = false;
				}
				else {
					stop = true;
				}
				break;
			case "left":
				if(colNumb > 1) {
					string = "c"+(colNumb-1)+" r"+rowNumb;
					nextBlock = document.getElementsByClassName(string);
					nextBlock = nextBlock[0].className;
					if(nextBlock.indexOf("inactive") > 0) {
						stop = true;
					}
					else stop = false;
				}
				else {
					stop = true;
				}
				break;
			default:
				break;
		}
	};

	function switchClasses(direction) {
		boat.classname = boat.itself.className;
		if(boat.classname.indexOf("r0") > -1 && flag < 1) {
			flag++;
			firstBlock = document.getElementsByClassName(startHCoord+" r1");
			setTimeout(function() {
				firstBlock[0].className += " inactive done3";
			}, 500);
		}
		else if(boat.classname.indexOf("r0") > -1 && flag == 1) {
			boat.itself.className = startHCoord+" r1 down";
		}
		else {
			getRowAndColumn(boat.classname);
			if(rowNumb >= 1 && rowNumb <= maxVBlocks && colNumb >= 1 && colNumb <= maxHBlocks) {
				switch(direction) {
					case "up":
						if(rowNumb == 1) {
							boat.itself.className = "c"+colNumb+" r"+rowNumb+" up";
						}
						else {
							string = "c"+colNumb+" r"+(rowNumb-1);
							lastBlock = document.getElementsByClassName(string);
							lastBlock[0].className = lastBlock[0].className + " inactive done1";
							boat.itself.className = string+" up";
						}
						break;
					case "right":
						if(colNumb == maxHBlocks) {
							boat.itself.className = "c"+colNumb+" r"+rowNumb+" right";
						}
						else {
							string = "c"+(colNumb+1)+" r"+rowNumb;
							lastBlock = document.getElementsByClassName(string);
							lastBlock[0].className = lastBlock[0].className + " inactive done2";
							boat.itself.className = string+" right";
						}
						break;
					case "down":
						if(rowNumb == maxVBlocks) {
							boat.itself.className = "c"+colNumb+" r"+rowNumb+" down";
						}
						else {
							string = "c"+colNumb+" r"+(rowNumb+1);
							lastBlock = document.getElementsByClassName(string);
							lastBlock[0].className = lastBlock[0].className + " inactive done3";
							boat.itself.className = string+" down";
						}
						break;
					case "left":
						if(colNumb == 1) {
							boat.itself.className = "c"+colNumb+" r"+rowNumb+" left";
						}
						else {
							string = "c"+(colNumb-1)+" r"+rowNumb;
							lastBlock = document.getElementsByClassName(string);
							lastBlock[0].className = lastBlock[0].className + " inactive done4";
							boat.itself.className = string+" left";
						}
						break;
					default:
						break;
				}
			};
		}
	};
};



