/***********************************************************************************
  MoodyMaze
  by Scott Kildall

  Uses the p5.2DAdventure.js class 
  
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.2DAdventure.js"></script>
***********************************************************************************/

// adventure manager global  
var adventureManager;

// p5.play
var playerSprite;
var playerAnimation;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// NPC talking global variables
var talkedToWeirdNPC = false;
var talkedToBearNPC = false;


// indexes into the clickable array (constants)
const playGameIndex = 0;

// Allocate Adventure Manager with states table and interaction tables
function preload() {
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
  animation = loadAnimation('assets/avatars/max_1.png', 'assets/avatars/max_3.png'); 
}

// Setup the adventure manager
function setup() {
  createCanvas(800, 450);

  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  // create a sprite and add the 3 animations
  playerSprite = createSprite(230, 195, 80, 80);

  // every animation needs a descriptor, since we aren't switching animations, this string value doesn't matter

  playerSprite.addAnimation("walk", animation);
  animation.frameDelay = 10;

  // use this to track movement from toom to room in adventureManager.draw()
  adventureManager.setPlayerSprite(playerSprite);

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

    // This will load the images, go through state and interation tables, etc
  adventureManager.setup();

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables(); 
}

// Adventure manager handles it all!
function draw() {
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();

  // No avatar for Splash screen or Instructions screen
  if( adventureManager.getStateName() !== "Start" && 
      adventureManager.getStateName() !== "Instruction" &&
      adventureManager.getStateName() !== "Intro" &&
      adventureManager.getStateName() !== "Trans1" &&
      adventureManager.getStateName() !== "Trans1cont" &&
      adventureManager.getStateName() !== "Trans2" &&
      adventureManager.getStateName() !== "Trans3"  &&
      adventureManager.getStateName() !== "ZoomBreak" &&
      adventureManager.getStateName() !== "ZoomBreak2" &&
      adventureManager.getStateName() !== "ZoomBreak3" &&
      adventureManager.getStateName() !== "ZoomBreak4" &&
      adventureManager.getStateName() !== "Trans4"  &&
      adventureManager.getStateName() !== "Trans5"  &&
      adventureManager.getStateName() !== "Trans6"  &&
      adventureManager.getStateName() !== "ZoomEulogy"  &&
      adventureManager.getStateName() !== "ZoomEulogy2"  &&
      adventureManager.getStateName() !== "End"  &&
      adventureManager.getStateName() !== "End2") {
      
    // responds to keydowns
    moveSprite();

    // this is a function of p5.js, not of this sketch
    drawSprite(playerSprite);
  } 
}

// pass to adventure manager, this do the draw / undraw events
function keyPressed() {
  // toggle fullscreen mode
  if( key === 'f') {
    fs = fullscreen();
    fullscreen(!fs);
    return;
  }

  // dispatch key events for adventure manager to move from state to 
  // state or do special actions - this can be disabled for NPC conversations
  // or text entry   

  // dispatch to elsewhere
  adventureManager.keyPressed(key); 
}

function mouseReleased() {
  adventureManager.mouseReleased();
}

//-------------- YOUR SPRITE MOVEMENT CODE HERE  ---------------//
function moveSprite() {
  //right
  if(keyIsDown(68)) {
    playerSprite.animation.play();
    playerSprite.velocity.x = 8;
    playerSprite.mirrorX(-1);
  }
  //left
  else if(keyIsDown(65)) {
    playerSprite.animation.play();
    playerSprite.velocity.x = -8;
    playerSprite.mirrorX(1);
  }
  else {
    playerSprite.velocity.x = 0;
    playerSprite.animation.stop();
  }
  //down
  if(keyIsDown(83)) {
    playerSprite.animation.play();
    playerSprite.velocity.y = 8;
  }
  //up
  else if(keyIsDown(87)) {
    playerSprite.animation.play();
    playerSprite.velocity.y = -8;
  }
  else {
    playerSprite.velocity.y = 0;
  }

}

//-------------- CLICKABLE CODE  ---------------//

function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    clickables[i].onPress = clickableButtonPressed;
  }
}

// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#AA33AA";
  this.noTint = false;
  this.tint = "#FF0000";
}

// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#AAAAAA";
}

clickableButtonPressed = function() {
  // these clickables are ones that change your state
  // so they route to the adventure manager to do this
  adventureManager.clickablePressed(this.name); 
}

// code to check if NPC was talked to, if false, sets to true
function talkToWeirdy() {
    if (talkedToWeirdNPC === false) {
        print("turning them on");
        talkedToWeirdNPC = true;
        print("talked to weidy");
    }
}

// code to check if NPC was talked to, if false, sets to true
function talkToBear() {
    if (talkedToBearNPC === false) {
        print("turning them on");

        //    // turn on visibility for buttons
        //    for( let i = answer1Index; i <= answer6Index; i++ ) {
        //      clickables[i].visible = true;
        //    }

        talkedToBearNPC = true;
        print("talked to Bear");
    }
}




//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//


// Instructions screen has a backgrounnd image, loaded from the adventureStates table
// It is sublcassed from PNGRoom, which means all the loading, unloading and drawing of that
// class can be used. We call super() to call the super class's function as needed
class GirlsRoom1 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/grace_1.png', 'assets/avatars/grace_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_GirlsRoom1.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/4 + 100, 0);
        }
    }
}

class ParentsRoom1 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 - 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/mom_3.png', 'assets/avatars/mom_3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_ParentsRoom1.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/4 + 100, 50);
        }
    }
}

class Kitchen1 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 - 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/ja_1.png', 'assets/avatars/ja_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_Kitchen1.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/4 + 100, 50);
        }
    }
}

class TVRoom1 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/dad_1.png', 'assets/avatars/dad_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_TVRoom1.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class MaxsRoom1 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 200, height / 2 - 93, 0, 0);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/phone_Phone2.png', 'assets/avatars/phone_Phone3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_MaxsRoom1.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/2 , 50);
        }
    }
}

//
// NEW SET OF INTERACTIONS
//
class GirlsRoom2 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/grace_1.png', 'assets/avatars/grace_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_GirlsRoom2.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/4 + 100, 0);
        }
    }
}

class LivingRoom2 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 2, height / 2 - 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/mom_3.png', 'assets/avatars/mom_3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_LivingRoom2.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/2, 50);
        }
    }
}
class LivingRoom2Done extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 2, height / 2 - 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/mom_3.png', 'assets/avatars/mom_3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_LivingRoom2Done.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/2, 50);
        }
    }
}


class Kitchen2 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 - 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/ja_1.png', 'assets/avatars/ja_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_Kitchen2.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/4 + 100, 50);
        }
    }
}

class TVRoom2 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/dad_1.png', 'assets/avatars/dad_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_TVRoom2.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class MaxsRoom2 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 200, height / 2 - 93, 0, 0);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/phone_Phone2.png', 'assets/avatars/phone_Phone3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_MaxsRoom2.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/2 , 50);
        }
    }
}


//
// NEW SET OF INTERACTIONS
//

class GirlsRoom3 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/grace_1.png', 'assets/avatars/grace_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_GirlsRoom3.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/4 + 100, 0);
        }
    }
}

class ParentsRoom3 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 2, height / 2 - 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/mom_3.png', 'assets/avatars/mom_3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_ParentsRoom3.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/2, 50);
        }
    }
}

class Kitchen3 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 - 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/ja_1.png', 'assets/avatars/ja_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_Kitchen3.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/4 + 100, 50);
        }
    }
}

class TVRoom3 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/dad_1.png', 'assets/avatars/dad_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_TVRoom3.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class MaxsRoom3 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 200, height / 2 - 93, 0, 0);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/phone_Phone2.png', 'assets/avatars/phone_Phone3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_MaxsRoom3.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/2 , 50);
        }
    }
}


//
// NEW SET OF INTERACTIONS
//

class GirlsRoom4 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/grace_1.png', 'assets/avatars/grace_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_GirlsRoom4.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/4 + 100, 0);
        }
    }
}

class ParentsRoom4 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 2, height / 2 - 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/mom_3.png', 'assets/avatars/mom_3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_ParentsRoom4.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/2, 50);
        }
    }
}

