/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
 /* eslint no-use-before-define: "error"*/
/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }
  // Your custom JavaScript goes here 
  var addClick = document.getElementById('add-task');
  addClick.onclick = function() {
    console.log('123');
    var getTodotitle = document.getElementById('addInputTitle').value;
    var getTododetail = document.getElementById('addInputDetail').value;
    var getTododate = document.getElementById('addInputDate').value;
    console.log(getTodotitle);
    if(getTodotitle != '' && getTododetail != '' && getTododate !='') {
      addToList( getTodotitle, getTododetail ,getTododate);
      document.getElementById('requiredData').style.display = 'none';
    } else {
      document.getElementById('requiredData').style.display = 'block';
    }
  };
  var taskList = [],
  completedTasks = [];

  if( JSON.parse( localStorage.getItem( 'taskList' )))
    taskList = JSON.parse( localStorage.getItem( 'taskList' ));
  else
    localStorage.setItem('taskList', JSON.stringify( taskList ));

  updateCompletedListArray();
  updateListView();
  showComplete();

  function updateCompletedListArray() {
    completedTasks = [];

    taskList.forEach(function( task ) {
      if( task.done )
        completedTasks.push( taskList.indexOf( task ) + '' );

    });
  }
  function addToList( task, taskDetail, taskDate ){
    console.log(taskDetail);
    taskList.push({
      name: task,
      detail: taskDetail,
      date: taskDate, 
      done: false
    });

    updateListView();
    console.log(taskList);
    localStorage.setItem('taskList', JSON.stringify( taskList ));
  }
  function updateListView() {
  var ul = document.getElementById('tasklist');

    ul.innerHTML = '';

    taskList.forEach(function( task ) {
      console.log('1234');
      var listItem = document.createElement('li'),
        taskLabel = document.createElement('label'),
        delBtn = document.createElement('button'),
        viewBtn = document.createElement('button'), 
        updatebtn = document.createElement('button'),
        updateInput = document.createElement('input'),
        delBtn = document.createElement('span'),
        checkbox = document.createElement('input');

      listItem.className = 'card card-block task-card';
      listItem.id = taskList.indexOf( task );

      taskLabel.className = 'taskLabel task-name';
      taskLabel.textContent = task.name;
      taskLabel.htmlFor = 'c' + taskList.indexOf( task );

      updateInput.type = "text";
      
      updatebtn.className = 'edit btn btn-primary';
      updatebtn.textContent = 'Update';
      updatebtn.value = 'Update detail';
      updatebtn.onclick = UpdateThisTask;

      viewBtn .className = 'viewTaskBtn btn btn-primary';
      viewBtn .textContent = 'Vew';
      viewBtn .onclick = viewThisTask;

      delBtn.className = 'deleteTaskBtn';
      delBtn.textContent = 'X';
      delBtn.onclick = deleteThisTask;

      checkbox.className = 'taskCheckbox';
      checkbox.id = 'c' + taskList.indexOf( task );
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.onclick = toggleChecked;

      listItem.appendChild( checkbox );
      listItem.appendChild( taskLabel );
      listItem.appendChild( updateInput );
      listItem.appendChild( viewBtn );
      listItem.appendChild( updatebtn );
      listItem.appendChild( delBtn );
      ul.appendChild( listItem );
    });
  }

  function toggleChecked(e) {
  var checkStatus = e.target.checked,
    task = e.target.parentElement,
    taskId = task.id,
    removed = false;

  taskList[taskId].done = checkStatus;

  if( completedTasks.length === 0 ) {
    completedTasks.push( taskId );
  }
  else {
    completedTasks.forEach(function( index ) {
      if( taskId === index ) {
        completedTasks.splice( completedTasks.indexOf( index ), 1 );
        removed = true;
      }
    });

    if( !removed ) {
      completedTasks.push( taskId );
      completedTasks.sort();
    }
  }
  showComplete();
  saveLocalList();
}

function showComplete() {
  var completeUl = document.getElementById('show-complete-task');
  completeUl.innerHTML = '';
  completedTasks.forEach(function( task ) {
      console.log('1234');
      var completelistItem = document.createElement('li'),
        completetaskLabel = document.createElement('label');

      completelistItem.className = 'card card-block complete-card';
      completelistItem.id = completedTasks.indexOf( task );

      completetaskLabel.className = 'taskLabel';
      completetaskLabel.textContent = taskList[task].name + ' : ' + taskList[task].detail + ' ' + taskList[task].date;
      completetaskLabel.htmlFor = 'c' + completedTasks.indexOf( task );

      
      completelistItem .appendChild( completetaskLabel );
      completeUl.appendChild( completelistItem );
    });

}

function viewThisTask(e){
  var id = e.target.parentElement.id;
  var modal = document.getElementById('myModal');
  modal.style.display = 'block';
  var content = document.getElementById('show-details');
  content.innerHTML = '<h5>Task Id: '+ id + '</h5><h5>Task Title: '+ taskList[id].name + '</h5><h5>Task Detail: ' + taskList[id].detail+'</h5><h5>Task Date: ' + taskList[id].date + '</h5>'; 
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function() {
    modal.style.display = 'none';
  };
}

function UpdateThisTask(e) {
  var listItem = this.parentNode;
  var updateid = e.target.parentElement.id;
  var updateInput = listItem.querySelector('input[type=text]')
  var label = listItem.querySelector('label');
  var containsClass = listItem.classList.contains('editMode');
    //if the class of the parent is .editMode 
  if(containsClass) {
    label.innerText = updateInput.value;
    taskList[updateid].name = updateInput.value;
    saveLocalList();
    updateListView();
    showComplete();
  
  } else {
    updateInput.value = label.innerText;
  }
   listItem.classList.toggle('editMode'); 
}

function deleteThisTask(e) {
  taskList.splice( e.target.parentElement.id, 1 );

  saveLocalList();
  updateListView();
  showComplete();
}

function saveLocalList() {
  localStorage.setItem("taskList", JSON.stringify( taskList ));
}

document.getElementById('deleteCompletedBtn').onclick = function () {
  var length = completedTasks.length;

  for( var i = completedTasks.length; i--; ) {
    taskList.splice( completedTasks[i], 1 );
  }

  saveLocalList();
  updateCompletedListArray();
  updateListView();
  showComplete();
};
document.getElementById('addNewtask').onclick = function () {
  var inputForm = document.getElementById('show-form');
        inputForm.style.display = 'block'; 
};

})();

