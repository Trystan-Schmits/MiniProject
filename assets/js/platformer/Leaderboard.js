import LocalStorage from "./LocalStorage.js";

export class Leaderboard extends LocalStorage { //create a class with access to local storage
    constructor(){
        var keys = {leaderboard: "leaderboard",gameOverScreenShown: "gameOverScreenShown"};
        super(keys);

        this.time = 0;
        this.timerInterval;
    }

    initialize(){
        this.loadAll();
    }

    showLeaderboard(){
            this.loadAll();

            const id = document.getElementById("gameOver");
            id.hidden = false;
            // Hide game canvas and controls
            document.getElementById('canvasContainer').style.display = 'none';
            document.getElementById('controls').style.display = 'none';
            document.getElementById('score').style.display = 'none';
        
          // Create and display leaderboard section
          const leaderboardSection = document.createElement('div');
          leaderboardSection.id = 'leaderboardSection';
          leaderboardSection.innerHTML = '<h1 style="text-align: center; font-size: 18px;">Leaderboard </h1>';
          document.querySelector(".page-content").appendChild(leaderboardSection)
          // document.body.appendChild(leaderboardSection);
        
          const playerScores = this[this.keys.leaderboard];
          const playerScoresArray = playerScores.split(";")
          const scoresObj = {}
          const scoresArr = []
          for(let i = 0; i< playerScoresArray.length-1; i++){
            const temp = playerScoresArray[i].split(",")
            scoresObj[temp[0]] = parseInt(temp[1])
            scoresArr.push(parseInt(temp[1]))
          }
        
          var sortedScoresArr = scoresArr.toSorted((a,b)=>a-b); // sort values
        
          const finalScoresArr = [];
          for (let i = 0; i<sortedScoresArr.length; i++) {
            for (const [key, value] of Object.entries(scoresObj)) {
              if (sortedScoresArr[i] ==value) {
                finalScoresArr.push(key + "," + value);
                break;
              }
            }
          }

          var table = document.createElement("table");
          table.style.margin = "auto";
          var tableHead = document.createElement("tr");
          var tableTitle1 = document.createElement("th");
          tableTitle1.innerText = "Rank";
          tableHead.append(tableTitle1);
          var tableTitle2 = document.createElement("th");
          tableTitle2.innerText = "Name";
          tableHead.append(tableTitle2);
          var tableTitle3 = document.createElement("th");
          tableTitle3.innerText = "Time";
          tableHead.append(tableTitle3);
          table.append(tableHead);

          let rankScore = 1;
          for (let i =0; i<finalScoresArr.length; i++) {
            var row = document.createElement("tr");
            var rank = document.createElement("td");
            rank.id = String(i)+"r";
            rank.innerText = String(i+1);
            var name = document.createElement("td");
            name.id = String(i)+"n";
            name.innerText = String(finalScoresArr[i].split(",")[0]);
            var score = document.createElement("td");
            score.id = String(i)+"s";
            score.innerText = String(finalScoresArr[i].split(",")[1]);
            row.append(rank);
            row.append(name);
            row.append(score);
            table.append(row);  
          }
          leaderboardSection.appendChild(table); //apend table

          var clearButton = document.createElement("button"); //button for clearing data
          clearButton.style.margin = "auto";
          clearButton.innerText = "clear leaderboard"
          clearButton.addEventListener("click",()=>{
            this[this.keys.leaderboard] = "";
            this.save(this.keys.leaderboard);
            table.remove();
            clearButton.remove();
          });
          leaderboardSection.appendChild(clearButton); //apend button
    }

    // Function to stop the timer
    stopTimer() {   
        clearInterval(this.timerInterval); // Clear the interval to stop the timer
    }

        // Function to update and display the timer
     updateTimer() {
        const id = document.getElementById("gameOver");

        if (id.hidden == false) {
            this.stopTimer();
            this.time=-1;
        }
       this.time+=1; // Increment time (you can adjust this based on your game logic)

       // Display the updated time in the span element with id 'timeScore'
       const timeScoreElement = document.getElementById('timeScore');
       if (timeScoreElement) {
           timeScoreElement.textContent = String(this.time); // Update the displayed time
       }
    }


    // Function to start the timer
     startTimer() {
       // Start the timer interval, updating the timer every second (1000 milliseconds)
       this.timerInterval = setInterval(this.updateTimer.bind(this), 1000);
    }

    // Function to reset the timer
    resetTimer() {
       this.stopTimer(); // Stop the timer
       this.time = 0; // Reset the time variable
       this.updateTimer(); // Update the displayed time to show 0
    }
}

export default Leaderboard;