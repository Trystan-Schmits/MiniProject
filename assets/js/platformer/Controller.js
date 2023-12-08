import LocalStorage from "./LocalStorage.js";
import GameEnv from "./GameEnv.js";
import GameControl from "./GameControl.js";

export class Controller extends LocalStorage{   
    constructor(){
        var keys = {currentLevel:"currentLevel"}; //default keys for localStorage
        super(keys); //creates this.keys
    }

    //separated from constructor so that class can be created before levels are added
    initialize(){ 
        this.loadAll(); // load data
        
        if(this[this.keys.currentLevel]){ //update to active level
            GameControl.transitionToLevel(GameEnv.levels[Number(this[this.keys.currentLevel])]);
        }
        else{ //if not current level then set this.currentLevel to 0 (default)
            this[this.keys.currentLevel] = 0;
        }
        
        window.addEventListener("resize",()=>{ //updates this.currentLevel when the level changes
            this[this.keys.currentLevel] = GameEnv.levels.indexOf(GameEnv.currentLevel);
            this.save(this.keys.currentLevel);//save to local storage
            console.log(this[this.keys.currentLevel])
            console.log(localStorage.getItem(this.keys.currentLevel))
        });
    }

    get table(){
        var t = document.createElement("table");
        //create header
        var header = document.createElement("tr");
        var th1 = document.createElement("th");
        th1.innerText = "#";
        header.append(th1);
        var th2 = document.createElement("th");
        th2.innerText = "Level Tag";
        header.append(th2);
        t.append(header);

        //create other rows
        for(let i = 0;i < GameEnv.levels.length;i++){
            var row = document.createElement("tr");
            var td1 = document.createElement("td");
            td1.innerText = String(i);
            row.append(td1);
            var td2 = document.createElement("td");
            td2.innerText = GameEnv.levels[i].tag;
            td2.addEventListener("click",()=>{ // when player clicks on level name
                GameControl.transitionToLevel(GameEnv.levels[i]); //transition to that level
            })
            row.append(td2);
            t.append(row);
        }

        return t; //returns <table> element
    }
}

export default Controller;
