const BACKGROUND_COLOR = '#000000';
const LINE_COLOR = '#FFFFFF';
const LINE_WIDTH = 15;


var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;

var mouseDown = false;
var mouseOnCanvas = false;

var canvas;
var context;

function prepareCanvas() {
        // console.log('Preparing Canvas');

    canvas = document.getElementById('my-canvas');
    context = canvas.getContext('2d');

        // console.log(canvas);

    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    context.strokeStyle = LINE_COLOR;
    context.lineWidth = LINE_WIDTH;
    context.lineJoin = 'round'

    document.addEventListener('mousedown', function (event) {
        currentX = event.clientX - canvas.offsetLeft;
        currentY = event.clientY - canvas.offsetTop;

        // console.log('Mouse pressed');
        mouseDown = true;

        if (currentX >= 0 && currentX <= canvas.clientWidth && currentY >= 0 && currentY <= canvas.clientHeight) {
            mouseOnCanvas = true;
        }

        // console.log(`${currentX} >= 0 && ${currentX} <= ${canvas.clientWidth} && ${currentY} >= 0 && ${currentY} <= ${canvas.clientHeight}`)

    });

    document.addEventListener('mouseup', function (event) {
        // console.log('Mouse released');
        mouseDown = false;
        mouseOnCanvas = false;
    });

    document.addEventListener('mousemove', function (event) {
        // console.log(`${currentX} >= 0 && ${currentX} <= ${canvas.clientWidth} && ${currentY} >= 0 && ${currentY} <= ${canvas.clientHeight}`)
        
        // if (currentX < 0 || currentX > canvas.clientWidth || currentY < 0 || currentY > canvas.clientHeight) {
        //     mouseOnCanvas = false;
        // } 

        if (mouseDown == true) {
            previousX  = currentX;
            previousY = currentY;

            currentX = event.clientX - canvas.offsetLeft;
            currentY = event.clientY - canvas.offsetTop;
            
            if (mouseOnCanvas == true) {
                draw();
            }
        }
    });

    canvas.addEventListener('mouseleave', function (event) {
        mouseOnCanvas = false  
    })


    // Touchevents
    document.addEventListener('touchstart', function (event) {
        currentX = event.touches[0].clientX - canvas.offsetLeft;
        currentY = event.touches[0].clientY - canvas.offsetTop;

        // console.log('Touched');
        mouseDown = true;

        if (currentX >= 0 && currentX <= canvas.clientWidth && currentY >= 0 && currentY <= canvas.clientHeight) {
            mouseOnCanvas = true;
        }
    });

    document.addEventListener('touchend', function (event) {
        // console.log('Touch released');
        mouseDown = false;
        mouseOnCanvas = false;
    });

    canvas.addEventListener('touchcancel', function (event) {
        mouseOnCanvas = false  
    })


    document.addEventListener('touchmove', function (event) {
        if (mouseDown == true) {
            previousX  = currentX;
            previousY = currentY;

            currentX = event.touches[0].clientX - canvas.offsetLeft;
            currentY = event.touches[0].clientY - canvas.offsetTop;
            
            if (mouseOnCanvas == true) {
                draw();
            }
        }
    });
}

function draw() {
    context.beginPath();
    context.moveTo(previousX, previousY);
    context.lineTo(currentX, currentY);
    context.closePath();
    context.stroke();
}

function clearCanvas() {
    // console.log('Reset canvas');

    currentX = 0;
    currentY = 0;
    previousX = 0;
    previousY = 0;

    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}