class Kitchen4 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 - 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/ja_1.png', 'assets/avatars/ja_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_Kitchen4.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/4 + 100, 50);
        }
    }
}

class MaxsRoom4 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 200, height / 2 - 93, 0, 0);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/phone_Phone2.png', 'assets/avatars/phone_Phone3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_MaxsRoom4.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/2 , 50);
        }
    }
}


//
// NEW SET OF INTERACTIONS
//

class LivingRoom5 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 2, height / 2 - 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/family_family.png', 'assets/avatars/family_family.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_LivingRoom5.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/2, 50);
        }
    }
}

class LivingRoom5Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 2, height / 2 - 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/family_family.png', 'assets/avatars/family_family.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_LivingRoom5Sleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/2, 50);
        }
    }
}


class MaxsRoom5 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 200, height / 2 - 93, 0, 0);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/phone_Phone2.png', 'assets/avatars/phone_Phone3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_MaxsRoom5.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/2 , 50);
        }
    }
}


//
// NEW SET OF INTERACTIONS
//

class GirlsRoom6 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/grace_1.png', 'assets/avatars/grace_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_GirlsRoom6.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/4 + 100, 0);
        }
    }
}

class ParentsRoom6 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 2, height / 2 - 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/mom_3.png', 'assets/avatars/mom_3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_ParentsRoom6.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/2, 50);
        }
    }
}

class Kitchen6 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 - 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/ja_1.png', 'assets/avatars/ja_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_Kitchen6.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/4 + 100, 50);
        }
    }
}

class TVRoom6 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/dad_1.png', 'assets/avatars/dad_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_TVRoom6.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class GirlsRoom6Paint extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/grace_1.png', 'assets/avatars/grace_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_GirlsRoom6.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/4 + 100, 0);
        }
    }
}

class ParentsRoom6Paint extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 2, height / 2 - 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/mom_3.png', 'assets/avatars/mom_3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_ParentsRoom6Paint.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/2, 50);
        }
    }
}

class Kitchen6Paint extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 - 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/ja_1.png', 'assets/avatars/ja_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_Kitchen6Paint.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/4 + 100, 50);
        }
    }
}

class TVRoom6Paint extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/dad_1.png', 'assets/avatars/dad_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_TVRoom6Paint.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class MaxRoom6 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 200, height / 2 - 93, 0, 0);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/phone_Phone2.png', 'assets/avatars/phone_Phone3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_MaxsRoom6.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class MaxsRoom6Painted extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 220, height / 2 + 150, 0, 0);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/phone_Phone2.png', 'assets/avatars/phone_Phone3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_MaxsRoomSleepAfter.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/2 , 50);
        }
    }
}

//
// NEW SET OF INTERACTIONS
//

class GirlsRoom7 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/grace_1.png', 'assets/avatars/grace_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_GirlsRoom7.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/4 + 100, 0);
        }
    }
}

class ParentsRoom7 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 2, height / 2 - 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/mom_3.png', 'assets/avatars/mom_3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_ParentsRoom7.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/2, 50);
        }
    }
}

class Kitchen7 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 - 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/ja_1.png', 'assets/avatars/ja_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_Kitchen7.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/4 + 100, 50);
        }
    }
}

class TVRoom7 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/dad_1.png', 'assets/avatars/dad_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_TVRoom7.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class MaxRoom7 extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 220, height / 2 + 150, 0, 0);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/phone_Phone2.png', 'assets/avatars/phone_Phone3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_MaxsRoom7.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class MaxsRoom7Free extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 200, height / 2 - 93, 0, 0);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/phone_Phone2.png', 'assets/avatars/phone_Phone3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_MaxsRoom7.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, width/2 , 50);
        }
    }
}

//
//
// SLEEP STATES
//
//

class TVRoom1Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/dad_1.png', 'assets/avatars/dad_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_TVRoomSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}
class TVRoom2Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/dad_1.png', 'assets/avatars/dad_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_TVRoomSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class TVRoom3Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/dad_1.png', 'assets/avatars/dad_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_TVRoomSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class TVRoom4Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/dad_1.png', 'assets/avatars/dad_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_TVRoomSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class TVRoom5Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/dad_1.png', 'assets/avatars/dad_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_TVRoomSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class Kitchen1Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/ja_1.png', 'assets/avatars/ja_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_KitchenSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}
class Kitchen2Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/ja_1.png', 'assets/avatars/ja_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_KitchenSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class Kitchen3Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/ja_1.png', 'assets/avatars/ja_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_KitchenSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class Kitchen4Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/ja_1.png', 'assets/avatars/ja_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_KitchenSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class Kitchen5Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/ja_1.png', 'assets/avatars/ja_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_KitchenSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}


