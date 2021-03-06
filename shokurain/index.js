$(document).ready(function(){
//VARIABLE DECLARATIONS
		//API collected stuff
	var apiKey;
	var playerName;
	var kanjiList= new Array();
	var readingList= new Array();
	var meaningList= new Array();
		//Game status stuff
	var thisGameSite = location.href; //for replaying, reload page
	var newGame = true;
	var gameOver = false;
		//Timer stuff
	var timerClock;
	var time = null;
	var timerStarted = false;
	var gameLvl = 1;
	var speed = 1;
	var dropTimer1, dropTimer2, dropTimer3, dropTimer4, dropTimer5;
		//Enemy stuff
	function RAINDROP(name, reading, meaning){
		this.name = name;
		this.reading = reading;
		this.meaning = meaning;
		this.dropType = null;
		this.whichDrop = null;
	}
	var droplet1 = 1;
	var droplet2 = 2;
	var droplet3 = 3;
	var droplet4 = 4;
	var droplet5 = 5;
	function KANJIITEM(name, reading, meaning){
		this.name = name;
		this.reading = reading;
		this.meaning = meaning;
	}
		//WKbabby stuff
	var kanjiItem = null;
	var wkHP = 3;			//the players HP, keep that high, yo
	var lastDirection = "left";	//checks last direction wk moved, for sprite animation direction. I felt like getting fancy here.
	var wkSprite = 1;		//12345-idleL&R,moveL&R, eatL&R, pukeL&R, sadL&R
	var ingredientsFound = [false,false];
		//scoreStuff
	var eatenMeanings = new Array();
	var eatenReadings = new Array();
	var eatenKanji = new Array();
	var allergenList = new Array();
	var bestStreakCount = 0;
	var goodStreak = 0;
	var badStreak = 0;
		//PAUSE SCREEN STUFF
	var isPaused = false;
	var mayPause = false; //addresses the pausing before loaded issue

	
//GAME FUNCTIONS
	//Start the timer
	function startTimer(){
		if((timerStarted === false) && (gameOver === false)){
			setNewMeal();
			time = 60;
			$("#theTime").text(time);
			timerClock = setInterval(passTime, 1000);
			timerStarted = true;
		}
	}
	//Continue and restart		WORKS
	function passTime(){
		if(time > 0){
			//time = parseInt($("#theTime").text());
			time--;
			$("#theTime").text(time);
		}
		else{
			clearInterval(timerClock);
			timerStarted = false;
			startTimer();
		}
	}

	//Move Wakababby	WORKS
	$(document).keydown(function(key){
		if(isPaused === false){
			switch(parseInt(key.which, 10)){
				case (37): //left arrow, move wkbabby left
					if(parseInt($("#wakaBabby").css('left')) > 0){
						$("#wakaBabby").animate({'left':'-=50px','right':'-=50px'},0).queue(function(next){
							if(parseInt($("#wakaBabby").css('left')) <= 0){
								$("#wakaBabby").animate({'left':'0px','right':'250px'},0);
							}
						next();
					});
					}
					lastDirection = "left";
						wkSprite = 2;
					setWakaBabbySprites(lastDirection, wkSprite);
					break;
				case (65): //a,move wkbabby left
					if(parseInt($("#wakaBabby").css('left')) > 0){
							$("#wakaBabby").animate({'left':'-=50px','right':'-=50px'},0).queue(function(next){
							if(parseInt($("#wakaBabby").css('left')) <= 0){
								$("#wakaBabby").animate({'left':'0px','right':'250px'},0);
							}
							next();
						});
					}
					lastDirection = "left";
					wkSprite = 2;
					setWakaBabbySprites(lastDirection, wkSprite);
					break;
				case (39): //right arrow, move wkbabby right
					if(parseInt($("#wakaBabby").css('left')) < 650){
						$("#wakaBabby").animate({'left':'+=50px','right':'+=50px'},0).queue(function(next){
							if(parseInt($("#wakaBabby").css('left')) >= 550){
								$("#wakaBabby").animate({'left':'550px', 'right':'800px'},0);
							}
							next();
						});
					}
						lastDirection = "right";
					wkSprite = 2;
					setWakaBabbySprites(lastDirection, wkSprite);
					break;
				case (68): //d, move wkbabby right
					if(parseInt($("#wakaBabby").css('left')) < 650){
						$("#wakaBabby").animate({'left':'+=50px','right':'+=50px'},0).queue(function(next){
							if(parseInt($("#wakaBabby").css('left')) >= 550){
								$("#wakaBabby").animate({'left':'550px', 'right':'800px'},0);
							}
							next();
						});
					}
					lastDirection = "right";
					wkSprite = 2;
					setWakaBabbySprites(lastDirection, wkSprite);
					break;
				default:
					//wkSprite = 1;
					//setWakaBabbySprites(lastDirection, wkSprite);
					break;
			}
		}
	});
		$(document).keyup(function(key){
			wkSprite = 1;
			setWakaBabbySprites(lastDirection, wkSprite);
		});

	//Wakababby Sprite Switch		//TODO	 CONNECT TO OTHER PARTS, PUKE ON BAD ITEM, SAD ON TIMER OUT
	function setWakaBabbySprites(direction, actionIndex){ //TODO CHANGE KANJIITEM'S POSITION ON SHELL BASED ON LEFT OR RIGHT
		if(direction === "left"){
			$("#kanji").css("margin-left","120px");
			$("#kanji").css("margin-right","60px");
			switch (actionIndex){
				case (1):
					if(!$("#wakaBabby").hasClass("wkIdleL")){
						$(".wkIdleL").css("background-image","url('blank.gif')");
						$(".wkIdleL").css("background-image","url('idleL.gif')");
						$("#wakaBabby").removeClass("wkSadR").removeClass("wkSadL").removeClass("wkPukeR").removeClass("wkPukeL").removeClass("wkEatR").removeClass("wkEatL").removeClass("wkMoveR").removeClass("wkMoveL").removeClass("wkIdleR").addClass("wkIdleL");
					}
					break;
				case (2):
					if(!$("#wakaBabby").hasClass("wkMoveL")){
						$(".wkMoveL").css("background-image","url('blank.gif')");
						$(".wkMoveL").css("background-image","url('idleL.gif')");
						$("#wakaBabby").removeClass("wkIdleL").removeClass("wkIdleR").removeClass("wkEatL").removeClass("wkEatR").removeClass("wkPukeL").removeClass("wkPukeR").removeClass("wkSadL").removeClass("wkSadR").removeClass("wkMoveR").addClass("wkMoveL");
					}
					break;
				case (3):
					if(!$("#wakaBabby").hasClass("wkEatL")){
						$(".wkEatL").css("background-image","url('blank.gif')");
						$(".wkEatL").css("background-image","url('idleL.gif')");
						$("#wakaBabby").removeClass("wkIdleL").removeClass("wkIdleR").removeClass("wkPukeL").removeClass("wkPukeR").removeClass("wkSadL").removeClass("wkSadR").removeClass("wkMoveL").removeClass("wkMoveR").removeClass("wkEatR").addClass("wkEatL");
					}
					break;
				case (4):
					if(!$("#wakaBabby").hasClass("wkPukeL")){
						$(".wkPukeL").css("background-image","url('blank.gif')");
						$(".wkPukeL").css("background-image","url('idleL.gif')");
						$("#wakaBabby").removeClass("wkIdleL").removeClass("wkIdleR").removeClass("wkEatL").removeClass("wkEatR").removeClass("wkSadL").removeClass("wkSadR").removeClass("wkMoveL").removeClass("wkMoveR").removeClass("wkPukeR").addClass("wkPukeL");
					}
					break;
				case (5):
					if(!$("#wakaBabby").hasClass("wkSadL")){
						$(".wkSadL").css("background-image","url('blank.gif')");
						$(".wkSadL").css("background-image","url('idleL.gif')");
						$("#wakaBabby").removeClass("wkIdleL").removeClass("wkIdleR").removeClass("wkEatL").removeClass("wkEatR").removeClass("wkPukeL").removeClass("wkPukeR").removeClass("wkMoveL").removeClass("wkMoveR").removeClass("wkSadR").addClass("wkSadL");
					}
					break;
				default:
					break;
			}
		}
		else if(direction === "right"){
			$("#kanji").css("margin-right","120px");
			$("#kanji").css("margin-left","60px");
			switch (actionIndex){
				case (1):
					if(!$("#wakaBabby").hasClass("wkIdleR")){
						$("#wakaBabby").removeClass("wkSadR").removeClass("wkSadL").removeClass("wkPukeR").removeClass("wkPukeL").removeClass("wkEatR").removeClass("wkEatL").removeClass("wkMoveR").removeClass("wkMoveL").removeClass("wkIdleL").addClass("wkIdleR");
					}
					break;
				case (2):
					if(!$("#wakaBabby").hasClass("wkMoveR")){
						$("#wakaBabby").removeClass("wkIdleL").removeClass("wkIdleR").removeClass("wkEatL").removeClass("wkEatR").removeClass("wkPukeL").removeClass("wkPukeR").removeClass("wkSadL").removeClass("wkSadR").removeClass("wkMoveL").addClass("wkMoveR");
					}
					break;
				case (3):
					if(!$("#wakaBabby").hasClass("wkEatR")){
						$("#wakaBabby").removeClass("wkIdleL").removeClass("wkIdleR").removeClass("wkPukeL").removeClass("wkPukeR").removeClass("wkSadL").removeClass("wkSadR").removeClass("wkMoveL").removeClass("wkMoveR").removeClass("wkEatL").addClass("wkEatR");
					}
					break;
				case (4):
					if(!$("#wakaBabby").hasClass("wkPukeR")){
						$("#wakaBabby").removeClass("wkIdleL").removeClass("wkIdleR").removeClass("wkEatL").removeClass("wkEatR").removeClass("wkSadL").removeClass("wkSadR").removeClass("wkMoveL").removeClass("wkMoveR").removeClass("wkPukeL").addClass("wkPukeR");
					}
					break;
				case (5):
					if(!$("#wakaBabby").hasClass("wkSadR")){
						$("#wakaBabby").removeClass("wkIdleL").removeClass("wkIdleR").removeClass("wkEatL").removeClass("wkEatR").removeClass("wkPukeL").removeClass("wkPukeR").removeClass("wkMoveL").removeClass("wkMoveR").removeClass("wkSadL").addClass("wkSadR");
					}
					break;
				default:
					break;
			}
		}
		else{}
	}
	//Move Raindrops down
	function dropRain(drop){
		if(gameOver === false){
			var speedVar = ("+=" + speed + "px");
			switch (drop.whichDrop){
				case (droplet1.whichDrop):
					dropTimer1 = setInterval(function(){
						$("#drop1").css("top", speedVar);
						$("#drop1").css("bottom", speedVar);
						detectCollisions(droplet1);
					},10);
					break;
				case (droplet2.whichDrop):
					dropTimer2 = setInterval(function(){
						$("#drop2").css("top", speedVar);
						$("#drop2").css("bottom", speedVar);
						detectCollisions(droplet2);
					},10);
					break;
				case (droplet3.whichDrop):
					dropTimer3 = setInterval(function(){
						$("#drop3").css("top", speedVar);
						$("#drop3").css("bottom", speedVar);
						detectCollisions(droplet3);
					},10);
					break;
				case (droplet4.whichDrop):
					dropTimer4 = setInterval(function(){
						$("#drop4").css("top", speedVar);
						$("#drop4").css("bottom", speedVar);
						detectCollisions(droplet4);
					},10);
					break;
				case (droplet5.whichDrop):
					dropTimer5 = setInterval(function(){
						$("#drop5").css("top", speedVar);
						$("#drop5").css("bottom", speedVar);
						detectCollisions(droplet5);
					},10);
					break;
				default:
					break;
			}
		}
	}
	//Collision detection, call gen raindrop, call matches, etc
	function detectCollisions(drop){			//TODO: If (lastDirection is left && ,| drop1.bottom-25<collision.top && drop1.bottom+50<collision.bottom |, &&wakababby.left +20<collision.right && wakababby.right-20 > collision.left) || (lastDirection is right && ,| drop1.bottom-25<collision.top && drop1.bottom+50<collision.bottom |, &&wakababby.right +20<collision.right && wakababby.right-20 > collision.left)
		if(gameOver === false){
			switch (drop.whichDrop){
				case (droplet1.whichDrop):
					if(((lastDirection === "left")&&(((parseInt($("#drop1").css("bottom"))-25) > (parseInt($("#drop1Collision").css("top"))) && (parseInt($("#drop1").css("bottom"))+50) < (parseInt($("#drop1Collision").css("bottom"))))&&(((parseInt($("#wakaBabby").css("left"))+30)<(parseInt($("#drop1Collision").css("right"))) )&&((parseInt($("#wakaBabby").css("right"))-150)>(parseInt($("#drop1Collision").css("left")))))))||((lastDirection === "right")&&(((parseInt($("#drop1").css("bottom"))-25) > (parseInt($("#drop1Collision").css("top"))) && (parseInt($("#drop1").css("bottom"))+50) < (parseInt($("#drop1Collision").css("bottom"))))&&(((parseInt($("#wakaBabby").css("right"))-30)>(parseInt($("#drop1Collision").css("left"))))&&((parseInt($("#wakaBabby").css("left"))+150)<(parseInt($("#drop1Collision").css("right")))))))){
						$("#drop1").css("background-image","none");
						checkForMatches(droplet1);
						destroyRain(droplet1);
						$("#drop1").css("background-color","transparent");
					}
					else if(parseInt($("#drop1").css("bottom")) >= parseInt($("#drop1Collision").css("bottom"))){
						$("#drop1").css("background-image","none");
						$("#drop1").css("background-color","#4400ff");
						destroyRain(droplet1);
						$("#drop1").css("background-color","transparent");
					}
					else{}
					break;
				case (droplet2.whichDrop):
					if(((lastDirection === "left")&&(((parseInt($("#drop2").css("bottom"))-25) > (parseInt($("#drop2Collision").css("top"))) && (parseInt($("#drop2").css("bottom"))+50) < (parseInt($("#drop2Collision").css("bottom"))))&&(((parseInt($("#wakaBabby").css("left"))+30)<(parseInt($("#drop2Collision").css("right"))) )&&((parseInt($("#wakaBabby").css("right"))-150)>(parseInt($("#drop2Collision").css("left")))))))||((lastDirection === "right")&&(((parseInt($("#drop2").css("bottom"))-25) > (parseInt($("#drop2Collision").css("top"))) && (parseInt($("#drop2").css("bottom"))+50) < (parseInt($("#drop2Collision").css("bottom"))))&&(((parseInt($("#wakaBabby").css("right"))-30)>(parseInt($("#drop2Collision").css("left"))))&&((parseInt($("#wakaBabby").css("left"))+150)<(parseInt($("#drop2Collision").css("right")))))))){
						$("#drop2").css("background-image","none");
						checkForMatches(droplet2);
						destroyRain(droplet2);
						$("#drop2").css("background-color","transparent");
					}
					else if(parseInt($("#drop2").css("bottom")) >= parseInt($("#drop2Collision").css("bottom"))){
						$("#drop2").css("background-image","none");
						$("#drop2").css("background-color","#4400ff");
						destroyRain(droplet2);
						$("#drop2").css("background-color","transparent");
					}
					else{}
					break;
				case (droplet3.whichDrop):
					if(((lastDirection === "left")&&(((parseInt($("#drop3").css("bottom"))-25) > (parseInt($("#drop3Collision").css("top"))) && (parseInt($("#drop3").css("bottom"))+50) < (parseInt($("#drop3Collision").css("bottom"))))&&(((parseInt($("#wakaBabby").css("left"))+30)<(parseInt($("#drop3Collision").css("right"))) )&&((parseInt($("#wakaBabby").css("right"))-150)>(parseInt($("#drop3Collision").css("left")))))))||((lastDirection === "right")&&(((parseInt($("#drop3").css("bottom"))-25) > (parseInt($("#drop3Collision").css("top"))) && (parseInt($("#drop3").css("bottom"))+50) < (parseInt($("#drop3Collision").css("bottom"))))&&(((parseInt($("#wakaBabby").css("right"))-30)>(parseInt($("#drop3Collision").css("left"))))&&((parseInt($("#wakaBabby").css("left"))+150)<(parseInt($("#drop3Collision").css("right")))))))){
						$("#drop3").css("background-image","none");
						checkForMatches(droplet3);
						destroyRain(droplet3);
						$("#drop3").css("background-color","transparent");
					}
					else if(parseInt($("#drop3").css("bottom")) >= parseInt($("#drop3Collision").css("bottom"))){
						$("#drop3").css("background-image","none");
						$("#drop3").css("background-color","#4400ff");
						destroyRain(droplet3);
						$("#drop3").css("background-color","transparent");
					}
					else{}
					break;
				case (droplet4.whichDrop):
					if(((lastDirection === "left")&&(((parseInt($("#drop4").css("bottom"))-25) > (parseInt($("#drop4Collision").css("top"))) && (parseInt($("#drop4").css("bottom"))+50) < (parseInt($("#drop4Collision").css("bottom"))))&&(((parseInt($("#wakaBabby").css("left"))+30)<(parseInt($("#drop4Collision").css("right"))) )&&((parseInt($("#wakaBabby").css("right"))-150)>(parseInt($("#drop4Collision").css("left")))))))||((lastDirection === "right")&&(((parseInt($("#drop4").css("bottom"))-25) > (parseInt($("#drop4Collision").css("top"))) && (parseInt($("#drop4").css("bottom"))+50) < (parseInt($("#drop4Collision").css("bottom"))))&&(((parseInt($("#wakaBabby").css("right"))-30)>(parseInt($("#drop4Collision").css("left"))))&&((parseInt($("#wakaBabby").css("left"))+150)<(parseInt($("#drop4Collision").css("right")))))))){
						$("#drop4").css("background-image","none");
						checkForMatches(droplet4);
						destroyRain(droplet4);
						$("#drop4").css("background-color","transparent");
					}
					else if(parseInt($("#drop4").css("bottom")) >= parseInt($("#drop4Collision").css("bottom"))){
						$("#drop4").css("background-image","none");
						$("#drop4").css("background-color","#4400ff");
						destroyRain(droplet4);
						$("#drop4").css("background-color","transparent");
					}
					else{}
					break;
				case (droplet5.whichDrop):
					if(((lastDirection === "left")&&(((parseInt($("#drop5").css("bottom"))-25) > (parseInt($("#drop5Collision").css("top"))) && (parseInt($("#drop5").css("bottom"))+50) < (parseInt($("#drop5Collision").css("bottom"))))&&(((parseInt($("#wakaBabby").css("left"))+30)<(parseInt($("#drop5Collision").css("right"))) )&&((parseInt($("#wakaBabby").css("right"))-150)>(parseInt($("#drop5Collision").css("left")))))))||((lastDirection === "right")&&(((parseInt($("#drop5").css("bottom"))-25) > (parseInt($("#drop5Collision").css("top"))) && (parseInt($("#drop5").css("bottom"))+50) < (parseInt($("#drop5Collision").css("bottom"))))&&(((parseInt($("#wakaBabby").css("right"))-30)>(parseInt($("#drop5Collision").css("left"))))&&((parseInt($("#wakaBabby").css("left"))+150)<(parseInt($("#drop5Collision").css("right")))))))){
						$("#drop5").css("background-image","none");
						checkForMatches(droplet5);
						destroyRain(droplet5);
						$("#drop5").css("background-color","transparent");
					}
					else if(parseInt($("#drop5").css("bottom")) >= parseInt($("#drop5Collision").css("bottom"))){
						$("#drop5").css("background-image","none");
						$("#drop5").css("background-color","#4400ff");
						destroyRain(droplet5);
						$("#drop5").css("background-color","transparent");
					}
					else{}
					break;
				default:
					break;
			}
		}
	}
	//Generate raindrops when a raindrop was destroyed or nullified
	function generateRain(drop){
		if(gameOver === false){
			var itemNumber; //check if name is same as kanjiItem, if so re-do, if no, its a-go
			var chanceIfKanji = Math.floor((Math.random()*5)+1); // if 1, its = kanjiItem!
			if(chanceIfKanji !== 1){
				itemNumber = Math.floor(Math.random()*kanjiList.length);
				if(kanjiList[itemNumber] === kanjiItem.name){
					var firstRange = Math.floor(Math.random()*itemNumber);
					var secondRange = Math.floor(Math.random()*(kanjiList.length - (itemNumber+1))+(itemNumber+1));
					var whichOfThoseNumbers = Math.floor((Math.random()*2)); // 0 = first, 1 = second
					if(whichOfThoseNumbers === 0){
						itemNumber = firstRange;
					}
					else{
						itemNumber = secondRange;
					}
				}
			}
			else{}
			var readingOrMeaning = Math.floor((Math.random()*2)); //if 0, reading, if 1 meaning;
			switch (drop){
				case (droplet1):
					if(chanceIfKanji === 1){
						droplet1 = new RAINDROP(kanjiItem.name, kanjiItem.reading, kanjiItem.meaning);
					}
					else{
						var meaning = meaningList[itemNumber].split(", ");
						var reading = readingList[itemNumber].split(", ");
						droplet1 = new RAINDROP(kanjiList[itemNumber], reading, meaning);
					}
					if(readingOrMeaning === 0){
						droplet1.dropType = "reading";
					}
					else{
						droplet1.dropType = "meaning";
					}
					droplet1.whichDrop = 1;
					$("#drop1").css({"top":"0px", "bottom":"50px"}).show()
					if(droplet1.dropType === "reading"){
						var whichIndex = Math.floor(Math.random()*(droplet1.reading.length));
						$("#drop1").text(droplet1.reading[whichIndex]);
						$("#drop1").css("font-size","1.5em");
					}
					else if(droplet1.dropType === "meaning"){
						var whichIndex = Math.floor(Math.random()*(droplet1.meaning.length));
						$("#drop1").text(droplet1.meaning[whichIndex]);
						$("#drop1").css("font-size","1.25em");
					}
					else{}
					var dropBG = Math.floor(Math.random()*3);
					$("#drop1").css("background-color", "transparent");
					if(dropBG === 0){
						$("#drop1").css("background-image", "url('drop1.gif')");
					}
					else if(dropBG === 1){
						$("#drop1").css("background-image", "url('drop2.gif')");
					}
					else{
						$("#drop1").css("background-image", "url('drop3.gif')");
					}
					$("#drop1").show("explode", {pieces: 1}, 100);
					dropRain(droplet1);
					break;
				case (droplet2):
					if(chanceIfKanji === 1){
						droplet2 = new RAINDROP(kanjiItem.name, kanjiItem.reading, kanjiItem.meaning);
					}
					else{
						var meaning = meaningList[itemNumber].split(", ");
						var reading = readingList[itemNumber].split(", ");
						droplet2 = new RAINDROP(kanjiList[itemNumber], reading, meaning);
					}
					if(readingOrMeaning === 0){
						droplet2.dropType = "reading";
					}
					else{
						droplet2.dropType = "meaning";
					}
					droplet2.whichDrop = 2;
					$("#drop2").css({"top":"0px", "bottom":"50px"}).show()
					if(droplet2.dropType === "reading"){
						var whichIndex = Math.floor(Math.random()*(droplet2.reading.length));
						$("#drop2").text(droplet2.reading[whichIndex]);
						$("#drop2").css("font-size","1.5em");
					}
					else if(droplet2.dropType === "meaning"){
						var whichIndex = Math.floor(Math.random()*(droplet2.meaning.length));
						$("#drop2").text(droplet2.meaning[whichIndex]);
						$("#drop2").css("font-size","1.25em");
					}
					else{}
					var dropBG = Math.floor(Math.random()*3);
					$("#drop2").css("background-color", "transparent");
					if(dropBG === 0){
						$("#drop2").css("background-image", "url('drop1.gif')");
					}
					else if(dropBG === 1){
						$("#drop2").css("background-image", "url('drop2.gif')");
					}
					else{
						$("#drop2").css("background-image", "url('drop3.gif')");
					}
					$("#drop2").show("explode", {pieces: 1}, 100);
					dropRain(droplet2);
					break;
				case (droplet3):
					if(chanceIfKanji === 1){
						droplet3 = new RAINDROP(kanjiItem.name, kanjiItem.reading, kanjiItem.meaning);
					}
					else{
						var meaning = meaningList[itemNumber].split(", ");
						var reading = readingList[itemNumber].split(", ");
						droplet3 = new RAINDROP(kanjiList[itemNumber], reading, meaning);
					}
					if(readingOrMeaning === 0){
							droplet3.dropType = "reading";
					}
					else{
						droplet3.dropType = "meaning";
					}
					droplet3.whichDrop = 3;
					$("#drop3").css({"top":"0px", "bottom":"50px"}).show()
					if(droplet3.dropType === "reading"){
						var whichIndex = Math.floor(Math.random()*(droplet3.reading.length));
						$("#drop3").text(droplet3.reading[whichIndex]);
						$("#drop3").css("font-size","1.5em");
					}
					else if(droplet3.dropType === "meaning"){
						var whichIndex = Math.floor(Math.random()*(droplet3.meaning.length));
						$("#drop3").text(droplet3.meaning[whichIndex]);
						$("#drop3").css("font-size","1.25em");
					}
					else{}
					var dropBG = Math.floor(Math.random()*3);
					$("#drop3").css("background-color", "transparent");
					if(dropBG === 0){
						$("#drop3").css("background-image", "url('drop1.gif')");
					}
					else if(dropBG === 1){
						$("#drop3").css("background-image", "url('drop2.gif')");
					}
					else{
						$("#drop3").css("background-image", "url('drop3.gif')");
					}
					$("#drop3").show("explode", {pieces: 1}, 100);
					dropRain(droplet3);
					break;
				case (droplet4):
					if(chanceIfKanji === 1){
						droplet4 = new RAINDROP(kanjiItem.name, kanjiItem.reading, kanjiItem.meaning);
					}
					else{
						var meaning = meaningList[itemNumber].split(", ");
						var reading = readingList[itemNumber].split(", ");
						droplet4 = new RAINDROP(kanjiList[itemNumber], reading, meaning);
					}
					if(readingOrMeaning === 0){
						droplet4.dropType = "reading";
					}
					else{
						droplet4.dropType = "meaning";
					}
					droplet4.whichDrop = 4;
					$("#drop4").css({"top":"0px", "bottom":"50px"}).show()
					if(droplet4.dropType === "reading"){
						var whichIndex = Math.floor(Math.random()*(droplet4.reading.length));
						$("#drop4").text(droplet4.reading[whichIndex]);
						$("#drop4").css("font-size","1.5em");
					}
					else if(droplet4.dropType === "meaning"){
						var whichIndex = Math.floor(Math.random()*(droplet4.meaning.length));
						$("#drop4").text(droplet4.meaning[whichIndex]);
						$("#drop4").css("font-size","1.25em");
					}
					else{}
					var dropBG = Math.floor(Math.random()*3);
					$("#drop4").css("background-color", "transparent");
					if(dropBG === 0){
						$("#drop4").css("background-image", "url('drop1.gif')");
					}
					else if(dropBG === 1){
						$("#drop4").css("background-image", "url('drop2.gif')");
					}
					else{
						$("#drop4").css("background-image", "url('drop3.gif')");
					}
					$("#drop4").show("explode", {pieces: 1}, 100);
					dropRain(droplet4);
					break;
				case (droplet5):
					if(chanceIfKanji === 1){
						droplet5 = new RAINDROP(kanjiItem.name, kanjiItem.reading, kanjiItem.meaning);
					}
					else{
						var meaning = meaningList[itemNumber].split(", ");
						var reading = readingList[itemNumber].split(", ");
						droplet5 = new RAINDROP(kanjiList[itemNumber], reading, meaning);
					}
					if(readingOrMeaning === 0){
						droplet5.dropType = "reading";
					}
					else{
							droplet5.dropType = "meaning";
					}
					droplet5.whichDrop = 5;
					$("#drop5").css({"top":"0px", "bottom":"50px"}).show()
					if(droplet5.dropType === "reading"){
						var whichIndex = Math.floor(Math.random()*(droplet5.reading.length));
						$("#drop5").text(droplet5.reading[whichIndex]);
						$("#drop5").css("font-size","1.5em");
					}
					else if(droplet5.dropType === "meaning"){
						var whichIndex = Math.floor(Math.random()*(droplet5.meaning.length));
						$("#drop5").text(droplet5.meaning[whichIndex]);
						$("#drop5").css("font-size","1.25em");
					}
					else{}
					var dropBG = Math.floor(Math.random()*3);
					$("#drop5").css("background-color", "transparent");
					if(dropBG === 0){
						$("#drop5").css("background-image", "url('drop1.gif')");
					}
					else if(dropBG === 1){
						$("#drop5").css("background-image", "url('drop2.gif')");
					}
					else{
						$("#drop5").css("background-image", "url('drop3.gif')");
					}
					$("#drop5").show("explode", {pieces: 1}, 100);
					dropRain(droplet5);
					break;
				default:
					break;
			}
		}
	}
	//Destroy raindrops
	function destroyRain(drop){
		switch (drop.whichDrop){
			case (droplet1.whichDrop):
				droplet1 = 1;
				clearInterval(dropTimer1);
				$("#drop1").hide("explode", {pieces: 30}, 100).css({"top":"0px","bottom":"50px"});
				if(!gameOver){
					generateRain(droplet1)
				}
				break;
			case (droplet2.whichDrop):
				droplet2 = 2;
				clearInterval(dropTimer2);
				$("#drop2").hide("explode", {pieces: 30}, 100).css({"top":"0px","bottom":"50px"});
				if(!gameOver){
					generateRain(droplet2)
				}
				break;
			case (droplet3.whichDrop):
				droplet3 = 3;
				clearInterval(dropTimer3);
				$("#drop3").hide("explode", {pieces: 30}, 100).css({"top":"0px","bottom":"50px"});
				if(!gameOver){
					generateRain(droplet3)
				}
				break;
			case (droplet4.whichDrop):
				droplet4 = 4;
				clearInterval(dropTimer4);
				$("#drop4").hide("explode", {pieces: 30}, 100).css({"top":"0px","bottom":"50px"});
				if(!gameOver){
					generateRain(droplet4)
				}
				break;
			case (droplet5.whichDrop):
				droplet5 = 5;
				clearInterval(dropTimer5);
				$("#drop5").hide("explode", {pieces: 30}, 100).css({"top":"0px","bottom":"50px"});
				if(!gameOver){
					generateRain(droplet5)
				}
				break;
			default:
				break;
		}
		var dropPlop = $("#dropSplode")[0];
		dropPlop.play();
	}
	//Change Lunch item, call gen raindrop(all)
	function setNewMeal(){
		if(gameOver === false){
			kanjiItem = null;
			var newKanjiIndex = Math.floor(Math.random()*kanjiList.length);
			var meaning = meaningList[newKanjiIndex].split(", ");
			var reading = readingList[newKanjiIndex].split(", ");
			kanjiItem = new KANJIITEM(kanjiList[newKanjiIndex], reading, meaning);
			$("#kanji").text(kanjiItem.name);
			if(newGame === false){
				//TO DO DISPLAY A POP-UP INDICATOR OF NEW ITEM
				if((ingredientsFound[0] === false) || (ingredientsFound[1] === false)){
					setHP("ouch");
				}
				else if((ingredientsFound[0] === true) && (ingredientsFound[1] === true)){
					setHP("yay");
					gameLvl++;
					if(gameLvl%2 === 0){
						gameLvl = 1;
						//speed++;
						speed += (0.15);
					}
				}
				else{
					setHP("huh");
				}
				ingredientsFound = [false,false];
				$("#rItem").removeClass("yItem").addClass("nItem");
				$("#readingItem").css("background-image","none");
				$("#readingItem").css("margin-top","0px");
				$("#readingItem").text("O");
				$("#mItem").removeClass("yItem").addClass("nItem");
				$("#meaningItem").css("background-image","none");
				$("#meaningItem").css("margin-top","0px");
				$("#meaningItem").text("O");
				var aNewKanji = $("#newKanji")[0];
				aNewKanji.play();
				newKanjiWarn();
			}
			else if(newGame === true){
				setHP("huh");
				ingredientsFound = [false,false];
				$("#rItem").removeClass("yItem").addClass("nItem");
				$("#readingItem").css("background-image","none");
				$("#readingItem").css("margin-top","0px");
				$("#readingItem").text("O");
				$("#mItem").removeClass("yItem").addClass("nItem");
				$("#meaningItem").css("background-image","none");
				$("#meaningItem").css("margin-top","0px");
				$("#meaningItem").text("O");
			}
			else{}
			newGame = false;
		}
	}
	//Announcement of New Kanji!
	function newKanjiWarn(){
		$("#annKanji").text(kanjiItem.name);
		$("#announcement").show(300).delay(150).effect("shake").delay(150).hide(300);
	}
	//Check Matches, call streaks
	function checkForMatches(drop){
		if(gameOver === false){
			switch (drop.whichDrop){
				case (droplet1.whichDrop):
					if(droplet1.name === kanjiItem.name || ((droplet1.dropType === "reading") &&( kanjiItem.reading .indexOf($("#drop1").text())>=0))){
						setStreaks(true, droplet1);
						var eatIt = $("#eat")[0];
						eatIt.play();
						$("#drop1").css("background-color","#00ff44");
					}
					else{
						setStreaks(false, droplet1);
						var pukeIt = $("#puke")[0];
						pukeIt.play();
						$("#drop1").css("background-color","#ff0044");
					}
					break;
				case (droplet2.whichDrop):
					if(droplet2.name === kanjiItem.name || ((droplet2.dropType === "reading") &&( kanjiItem.reading .indexOf($("#drop2").text())>=0))
){
						setStreaks(true, droplet2);
						var eatIt = $("#eat")[0];
						eatIt.play();
						$("#drop2").css("background-color","#00ff44");
					}
					else{
						setStreaks(false, droplet2);
						var pukeIt = $("#puke")[0];
						pukeIt.play();
						$("#drop2").css("background-color","#ff0044");
					}
					break;
				case (droplet3.whichDrop):
					if(droplet3.name === kanjiItem.name || ((droplet3.dropType === "reading") &&( kanjiItem.reading .indexOf($("#drop3").text())>=0))
){
						setStreaks(true, droplet3);
						var eatIt = $("#eat")[0];
						eatIt.play();
						$("#drop3").css("background-color","#00ff44");
					}
					else{
						setStreaks(false, droplet3);
						var pukeIt = $("#puke")[0];
						pukeIt.play();
						$("#drop3").css("background-color","#ff0044");
					}
					break;
				case (droplet4.whichDrop):
					if(droplet4.name === kanjiItem.name || ((droplet4.dropType === "reading") &&( kanjiItem.reading .indexOf($("#drop4").text())>=0))
){
						setStreaks(true, droplet4);
						var eatIt = $("#eat")[0];
						eatIt.play();
						$("#drop4").css("background-color","#00ff44");
					}
					else{
						setStreaks(false, droplet4);
						var pukeIt = $("#puke")[0];
						pukeIt.play();
						$("#drop4").css("background-color","#ff0044");
					}
					break;
				case (droplet5.whichDrop):
					if(droplet5.name === kanjiItem.name || ((droplet5.dropType === "reading") &&( kanjiItem.reading .indexOf($("#drop5").text())>=0))
){
						setStreaks(true, droplet5);
						var eatIt = $("#eat")[0];
						eatIt.play();
						$("#drop5").css("background-color","#00ff44");
					}
					else{
						setStreaks(false, droplet5);
						var pukeIt = $("#puke")[0];
						pukeIt.play();
						$("#drop5").css("background-color","#ff0044");
					}
					break;
				default:
					break;
			}
		}
	}
	//Set good or bad Streaks, call hpset
	function setStreaks(aMatch, drop){
		if(gameOver === false){
			if (aMatch === true){
				//ANIMATE WK SAMA
				setWakaBabbySprites(lastDirection, 3);
				checkFoundIngredients(drop);
				goodStreak++;
				if (goodStreak > bestStreakCount){
					bestStreakCount = goodStreak;
					$("#theBestStreak").animate({"color":"#00ff00","font-size":"3.25em"},100).text(bestStreakCount).animate({"color":"#000000","font-size":"3em"},100);
				}
				if((goodStreak%7)===0){
					setHP("yay");
				}

				$("#theCurrentStreak").animate({"color":"#00ff00","font-size":"3.25em"},100).text(goodStreak).animate({"color":"#000000","font-size":"3em"},100).delay(500).queue(
					function(next){
						setWakaBabbySprites(lastDirection, 1);
						next();
					}
				);
			}
			if (aMatch === false){
				//ANIMATE WK SAMA
				setWakaBabbySprites(lastDirection, 4);
				allergenList.push(kanjiItem.name);
				badStreak++;
				goodStreak = 0;
				if(badStreak >= 5){
					setHP("ouch");
					badStreak = 0;
				}
				$("#theCurrentStreak").animate({"color":"#ff0000","font-size":"3.25em"},100).text(goodStreak).animate({"color":"#000000","font-size":"3em"},100).delay(1000).queue(
					function(next){
						setWakaBabbySprites(lastDirection, 1);
						next();
					}
				);
			}
			else{}
		}
	}
	//Set HP
	function setHP(mathType){
		if(gameOver === false){
			if(mathType === "yay"){
				wkHP++;
				var hpSound = $("#hpUp")[0];
				hpSound.play();
				$("#theHP").animate({"color":"#00ff00","font-size":"3.25em"},100).text(wkHP).animate({"color":"#000000","font-size":"3em"},100);
			}
			else if(mathType === "ouch"){
				wkHP--;
				var hpSound = $("#hpDown")[0];
				hpSound.play();
				checkGameOver();
				//TODO 	ANIMATE WK SAMA
				setWakaBabbySprites(lastDirection, 5);
				$("#theHP").animate({"color":"#ff0000","font-size":"3.25em"},100).text(wkHP).animate({"color":"#000000","font-size":"3em"},100).delay(500).queue(
					function(next){
						setWakaBabbySprites(lastDirection, 1);
						next();
					}
				);
			}
			else{
				$("#theHP").text(wkHP);
			}
		}
	}
	//Set Ingredients Found
	function checkFoundIngredients(drop){
		if(gameOver === false){
			if(drop.dropType === "reading"){
				if(ingredientsFound[0] === false){
					ingredientsFound[0] = true;
					eatenReadings.push(drop.reading);
					//TODO MAKE HUD ITEM APPEAR
					$("#rItem").removeClass("nItem").addClass("yItem");
					$("#readingItem").text("");
					$("#readingItem").css("margin-top","50px");
					$("#readingItem").css("background-image","url('reading.gif')");
				}
				else{
					eatenReadings.push(drop.reading);
				}
			}
			else if(drop.dropType === "meaning"){
				if(ingredientsFound[1] === false){
					ingredientsFound[1] = true;
					eatenMeanings.push(drop.meaning);
					//TODO MAKE HUD ITEM APPEAR
					$("#mItem").removeClass("nItem").addClass("yItem");
					$("#meaningItem").text("");
					$("#meaningItem").css("margin-top","50px");
					$("#meaningItem").css("background-image","url('meaning.gif')");
				}
				else{
					eatenMeanings.push(drop.meaning);
				}
			}
			else{}
			if((ingredientsFound[0] === true) && (ingredientsFound[1] === true)){
				eatenKanji.push(drop.name);
			}
		}
	}
	//Check for game Over, go to end screen
	function checkGameOver(){
		if(wkHP <= 0){
			gameOver = true;
			clearInterval(timerClock);
			clearInterval(dropTimer1);
			clearInterval(dropTimer2);
			clearInterval(dropTimer3);
			clearInterval(dropTimer4);
			clearInterval(dropTimer5);
			droplet1 = 1;
			droplet2 = 2;
			droplet3 = 3;
			droplet4 = 4;
			droplet5 = 5;
			showScoreBoard();
		}
		else{
			gameOver = false;
		}
	}


//LOAD GAME BOARDS
	//START GAME
	function startNewGame(){
		$("#tutorialBoard").hide();	//hide and show respective boards
		$("#scoreBoard").hide();
		$("#gameBoard").show();
		$("#drop1").hide();
		$("#drop2").hide();
		$("#drop3").hide();
		$("#drop4").hide();
		$("#drop5").hide();
				//Clear all useable game variables to default start value
		newGame = true;
		gameOver = false;
		time = null;
		timerStarted = false;
		gameLvl = 1;
		speed = 1;
		kanjiItem = null;
		wkHP = 3;
		ingredientsFound= [false,false];
		eatenMeanings = new Array();
		eatenReadings = new Array();
		eatenKanji = new Array();
		allergenList = new Array();
		bestStreakCount = 0;
		goodStreak = 0;
		badStreak = 0;
		$("#theCurrentStreak").text(goodStreak);
		$("#theBestStreak").text(bestStreakCount);
		$("#meaningItem").text("O");
		$("#readingItem").text("O");

				//Call our beloved game 'loop''s functions.
		startTimer();
		setTimeout(function(){generateRain(droplet1);},1);
		setTimeout(function(){generateRain(droplet2);},1500);
		setTimeout(function(){generateRain(droplet3);},3000);
		setTimeout(function(){generateRain(droplet4);},4500);
		setTimeout(function(){generateRain(droplet5);},6000);
		setTimeout(function(){mayPause=true;},6000);
		//setTimeOut(function(){setWakaBabbySprites(lastDirection, 1);},1000);
		checkGameOver();

			//GET SOME PAUSE ACTION IN DIS HURR HIZZY
		$("body").keyup(function(key){
			if(((parseInt(key.which, 10) === 80)||(parseInt(key.which, 10) === 17)||(parseInt(key.which, 10) === 16)) && (mayPause === true)){ //key 80 is P
				if(isPaused === false){
					isPaused = true;
					$("#gameBoard").hide();
					$("#pauseBoard").show();
					clearInterval(timerClock);
					timerStarted = false;
					clearInterval(dropTimer1);
					clearInterval(dropTimer2);
					clearInterval(dropTimer3);
					clearInterval(dropTimer4);
					clearInterval(dropTimer5);
				}	
				else{
					isPaused = false;
					$("#pauseBoard").hide();
					$("#gameBoard").show();
					timerClock = setInterval(passTime, 1000);
					timerStarted = true;
					dropRain(droplet1);
					dropRain(droplet2);
					dropRain(droplet3);
					dropRain(droplet4);
					dropRain(droplet5);
					//setTimeOut(function(){setWakaBabbySprites(lastDirection, 1);},1000);
				}
			}
		});	
	}



	//Start Screen  && API
	function startScreen(){   
		$("#apiText").focus(); 		//Focus on textbox
		$("#apiButton").click(function(){		//if press enter button
			//TODO	Edit button animation properties
			$("#apiButton").animate({'background-color':'#ffcc99', 'border-color':'#663300', 'color':'#663300', 'margin-top':'5px'}, 75).animate({'background-color':'#bbbbff', 'border-color':'#4444ff', 'color':'#4444ff', 'margin-top':'0px'}, 50);
			apiKey = $("#apiText").val(); 		//define apiKey value
			if(apiKey === ""){
				$("#apiText").attr("placeholder", "Forgot to enter API key.");
				$("#apiText").focus();
			}
			else{
				$("#apiText").blur().val("ONE MOMENT, PLEASE~");
				collectAPIData("http://www.wanikani.com/api/v1.1/user/" + apiKey + "/kanji/");
			}
		});
		$("#apiText").keypress(function(key){
			if(parseInt(key.which,10)===13){
				key.preventDefault();
				//TODO	Edit button animation properties
				$("#apiButton").animate({'background-color':'#ffcc99', 'border-color':'#663300', 'color':'#663300', 'margin-top':'5px'}, 75).animate({'background-color':'#bbbbff', 'border-color':'#4444ff', 'color':'#4444ff', 'margin-top':'0px'}, 50);
				apiKey = $("#apiText").val(); //records input
				if(apiKey === ""){
					$("#apiText").attr("placeholder", "Forgot to enter API key.");
					$("#apiText").focus();
				}
				else{
					$("#apiText").blur().val("ONE MOMENT, PLEASE~");
						collectAPIData("http://www.wanikani.com/api/v1.1/user/" + apiKey + "/kanji/");
						}
			}
		});	
	}

	//function to collect API. if success, start game or scold invalid key, if not, explain why
	function collectAPIData(URL){
		$.ajax({
			'type': "GET",
			'url': URL,
			'dataType': 'jsonp',
			'success': function(data){
				if(data.hasOwnProperty("error")){ 	//API key is not legitimate
					//Scold player for being a liar
					alert("Looks like you forgot your good API key \n in your other pant's pocket. \n Go get that so we can go picinic with Wanikani.");
					$("#apiText").val("").focus();
				}
				else{ 	//API key is legitimate
					playerName = data.user_information.username;	//set Player Name to username
					if(data.requested_information.hasOwnProperty("general")){ 
						for(var i = 0; i<data.requested_information.general.length; i++){
							if(data.requested_information.general[i].stats != null){
								//fill kanji, meaning, levels
								kanjiList.push(data.requested_information.general[i].character);
								meaningList.push(data.requested_information.general[i].meaning);
								//fill reading based on most important reading
								if(data.requested_information.general[i].important_reading === "onyomi"){
									readingList.push(data.requested_information.general[i].onyomi);
								}
								else if(data.requested_information.general[i].important_reading === "kunyomi"){
									readingList.push(data.requested_information.general[i].kunyomi);
								}
								else{}
							}
							else{}
						}
					}
					else{
						for(var i = 0; i<data.requested_information.length; i++){
							if(data.requested_information[i].stats != null){
								//fill kanji, meaning, levels
								kanjiList.push(data.requested_information[i].character);
								meaningList.push(data.requested_information[i].meaning);
								//fill reading based on most important reading
								if(data.requested_information[i].important_reading === "onyomi"){
									readingList.push(data.requested_information[i].onyomi);
								}
								else if(data.requested_information[i].important_reading === "kunyomi"){
									readingList.push(data.requested_information[i].kunyomi);
								}
								else{}
							}
							else{}
						}
					}
					$("#apiForm").val("Welcome to the PICINIC.");
					if(autoPlayOrBeingGay === false){
						setCookie("ShokuRain API Key", apiKey , 7);
						alert("Your API key works! \n Lets go have lunch with Wanikani!");
					}
					else{
						$("body").css("background-color","#000000");
						$("#loading1").remove();	
					}
					//TODO     PLAY GAME FUNCTION
					startNewGame();
				}
			},
			'error': function(){
				var answer = Math.floor(Math.random()*4);
				switch (answer) {
					case 0:
						alert("The server is out to lunch.");
						break;
					case 1:
						alert("Everyone at Tofugu quit \n and burnt down the server.");
						break;
					case 2:
						alert("I'm holding the server hostage \n for a 1 million dong ransom.");
						break;
					case 3:
						alert("The server wanted me to tell you that \n it wants to see other people...");
						break;
					default:
						break;
				}
			}
		});
	}


	//SCORES
	function showScoreBoard(){
		$("#tutorialBoard").hide();
		$("#gameBoard").hide();
		$("#scoreBoard").show();
		var results = calcScores();
		//add to existing contents, etc:  username + gameover, you ate this stuff, you liked, you allergic
		$("#gameOverAnnouncement").append( playerName + ", ごちそうさまでした!");
		if(results[0]>0){
			var gameOverSound = $("#overGood")[0];
			gameOverSound.play();
			$("#scoreBoard").css("background-image","url('end_good.jpg')");
			$("#streakInfo").append("Wakababby-san really liked all that delicious kanji!<BR><BR>In fact, one time he ate <br><span><strong>" + results[0] + "</strong></span> in a row without getting full or sick~");
		}
		else{
			var gameOverSound = $("#overBad")[0];
			gameOverSound.play();
			$("#scoreBoard").css("background-image","url('end_bad.jpg')");
			$("#streakInfo").append("Wakababby-san had a terrible picinic! <BR><BR>In fact, he couldn't stomach <br><span><strong>ANY</strong></span> kanji ingredients without getting full or sick~");
		}
		$("#resultsWhole").append("<span><strong>" + results[1] + "</strong></span> Whole kanji meals,");
		$("#resultsRead").append("<span><strong>" + results[2] + "</strong></span> Reading");
			if(results[2] == 1){
				$("#resultsRead").append(",");
			}
			else{$("#resultsRead").append("s,");}
		$("#resultsMean").append("and <span><strong>" + results[3] + "</strong></span> Meaning");
			if(results[3] == 1){
				$("#resultsMean").append("!");
			}
			else{$("#resultsMean").append("s!");}
		if(results[4] === "NONE"){
			$("#loveSnacks").append("He didn't particularly like any snacks");
		}
		else{
			 $("#loveSnacks").append("His favourite snack was <span><strong>" +results[4] + "</strong></span>.");

		}
		if(results[5] == "NONE"){
			$("#hateSnacks").append("He seems to love all snacks,<br> and has no allergies that need learning!");
		}
		else{
			$("#hateSnacks").append("He found he was allergic to <span><strong>" + results[5] + "</strong></span> though.<br>We need to learn more about this allergen.");
		}
		//If you click the button
		$("#replayButton").click(function(){
			$("#replayButton").animate({'background-color':'#ffcc99', 'border-color':'#663300', 'color':'#663300', 'margin-top':'40px'}, 25).animate({'background-color':'#ffeebb', 'border-color':'#554444', 'color':'#554444', 'margin-top':'30px'}, 25).queue(function(next){
				location.assign(thisGameSite); //REFRESHED GAMEPAGE WITH COOKIE LOADED TO AUTO-PLAY. Otherwise you'd be in a terrible loop of ever-quickening kanji drops
				results = null;
				$("#gameOverAnnouncement").text("");
				$("#streakInfo").text("");
				$("#resultsWhole").text("");
				$("#resultsRead").text("");
				$("#resultsMean").text("");
				$("#loveSnacks").text("");
				$("#hateSnacks").text("");
				next();
			});
		});
	}
	//Calculate scoreboard content
	function calcScores(){
		//Records: best streak, eaten Kanji, Reading, Meaning, fav snack, allergen
		var bestStreak = bestStreakCount;
		var eKanji = eatenKanji.length;
		var eReading = eatenReadings.length;
		var eMeaning = eatenMeanings.length;
		var favSnack = new Array();
		var allergen = new Array();
		var item1Count = 0;
		var item2Count = 0;
		for(var i = 0; i < eatenKanji.length; i++){
			for(var j = 0; j < eatenKanji.length; j++){
				if(eatenKanji[j] === eatenKanji[i]){
					item1Count++;
				}
				else{}
			}
			if(item1Count > item2Count){
				favSnack = null;
				favSnack = new Array();
				favSnack.push(eatenKanji[i]);
				item2Count = item1Count;
				item1Count = 0;
			}
			else if(item1Count === item2Count){
				var isRepeated = false;
				var escape = 0;
				while((escape < favSnack.length) && (isRepeated === false)){;
					if(favSnack[escape] === eatenKanji[i]){
						isRepeated = true;
					}
					else if(favSnack[escape] !== eatenKanji[i]){
						isRepeated = false;
					} else{}
					escape++;
				}
				if(isRepeated === false){
					favSnack.push(eatenKanji[i]);
					item2Count = item1Count;
				}
				item1Count = 0;
			}
			else{
				item1Count = 0;
			}
		}
		item1Count = 0;
		item2Count = 0;
		for(var i = 0; i < allergenList.length; i++){
			for(var j = 0; j < allergenList.length; j++){
				if(allergenList[j] === allergenList[i]){
					item1Count++;
				}
				else{}
			}
			if(item1Count > item2Count){
				allergen = null;
				allergen = new Array();
				allergen.push(allergenList[i]);
				item2Count = item1Count;
				item1Count = 0;
			}
			else if(item1Count === item2Count){
				var isRepeated = false;
				var escape = 0;
				while((escape < allergen.length) && (isRepeated === false)){;
					if(allergen[escape] === allergenList[i]){
						isRepeated = true;
					}
					else if(allergen[escape] !== allergenList[i]){
						isRepeated = false;
					} else{}
					escape++;
				}
				if(isRepeated === false){
					allergen.push(allergenList[i]);
					item2Count = item1Count;
				}
				item1Count = 0;
			}
			else{
				item1Count = 0;
			}
		}
		if(favSnack.length <= 0){
			return [bestStreak, eKanji, eReading, eMeaning, "NONE", allergen];
		}
		else if(allergen.length <= 0){
			return [bestStreak, eKanji, eReading, eMeaning, favSnack, "NONE"];
		}
		else{
			return [bestStreak, eKanji, eReading, eMeaning, favSnack, allergen];
		}
	}




	//CALLED WHEN SUBMITTING API, to save api key
	function setCookie(cookieName, cookieValue, expirationDays){
		var expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + expirationDays);
		var cValue=escape(cookieValue) + ((expirationDays==null) ? "" : "; expires="+expirationDate.toUTCString());
		var theNewCookie= cookieName + "=" + cValue;
		document.cookie = theNewCookie;
	}
	//CALLED WHEN OPENING PAGE, to find saved api key
	function checkCookie(){
		var apiKey = getCookie("ShokuRain API Key");
		if((apiKey != null) && (apiKey  != "")){
			return apiKey;
		}
		else{
			return false;	
		}
	}
	//CALLED WHEN COOKIES FOUND, to auto submit api key
	function getCookie(cookieName){
		var cookieValue = document.cookie;
		var cookieStart = cookieValue.indexOf(" " + cookieName + "=");
		if(cookieStart == -1){
			cookieStart = cookieValue.indexOf(cookieName + "=");
		}
		if(cookieStart == -1){
			cookieValue = null;
		}
		else{
			cookieStart = cookieValue.indexOf("=", cookieStart) + 1;
			var cookieEnd = cookieValue.indexOf(";", cookieStart);
			if(cookieEnd == -1){
				cookieEnd = cookieValue.length;
			}
			cookieValue = unescape(cookieValue.substring(cookieStart, cookieEnd));
		}
		return cookieValue;
	}

	function preGameCheck(){
		if(autoPlayOrBeingGay === false){
			startScreen();
		}
		else{
			$("#tutorialBoard").hide();
			$("body").css("background-color","#ffffff");
			$("body").append("<center><div id='loading1' style='margin-top: 200px;'><div id='loading'></div><p>Loading~</p><BR><BR><p>Blame Wanikani's inefficient get-ability</p></div></center>");
			$("#loading").css("background-image","url('loading.gif')");
			$("#loading").css({"width":"100px" , "height":"25px"});
			collectAPIData("http://www.wanikani.com/api/v1.1/user/" + autoPlayOrBeingGay + "/kanji/");
		}
	}

	//Check if Firefox. The only Browser this doesn't seem to work on.
	var isFirefox = typeof InstallTrigger !== 'undefined';
	if(isFirefox === true){
		$("#tutorialBoard").hide();
		$("body").append("<p>Good job, Firefox using hipster! <BR> You use the only browser that can't seem to function with this application.<BR><BR> Seriously, even Opera and Safari can work with it, and you know what? So can IE, as WELL.<BR> Now do yourself a favor and download Chrome like the other +-50% of the internet users</p>");
		$("body").append("<p>Serious, +-50% of internet users are Chroming it up: <a href='http://www.w3schools.com/browsers/browsers_stats.asp'>the Statistics are Here.</a></p>");
	}
	else{
		var autoPlayOrBeingGay = checkCookie();
		preGameCheck();
	}
});