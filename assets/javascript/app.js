// VARIABLES
// ==============================================================================

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

// Set initial values
var trainName = "";
var destination = "";
var firstTime = "";
var frequency = 0;


// FUNCTIONS
// ==============================================================================

// Update the current time display
function update () {
  var currTimeDisplay = moment().format("LTS");
  $("#current-time").html("<h1>Current Train Scheduler time is: " + currTimeDisplay + "</h1>");
};

// Run the update current time display function
$(document).ready(function() {
  update();
  setInterval(update, 1000);
});

// Event listenter for the submit button click event
$("#submitButton").on("click", function (event) {
  event.preventDefault();

  // Capture the values entered into the form and store them in variables
  trainName = $("#newTrainID").val().trim();
  console.log("Train Name: " + trainName);

  destination = $("#newDestinationID").val().trim();
  console.log("Destination: " + destination);

  firstTime = $("#newTimeID").val().trim();
  console.log("First train time is: " + firstTime);

  frequency = $("#newFrequencyID").val().trim();
  console.log("Train frequency: " + frequency);

  // Add those values to our database
  database.ref().push({
    TrainName: trainName,
    Destination: destination,
    FirstTrainTime: firstTime,
    Frequency: frequency,
    timeSubmitted: firebase.database.ServerValue.TIMESTAMP
  });

  // Reset the form fields
  $("#newTrainID").val("");
  $("#newDestinationID").val("");
  $("#newTimeID").val("");
  $("#newFrequencyID").val("");

});

// Firebase watcher .on("child_added"
database.ref().on("child_added", function (snapshot) {
  // storing the snapshot.val() in a variable for convenience
  var sv = snapshot.val();

  // Log the snapshot values for inspection
  console.log(sv.TrainName);
  console.log(sv.Destination);
  console.log(sv.FirstTrainTime);
  console.log(sv.Frequency);

  // Convert the first train time and push it back 1 day to make sure it comes before current time
  var firstTimeConverted = moment(sv.FirstTrainTime, "HH:mm").subtract(1, "days");

  var currentTime = moment().format("hh:mm");
  console.log("Current time: " + currentTime);

  // Determine the difference between the current and first train times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("Difference in time in minutes is: " + diffTime);

  // Determine the time apart (remainder)
  var remainder = diffTime % sv.Frequency;
  console.log("Time remainder: " + remainder);

  // Determine the minutes until the next train
  var minutesAway = sv.Frequency - remainder;
  console.log("Minutes until the next train: " + minutesAway);

  // Determine the next arrival time for the train
  var nextArrival = moment().add(minutesAway, "minutes");
  var nextArrivalConverted = moment(nextArrival).format("hh:mm A");
  console.log("Arrival time: " + moment(nextArrival).format("hh:mm"));

  //Add new rows to the table
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

  // Append the data to the train row
  trainRow.append(trainNameData);
  trainRow.append(destinationData);
  trainRow.append(frequencyData);
  trainRow.append(arrivalData);
  trainRow.append(minutesData);

  // Append the train tow to the table
  $("#tablebody").append(trainRow);

  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});