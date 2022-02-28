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
};

//let filterBy = "all";
const settings = {
  filterBy: "all",
  sortBy: "name",
  sortDir: "asc",
};

//make an empty array that can contain all students
const allStudents = [];

//link to json data
const url = "https://petlatkea.dk/2021/hogwarts/students.json";

//fetched data
let hogwartsData;

function start() {
  console.log("hej Hogwarts");

  console.log("test");
  buttonListener();
  loadJSON();
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

//------filter function
function selectFilter(event) {
  //filter on a criteria
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  console.log("setfilter");
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
    console.log("clicked");
    if (a[settings.sortBy] < b[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
}

async function loadJSON() {
  const jsonData = await fetch(url);
  hogwartsData = await jsonData.json();

  prepareStudents();
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

function showDetails(studentData) {
  const popup = document.querySelector("#popup");
  popup.style.display = "block";
  popup.querySelector("#popup_profilepic").src = studentData.profilePic;
  popup.querySelector("#popup_firstname").textContent = studentData.firstName;
  popup.querySelector("#popup_middlename").textContent = studentData.middleName;
  popup.querySelector("#popup_lastname").textContent = studentData.lastName;

  /*   popup.querySelector("#popup_middlename").textContent = studentData.middleName;
  popup.querySelector("#popup_lastname").textContent = studentData.lastName; */
  popup.querySelector("#popup_nickname").textContent = studentData.nickName;
  popup.querySelector("#popup_house").textContent =
    "House:" + " " + studentData.house;
  popup.querySelector("#popup_gender").textContent =
    "Gender:" + " " + studentData.gender;

  document.querySelector("#back").addEventListener("click", closePopup);

  function closePopup() {
    document.querySelector("#back").removeEventListener("click", closePopup);
    document.querySelector("#popup").style.display = "none";

    popup
      .querySelector('[data-field="prefect"]')
      .removeEventListener("click", clickPrefect);
  }

  popup
    .querySelector('[data-field="prefect"]')
    .addEventListener("click", clickPrefect);

  function clickPrefect() {
    console.log("prefect clicked");

    if (studentData.prefect === true) {
      studentData.prefect = false;
    } else {
      tryToMakePrefect(studentData);

      //buildList(); - skal kun bruges hvis vi vil tilsætte ikonerne
    }
  }

  function tryToMakePrefect(selectedStudent) {
    //make new array
    console.log("trying to make prefect");
    const prefects = allStudents.filter((student) => {
      if (student.house === selectedStudent.house && student.prefect === true) {
        return true;
      } else {
        return false;
      }
    });

    console.log("prefects", prefects);

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

    console.log("isOtherStudentOfSameGender", isOtherStudentOfSameGender);
    console.log("otherStudent", otherStudent);

    if (isOtherStudentOfSameGender) {
      console.log("there is already a prefect of this house and this gender");
      //remove 1s in array
      removeOther(otherStudent);
    } else {
      makePrefect(selectedStudent);
    }

    console.log("selectedStudent", selectedStudent);

    function makePrefect(student) {
      student.prefect = true;
      console.log("student is now prefect");
    }

    function removeOther() {
      //ask user to ignore or remove other
      document.querySelector("#warning_remove_other").classList.remove("hide");
    }
  }
}

function expelledStudents(student) {
  student.expelled = true;
  console.log("student expelled");
  buildList();
}
