var model;

async function loadModel() {
    model = await tf.loadGraphModel('TFJS/model.json');
}


function predictImage() {
        // console.log('Processing');

    // Get the image
    let image = cv.imread(canvas);
    cv.cvtColor(image, image, cv.COLOR_RGB2GRAY, 0);
    cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);


    // Calculate the space the number takes up
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE );
    
    let cnt = contours.get(0);
    let rect = cv.boundingRect(cnt);
    image = image.roi(rect)

    var height = image.rows;
    var width = image.cols;
        // console.log(`Before: Height ${height} Width ${width}`);

    if (height > width) {
        const scaleFactor = height / 20;
        width = Math.round(width / scaleFactor);
        height = 20; 
    } else {
        const scaleFactor = width / 20;
        height = Math.round(height / scaleFactor);
        width = 20;
    };


    // Crop Image
    let dsize = new cv.Size(width, height);
    cv.resize(image, image, dsize, 0, 0, cv.INTER_AREA);
    

    // Adding padding to have 4px margin and 28x28 image
    const LEFT = Math.ceil(4 + ((20 - width)/2));
    const RIGHT = Math.floor(4 + ((20 - width)/2));

    const TOP = Math.ceil(4 + ((20 - height)/2));
    const BOTTOM = Math.floor(4 + ((20 - height)/2));
        // console.log(`top: ${TOP}, bottom: ${BOTTOM}, left: ${LEFT}, right: ${RIGHT}`);

    let BLACK = new cv.Scalar(0, 0, 0, 0); // RBGA Format
    cv.copyMakeBorder(image, image, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, BLACK);


    // calculate center of mass and shift image
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE );
    cnt = contours.get(0);
    const Moments = cv.moments(cnt, false);
    const cx = Moments.m10 / Moments.m00;
    const cy = Moments.m01 / Moments.m00;
        // console.log(`Before Shifting: M00: ${Moments.m00}, cx: ${cx}, cy: ${cy}`);

    const X_SHIFT = Math.round((image.cols / 2.0) - cx);
    const Y_SHIFT = Math.round((image.rows / 2.0) - cy);

    let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
    dsize = new cv.Size(image.rows, image.cols);
    cv.warpAffine(image, image, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, BLACK);


    // Normalize pixel values
    let pixelValues = image.data; // gives an array of integers
        // console.log(`Pixel values: ${pixelValues}`);
    pixelValues = Float32Array.from(pixelValues) // changes array from integer to float

    pixelValues = pixelValues.map(function (item) {
        return item / 255; 
    });
        // console.log(`Scaled array ${pixelValues}`);

    const X = tf.tensor([pixelValues]);
        // console.log(`Shape of tensor: ${X.shape} dtype of tensor: ${X.dtype}`);


    // make prediction
    const prediction = model.predict(X);
    console.log(`Prediction: ${prediction}`);
        // console.log(tf.memory());


    // Get the prediction as an integer
    const output = prediction.dataSync()[0];


    // Testing only 
    const outputCanvas = document.createElement('CANVAS');
    cv.imshow(outputCanvas, image);
    document.body.appendChild(outputCanvas);


    // Cleanuo
    image.delete()
    contours.delete();
    cnt.delete();
    hierarchy.delete();
    M.delete();

    X.dispose();
    prediction.dispose();

    // Return the predicted number
    return output
};