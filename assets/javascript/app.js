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

// Set some initial values for our variables to be used
var trainName = "";
var destination = "";
var firstTime = "";
var frequency = 0;
var currentTime = "";
var minutesAway = 0;
var nextArrival = "";


// Event listenter for the submit button click event
$("#submitButton").on("click", function (event) {
  event.preventDefault();

  trainName = $("#newTrainID").val().trim();
  console.log("Train Name: " + trainName);

  destination = $("#newDestinationID").val().trim();
  console.log("Destination: " + destination);

  firstTime = $("#newTimeID").val().trim();
  console.log("First train time is: " + firstTime);
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  
  frequency = $("#newFrequencyID").val().trim();
  console.log("Train frequency: " + frequency);

  currentTime = moment().format("hh:mm");
  console.log("Current time: " + currentTime);
  
  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("Difference in time in minutes is: " + diffTime);

  // Time apart (remainder)
  var remainder = diffTime % frequency;
  console.log("Time remainder: " + remainder);

  // Minutes Until Train
  minutesAway = frequency - remainder;
  console.log("Minutes until the next train: " + minutesAway);

  // Next Train
  nextArrival = moment().add(minutesAway, "minutes");
  console.log("Arrival time: " + moment(nextArrival).format("hh:mm"));

  database.ref().push({
    TrainName: trainName,
    Destination: destination,
    Frequency: frequency,
    NextArrival: nextArrival,
    MinutesAway: minutesAway,
    timeSubmitted: firebase.database.ServerValue.TIMESTAMP
  });
});


// Firebase watcher .on("child_added"
database.ref().on("child_added", function(snapshot) {
  // storing the snapshot.val() in a variable for convenience
  var sv = snapshot.val();

  //add new rows to table
  $("#tablebody").append($("<tr><td>"
  +sv.trainName+"</td><td>"
  +sv.destination+"</td><td>"
  +sv.frequency+"</td><td>"
  +sv.nextArrival+"</td><td>"
  +sv.minutesAway+"</td></tr>"));

  // Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});
