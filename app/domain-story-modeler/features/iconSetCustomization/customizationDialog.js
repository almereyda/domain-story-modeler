'use strict';

import { initializeAllIcons, getAllIconDictioary, deleteFromSelectedWorkObjectDictionary, deleteFromSelectedActorDictionary, getIconSource, addToSelectedActors, addToSelectedWorkObjects, selectedCitionariesAreNotEmpty, getAppendedIconDictionary } from './dictionaries';
import { isInActorIconDictionary } from '../../language/icon/actorIconDictionary';
import { isInWorkObjectIconDictionary } from '../../language/icon/workObjectIconDictionary';
import { ACTOR, WORKOBJECT } from '../../language/elementTypes';
import { isTestMode } from '../../language/testmode';

var htmlList = document.getElementById('allIconsList');
var selectedActorsList = document.getElementById('selectedActorsList');
var selectedWorkObjectList = document. getElementById('selectedWorkObjectsList');

const Sortable = require('sortablejs');
const iconSize = 20;
const highlightBackgroundColor = '#f6f6f6';

const mainListOptions = {
  group: 'allIconList',
  sort: 'true',
  onEnd: function() {
    updateBackgroundColors();
  }
};

const actorListOptions = {
  group: {
    name: 'actorIconList',
    put: ['actorIconList', 'workObjectIconList']
  },
  sort: 'true',
  onEnd: function(event) {
    dropElement(event);
  }
};

const workObjectListOptions = {
  group: {
    name: 'workObjectIconList',
    put: ['actorIconList', 'workObjectIconList']
  },
  sort: 'true',
  onEnd: function(event) {
    dropElement(event);
  }
};

function updateBackgroundColors() {
  var children = htmlList.children;
  for (var i=0; i<children.length; i++) {
    var child = children[i];
    if (i%2 ==0) {
      child.style.backgroundColor = highlightBackgroundColor;
    } else {
      child.style.backgroundColor = 'white';
    }
  }
}

function dropElement(event) {
  var target = event.to;
  var source = event.srcElement;
  var draggedItem = event.item;

  var listEntryName = draggedItem.lastChild.innerText;
  if (target != source) {
    var addToActors, addToWorkObjects;
    if (target == selectedActorsList) {
      addToActors = true;
      addToWorkObjects = false;
    } else {
      addToActors = false;
      addToWorkObjects = true;
    }
    updateSelectedWorkObjectsAndActors(listEntryName, addToActors, addToWorkObjects, false);
  }
}

export function createListOfAllIcons() {
  new Sortable(htmlList, mainListOptions);
  new Sortable(selectedActorsList, actorListOptions);
  new Sortable(selectedWorkObjectList, workObjectListOptions);

  initializeAllIcons();

  var allIconDictionary = getAllIconDictioary();

  var allIconNames = allIconDictionary.keysArray();
  var i=0;
  allIconNames.forEach(name => {
    var listElement = createListElement(name, (i%2)==0);
    htmlList.appendChild(listElement);
    i++;
  });

  var appendIconDictionary = getAppendedIconDictionary();
  var allAppendIconNames = appendIconDictionary.keysArray();
  allAppendIconNames.forEach(name => {
    var listElement = createListElement(name, (i%2)==0);
    htmlList.appendChild(listElement);
    i++;
  });
}

export function createListElement(name, greyBackground) {
  var iconSRC = getIconSource(name);

  var listElement = document.createElement('li');
  var radioElement = document.createElement('div');
  var verticalLineElement = document.createElement('div');
  var imageElement = document.createElement('img');
  var nameElement = document.createElement('text');

  var inputRadioNone = document.createElement('input');
  var inputRadioActor = document.createElement('input');
  var inputRadioWorkObject = document.createElement('input');

  listElement.style.marginLeft = '5px';
  listElement.style.height = '20px';
  listElement.style.display ='grid';
  listElement.style.gridTemplateColumns = '125px 10px 30px auto';
  listElement.style.borderTop = 'solid 1px black';
  if (greyBackground) {
    listElement.style.backgroundColor = highlightBackgroundColor;
  }

  radioElement.id = 'radioButtons';
  radioElement.style.display = 'grid';
  radioElement.style.gridTemplateColumns = '45px 45px 30px';

  inputRadioNone.setAttribute('type', 'radio');
  inputRadioNone.setAttribute('name', name);
  inputRadioNone.setAttribute('value', 'none');

  inputRadioActor.setAttribute('type', 'radio');
  inputRadioActor.setAttribute('name', name);
  inputRadioActor.setAttribute('value', 'actor');

  inputRadioWorkObject.setAttribute('type', 'radio');
  inputRadioWorkObject.setAttribute('name', name);
  inputRadioWorkObject.setAttribute('value', 'workObject');

  if (isInActorIconDictionary(ACTOR +name)) {
    inputRadioActor.checked = true;
    createListElementInSeletionList(name, getIconSource(name), selectedActorsList);
    addToSelectedActors(name, getIconSource(name));
  } else if (isInWorkObjectIconDictionary(WORKOBJECT + name)) {
    inputRadioWorkObject.checked = true;
    createListElementInSeletionList(name, getIconSource(name), selectedWorkObjectList);
    addToSelectedWorkObjects(name, getIconSource(name));
  }
  else {
    inputRadioNone.checked = true;
  }

  verticalLineElement.style.display = 'inline';
  verticalLineElement.style.borderLeft = 'solid 1px black';
  verticalLineElement.width ='1px';
  verticalLineElement.heigth = '15px';
  verticalLineElement.style.overflowY = 'visible';
  verticalLineElement.style.marginLeft = '5px';

  imageElement.width = iconSize;
  imageElement.heigth = iconSize;
  imageElement.style.marginLeft = '5px';
  if (iconSRC.startsWith('data')) {
    imageElement.src= iconSRC;
  } else {
    imageElement.src= ('data:image/svg+xml,' + iconSRC);
  }

  nameElement.innerHTML = name;

  radioElement.appendChild(inputRadioNone);
  radioElement.appendChild(inputRadioActor);
  radioElement.appendChild(inputRadioWorkObject);

  radioElement.addEventListener('click', function() {
    var children = radioElement.children;
    var actorButton = children[1];
    var workObjectButton = children[2];

    var currentSelectionName = actorButton.name;
    var addToActors = false;
    var addToWorkObjects = false;
    if (actorButton.checked) {
      addToActors = true;
    }
    else if (workObjectButton.checked) {
      addToWorkObjects = true;
    }
    updateSelectedWorkObjectsAndActors(currentSelectionName, addToActors, addToWorkObjects, true);
  });

  listElement.appendChild(radioElement);
  listElement.appendChild(verticalLineElement);
  listElement.appendChild(imageElement);
  listElement.appendChild(nameElement);

  return listElement;
}