class ParentsRoom1Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/mom_3.png', 'assets/avatars/mom_3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_ParentsRoomSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}
class ParentsRoom2Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/mom_3.png', 'assets/avatars/mom_3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_ParentsRoomSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class ParentsRoom3Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/mom_3.png', 'assets/avatars/mom_3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_ParentsRoomSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class ParentsRoom4Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/mom_3.png', 'assets/avatars/mom_3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_ParentsRoomSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class ParentsRoom5Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/mom_3.png', 'assets/avatars/mom_3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_ParentsRoomSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}


class GirlsRoom1Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/grace_1.png', 'assets/avatars/grace_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_GirlsRoomSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}
class GirlsRoom2Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/grace_1.png', 'assets/avatars/grace_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_GirlsRoomSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class GirlsRoom3Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/grace_1.png', 'assets/avatars/grace_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_GirlsRoomSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class GirlsRoom4Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/grace_1.png', 'assets/avatars/grace_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_GirlsRoomSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class GirlsRoom5Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 100, height / 2 + 100, 100, 100);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/grace_1.png', 'assets/avatars/grace_1.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_GirlsRoomSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class MaxsRoom1Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 200, height / 2 - 93, 0, 0);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/phone_Phone2.png', 'assets/avatars/phone_Phone3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_MaxsRoomSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}
class MaxsRoom2Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 200, height / 2 - 93, 0, 0);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/phone_Phone2.png', 'assets/avatars/phone_Phone3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_MaxsRoomSleep.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class MaxsRoom3Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 200, height / 2 - 93, 0, 0);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/phone_Phone2.png', 'assets/avatars/phone_Phone3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_MaxsRoomSleepAfter.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class MaxsRoom4Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 200, height / 2 - 93, 0, 0);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/phone_Phone2.png', 'assets/avatars/phone_Phone3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_MaxsRoomSleepAfter.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

class MaxsRoom5Sleep extends PNGRoom {
    // preload() gets called once upon startup
    // We load ONE animation and create 20 NPCs
    // 
    preload() {
        // this is our image, we will load when we enter the room
        this.talkBubble = null;
        this.talkedToNPC = false; // only draw when we run into it
        talkedToWeirdNPC = false;

        // NPC position
        this.drawX = width / 4 + 100;
        this.drawY = height / 2 - 40;

        // load the animation just one time
        this.NPC1 = createSprite(width / 4 + 200, height / 2 - 93, 0, 0);
        this.NPC1.addAnimation('regular', loadAnimation('assets/avatars/phone_Phone2.png', 'assets/avatars/phone_Phone3.png'));

    }

    load() {
        // pass to superclass
        super.load();

        this.talkBubble = loadImage('assets/chat/bubble_MaxsRoomSleepAfter.png');

        //      // turn off buttons
        //      for( let i = answer1Index; i <= answer6Index; i++ ) {
        //       clickables[i].visible = false;
        //      }
    }

    // clears up memory
    unload() {
        super.unload();

        this.talkBubble = null;
        talkedToWeirdNPC = false;
        print("unloading AHA room");
    }

    // pass draw function to superclass, then draw sprites, then check for overlap
    draw() {
        // PNG room draw
        super.draw();

        // draws all the sprites in the group
        //this.weirdNPCSprite.draw();
        drawSprite(this.NPC1)
        //drawSprite(this.NPC2)
        // draws all the sprites in the group - 
        //drawSprites(this.weirdNPCgroup);//.draw();

        // checks for overlap with ANY sprite in the group, if this happens
        // talk() function gets called
        playerSprite.overlap(this.NPC1, talkToWeirdy);


        if (this.talkBubble !== null && talkedToWeirdNPC === true) {
            image(this.talkBubble, 300, 50);
        }
    }
}

