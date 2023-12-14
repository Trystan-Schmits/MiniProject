---
layout: post
title: Local Storage Table
description: Local Storage Table
courses: { csse: {week: 14} }
type: devops
---

- This is an example of LocalStorage. You can save and load data. Even when you close the tab/window, the data will stay when you press load. (No need to copy code here)
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