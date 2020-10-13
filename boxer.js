let video;
let poseNet;
let pose;
let skeleton;
let timer = 60;

let bubbles = [];
let items = ['red','blue','green','yellow'];
let leye,reye,leyeball,reyeball, nose, lear, rear, head, lshoulder, rshoulder, lelbow, relbow, lwrist, rwrist, bbox_L, bbox_R;

let bbox_Rx = 0;
let bbox_Ry = 0;
let bbox_Lx = 0;
let bbox_Ly = 0;

let moveL = 0;
let moveR = 0;

let screen = 0;
let score = 0;
let combo_L = 200;
let combo_R = 200;
let punch_count = 0;

let pow_l = 0;
let pow_r = 0;

let powtext_L, powtextR;

var punch = document.getElementById("punch");
var hey = document.getElementById("hey");


function setup() {
  let cnv = createCanvas(640, 380);
  cnv.position(450, 150);

  background(256);
  //frameRate(10);
  video = createCapture(VIDEO);
  video.hide();

  bbox_Rx = width-100;
  bbox_Ry = 200;
  bbox_Lx = width-550;
  bbox_Ly = 200;

  const options = {
    flipHorizontal: true,
    minConfidence: 0.8
  }


  head = new PandaBodyPart(0,0,150,150,'white');
  leye = new PandaBodyPart(0,0,30,30,'whitek');
  reye = new PandaBodyPart(0,0,30,30,'white');
  leyeball = new PandaBodyPart(0,0,10,10,'black');
  reyeball = new PandaBodyPart(0,0,10,10,'black');
  lear = new PandaBodyPart(0,0,15,15,'red');
  rear = new PandaBodyPart(0,0,15,15,'red');
  //nose = new PandaBodyPart(0,0,15,15,'black');



  for (let i = 0; i < 1; i++) {
    let x = width-100;
    let y = random(height-10, height-400);
    let r = 25;
    let b = new Bubble(x, y, r, 'green');
    bubbles.push(b);
  }

  for (let i = 0; i < 1; i++) {
    let x = width-550;
    let y = random(height-10, height-400);
    let r = 25;
    let b = new Bubble(x, y, r, 'green');
    bubbles.push(b);
  }


  bbox_L = new Bubble(bbox_Lx, bbox_Ly, 60, 'white');
  bbox_R = new Bubble(bbox_Rx, bbox_Ry, 60, 'white');

  powtext_L = new boomText(0, 0,0,'red');
  powtext_R = new boomText(0, 0,0,'red');

  poseNet = ml5.poseNet(video, options, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {

  hey.play();

  if (screen == 0) {

		background(255)
    fill(0)
    textAlign(CENTER);
    textFont('Georgia')
    textSize(50);
    text('Lockdown Boxer', width / 2, height/8)

    
    if (pose) {
      let d = 50;
      fill(0);
      ellipse(pose.nose.x-d,pose.nose.y-d,80,80); // left ear
      ellipse(pose.nose.x+d,pose.nose.y-d,80,80); // right ear
      head.move(pose.nose.x, pose.nose.y); head.display();
      head.resize(d*3,d*3);
      leye.move(pose.nose.x-d/2, pose.nose.y-d/2); leye.display();
      reye.move(pose.nose.x+d/2, pose.nose.y-d/2); reye.display();
      leyeball.move(pose.nose.x-d/2, pose.nose.y-d/2); leyeball.display();
      reyeball.move(pose.nose.x+d/2, pose.nose.y-d/2); reyeball.display();
      ellipse(pose.nose.x, pose.nose.y+20,d,d/2); // nose
      fill(0);
      stroke(0);
      curve(pose.rightEar.x, pose.rightEar.y,pose.nose.x-d/2, pose.nose.y+d,pose.nose.x+d/2, pose.nose.y+d,pose.leftEar.x, pose.leftEar.y);

      bbox_L.show();
      bbox_R.show();

      fill(0); textSize(20); strokeWeight(1);
      text('Please stand infront of the camera in a well lighted environment', width / 2, height - 80);
      fill('red'); textSize(40); strokeWeight(1);
      text('click to start', width / 2, height - 40);

    }
    else{
    textSize(20);strokeWeight(1);
    text('This game works by tracking your movements utilizing the camera',width / 2, height/2);  
    text('Please allow access to the webcam to use this application', width / 2, height/2 - 20);
    text('Refresh the page to start again and allow to use the camera', width / 2, height/2 + 20);
    }
        

  }
  else if (screen == 1) {

    background(256);
    fill('red');
    strokeWeight(1);
    textAlign(CENTER);
    textSize(20);
    text(timer, 550,30);
    fill('black');
    textSize(40);
    text("score = " + score, 300, 30);

    //push();
    //translate(video.width, 0);
    //scale(-1, 1);

    //image(video, 0, 0);

          
    bbox_L.show();
    bbox_R.show();
    

    fill('yellow');

    if (pose) {
      let eyeR = pose.rightEye;
      let eyeL = pose.leftEye;
      let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
      d = 50;
      
      fill(0);
      ellipse(pose.nose.x-d,pose.nose.y-d,80,80); // left ear
      ellipse(pose.nose.x+d,pose.nose.y-d,80,80); // right ear

      fill(0); stroke(0);
      ellipse(pose.nose.x-d,pose.nose.y+d*3,d*4,d*4); //left shoulder
      ellipse(pose.nose.x+d,pose.nose.y+d*3,d*4,d*4); //right shoulder

      fill(255); stroke(0);
      ellipse(pose.nose.x, pose.nose.y+d*4,d*5,d*5); //body


      head.move(pose.nose.x, pose.nose.y); head.display();
      head.resize(d*3,d*3);

      leye.move(pose.nose.x-d/2, pose.nose.y-d/2); leye.display();
      reye.move(pose.nose.x+d/2, pose.nose.y-d/2); reye.display();

      leyeball.move(pose.nose.x-d/2, pose.nose.y-d/2); leyeball.display();
      reyeball.move(pose.nose.x+d/2, pose.nose.y-d/2); reyeball.display();

      //nose.move(pose.nose.x, pose.nose.y); nose.display();
      ellipse(pose.nose.x, pose.nose.y+20,d,d/2); // nose

      //lear.move(pose.rightEar.x, pose.rightEar.y); lear.display();
      //rear.move(pose.leftEar.x, pose.leftEar.y); rear.display();
      fill(0);
      stroke(0);
      curve(pose.rightEar.x, pose.rightEar.y,pose.nose.x-d/2, pose.nose.y+d,pose.nose.x+d/2, pose.nose.y+d,pose.leftEar.x, pose.leftEar.y);

      bbox_L.changeColor(combo_L);
      bbox_R.changeColor(combo_R);


      if(pose.rightWrist.y > pose.rightShoulder.y){
        moveL = 0;
      }
      if(pose.leftWrist.y > pose.leftShoulder.y){
        moveR = 0;
      }


      for (let i = 0; i < bubbles.length; i++) {


        if (bbox_L.contains(bubbles[i].x, bubbles[i].y)) {  // N.B pose track is the mirror image

            if(pose.rightWrist.y < pose.nose.y && moveL == 0){
              //console.log("Left punch...");
              bbox_L.changeColor('red');
              combo_L -= 10;
              moveL = 1;

              bubbles[i].changePos(bubbles[i].x,random(550,700));
              score += 10;
              pow_l = 60;
              powtext_L.move(bbox_L.x, bbox_L.y-80);
              powtext_L.resize(pow_l); powtext_L.display();
              punch.play();
              punch_count += 1;
            }
        } 
        
        if (bbox_R.contains(bubbles[i].x, bubbles[i].y)) {    // N.B pose track is the mirror image
          
          if(pose.leftWrist.y < pose.nose.y && moveR == 0){
            //console.log("Right punch...");
            bbox_R.changeColor('red');
            combo_R -= 10;
            moveR = 1;

            bubbles[i].changePos(bubbles[i].x,random(550,700));
            score += 10;
            pow_r = 60;
            powtext_R.move(bbox_R.x, bbox_R.y-80);
            powtext_R.resize(pow_r); powtext_R.display();
            punch.play();
            punch_count += 1;
          }

        } 

        if(bubbles[i].y < 100 && bubbles[i].y > 95){
          score -= 5;
          combo_L += 5;
          combo_R += 5;

          pow_l = 0;
          pow_r = 0;
        }
        
        if(timer < 60 && timer>55){
          bubbles[i].changeSpeed(2);
        }
        else if (timer<55 && timer>45){
          bubbles[i].changeSpeed(3);
        }
        else if (timer<45 && timer>35){
          bubbles[i].changeSpeed(4);
        }
        else if (timer<35 && timer>25){
          bubbles[i].changeSpeed(5);
        }
        else if (timer<25 && timer>15){
          bubbles[i].changeSpeed(6);
        }
        else if (timer<15 && timer>0){
          bubbles[i].changeSpeed(7);
        }

        pow_l = 0;
        pow_r = 0;;

        bubbles[i].moves();
      }


      bbox_L.show();
      bbox_R.show()

      //console.log("MoveL = " + moveL + " MoveR = " + moveR);
      

    
    }


    if (frameCount % 60 == 0 && timer > 0) { 
      timer --;
    }

    if(timer <= 0){
      screen = 2;
    }
  } 
  else if (screen == 2) {
		
		background(255)
    fill(0)
    textAlign(CENTER);
    textFont('Georgia')
    textSize(50);
    text('Game Over', width / 2, height/8)
    text('Your Score = ' + score, width / 2, height / 2);
    text('Total punches = ' + punch_count, width / 2, height - 130);
    fill('red');
		text('click to play again', width / 2, height - 60);
    
    //score = 0;
	}
}



function randomNumber(min, max) {  
  min = Math.ceil(min); 
  max = Math.floor(max); 
  return Math.floor(Math.random() * (max - min + 1)) + min; 
} 

function getRandomItem(items) {
  return items[Math.floor(Math.random()*items.length)];
}


class PandaBodyPart {
  constructor(x,y,d,h,col) {
    this.x = x;
    this.y = y;
    this.diameter = d;
    this.height = h;
    this.color = col;
  }

  display() {
    stroke(0);
    strokeWeight(4);
    fill(this.color);
    ellipse(this.x, this.y, this.diameter);
  }

  resize(newD,newH){
    this.diameter = newD;
    this.diameter = newH;
  }

  move(newX,newY){
    this.x = newX;
    this.y = newY;
  }
}



class boomText {
  constructor(x,y,s,col) {
    this.x = x;
    this.y = y;
    this.size = s;
    this.color = col;
  }

  display() {
    stroke(0);
    strokeWeight(1);
    fill(this.color);
    text('pow', this.x, this.y);
  }

  resize(newS){
    this.size = newS;
    textSize(this.size);
  }

  move(newX,newY){
    this.x = newX;
    this.y = newY;
  }
}





class Bubble {
  constructor(x, y, r, col) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.speed = 3;
    this.brightness = 0;
    this.col = col;
  }

  changeColor(newCol) {
    this.col = newCol;
  }

  changePos(newX,newY) {
    this.x = newX;
    this.y = newY;
  }

  changeSpeed(newSpeed) {
    this.speed = newSpeed;
  }


  contains(px, py) {
    let d = dist(px, py, this.x, this.y);
    if (d < this.r) {
      return true;
    } else {
      return false;
    }
  }

  moves() {
    this.x = this.x;

    if(this.y < 0){
      this.col = getRandomItem(items);
      fill(this.col);
      this.y = random(550,700);
      ellipse(this.x, this.y, this.r * 2);
    }
    else {
      fill(this.col);
      this.y = this.y - this.speed;
      ellipse(this.x, this.y, this.r * 2);
    }
    
  }

  show() {
    stroke(0);
    strokeWeight(4);
    fill(this.col);
    ellipse(this.x, this.y, this.r * 2);
  }
}



function mousePressed() {
	if (screen == 0) {
    if (pose) {
      screen = 1;
      score = 0;
      combo_L = 200;
      combo_R = 200;
      punch_count = 0;
    }
	}else	if (screen == 1) {

	} else if (screen == 2) {
    timer = 60;
		screen = 0;
	}
}
