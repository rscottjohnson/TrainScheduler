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
var frequency = "";
var currentTime = "";
var nextArrival = "";
var minutesAway = "";

// Event listenter for the submit button click event
$("#submitButton").on("click", function (event) {
  event.preventDefault();

  trainName = $("#newTrainID").val().trim();
  destination = $("#newDestinationID").val().trim();
  firstTime = $("#newTimeID").val().trim();
  frequency = $("#newFrequencyID").val().trim();
  currentTime = moment(firebase.database.ServerValue.TIMESTAMP);
  // nextArrival
  // ...runs every x hh:mm, what is that next time, how long is it from now
  // nextArrival = moment(currentTime).diff(firstTime,'minutes',true);
  // minutesAway = moment(currentTime).diff(nextArrival,'minutes',true);

  console.log(trainName);
  console.log(destination);
  console.log(firstTime);
  console.log(frequency);
  console.log(currentTime);
  // console.log(nextArrival);
  // console.log(minutesAway);


  var temp = {
    TrainName: trainName,
    Destination: destination,
    Frequency: frequency,
    // NextArrival: nextArrival,
    SubmitTime: currentTime,
    // MinutesAway: minutesAway
  }

  database.ref().push(temp);

  $("#newTrainID").val('');
  $("#newDestinationID").val('');
  $("#newTimeID").val('');
  $("#newFrequencyID").val('');

});



// //grab the added information
// database.ref().on("child_added", function (childSnapshot) {
//   console.log(childSnapshot.val().trainName);
//   console.log(childSnapshot.val().destination);
//   console.log(childSnapshot.val().trainTime);
//   console.log(childSnapshot.val().MonthsWorked);
//   console.log(childSnapshot.val().Rate);
//   console.log(childSnapshot.val().SubmitDate);

//   //add new rows to table
//   $("#tablebody").append($("<tr><td>"
//   +childSnaphot.val().EmployeeName+"</td><td>"
//   +childSnaphot.val().Role+"</td><td>"
//   +childSnaphot.val().StartDate+"</td><td>"
//   +childSnaphot.val().MonthsWorked+"</td><td>"
//   +childSnaphot.val().Rate+"</td><td>"
//   +childSnaphot.val().PayOut
//   +"</td></tr>"))

// });