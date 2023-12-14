---
layout: post
title: LocalStorage Lesson Outline
description: Local Storage / Character Selection
courses: { csse: {week: 14} }
type: collab
---

# Key Ideas:
- What is LocalStorage: The ability to store information inside of a website, repository, etc.
- How do we use LocalStorage: We can use local storage using a player and local selection.
- Why is LocalStorage important: To prevent the loss of data storage, even when a tab or window is closed.


# Step 1: Implementing Controller.js and LocalStorage.js:




<div>
<table>
    <tr id="pasteAfter">
    	<th>#</th>
        <th>name</th>
        <th>age</th>
    </tr>
    <tr>
    	<td><button id="incrementRow">+</button></td>
    </tr>
</table>
<button id="save">save</button>
<button id="load">load</button>
<p id="storageCheck"></p>
</div>

<script>
var count = 0;
var storageC;
var pasteAfter = document.getElementById("pasteAfter");
var incrementRow = document.getElementById("incrementRow");
var storageExists = document.getElementById("storageCheck");
var saveButton = document.getElementById("save");
var loadButton = document.getElementById("load");

var key = "myKeyValue";

var rows=[];
function addRow(v1,v2){
    var current = count.toFixed(0); //copy the current count for the current row
    rows.push([]);

	  var row = document.createElement("tr"); //create a row

    var td1 = document.createElement("td");
    td1.innerText = String(count);
    row.append(td1);
    
    var td2 = document.createElement("td");
    var input1 = document.createElement("input");
    input1.type = "text";
    input1.value = v1?v1:"";
    rows[count].push(input1.value);
    input1.addEventListener("focusout",()=>{rows[current][0]=input1.value}); //listen for updates to inputfeild
    td2.append(input1);
    row.append(td2);
    
    var td3 = document.createElement("td");
    var input2 = document.createElement("input");
    input2.type = "number";
    input2.value = v2?v2:0;
    rows[count].push(input2.value);
    input2.addEventListener("focusout",()=>{rows[current][1]=input2.value});//listen for updates to inputfeild
    td3.append(input2);
    row.append(td3);
    
    pasteAfter.insertAdjacentElement("afterend",row); //paste row into table

    count += 1; //increment count
}

///// not my code, but checks if browser has localstorage
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}
if (storageAvailable("localStorage")) {
    storageExists.innerText = "Local Storage Available";
    storageC = true;
  // Yippee! We can use localStorage awesomeness
} else {
    storageC = false;
    storageExists.innerText = "Local Storage Not Available";
  // Too bad, no localStorage for us
}

function load(){
    if (!storageC){
        console.log("cannot access local storage");
        return;
    }
    var list = window.localStorage.getItem(key);
    if (list){
        var array1 = list.split(","); //data is saved as a string, convert to array
        for(let i = 0;i<array1.length;i+=2){
            addRow(array1[i],array1[i+1]);
        }
    }
    else {
        console.log("data may not exist");
    }
}

function save(){
    console.log(rows);
    if (!storageC){
        console.log("cannot access local storage");
        return;
    }
    window.localStorage.clear(); //clear existing data

    //replace data
    window.localStorage.setItem(key,rows); //data is converted to string automatically
}
//listen for button presses
incrementRow.addEventListener("click",()=>{addRow()});
saveButton.addEventListener("click",save);
loadButton.addEventListener("click",load);
</script>

# Homework:
- For this lesson, we're going to use Object Orienting Programming
- We do this by modifying the GameEnvironment and GameLevels in particular.
- How to add LocalStorage? (Lecture for a few minutes)

# Future Ideas:
- Settings
- Make custom character or take it from the internet (in general, make a character that’s now mario or a monkey)
- “What is Parallax? Google definition of Parallax: PropBASIC is a BASIC programming language for the Parallax Propeller Microcontroller. PropBASIC requires Brad's Spin Tool (BST), a cross-platform set of tools for developing with the Parallax Propeller.

# Developing the Lecture/Game:
- How to save the game even when the tab or window is closed. This can be useful to prevent people who are far in a game and accidentally close out their window. 
- Using LocalStorage, the game will be saved and they wouldn’t lose much data compared to if they don’t have LocalStorage. 
- GameControl is also a key part to LocalStorage, as it transitions between the levels in the game. This is also essential to LocalStorage because it can also prevent data loss.
Look more into the assets and objects used.

# Misc.
Document getElementByID imports the idea put inside of the parentheses and quotations, which follows with addEventListener to import the action that the user would do.
- This sets up a base to generate a table and allows events such as GameEnv, GameLevel, and GameControl to be imported inside of that table and be linked in the same drive.