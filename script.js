"use strict";

window.addEventListener("DOMContentLoaded", start);

//global variable
let hacked = false;

//prototype for all students
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
  hacker: false,
};

//let filterBy = "all";
const settings = {
  filterBy: "all",
  sortBy: "firstName",
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

//delegator to other functions
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

  //hack button
  document
    .querySelector("#hack_button")
    .addEventListener("click", clickOnMysteriousButton);

  filterButtons.forEach((button) =>
    button.addEventListener("click", selectFilter)
  );

  /*   sortButtons.forEach((button) => button.addEventListener("click", selectSort)); */
  //  it's a dropdown list so I'll have to check for the change event
  document.querySelector("#sorting").addEventListener("change", selectSort);

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
  // displayList(allStudents);
  buildList();
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
  document.querySelector(".chosen").classList.remove("chosen");
  this.classList.add("chosen");

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
  // get the chosen one in the dropdown list which is the value
  const sortBy = event.target.value;
  // since I can't choose directions asc/desc I hardcoded it to ascending
  const sortDir = "asc";

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

  //number of students in each house
  let numOfExpelledStudents = allStudents.filter(
    (student) => student.expelled
  ).length;

  document.querySelector("#num_expelled_students").textContent =
    "Expelled Students: " + numOfExpelledStudents;

  //total number of active students (not expelled)

  const activeStudents = allStudents.length - numOfExpelledStudents;

  document.querySelector("#num_active_students").textContent =
    "Active Students " + activeStudents;

  //Number of students currently displayed
  let numCurrentDisplay = students.length;

  document.querySelector("#num_current_display").textContent =
    "Currently displaying " + numCurrentDisplay;

  //Number of students in each house
  //make empty array
  let numOfActiveStudents = [];

  //put all students in array except the expelled ones
  numOfActiveStudents = allStudents.filter((student) => {
    if (!student.expelled) {
      return true;
    } else {
      return false;
    }
  });

  //Gryffindor
  let numStudentsGryffindor = numOfActiveStudents.filter(isGryffindor).length;

  document.querySelector("#num_gryffindor").textContent =
    "Gryffindors: " + numStudentsGryffindor;

  //hufflepuff
  let numStudentsHufflepuff = numOfActiveStudents.filter(isHufflepuff).length;

  document.querySelector("#num_hufflepuff").textContent =
    "Hufflepuffs: " + numStudentsHufflepuff;

  //Slytherin
  let numStudentsSlytherin = numOfActiveStudents.filter(isSlytherin).length;

  document.querySelector("#num_slytherin").textContent =
    "Slytherin: " + numStudentsSlytherin;

  //Ravenclaw
  let numStudentsRavenclaw = numOfActiveStudents.filter(isRavenclaw).length;

  document.querySelector("#num_ravenclaw").textContent =
    "Ravenclaw: " + numStudentsRavenclaw;
}

