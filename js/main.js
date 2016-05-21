var canvas;
    var ctx;
    var circle;
    var drag;
    var circ;
    var toDraw;
    var focusedCircle;

//create a circle class
var Circle = function(startX, startY, varX, varY, radius, color) {
      this.startX = startX;
      this.startY = startY;
      this.varX = varX;
      this.varY = varY;
      this.radius = radius;
      this.color=color;
};

var drawCircle = function (context, x, y, fillcolor, radius, linewidth, strokestyle, fontcolor, textalign, fonttype, filltext) {
      draw(context, x, y, fillcolor, radius, linewidth, strokestyle, fontcolor, textalign, fonttype, filltext);
};

var draw = function (context, x, y, fillcolor, radius, linewidth, strokestyle, fontcolor, textalign, fonttype, filltext) {
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI);
      context.fillStyle = fillcolor;
      context.fill();
      context.lineWidth = linewidth;
      context.strokeStyle = strokestyle;
      context.stroke();
};

function init() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  circles = [];
  circ={};
  circle = {};
  toDraw=true;
  drag = false;
  canvas.addEventListener('mousedown', mouseDown, false);
  canvas.addEventListener('mouseup', mouseUp, false);
  canvas.addEventListener('mousemove', mouseMove, false);
}
var clickCount = 0;
  clear = function() {
    clickCount = 0;
    clearTimeout(singleClickTimer);
    };
function mouseDown(e) {
    circle.startX = e.pageX - this.offsetLeft;
    circle.startY = e.pageY - this.offsetTop;
    toDraw=true;
    clickCount++;

  // Single Click
  if(clickCount === 1) {
    singleClickTimer = setTimeout(function() {
      console.log('single click');
      clickCount = 0;
    }, 400);

  // Double Click
  } else if (clickCount === 2) {
    console.log('double click');
    dblclick(circle.startX,circle.startY);
    clear();
  }
    var selectedCircle = selectedCirclePos(circle.startX,circle.startY);
    circle.color=getRandomColor();
    drag = true;
}
function mouseUp() {
    if(toDraw==true){
      circles.push(circ);
    }
    drag = false;
    toDraw=true;
}
function mouseMove(e) {
    if (drag==true && toDraw==true) {
        circle.varX = e.pageX - this.offsetLeft;
        circle.varY = e.pageY - this.offsetTop;
        w = circle.varX - circle.startX;
        h = circle.varY - circle.startY ;
        circle.radius = Math.sqrt(Math.pow((w), 2) + Math.pow((h), 2));
        circ=new Circle(circle.startX,circle.startY,circle.varX,circle.varY,circle.radius, circle.color);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for (i = 0; i < circles.length; i++) {
          drawIt(circles[i],i+1);
        }
        drawIt(circ,i+1);
    }
    if (drag==true && toDraw==false) {
        w = e.pageX - this.offsetLeft - circles[focusedCircle].startX;
        h = e.pageY - this.offsetTop - circles[focusedCircle].startY ;
        circles[focusedCircle].startX = circles[focusedCircle].startX +w;
        circles[focusedCircle].startY = circles[focusedCircle].startY +h;
        circles[focusedCircle].varX = circles[focusedCircle].varX +w;
        circles[focusedCircle].varY = circles[focusedCircle].varY +h;
        //redraw everything
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for (i = 0; i < circles.length; i++) {
          drawIt(circles[i],i+1);
        }
    }
}

function drawIt(c,pos) {
    drawCircle(ctx, c.varX, c.varY, c.color, c.radius, 5, "#003300", "white", "center", "bold 32px Arial", pos);
}
//random color generator
function getRandomColor() {
var letters = '0123456789ABCDEF'.split('');
var color = '#';
for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
}
return color;
}
function reset(){
ctx.clearRect(0,0,canvas.width,canvas.height);
circle={};
circles=[];
circ={};
}
function selectedCirclePos(xPos,yPos){
var minDistFromCenter=999999;
for (i = 0; i < circles.length; i++) {
  distFromCenter = Math.sqrt(Math.pow((xPos - circles[i].varX), 2) + Math.pow((yPos - circles[i].varY), 2));
  if(circles[i].radius>=distFromCenter && minDistFromCenter>distFromCenter){
      toDraw=false;
      minDistFromCenter=distFromCenter;
      console.log("Circle "+(i+1)+" selected");
      focusedCircle=i;
      return (i+1);
  }
}
if(minDistFromCenter==999999){
  return 0;
}
}
function dblclick(posX,posY) {
//w = e.pageX - this.offsetLeft;
//h = e.pageY - this.offsetTop;
  var selectedCircle1 = selectedCirclePos(posX,posY);
  //console.log("dblclick circle selected"+selectedCircle1+" dimen: "+w+" "+h);
  if(selectedCircle1=>0){
    circles.splice((selectedCircle1-1),1);
    //redraw everything
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (i = 0; i < circles.length; i++) {
      drawIt(circles[i],i+1);
    }
  }
}
