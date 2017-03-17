
var playerId ="";

var playerName = "";

var playerArr = [];

var position = 0;

var setFlag = false;

var p1Choice = "";

var p2Choice = "";


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


    




        

  var rps = {

    playerOne: " Player 1",

    PlayerTwo: " Player 2",

    
    message: "",


    setPlayerOne: function(){

             var connectedOk = fireDb.ref("/p1");

      connectedOk.once("value").then(function(snap) { 

        test = snap.val();

        console.log(test);

        if (test !== null)

        {


            return;


        }

       if (test === null) {

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

        $(".pBtn2b").attr("disabled","disabled");


        var ref = firebase.database().ref("/p1");

        ref.onDisconnect().remove();

    }

        
});






    },


    setPlayerTwo: function() {

            console.log(setFlag);

      if (position === 1) {

        var connectedOk = fireDb.ref("/p2");

      connectedOk.once("value").then( function(snap) { 

        test = snap.val();

        console.log(test);

       if (test === null) {

        fireDb.ref().update({
           p2: {
                name: "Player 2",
                choice: "null",
                loss: 0,
                wins: 0
            }

            

        });

        

    }

position = 2;

 $(".pBtn1").removeClass("pBtn1").addClass("pBtn1b");

        $(".pBtn1b").attr("disabled","disabled");

        
var ref = firebase.database().ref("/p2");
ref.onDisconnect().remove();


  });

}

    },


  nameSet: function(name) {

var pName = $('#name').val().trim();

playerName = pName;

console.log(pName);

            
      if (pName.length < 1) {

        console.log(pName);

            return;

      } else if (position === 1 ) { 

            $("#sendMessage").attr("data-pId","1")

           fireDb.ref("/p1/name/").set(pName);

           rps.playerOne = pName

           console.log(pName);

           $(".pBtn1").removeAttr('disabled');

           $("#p1Name").text(playerName);

           $("#submitName").prop("disabled",true);

           fireDb.ref("message").set("Player One is --->  " + pName);

            return;

        }

        
else {


        fireDb.ref("/p2/name/").set(pName);

        rps.playerTwo = pName;

                     $("#sendMessage").attr("data-pId","2")

                    $("#p2Name").text(pName);

                     $("#submitName").prop("disabled",true);

                   fireDb.ref("message").set("Player Two is --->  " + rps.playerTwo);

                
            }
           

     

  },


  startGame: function() {

    fireDb.ref().update({

        turn: 1

    });

    fireDb.ref().update({

        message: ""
  });




   var fireMes = fireDb.ref("message");

   fireMes.on('value', function(data){

   

   rps.message = data.val();

   

   

});



},

 evaluate: function() {

    choice = p1Choice + p2Choice;

    console.log(choice);

    if (p1Choice === p2Choice) {

        $("#eval").html("<center><h1>Tie Game!</h1></center>")


        return;
    }



     if ((choice == "rs") || (choice == "sp")  || (choice == "pr")) {

        $("#eval").html("<center><h1>" + $("#p1Name").text() + " Wins!</h1></center>")

        return;
    }

    else {

    $("#eval").html("<center><h1>" + $("#p2Name").text() + " Wins!</h1></center>")

    }

    

    

 }  

};


rps.startGame();
rps.setPlayerOne();

rps.setPlayerTwo();






fireDb.ref("/p1/name/").on("value",function(snapshot) {

 rps.playerOne = snapshot.val();

 console.log("P1 Name " + name);


 if (position == 1) {

    $(".pBtn2").attr("disabled","disabled");

 }

 if (position == 2) {

$(".pBtn1").attr("disabled","disabled");



 }



 var ref = firebase.database().ref("message");

ref.onDisconnect().set(rps.playerOne + " has left the game!");

var ref = firebase.database().ref("/turn");

ref.onDisconnect().set(1);


});

fireDb.ref("/p2/name/").on("value", function(snapshot) {

 rps.playerTwo = snapshot.val();


 if (rps.playerTwo === null) {

    rps.playerTwo = " Player 2";

    $(".pBtn2").attr("disabled","disabled");
 }

 console.log("Player 2 : " + name);

 var ref = firebase.database().ref("message");

ref.onDisconnect().set(rps.playerOne + " has left the game!");

var ref = firebase.database().ref("/turn");

ref.onDisconnect().set(1);


});

if ((rps.playerOne === "Player 1") || (rps.playerTwo === " Player 2")) {

$(".pBtn1").attr("disabled","disabled");

$(".pBtn2").attr("disabled","disabled");

}


fireDb.ref("/p1/choice/").on("value", function(snapshot) {

p1Choice = snapshot.val();

});

fireDb.ref("/p2/choice/").on("value", function(snapshot) {

p2Choice = snapshot.val();

});

// Wait For Document To Load

$(document).ready(function() {




 fireDb.ref("/turn").on("value", function(snapshot) {
  var ref = snapshot.val();



    

 

  if (ref === 1 ) {

    $(".pBtn1").removeAttr('disabled');

    $(".pBtn1").css({"border":"2px solid green"});

    $(".pBtn1b").css({"border":"2px solid green"});

    $(".pBtn2").css({"border":"2px solid red"});

    $(".pBtn2b").css({"border":"2px solid red"});


    $(".pBtn2").attr("disabled","disabled");

  } else {


$(".pBtn2").css({"border":"2px solid green"});
$(".pBtn2b").css({"border":"2px solid green"});

$(".pBtn2").removeAttr('disabled');

    $(".pBtn1").css({"border":"2px solid red"});
    $(".pBtn1b").css({"border":"2px solid red"});

    $(".pBtn1").attr("disabled","disabled");


  }


 });


 fireDb.ref().on("value", function(snapshot) {



$("#p1Name").text(rps.playerOne);

$("#p2Name").text(rps.playerTwo);


if (rps.message === null) {

    return;
}

$("#messageArea").append("<div>" + rps.message + "</div>");

rps.message = null;


 });

  

    $('#submitName').on('click', function() {

            rps.nameSet();

        return false;

      });

    $('.messageBtn').on('click', function() {

var newMes = $('#message').val().trim();

console.log(newMes);

if (newMes.length < 1) {

    return;
}

 else {

        fireDb.ref("message").set(newMes);

        $("#message").val("");


}
   

});


    $(".pBtn1").on("click", function(snapshot) {

        var ref = this.id;
            fireDb.ref("/p1/choice/").set(ref);
        console.log(ref);

        fireDb.ref("/turn").set(2);
       

    });

    $(".pBtn2").on("click", function(snapshot) {

        var ref = this.id;

            fireDb.ref("/p2/choice/").set(ref);
        

               rps.evaluate();

       

        fireDb.ref("/turn").set(1);
        console.log(ref);

    });


});
         


   


