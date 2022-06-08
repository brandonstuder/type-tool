// no animation by default (move load pixels to setup)
// only checkboxes in anim parameters (except frame rate)
// run smoother (move load pixels to setup / textbounds)
// resolution range (animation parameter)
// blur animation that cycles through blur amt
// multiple lines of text
// different blur animation (bloom/scatter...)
// video / image input
// export frames

let gridArr = [2,6,9,12,16,18]
let grid;
let input;
let font;
let colorMode = "black"
let animate = false;
let sizeSlider;
let strokeSlider;
let gridSlider;
let framerateSlider;
let blurSlider;
let pixelScatter = false;
let shapeSlider;
let freeze = false;
let initialWord;
let invader = false;

function preload (){
  font = loadFont ('Akkurat-Mono.otf')
  initialWord = loadStrings('1000-or-so-words.txt');
  invaderImg = loadImage ('invader.png')
}

function setup() {

  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER,CENTER);
  
  textFont(font);
  
  input = createInput(random(initialWord));
  input.position(20,20);

  sizeSlider = createSlider (50,500,100,.5);
  sizeSlider.position (20, input.y + 80);
  sizeSlider.position (20, input.y + 80);
  sizeSlider.style ('width', '100px');
  
  gridSlider = createSlider (2,18,6,1);
  gridSlider.position (20, sizeSlider.y + 40);
  gridSlider.style ('width', '100px');

  let invbutton = createButton("invert");
  invbutton.position (20, height - 40);
  invbutton.mousePressed(changeBG);

  let invaderbutton = createCheckbox("", false);
  invaderbutton.position (20, invbutton.y -40);
  invaderbutton.mousePressed(showInvader);

  let animbutton = createCheckbox("", false);
  animbutton.position (20, gridSlider.y + 80);
  animbutton.mousePressed(animation);

  blurSlider = createSlider (0,50,0,.125);
  blurSlider.position (20, animbutton.y + 40);
  blurSlider.style ('width', '100px');

  shapeSlider = createSlider(0,1,0,.1)
  shapeSlider.position (20, blurSlider.y + 40);
  shapeSlider.style ('width', '100px');

  framerateSlider = createSlider (.5,15,2,.5);
  framerateSlider.position (20, shapeSlider.y + 40);
  framerateSlider.style ('width', '100px');

  let freezebutton = createCheckbox("", false);
  freezebutton.position (20, framerateSlider.y + 40);
  freezebutton.mousePressed(freezeAnim);
  
}
function showInvader(){
  if (invader === false){
    invader = true;
  } else {
    invader = false;
  }
}

function freezeAnim(){
  if (freeze === false){
    freeze = true;
  } else {
    freeze = false;
  }
}

function changeBG() {
  if (colorMode === "black") {
    colorMode = "white"
  } else {
    colorMode = "black"
  }
}

function animation(){
  if (animate === false){
  animate = true;
  } else {
    animate = false;
  }
} 

function draw() {

  let shapeThresh = shapeSlider.value()

  if (freeze === true){
    randomSeed(0);
    // animbutton.value = false;
  } 
  background(0);
  frameRate (framerateSlider.value())

  if (animate === false){
    grid = gridSlider.value();
  } else{
    grid = random(gridArr)
  }

  let typeSize = sizeSlider.value();
  
  if (invader === false){
  // DRAW WORD
  textSize(typeSize);
  textAlign (CENTER,CENTER);
  fill (255);
  text(input.value(),width/2,height/2);
  } else {
    imageMode(CENTER)
    image(invaderImg, width/2,height/2);
    invaderImg.resize(sizeSlider.value()*3,0)
  }

  // LOAD PIXELS OF WORD
  let points = [];
  loadPixels();
  for (let  y=0; y<height; y+=grid){
    for (let  x=0; x<width; x+=grid){
      let px = get(x,y);
      let sample = px[0];
      if (sample>125){
          points.push(createVector(x,y));
      }
    }
  }  
    
  // BG TO COVER TEXT
  if (colorMode === "black") {
    background(0)
  } else {
    background(255)
   }

  // SLIDER TEXT
  textAlign(LEFT,TOP)
  textSize(12)
  fill(150)
  text ('TEXT PARAMETERS', 20, input.y+50)
  text ('size', 135, sizeSlider.y)
  text ('resolution (hi <--> lo)', 135, gridSlider.y)
  text ('ANIMATION PARAMETERS', 20, gridSlider.y+50)
  text ('animate resolution', 135, gridSlider.y+80)
  text ('blur', 135, blurSlider.y)
  text ('pixel shapes (square <--> circle)', 135, shapeSlider.y)
  text ('frame rate', 135, framerateSlider.y)
  text ('freeze', 135, framerateSlider.y + 40)
  text ('invader', 45, height-78)

  // DRAW SHAPES
  let blurBloom = false
  let bloom = .1
  for(let i =0; i<points.length;i++){
    let x = points[i].x
    let y = points[i].y
    if (blurBloom === false){
    x += random(-blurSlider.value(), blurSlider.value());
    y += random(-blurSlider.value(), blurSlider.value());
    } 
    //   x += random(sin(-frameCount)*100,sin(frameCount)*100);
    //   y += random(sin(-frameCount)*100,sin(frameCount)*100);
    // }
     
    if (colorMode === "black") {
      fill(255);
    } else {
      fill(0);
    }
    if(invader === true){
      fill(57,255,50)
    }
      
    noStroke()

    if (random() < shapeThresh){
      circle(x,y,grid);
    } else {
      rect(x,y,grid);
    } 

    }
}