function displayStudent(student) {
  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  //set clone data

  clone.querySelector("img").src = student.profilePic;
  clone.querySelector("#firstname").textContent = student.firstName;
  clone.querySelector("#middlename").textContent = student.middleName;
  clone.querySelector("#lastname").textContent = student.lastName;

  clone.querySelector("#house").innerHTML = "<b>House: </b>" + student.house;
  clone.querySelector("#gender").innerHTML = "<b>Gender: </b>" + student.gender;
  clone
    .querySelector(".see_details")
    .addEventListener("click", () => showDetails(student));

  clone
    .querySelector("#expel")
    .addEventListener("click", () => expelledStudents(student));

  //show house badges and color border for each house

  if (student.house === "Gryffindor") {
    clone.querySelector("article").style.backgroundColor =
      "rgba(166, 3, 33, 0.76)";
    clone.querySelector(".house_badge").src = "icons/gryffindor.png";
    clone.querySelector("#expel").style.backgroundColor = "#000";
    /*  clone.querySelector("article").style.borderColor = "#e1b024"; */
  } else if (student.house === "Slytherin") {
    clone.querySelector("article").style.backgroundColor =
      "rgba(56, 153, 90, 0.76)";
    clone.querySelector(".house_badge").src = "icons/slytherin.png";
    /*  clone.querySelector("article").style.borderColor = "#c0c0c0"; */
  } else if (student.house === "Ravenclaw") {
    clone.querySelector("article").style.backgroundColor =
      "rgba(43, 72, 148, 0.74)";
    /*   clone.querySelector("article").style.borderColor = "#c0c0c0"; */
    clone.querySelector(".house_badge").src = "icons/ravenclaw.png";
  } else if (student.house === "Hufflepuff") {
    clone.querySelector("article").style.backgroundColor =
      "rgba(255, 202, 0, 0.75)";
    clone.querySelector(".house_badge").src = "icons/hufflepuff.png";
    /*     clone.querySelector("article").style.borderColor = "#000"; */
  }

  //hide expel button if student is already expelled

  if (student.expelled === true) {
    clone.querySelector("#expel").classList.add("hidden");
    (student.prefect = false),
      clone.querySelector("#is_prefect").classList.add("hidden"),
      document.querySelector("[data-field=prefect]").classList.add("hidden"),
      (student.inqSquad = false),
      clone.querySelector("#is_member").classList.add("hidden"),
      document.querySelector('[data-field="inqSquad"]').classList.add("hidden");
  } else {
    document.querySelector("[data-field=prefect]").classList.remove("hidden"),
      clone.querySelector("#is_prefect").classList.remove("hidden"),
      document
        .querySelector('[data-field="inqSquad"]')
        .classList.remove("hidden");
    clone.querySelector("#is_member").classList.remove("hidden");
  }

  if (student.prefect === true) {
    clone.querySelector("#is_prefect").classList.remove("hidden");
  } else {
    clone.querySelector("#is_prefect").classList.add("hidden");
  }

  if (student.inqSquad === true) {
    clone.querySelector("#is_member").classList.remove("hidden");
  } else {
    clone.querySelector("#is_member").classList.add("hidden");
  }

  document.querySelector("#container").appendChild(clone);
}

function expelledStudents(student) {
  if (student.hacker === false) {
    student.expelled = true;
  } else {
    student.expelled = false;
    warningHacking();
  }

  buildList();
}

function showDetails(student) {
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
    document.querySelector("[data-field=prefect]").textContent = "??? prefect";
    document.querySelector("#is_prefect").classList.remove("hidden");
  } else {
    document.querySelector("[data-field=prefect]").textContent = "??? prefect";
    document.querySelector("#is_prefect").classList.add("hidden");
  }

  if (student.inqSquad === true) {
    document.querySelector('[data-field="inqSquad"]').textContent =
      "???? Inquisitorial Member";
    document.querySelector("#is_member").classList.remove("hidden");
  } else {
    document.querySelector('[data-field="inqSquad"]').textContent =
      "???? Not Inquisitorial Member";
    document.querySelector("#is_member").classList.add("hidden");
  }

  if (student.house === "Gryffindor") {
    document.querySelector("#popup_article").style.backgroundColor = "#740001";
    document.querySelector(".house_badge").src = "icons/gryffindor.png";
    document.querySelector(".name_wrapper").style.color = "#e2b125";
  } else if (student.house === "Slytherin") {
    document.querySelector("#popup_article").style.backgroundColor = "#1A472A";
    document.querySelector(".house_badge").src = "icons/slytherin.png";
    document.querySelector(".name_wrapper").style.color = "#ffff";
  } else if (student.house === "Hufflepuff") {
    document.querySelector("#popup_article").style.backgroundColor = "#E2B125";
    document.querySelector(".house_badge").src = "icons/hufflepuff.png";
    document.querySelector(".name_wrapper").style.color = "#000";
  } else if (student.house === "Ravenclaw") {
    document.querySelector("#popup_article").style.backgroundColor = "#0E1A40";
    document.querySelector(".house_badge").src = "icons/ravenclaw.png";
    document.querySelector(".name_wrapper").style.color = "#ffff";
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
    .querySelector('[data-field="inqSquad"]')
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
      .querySelector('[data-field="inqSquad"]')
      .removeEventListener("click", clickInqSquadCallBack);
  }
}

