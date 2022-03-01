"use strict";

window.addEventListener("DOMContentLoaded", start);

//create student object
const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  gender: "",
  profilePic: "",
  house: "",
  expelled: false,
  prefect: false,
  bloodstatus: "",
  inqSquad: false,
};

//let filterBy = "all";
const settings = {
  filterBy: "all",
  sortBy: "name",
  sortDir: "asc",
};

//make an empty array that can contain all students
const allStudents = [];

//link to json data with students
const url = "https://petlatkea.dk/2021/hogwarts/students.json";

//link to json data with bloodfamilies
const url2 = "https://petlatkea.dk/2021/hogwarts/families.json";

//fetched data
let hogwartsData;
let bloodData;

async function start() {
  buttonListener();
  await loadJSON();
  await loadJSONFamilies();
  prepareStudents();
}

function buttonListener() {
  //get filterbuttons
  const filterButtons = document.querySelectorAll('[data-action="filter"]');
  //get sortingbuttons
  const sortButtons = document.querySelectorAll('[data-action="sort"]');

  filterButtons.forEach((button) =>
    button.addEventListener("click", selectFilter)
  );

  sortButtons.forEach((button) => button.addEventListener("click", selectSort));

  //searchBar
  const searchBar = document.querySelector("#searchBar");
  searchBar.addEventListener("keyup", searchFunction);
}

async function loadJSON() {
  const jsonData = await fetch(url);
  hogwartsData = await jsonData.json();
}

async function loadJSONFamilies() {
  const jsonDataFamilies = await fetch(url2);
  bloodData = await jsonDataFamilies.json();
}

//delegator to other functions
function prepareStudents() {
  hogwartsData.forEach((stud) => {
    const student = Object.create(Student);

    student.firstName = getFirstName(stud.fullname.trim());
    student.middleName = getMiddleName(stud.fullname.trim());
    student.nickName = getNickName(stud.fullname.trim());
    student.lastName = getLastName(stud.fullname.trim());
    student.gender = getGender(stud.gender.trim());
    student.house = getHouse(stud.house.trim());
    student.prefect = false;
    student.bloodstatus = getBloodStatus(student);
    student.inqSquad = false;

    student.profilePic = getProfilePic(stud.fullname.trim());

    //put student in the allStudents array
    allStudents.push(student);
  });
  displayList(allStudents);
}

function getFirstName(fullname) {
  if (fullname.includes(" ")) {
    let firstName = fullname.substring(
      fullname.indexOf(0),
      fullname.indexOf(" ")
    );

    const cleanedFirstName = cleanData(firstName);
    return cleanedFirstName;
  } else {
    const cleanedFirstName = cleanData(fullname);
    return cleanedFirstName;
  }
}

function getMiddleName(fullname) {
  const firstSpace = fullname.indexOf(" ");
  const lastSpace = fullname.lastIndexOf(" ");
  const fullMiddleName = fullname.substring(firstSpace + 1, lastSpace).trim();
  if (!fullname.includes('"') && fullname.includes(" ")) {
    let middleName =
      fullMiddleName.substring(0, 1) + fullMiddleName.substring(1);
    const cleanedMiddleName = cleanData(middleName);
    return cleanedMiddleName;
  } else if (fullMiddleName === "") {
    let middleName = null;
    return middleName;
  }
}

function getNickName(fullname) {
  //check if middlename contains "" if that is true, it is a nickName

  if (fullname.includes('"')) {
    let nickName = fullname.substring(
      fullname.indexOf('"') + 1,
      fullname.lastIndexOf('"')
    );

    const cleanedNickName = cleanData(nickName);
    return cleanedNickName;
  }
}

function getLastName(fullname) {
  const lastName = fullname.substring(fullname.lastIndexOf(" ") + 1);

  if (lastName.includes("-")) {
    //split middleName into an array
    const lastNameArray = lastName.split("");

    lastNameArray.forEach((element, index, array) => {
      // if the element contains a "-" or space make the letter afterwards uppercase
      if (element === "-" || element === " ") {
        array[index + 1] = array[index + 1].toUpperCase();
      }
    });

    //then join the array into a new string by concat all elements in the array
    let result = lastNameArray.join("");
    return result;
  } else if (!fullname.includes(" ")) {
    let lastName = null;
    return lastName;
  } else {
    const cleanedLastName = cleanData(lastName);
    return cleanedLastName;
  }
}
function getGender(gender) {
  const cleanedGender = cleanData(gender);
  return cleanedGender;
}
function getHouse(house) {
  const cleanedHouse = cleanData(house);
  return cleanedHouse;
}
function getProfilePic(fullname) {
  //find first name and make it lowercase
  const firstName = fullname.substring(
    fullname.indexOf(0),
    fullname.indexOf(" ")
  );

  const smallFirstName = firstName.toLowerCase();

  //find first letter in firstName and make it lowercase
  const firstLetterOfName = fullname.substring(0, 1).toLowerCase();

  //the pics is named with the lastName in lowercase
  const smallLastName = fullname
    .substring(fullname.lastIndexOf(" ") + 1)
    .toLowerCase();

  if (smallLastName === "patil") {
    let profilePic = `images/${smallLastName}_${smallFirstName}.png`;
    return profilePic;
  } else if (smallLastName.includes("-")) {
    const smallLastNameShort = smallLastName.slice(
      smallLastName.indexOf("-") + 1
    );
    let profilePic = `images/${smallLastNameShort}_${firstLetterOfName}.png`;
    return profilePic;
  } else if (smallLastName === "leanne") {
    const profilePic = `images/default.png`;
    return profilePic;
  } else {
    let profilePic = `images/${smallLastName}_${firstLetterOfName}.png`;
    return profilePic;
  }
}