export function createListElementInSeletionList(name, src, list) {
  if (!isTestMode()) {
    var listElement = document.createElement('li');
    var nameElement = document.createElement('text');
    var imageElement = document.createElement('img');

    imageElement.width = iconSize;
    imageElement.heigth = iconSize;
    if (src.startsWith('data')) {
      imageElement.src= src;
    } else {
      imageElement.src= ('data:image/svg+xml,' + src);
    }

    nameElement.innerHTML = name;
    nameElement.style.marginLeft ='5px';

    listElement.appendChild(imageElement);
    listElement.appendChild(nameElement);

    list.appendChild(listElement);
  }
}

function removeListEntry(name, list) {
  var children = list.children;
  var wantedChild;
  for (var i=0; i<children.length; i++) {
    var child = children[i];
    var innerText = child.innerText;
    if (innerText.includes(name)) {
      wantedChild = child;
    }
  }
  if (wantedChild) {
    list.removeChild(wantedChild);
  }
}

function updateSelectedWorkObjectsAndActors(currentSelectionName, addToActors, addToWorkObjects, updateHTML) {

  deleteFromSelectedWorkObjectDictionary(currentSelectionName);
  if (deleteFromSelectedActorDictionary(currentSelectionName)) {
    if (updateHTML) {
      removeListEntry(currentSelectionName, selectedActorsList);
    }
  } else {
    if (updateHTML) {
      removeListEntry(currentSelectionName, selectedWorkObjectList);
    }
  }

  var iconSRC = getIconSource(currentSelectionName);
  if (addToActors) {
    addToSelectedActors(currentSelectionName, iconSRC);
    if (updateHTML) {
      createListElementInSeletionList(currentSelectionName, iconSRC, selectedActorsList);
    }
  }
  else if (addToWorkObjects) {
    addToSelectedWorkObjects(currentSelectionName, iconSRC);
    if (updateHTML) {
      createListElementInSeletionList(currentSelectionName, iconSRC, selectedWorkObjectList);
    }
  }

  var exportConfigurationButton = document.getElementById('exportConfigurationButton');
  var customIconConfigSaveButton = document.getElementById('customIconConfigSaveButton');

  if (selectedCitionariesAreNotEmpty()) {
    exportConfigurationButton.disabled = false;
    exportConfigurationButton.style.opacity = 1;

    customIconConfigSaveButton.disabled = false;
    customIconConfigSaveButton.style.opacity = 1;
  } else {
    exportConfigurationButton.disabled = true;
    exportConfigurationButton.style.opacity = 0.5;

    customIconConfigSaveButton.disabled = true;
    customIconConfigSaveButton.style.opacity = 0.5;
  }

  if (!updateHTML) {
    var correspondingAllIconElement = document.evaluate('//text[contains(., \''+currentSelectionName +'\')]', document, null, XPathResult.ANY_TYPE, null).iterateNext().parentNode;
    var radioButtons = correspondingAllIconElement.children[0];

    //    var radioNone = radioButtons.children[0];
    var radioActor = radioButtons.children[1];
    var radioWorkObject = radioButtons.children[2];

    if (addToActors) {
      radioActor.checked = true;
      radioWorkObject.checked = false;
    } else {
      radioActor.checked = false;
      radioWorkObject.checked = true;
    }
  }
}


export function resetHTMLSelectionList() {
  var i=0, child;
  for (i=selectedWorkObjectList.children.length -1; i>=0; i--) {
    child = selectedWorkObjectList.children[i];
    selectedWorkObjectList.removeChild(child);
  }

  for (i=selectedActorsList.children.length -1; i>=0; i--) {
    child = selectedActorsList.children[i];
    selectedActorsList.removeChild(child);
  }
}