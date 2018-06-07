// Initialize the Firebase database
var config = {
  apiKey: "AIzaSyARYKUXmQcmsDfTx7zNa-Fa0RK4lKRUM0k",
  authDomain: "trainscheduler-2a351.firebaseapp.com",
  databaseURL: "https://trainscheduler-2a351.firebaseio.com",
  projectId: "trainscheduler-2a351",
  storageBucket: "trainscheduler-2a351.appspot.com",
  messagingSenderId: "1053841504244"
};

firebase.initializeApp(config);

var database = firebase.database();

// Set some initial values for our variables
var trainName = "";
var destination = "";
var firstTime = "";
var frequency = 0;

// var update = function() {
//   $("#current-time")= moment().format("LTS"); 
// };

// setInterval(update, 1000);

function update () {
  var currTimeDisplay = moment().format("LTS");
  $("#current-time").html("<h1>Current Train Scheduler time is: " + currTimeDisplay + "</h1>");
  
  // $("#current-time") = moment().format("LTS");
  // setInterval(update, 1000);
};

$(document).ready(function() {
  update();
  setInterval(update, 1000);
});

// window.onload = function () {
// $(document).ready(function() {
  

// })
  
// };


// Event listenter for the submit button click event
$("#submitButton").on("click", function (event) {
  event.preventDefault();

  trainName = $("#newTrainID").val().trim();
  console.log("Train Name: " + trainName);

  destination = $("#newDestinationID").val().trim();
  console.log("Destination: " + destination);

  firstTime = $("#newTimeID").val().trim();
  console.log("First train time is: " + firstTime);

  frequency = $("#newFrequencyID").val().trim();
  console.log("Train frequency: " + frequency);

  database.ref().push({
    TrainName: trainName,
    Destination: destination,
    FirstTrainTime: firstTime,
    Frequency: frequency,
    timeSubmitted: firebase.database.ServerValue.TIMESTAMP
  });

  $("#newTrainID").val("");
  $("#newDestinationID").val("");
  $("#newTimeID").val("");
  $("#newFrequencyID").val("");

});

// Firebase watcher .on("child_added"
database.ref().on("child_added", function (snapshot) {
  // storing the snapshot.val() in a variable for convenience
  var sv = snapshot.val();

  console.log(sv.TrainName);
  console.log(sv.Destination);
  console.log(sv.FirstTrainTime);
  console.log(sv.Frequency);

  var firstTimeConverted = moment(sv.FirstTrainTime, "HH:mm").subtract(1, "days");

  var currentTime = moment().format("hh:mm");
  console.log("Current time: " + currentTime);

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("Difference in time in minutes is: " + diffTime);

  // Time apart (remainder)
  var remainder = diffTime % sv.Frequency;
  console.log("Time remainder: " + remainder);

  // Minutes Until Train
  var minutesAway = sv.Frequency - remainder;
  console.log("Minutes until the next train: " + minutesAway);

  // Next Train
  var nextArrival = moment().add(minutesAway, "minutes");
  var nextArrivalConverted = moment(nextArrival).format("hh:mm A");
  console.log("Arrival time: " + moment(nextArrival).format("hh:mm"));

  //add new rows to table
  var trainRow = $("<tr>");
  var trainNameData = $("<td>");
  trainNameData.append(sv.TrainName);
  var destinationData = $("<td>");
  destinationData.append(sv.Destination);
  var frequencyData = $("<td>");
  frequencyData.append(sv.Frequency);
  var arrivalData = $("<td>");
  arrivalData.append(nextArrivalConverted);
  var minutesData = $("<td>");
  minutesData.append(minutesAway);

  trainRow.append(trainNameData);
  trainRow.append(destinationData);
  trainRow.append(frequencyData);
  trainRow.append(arrivalData);
  trainRow.append(minutesData);

  $("#tablebody").append(trainRow);

  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

update();