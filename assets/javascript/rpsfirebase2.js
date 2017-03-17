// variable list
var playerId = "";

var playerName = "";

var playerArr = [];

var position = 0;

var setFlag = false;

var p1Choice = "";

var p2Choice = "";

var p1Wins = 0;

var p2Wins = 0;

var p1Loss = 0;

var p2Loss = 0;

// Initialize Firebase



var config = {
    apiKey: "AIzaSyB4l14KNK0zTvdN0X86fCCmbp2HuBooLog",
    authDomain: "rpsfirebase-e6c99.firebaseapp.com",
    databaseURL: "https://rpsfirebase-e6c99.firebaseio.com",
    storageBucket: "rpsfirebase-e6c99.appspot.com",
    messagingSenderId: "382261289135"
};

firebase.initializeApp(config);

var fireDb = firebase.database();




// game object


var rps = {

    playerOne: " Player 1",

    PlayerTwo: " Player 2",


    message: "",


    setPlayerPos: function() { // set player position

        var connectedOk = fireDb.ref("/p1");

        connectedOk.once("value").then(function(snap) {

            test = snap.val();

            console.log(test);

            if (test !== null) {


                fireDb.ref().update({
                    p2: {
                        name: "Player 2",
                        choice: "null",
                        loss: 0,
                        wins: 0
                    }



                });

                position = 2;

                $(".pBtn1").removeClass("pBtn1").addClass("pBtn1b");

                $(".pBtn1b").attr("disabled", "disabled");

                var newMes = "Player Two Logged in"

                fireDb.ref("message").set(newMes);

                var ref = firebase.database().ref("/p2");
                ref.onDisconnect().remove();



            } else {

                setFlag = true;

                fireDb.ref().update({
                    p1: {
                        name: "Player 1",
                        choice: "null",
                        loss: 0,
                        wins: 0
                    }
                });


                position = 1;

                console.log("position" + position)

                $(".pBtn2").removeClass("pBtn2").addClass("pBtn2b");

                $(".pBtn2b").attr("disabled", "disabled");
                
                $(".pBtn1").attr("disabled", "disabled");

                var newMes = "Player One Logged in"

                fireDb.ref("message").set(newMes);


                var ref = firebase.database().ref("/p1");

                ref.onDisconnect().remove();

            }


        });


    },



    nameSet: function(name) { // set player names

        var pName = $('#name').val().trim();

        playerName = pName;

        console.log(pName);


        if (pName.length < 1) {

            console.log(pName);

            return;

        } else if (position === 1) {

            $("#sendMessage").attr("data-pId", "1")

            fireDb.ref("/p1/name/").set(pName);

            rps.playerOne = pName

            console.log(pName);

            $(".pBtn1").removeAttr('disabled');

            $("#p1Name").text(playerName);

            $("#submitName").prop("disabled", true);

            fireDb.ref("message").set("Player One is --->  " + pName);

            return;

        } else {


            fireDb.ref("/p2/name/").set(pName);

            rps.playerTwo = pName;

            $("#sendMessage").attr("data-pId", "2")

            $("#p2Name").text(pName);

            $("#submitName").prop("disabled", true);

            fireDb.ref("message").set("Player Two is --->  " + rps.playerTwo);

            fireDb.ref("results").set("<center><h1> </h1></center>");


        }

    },


    startGame: function() { // start game set up

        fireDb.ref().update({

            turn: 1

        });

        fireDb.ref().update({

            message: ""
        });

        fireDb.ref().update({

            results: "Shall We Play A Game!"

        });


        var fireMes = fireDb.ref("message");

        fireMes.on('value', function(data) {



            rps.message = data.val();



        });



    },

    evaluate: function() { // decide who wins

        choice = p1Choice + p2Choice;

        console.log(choice);

        if (p1Choice === p2Choice) { // tie game

            fireDb.ref("results").set("<center><h1>Tie Game!</h1></center>");


            return;
        }



        if ((choice == "rs") || (choice == "sp") || (choice == "pr")) { // player 1 wins

            fireDb.ref("results").set("<center><h1>" + $("#p1Name").text() + " Wins!</h1></center>");

            p1Wins++
            p2Loss++

            fireDb.ref("p1/wins/").set(p1Wins);
            fireDb.ref("p2/loss/").set(p2Loss);

            return;


        } else { // player 2 wins

            fireDb.ref("results").set("<center><h1>" + $("#p2Name").text() + " Wins!</h1></center>");



            p2Wins++
            p1Loss++

            fireDb.ref("p2/wins/").set(p2Wins);
            fireDb.ref("p1/loss/").set(p1Loss);



        }

    }

};


rps.startGame(); // call start game function
rps.setPlayerPos(); // set player position based on order of log on to game


fireDb.ref("/p1/wins").once("value", function(snapshot) { // initialize player 1 wins

    var score = snapshot.val();

    if (score === null) {

        score = 0;
    }


    p1Wins = score;


});

fireDb.ref("/p2/wins").once("value", function(snapshot) { // initialize player 2 wins

    var score = snapshot.val();


    if (score === null) {

        score = 0;

        $("#p2Wins").text("0");
    }

    p2Wins = score;


});


