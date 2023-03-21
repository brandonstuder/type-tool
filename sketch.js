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
let blurAnimation = false;
let intervalSlider;


function preload (){
  font = loadFont ('Akkurat-Mono.otf')
  initialWord = loadStrings('1000-or-so-words.txt');
  invaderImg = loadImage ('invader.png')
}

function setup() {

  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  
  textBuffer = createGraphics(windowWidth, windowHeight);
  textFont(font);
  textSize(11)
  fill(150)

  input = createInput(random(initialWord));
  input.position(20, 20);
  input.input(inputChanged);

  sizeSlider = createSlider (50,500,100,.5);
  sizeSlider.position (20, input.y + 40);
  sizeSlider.style ('width', '100px');
  sizeSlider.input(inputChanged)

  gridSlider = createSlider (2,18,6,1);
  gridSlider.position(20, sizeSlider.y + 40);
  gridSlider.style ('width', '100px');
  gridSlider.input(inputChanged)
  
  pixelSpacingSlider = createSlider(0, 4.5, 4.5, 0.1);
  pixelSpacingSlider.position(20, gridSlider.y + 40);
  pixelSpacingSlider.style('width', '100px');
  pixelSpacingSlider.input(inputChanged);

  shapeSlider = createSlider(0,1,0,.1)
  shapeSlider.position(20, pixelSpacingSlider.y + 40);
  shapeSlider.style ('width', '100px');
  shapeSlider.input(inputChanged)

  blurSlider = createSlider (0,50,0,1);
  blurSlider.position(20, shapeSlider.y + 40);
  blurSlider.style ('width', '100px');
  blurSlider.input(inputChanged)

  let animbutton = createCheckbox("", false);
  animbutton.position(20, blurSlider.y + 80);
  animbutton.mousePressed(pixelSizeAnimation);
  animbutton.input(inputChanged)

  let blurAnimCheckbox = createCheckbox("", false);
  blurAnimCheckbox.position(20, animbutton.y + 40);
  blurAnimCheckbox.mousePressed(toggleBlurAnimation);

  framerateSlider = createSlider (.5,15,2,.5);
  framerateSlider.position(20, blurAnimCheckbox.y + 40)
  framerateSlider.style ('width', '100px');
  framerateSlider.input(inputChanged)

  let invbutton = createButton("invert");
  invbutton.position (20, height - 40);
  invbutton.mousePressed(changeBG);
  invbutton.input(inputChanged)

  let invaderbutton = createCheckbox("", false);
  invaderbutton.position (20, invbutton.y -40);
  invaderbutton.mousePressed(showInvader);
  invaderbutton.input(inputChanged)


  

  noLoop();
  
}

function toggleBlurAnimation() {
  blurAnimation = !blurAnimation;
  if (blurAnimation) {
    loop();
  } else {
    noLoop();
  }
}

function inputChanged() {
  redraw();
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
  redraw();
}

function pixelSizeAnimation(){
  if (animate === false){
  animate = true;
  } else {
    animate = false;
  }
} 

function draw() {

  textBuffer.clear();

  if (colorMode === "black") {
    background(0);
  } else {
    background(255);
  }
  
  // SLIDER TEXT
  textAlign(LEFT,TOP)
  textSize(11)
  fill(150)
  
  text('letter size', 135, sizeSlider.y+3);
  text('grid size', 135, gridSlider.y+3);
  text('pixel size', 135, pixelSpacingSlider.y+3);
  text('square <--> circle', 135, shapeSlider.y+3);
  text('blur', 135, blurSlider.y+3);
  text('animate grid size', 135, blurSlider.y + 80+3);
  text('animate blur', 135, blurSlider.y + 120+3);
  text('frame rate', 135, framerateSlider.y+3);
  text('invader', 50, windowHeight-78);



  let shapeThresh = shapeSlider.value()

  frameRate (framerateSlider.value())

  if (animate === false){
    grid = gridSlider.value();
  } else{
    grid = random(gridArr)
    loop()
  }

  let typeSize = sizeSlider.value();
  
  if (invader === false) {
  // DRAW WORD (on the textBuffer)
  textBuffer.textSize(typeSize);
  textBuffer.textAlign(CENTER, BASELINE); // Change from CENTER to BASELINE
  textBuffer.fill(255);
  textBuffer.text(input.value(), width / 2, height / 2 + typeSize / 3.5);

} else {
  textBuffer.imageMode(CENTER);
  textBuffer.image(invaderImg, width / 2, height / 2);
  invaderImg.resize(sizeSlider.value() * 3, 0);
}


let xMin, xMax, yMin, yMax;

if (invader === false) {
  let typeWidth = textBuffer.textWidth(input.value());
  let typeHeight = textBuffer.textSize();
  xMin = max(0, (width - typeWidth) / 2 - grid * 2);
  xMax = min(width, (width + typeWidth) / 2 + grid * 2);
  yMin = max(0, (height - typeHeight) / 2 - grid * 2);
  yMax = min(height, (height + typeHeight) / 2 + grid * 2);
} else {
  let invaderWidth = invaderImg.width;
  let invaderHeight = invaderImg.height;
  xMin = max(0, (width - invaderWidth) / 2 - grid * 2);
  xMax = min(width, (width + invaderWidth) / 2 + grid * 2);
  yMin = max(0, (height - invaderHeight) / 2 - grid * 2);
  yMax = min(height, (height + invaderHeight) / 2 + grid * 2);

}



  // LOAD PIXELS OF WORD
  textBuffer.loadPixels();

  let points = [];
  // Update the loop to only cover the area where the text is drawn
  for (let y = yMin; y < yMax; y += grid) {
    for (let x = xMin; x < xMax; x += grid) {
      let px = textBuffer.get(x, y);
      let sample = px[0];
      if (sample > 125) {
        points.push(createVector(x, y));
      }
    }
  }

  if (blurAnimation) {
      for (let i = 0; i < points.length; i++) {
        let blurX = random(-blurSlider.value(), blurSlider.value());
        let blurY = random(-blurSlider.value(), blurSlider.value());
        points[i].x += blurX;
        points[i].y += blurY;
      }
    }
  

  // DRAW SHAPES

  let pixelSpacing = map(pixelSpacingSlider.value(), 0, 4.5, 4.5, 0);

  if (colorMode === "black") {
    fill(255);
  } else {
    fill(0);
  }
  if (invader === true) {
    fill(57, 255, 50);
  }

  noStroke();

  for (let i = 0; i < points.length; i++) {
    let x = points[i].x;
    let y = points[i].y;
    x += random(-blurSlider.value(), blurSlider.value());
    y += random(-blurSlider.value(), blurSlider.value());

    let adjustedGrid = grid * (1 - pixelSpacing / 5);

    if (random() < shapeThresh) {
      circle(x, y, adjustedGrid);
    } else {
      rect(x, y, adjustedGrid);
    }
    }
}
