var answer;
var score = 0;
var backgroundImages = [];

function nextQuestion() {
    const n1 = Math.floor(Math.random() * 5); // gives number between 0 - 4
    const n2 = Math.floor(Math.random() * 6); // gives number between 0 - 5

    document.getElementById('n1').innerHTML = n1; // change html value on website
    document.getElementById('n2').innerHTML = n2;

    answer = n1 + n2;

}

function checkAnswer(guess) {
    const prediction = predictImage();

    console.log(`answer: ${answer}, prediction: ${prediction}`);

    if (prediction == answer){
        score++;
        console.log(`Correct! Score: ${score}`);

        if (score <= 6){
            backgroundImages.push(`url('images/background${score}.svg')`);
            document.body.style.backgroundImage = backgroundImages;
        } else {
            alert('Congratulations!!! You can now start a new quiz!');
            // location.reload();
            score = 0;
            backgroundImages = [];
            document.body.style.backgroundImage = backgroundImages;

        }

    } else {
        if (score > 0){
            score--;

            alert(`Sorry your answer: ${prediction} was't correct. Check your math or write more clearly ;)`);
            backgroundImages.pop();
            setTimeout(function() {
                document.body.style.backgroundImage = backgroundImages;}, 1000);
        }
        console.log(`Wrong! Score: ${score}`);
    }
}