function clickPrefect(student) {
  if (student.prefect === true) {
    student.prefect = false;
  } else {
    tryToMakePrefect(student);
  }
  buildList();

  if (student.prefect === true) {
    document.querySelector("[data-field=prefect]").textContent = "??? prefect";
  } else {
    document.querySelector("[data-field=prefect]").textContent = "??? prefect";
  }
}

function clickInqSquad(student) {
  if (student.inqSquad === true) {
    student.inqSquad = false;
    document.querySelector('[data-field="inqSquad"]').textContent =
      "???? Not Inquisitorial Member";
  } else {
    tryToMakeMember(student);

    //buildList(); - skal kun bruges hvis vi vil tils??tte ikonerne
  }
  buildList();
  if (student.inqSquad === true) {
    document.querySelector('[data-field="inqSquad"]').textContent =
      "???? Inquisitorial Member";
  } else {
    document.querySelector('[data-field="inqSquad"]').textContent =
      "???? Not Inquisitorial Member";
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
}

function tryToMakeMember(student) {
  if (student.house === "Slytherin" || student.bloodstatus === "Pureblood") {
    console.log("congratz, the student is now a member!");
    student.inqSquad = true;
    if (hacked === true) {
      //remove membership after 2 seconds
      setTimeout(cancelMembership, 2000, student);
      function cancelMembership(student) {
        student.inqSquad = false;
        document.querySelector('[data-field="inqSquad"]').textContent =
          "???? Not Inquisitorial Member";
        buildList();
      }
    }
  } else {
    student.inqSquad = false;
    console.log("the student cannot be a member!");

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

function clickOnMysteriousButton() {
  //remove eventlistener
  document
    .querySelector("#hack_button")
    .removeEventListener("click", clickOnMysteriousButton);

  //make the screen shake
  document.querySelector("body").classList.add("shake");

  //send to hackTheSystem after animation
  document
    .querySelector("body")
    .addEventListener("animationend", hackTheSystem);
}

function hackTheSystem() {
  console.log("system is now hacked");

  hacked = true;

  //remove eventlistener
  document
    .querySelector("#hack_button")
    .removeEventListener("click", hackTheSystem);

  //inject myself
  const newStudent = {
    firstName: "Cecilie",
    middleName: "Jasmin",
    nickName: "",
    gender: "Girl",
    lastName: "Joergensen",
    profilePic: "images/default.png",
    house: "Hufflepuff",
    prefect: false,
    expelled: false,
    bloodstatus: "Muggleborn",
    inqSquad: false,
    hacker: true,
  };

  allStudents.push(newStudent);
  randomizeBloodStatus();

  buildList();
}

function randomizeBloodStatus() {
  //mix up bloodstatus
  allStudents.forEach((student) => {
    if (student.bloodstatus === "Muggleborn") {
      student.bloodstatus = "Pureblood";
    } else if (student.bloodstatus === "Halfblood") {
      student.bloodstatus = "Pureblood";
    } else {
      //randomize pureblood students to other bloodstatus
      let bloodStatusRandom = Math.floor(Math.random() * 3);
      if (bloodStatusRandom === 0) {
        student.bloodstatus = "Pureblood";
      } else if (bloodStatusRandom === 1) {
        student.bloodstatus = "Halfblood";
      } else {
        student.bloodstatus = "Muggleborn";
      }
    }
  });
}

function warningHacking() {
  //show warning
  document.querySelector("#warning_hacking").classList.remove("hide");

  //ad listener to close button
  document
    .querySelector(".hackingclosebutton")
    .addEventListener("click", closeHackingWarning);
}

function closeHackingWarning() {
  //hide warning
  document.querySelector("#warning_hacking").classList.add("hide");

  //remove listener to close button
  document
    .querySelector(".hackingclosebutton")
    .removeEventListener("click", closeHackingWarning);
}
