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
};

//make an empty array that can contain all students
const allStudents = [];

//link to json data
const url = "https://petlatkea.dk/2021/hogwarts/students.json";

//fetched data
let hogwartsData;

function start() {
  console.log("hej Hogwarts");
  loadJSON();
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
  displayList();
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

  document.querySelector("#container").appendChild(clone);
}