function cleanData(data) {
  const capitalizedFirstLetter = data.slice(0, 1).toUpperCase();
  const lowerCaseTheRest = data.slice(1).toLowerCase();
  const cleanedData = capitalizedFirstLetter + lowerCaseTheRest;
  return cleanedData;
}

function getBloodStatus(student) {
  if (bloodData.half.includes(student.lastName)) {
    return "Halfblood";
  } else if (bloodData.pure.includes(student.lastName)) {
    return "Pureblood";
  } else {
    return "Muggleborn";
  }
}

//------filter function
function selectFilter(event) {
  //filter on a criteria
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;

  buildList();
}

function studentFilter(list) {
  if (settings.filterBy === "expelled") {
    list = allStudents.filter(isExpelled);
  } else {
    list = allStudents.filter(isNotExpelled);

    if (settings.filterBy === "gryffindor") {
      list = list.filter(isGryffindor);
    } else if (settings.filterBy === "hufflepuff") {
      list = list.filter(isHufflepuff);
    } else if (settings.filterBy === "ravenclaw") {
      list = list.filter(isRavenclaw);
    } else if (settings.filterBy === "slytherin") {
      list = list.filter(isSlytherin);
    } else if (settings.filterBy === "prefect") {
      list = list.filter(isPrefect);
    } else if (settings.filterBy === "inqSquad") {
      list = list.filter(isSquadMember);
    }
  }
  return list;
  //displayList(filteredList);
}

function isGryffindor(student) {
  if (student.house === "Gryffindor") {
    return true;
  } else {
    return false;
  }
}

function isHufflepuff(student) {
  if (student.house === "Hufflepuff") {
    return true;
  } else {
    return false;
  }
}

function isRavenclaw(student) {
  if (student.house === "Ravenclaw") {
    return true;
  } else {
    return false;
  }
}

function isSlytherin(student) {
  if (student.house === "Slytherin") {
    return true;
  } else {
    return false;
  }
}

function isExpelled(student) {
  return student.expelled;
}

function isNotExpelled(student) {
  return !student.expelled;
}

function isPrefect(student) {
  return student.prefect;
}

function isSquadMember(student) {
  return student.inqSquad;
}