fireDb.ref("/p1/loss").once("value", function(snapshot) { // initialize player 1 losses

    var score = snapshot.val();

    if (score === null) {

        score = 0;
    }


    p1Loss = score;


});


fireDb.ref("/p2/loss").once("value", function(snapshot) { // initialize player 2 losses

    var score = snapshot.val();

    if (score === null) {

        score = 0;

        $("#p2Loss").text("0");
    }


    p2Loss = score;


});




fireDb.ref("/p1/name/").on("value", function(snapshot) { // initialize player 1 name

    rps.playerOne = snapshot.val();

    console.log("P1 Name " + name);


    if (position == 1) {

        $(".pBtn2").attr("disabled", "disabled");

    }

    if (position == 2) {

        $(".pBtn1").attr("disabled", "disabled");



    }



    var ref = firebase.database().ref("message");

    ref.onDisconnect().set(rps.playerOne + " has left the game!");

    var ref = firebase.database().ref("/turn");

    ref.onDisconnect().set(1);


});

fireDb.ref("/p2/name/").on("value", function(snapshot) { // initialize player 2 name

    rps.playerTwo = snapshot.val();


    if (rps.playerTwo === null) {

        rps.playerTwo = " Player 2";

        $(".pBtn2").attr("disabled", "disabled");
    }

    console.log("Player 2 : " + name);

    var ref = firebase.database().ref("message");

    ref.onDisconnect().set(rps.playerTwo + " has left the game!");

    var ref = firebase.database().ref("/turn");

    ref.onDisconnect().set(1);


});




fireDb.ref("/p1/choice/").on("value", function(snapshot) { // player 1 choice

    p1Choice = snapshot.val();

});

fireDb.ref("/p2/choice/").on("value", function(snapshot) { // player 2 choice

    p2Choice = snapshot.val();

});


fireDb.ref("/results/").on("value", function(snapshot) { // results message

    var score = snapshot.val();



    $("#results").html("<center><h1>" + score + "</h1></center>");


});


fireDb.ref("/p1/wins").on("value", function(snapshot) { // player 1 screen update wins

    var score = snapshot.val();



    $("#p1Wins").text(score);


});

fireDb.ref("/p2/wins").on("value", function(snapshot) { // player 2 screen update wins

    var score = snapshot.val();



    $("#p2Wins").text(score);


});


fireDb.ref("/p1/loss").on("value", function(snapshot) { // player 1 screen update wins

    var score = snapshot.val();



    $("#p1Loss").text(score);


});


fireDb.ref("/p2/loss").on("value", function(snapshot) { // player 2 screen update wins

    var score = snapshot.val();



    $("#p2Loss").text(score);


});

if ((rps.playerOne === "Player 1") || (rps.playerTwo === " Player 2")) { 

// disable buttons until both players set

    $(".pBtn1").attr("disabled", "disabled");

    $(".pBtn2").attr("disabled", "disabled");

    console.log("The Name Is The Same");

}

// Wait For Document To Load

$(document).ready(function() {




    fireDb.ref("/turn").on("value", function(snapshot) { // monitor whos turn it is and take action
        var ref = snapshot.val();

        if (ref === 1) {

            $(".pBtn1").removeAttr('disabled');

            $(".pBtn1").css({
                "border": "2px solid green"
            });

            $(".pBtn1b").css({
                "border": "2px solid green"
            });

            $(".pBtn2").css({
                "border": "2px solid red"
            });

            $(".pBtn2b").css({
                "border": "2px solid red"
            });


            $(".pBtn2").attr("disabled", "disabled");

        } else {


            $(".pBtn2").css({
                "border": "2px solid green"
            });
            $(".pBtn2b").css({
                "border": "2px solid green"
            });

            $(".pBtn2").removeAttr('disabled');

            $(".pBtn1").css({
                "border": "2px solid red"
            });
            $(".pBtn1b").css({
                "border": "2px solid red"
            });

            $(".pBtn1").attr("disabled", "disabled");


        }


    });



    fireDb.ref().on("value", function(snapshot) { // set player names




        $("#p1Name").text(rps.playerOne);

        $("#p2Name").text(rps.playerTwo);


        if (rps.message === null) {

            return;
        }

        $("#messageArea").append("<div>" + rps.message + "</div>");

        rps.message = null;


    });



    $('#submitName').on('click', function() { // name submit event listener

        rps.nameSet();

        return false;

    });

    $('.messageBtn').on('click', function() {

        var newMes = $('#message').val().trim();

        console.log(newMes);

        if (newMes.length < 1) {

            return;
        } else {

            fireDb.ref("message").set(newMes);

            $("#message").val("");


        }


    });


    $(".pBtn1").on("click", function(snapshot) { // player 1 buttons

        var ref = this.id;
        fireDb.ref("/p1/choice/").set(ref);
        console.log(ref);

        fireDb.ref("/turn").set(2);


    });

    $(".pBtn2").on("click", function(snapshot) { // player 2 buttons

        var ref = this.id;

        fireDb.ref("/p2/choice/").set(ref);


        rps.evaluate();



        fireDb.ref("/turn").set(1);
        console.log(ref);

    });


});