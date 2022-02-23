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

//start function, calls to load JSON function
function start() {
  console.log("hej Hogwarts");
  loadJSON();
}

//hent json data with async function
async function loadJSON() {
  const jsonData = await fetch(url);
  hogwartsData = await jsonData.json();
  //show hogwarts data in a table in the console
  console.table(hogwartsData);
  //call createStudents function
  prepareStudents();
}

//delegator to other functions
function prepareStudents() {}

function getFirstName() {}
function getMiddleName() {}
function getNickName() {}
function getLastName() {}
function getGender() {}
function getHouse() {}
function getProfilePic() {}
function cleanData() {}
