
const db = firebase.database();
const db_ball = db.ref("ball");

let url_string = window.location.href;
let url = new URL(url_string);
let myUser = url.searchParams.get("player");

function updateDatabaseMyUser() {
    db_myUser.set({
        y: myPaddle.y,
        h: myPaddle.h
    });
}

function updateDatabaseBall() {
    db_ball.set({
        x: ball.x,
        y: ball.y
    });
}

function updateOtherUser(snapshot) {
    let data = snapshot.val();
    otherPaddle.y = data.y;
    otherPaddle.h = data.h
}

function updateBall(snapshot) {
    let data = snapshot.val();
    ball.x = data.x;
    ball.y = data.y;
}

class Paddle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 20;
        this.h = 200;
    }

    draw(){
        fill(255);
        rect(this.x, this.y, this.w, this.h);
    }

    move(){
        if(keyIsDown(UP_ARROW) && this.y > 0){
            this.y -= 10;
            updateDatabaseMyUser();
        }
        else if(keyIsDown(DOWN_ARROW) && this.y < height - this.h){
            this.y += 10;
            updateDatabaseMyUser();
        }
    }
}


class Ball {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;

        this.ySpeed = 5;
        this.xSpeed = 5;
    }

    draw(){
        fill(255);
        ellipse(this.x, this.y, this.r, this.r);
    }

    move(){
        if(this.x < 0 || this.x > width){
            this.x = floor(width/2);
            this.y = floor(height/2);
        }


        if(this.y > 0 && this.y < height){
            this.x += this.xSpeed;
            this.y += this.ySpeed;
        }

        else{
            this.ySpeed *= -1;
            this.y += this.ySpeed;
        }
    }
}


function setup() {
    createCanvas(800, 500);

    ball = new Ball(floor(width/2), floor(height/2), 50);

    if(myUser === "paddle1"){
        myPaddle = new Paddle(10, 10);
        otherPaddle = new Paddle(width-30, 10);

        db_myUser = db.ref("paddle1");
        db_otherUser = db.ref("paddle2");
    }
    else if(myUser === "paddle2"){
        myPaddle = new Paddle(width-30, 10);
        otherPaddle = new Paddle(10, 10);

        db_myUser = db.ref("paddle2");
        db_otherUser = db.ref("paddle1");
    }
    else{
        alert("User not recognised");
        throw "User not recognised";
    }

    db_otherUser.on("value", updateOtherUser)
    db_ball.on("value", updateBall)

}

function isCollision(rx, ry, rw, rh, cx, cy, diameter) {

  let testX = cx;
  let testY = cy;

  if (cx < rx){         testX = rx
  }else if (cx > rx+rw){ testX = rx+rw  }

  if (cy < ry){         testY = ry
  }else if (cy > ry+rh){ testY = ry+rh }

  let distance = this.dist(cx,cy,testX,testY)

  if (distance <= diameter/2) {
    return true;
  }
  return false;
};

function draw() {
    background(51);

    ball.draw();
    ball.move();

    myPaddle.draw();
    myPaddle.move();

    otherPaddle.draw();

    if(isCollision(myPaddle.x, myPaddle.y, myPaddle.w, myPaddle.h, ball.x, ball.y, ball.r)){
        ball.xSpeed *= -1;
        ball.x += ball.xSpeed;
    }

    if(isCollision(otherPaddle.x, otherPaddle.y, otherPaddle.w, otherPaddle .h, ball.x, ball.y, ball.r)){
        ball.xSpeed *= -1;
        ball.x += ball.xSpeed;
    }

    if(myUser === "paddle1"){
        updateDatabaseBall();
    }
}



/**/
