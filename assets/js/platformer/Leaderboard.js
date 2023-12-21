import LocalStorage from "./LocalStorage.js";
import GameEnv from './GameEnv.js';

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
        
      var playerScoresArray;
      const playerScores = this[this.keys.leaderboard];
      if (playerScores == ""){
        console.log("no data"); 
        playerScoresArray=[];
      } else{
      playerScoresArray = playerScores.slice(0,-1).split(";");
      }

      var table = document.createElement("table"); // create table
      table.style.margin = "auto";

      var tableHead = document.createElement("tHead"); //create table header
      var tableHeadRow = document.createElement("tr");
      tableHead.append(tableHeadRow);
      var tableTitle1 = document.createElement("th");
      tableTitle1.innerText = "Run";
      tableHeadRow.append(tableTitle1);
      var tableTitle2 = document.createElement("th");
      tableTitle2.innerText = "Name";
      tableHeadRow.append(tableTitle2);
      var tableTitle3 = document.createElement("th");
      tableTitle3.innerText = "Time";
      tableHeadRow.append(tableTitle3);
      table.append(tableHead);

      var tableBody = document.createElement("tBody"); //create table body
      table.append(tableBody);
      for (let i =0; i<playerScoresArray.length; i++) {
        var row = document.createElement("tr");
        var rank = document.createElement("td");
        rank.id = String(i)+"r";
        rank.innerText = String(i+1);
        var name = document.createElement("td");
        name.id = String(i)+"n";
        name.innerText = String(playerScoresArray[i].split(",")[0]);
        var score = document.createElement("td");
        score.id = String(i)+"s";
        score.innerText = String(playerScoresArray[i].split(",")[1]);
        row.append(rank);
        row.append(name);
        row.append(score);
        tableBody.append(row);  
      }
      leaderboardSection.appendChild(table); //apend table

      const tBody = table.tBodies[0]; //table sorting when clicking on header
      const rows = Array.from(tBody.rows);
      const headerCells = table.tHead.rows[0].cells;
      for (const th of headerCells) {
        const cellIndex = th.cellIndex;
        th.addEventListener("click", () => {
          rows.sort((tr1, tr2) => {
            const tr1Text = tr1.cells[cellIndex].textContent;
            const tr2Text = tr2.cells[cellIndex].textContent;
            return tr1Text.localeCompare(tr2Text, undefined, { numeric: true, sensitivity: "base" });
          });
          tBody.append(...rows);
        });
      }

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
      }
      this.time+=1/GameEnv.frameRate.toFixed(2); // Increment time (you can adjust this based on your game logic)

      // Display the updated time in the span element with id 'timeScore'
      const timeScoreElement = document.getElementById('timeScore');
      if (timeScoreElement) {
          timeScoreElement.textContent = String(this.time.toFixed(2)); // Update the displayed time
      }
    }


    // Function to start the timer
    startTimer() {
       // Start the timer interval, updating the timer every second (1000 milliseconds)
       this.timerInterval = setInterval(this.updateTimer.bind(this), 1000/GameEnv.frameRate);
    }

    // Function to reset the timer
    resetTimer() {
       this.stopTimer(); // Stop the timer
       this.time = 0; // Reset the time variable
       this.updateTimer(); // Update the displayed time to show 0
    }
}

export default Leaderboard;