//------sorting function

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //toggle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortedStudents(sortedList) {
  //let sortedList = allStudents;
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(a, b) {
    if (a[settings.sortBy] < b[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
}

function buildList() {
  const currentList = studentFilter(allStudents);
  const sortedList = sortedStudents(currentList);

  displayList(sortedList);
}

function searchFunction(element) {
  const searchString = element.target.value.toLowerCase();
  const searchedStudents = allStudents.filter((student) => {
    return student.firstName.toLowerCase().includes(searchString);
  });
  displayList(searchedStudents);
}

function displayList(students) {
  // clear the list
  document.querySelector("#container").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  //set clone data
  clone.querySelector("img").src = student.profilePic;
  clone.querySelector("#fullname").textContent =
    student.firstName + " " + student.lastName;

  clone.querySelector("#house").textContent = student.house;
  clone.querySelector("#gender").textContent = student.gender;
  clone
    .querySelector("#details")
    .addEventListener("click", () => showDetails(student));

  clone
    .querySelector("#expel")
    .addEventListener("click", () => expelledStudents(student));

  document.querySelector("#container").appendChild(clone);
}

function showDetails(student) {
  console.log(student);

  /* # blood - status; */

  const popup = document.querySelector("#popup");
  popup.style.display = "block";
  popup.querySelector("#popup_profilepic").src = student.profilePic;
  popup.querySelector("#popup_firstname").textContent = student.firstName;
  popup.querySelector("#popup_middlename").textContent = student.middleName;
  popup.querySelector("#popup_lastname").textContent = student.lastName;
  popup.querySelector("#popup_nickname").textContent = student.nickName;
  popup.querySelector("#popup_house").textContent =
    "House:" + " " + student.house;
  popup.querySelector("#popup_gender").textContent =
    "Gender:" + " " + student.gender;

  popup.querySelector("#popup_bloodstatus").textContent =
    "Blood-status:" + " " + student.bloodstatus;

  if (student.prefect === true) {
    document.querySelector("[data-field=prefect]").textContent = "⭐ prefect";
  } else {
    document.querySelector("[data-field=prefect]").textContent = "☆ prefect";
  }

  if (student.inqSquad === true) {
    document.querySelector('[data-field="club"]').textContent =
      "🏅 Inquisitorial Member";
  } else {
    document.querySelector('[data-field="club"]').textContent =
      "🎖 Not Inquisitorial Member";
  }

  //eventlistener to closePopup
  document.querySelector("#back").addEventListener("click", closePopup);

  //eventlistener to prefect
  document
    .querySelector('[data-field="prefect"]')
    .addEventListener("click", clickPrefectCallBack);

  function clickPrefectCallBack(event) {
    clickPrefect(student);
  }

  //eventlistener to inqSquad
  document
    .querySelector('[data-field="club"]')
    .addEventListener("click", clickInqSquadCallBack);

  function clickInqSquadCallBack(event) {
    clickInqSquad(student);
  }

  function closePopup() {
    document.querySelector("#back").removeEventListener("click", closePopup);

    const popup = document.querySelector("#popup");
    popup.style.display = "none";

    //remove eventlistenerss
    document
      .querySelector('[data-field="prefect"]')
      .removeEventListener("click", clickPrefectCallBack);

    document
      .querySelector('[data-field="club"]')
      .removeEventListener("click", clickInqSquadCallBack);
  }
}

function clickPrefect(student) {
  if (student.prefect === true) {
    document.querySelector("[data-field=prefect]").textContent = "☆ prefect";
    student.prefect = false;
  } else {
    tryToMakePrefect(student);

    //buildList(); - skal kun bruges hvis vi vil tilsætte ikonerne
  }
}

function clickInqSquad(student) {
  if (student.inqSquad === true) {
    student.inqSquad = false;
    document.querySelector('[data-field="club"]').textContent =
      "🎖 Not Inquisitorial Member";
  } else {
    tryToMakeMember(student);

    //buildList(); - skal kun bruges hvis vi vil tilsætte ikonerne
  }
}

function tryToMakePrefect(selectedStudent) {
  //make new array

  const prefects = allStudents.filter((student) => {
    if (student.house === selectedStudent.house && student.prefect === true) {
      return true;
    } else {
      return false;
    }
  });

  //there should only be one of each gender for each house
  //if theres more than one, give an option to remove one student
  let otherStudent;
  let isOtherStudentOfSameGender = prefects.some((student) => {
    if (selectedStudent.gender === student.gender) {
      otherStudent = student;
      return true;
    } else {
      return false;
    }
  });

  if (isOtherStudentOfSameGender) {
    showWarning(selectedStudent, otherStudent);
  } else {
    makePrefect(selectedStudent);
  }
}

function makePrefect(student) {
  student.prefect = true;
  document.querySelector("[data-field=prefect]").textContent = "⭐ prefect";
}

function showWarning(student, otherStudent) {
  //show warning popup
  document.querySelector("#warning_remove_other").classList.remove("hide");

  //ad listener to close button
  document
    .querySelector("#warning_remove_other .closebutton")
    .addEventListener("click", closeWarning);

  //show otherStudents name

  document.querySelector("[data-field=otherprefect]").textContent =
    otherStudent.firstName + " " + otherStudent.lastName;

  //add listener to remove other prefect
  document
    .querySelector("#removeotherbutton")
    .addEventListener("click", onClickRemove);

  function onClickRemove(event) {
    otherStudent.prefect = false;
    makePrefect(student);
    closeWarning();
    document
      .querySelector("#removeotherbutton")
      .removeEventListener("click", onClickRemove);
  }
}

function closeWarning() {
  //close warning and remove eventlistener
  document.querySelector("#warning_remove_other").classList.add("hide");
  document
    .querySelector("#warning_remove_other #removeotherbutton")
    .removeEventListener("click", clickRemoveOther);
}

function tryToMakeMember(student) {
  if (student.house === "Slytherin" || student.bloodstatus === "Pureblood") {
    console.log("congratz, the student is now a member!");
    student.inqSquad = true;
    document.querySelector('[data-field="club"]').textContent =
      "🏅 Inquisitorial Member";
  } else {
    student.inqSquad = false;
    console.log("the student cannot be a member!");
    document.querySelector('[data-field="club"]').textContent =
      "🎖 Not Inquisitorial Member";
    showClubWarning();
  }
}

function showClubWarning() {
  //remove hide = it is now visible
  document.querySelector("#warning_club").classList.remove("hide");

  //add eventlistener
  document
    .querySelector(".clubclosebutton")
    .addEventListener("click", closeClubWarning);

  function closeClubWarning() {
    //hide warning modal
    document.querySelector("#warning_club").classList.add("hide");

    //remove eventlistener
    document
      .querySelector(".clubclosebutton")
      .removeEventListener("click", closeClubWarning);
  }
}

function expelledStudents(student) {
  student.expelled = true;

  buildList();
}
