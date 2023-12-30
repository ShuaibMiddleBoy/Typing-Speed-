document.addEventListener("DOMContentLoaded", () => {
  const quoteApiUrl =
    "https://api.quotable.io/random?minLength=250&maxLength=500";
  let timerEle = document.querySelector(".header span");
  let userInput = document.querySelector(".your-text textarea");
  let resetBtn = document.querySelector(".reset-btn");
  let countdown;
  let isTimerActive = false;
  const preTextElement = document.querySelector(".pre-text");
  let quote = "";
  let mistakes = 0;
  let startTime; // Variable to store the start time
  const removeBtn = document.getElementById("TypingSpeedCrossIcon");
  const typingSpeedResultContainer = document.getElementById(
    "typingSpeedResultContainer"
  );

  const renderNewQuote = async () => {
    const response = await fetch(quoteApiUrl);
    let data = await response.json();
    quote = data.content;
    let arr = quote.split("").map((value) => {
      return "<span class='quote-chars'>" + value + "</span>";
    });
    // console.log(arr.join(""));
    preTextElement.innerHTML += arr.join("");
  };

  // Function to start the timer
  const startTimer = () => {
    startTime = Date.now(); // Record the start time
    countdown = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Calculate elapsed time in seconds
      const remainingTime = Math.max(60 - elapsedTime, 0); // Calculate remaining time (maximum 60 seconds)
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      timerEle.textContent = `${minutes}:${
        seconds < 10 ? "0" + seconds : seconds
      }`;

      if (remainingTime === 0) {
        clearInterval(countdown);
        displayResult();
      }
    }, 1000);
  };

  // Function to update accuracy and speed
  const updateAccuracyAndSpeed = () => {
    const typedText = userInput.value.trim();
    const correctChars = typedText
      .split("")
      .filter((char, index) => char === quote.charAt(index)).length;
    const accuracy = ((correctChars / quote.length) * 100).toFixed(2);
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const timeTaken = Math.min(elapsedTime, 60); // Limit time taken to a maximum of 60 seconds
    const speed = (typedText.length / 5 / (timeTaken / 60)).toFixed(2);

    document.getElementById("accuracy").innerText = `${accuracy} %`;
    document.getElementById("wpm").innerText = `${speed} wpm`;
  };

  userInput.addEventListener("input", () => {
    if (!isTimerActive) {
      startTimer();
      isTimerActive = true;
    }

    //Logic for comparing input words with quote
    let quoteChars = document.querySelectorAll(".quote-chars");
    quoteChars = Array.from(quoteChars);
    let userInputChars = userInput.value.split("");
    quoteChars.forEach((char, index) => {
      if (char.innerText == userInputChars[index]) {
        char.classList.add("success");
      }
      //If user hasn't entered anything or backspaced
      else if (userInputChars[index] == null) {
        //Remove class if any
        if (char.classList.contains("success")) {
          char.classList.remove("success");
        } else {
          char.classList.remove("fail");
        }
      } else {
        //Checks if we alreasy have added fail class
        if (!char.classList.contains("fail")) {
          //increment and display mistakes
          mistakes += 1;
          char.classList.add("fail");
        }
        document.getElementById("mistakes").innerText = mistakes;
        document.getElementById("mistakess").innerText = mistakes;
        // Update accuracy and speed
        updateAccuracyAndSpeed();
      }
    });
  });

  // Reset timer and textarea when Reset button is clicked
  resetBtn.addEventListener("click", () => {
    clearInterval(countdown);
    isTimerActive = false;
    timerEle.textContent = "1:00";
    userInput.value = "";
    userInput.classList.remove("correct", "incorrect");
    preTextElement.innerHTML = "";
    mistakes = 0;
    document.getElementById("mistakes").innerText = mistakes;
    renderNewQuote(); // Load a new quote
  });

  const displayResult = () => {
    typingSpeedResultContainer.style.display = "flex";
    userInput.disabled = true;
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const timeTaken = Math.min(elapsedTime, 60); // Limit time taken to a maximum of 60 seconds
    document.getElementById("wpm").innerText =
      (userInput.value.length / 5 / (timeTaken / 60)).toFixed(2) + " wpm";
    document.getElementById("accuracy").innerText =
      (
        ((userInput.value.length - mistakes) / userInput.value.length) *
        100
      ).toFixed(2) + " %";
  };

  //  remove result popup
  removeBtn.addEventListener("click", () => {
    typingSpeedResultContainer.style.display = "none";
    userInput.disabled = false;
    userInput.value = "";
    preTextElement.innerHTML = "";
    mistakes = 0;
    document.getElementById("mistakes").innerText = mistakes;
    renderNewQuote(); // Load a new quote
  });

  renderNewQuote();
});
