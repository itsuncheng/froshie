//Dropzone.autoDiscover = false;

Dropzone.options.passportDropzone = {
  //paramName: 'file', // The name that will be used to transfer the file
  maxFilesize: 2, // MB
  maxFiles: 1,
  //uploadMultiple: true,
  autoProcessQueue: false,
  init: function () {

        var myDropzone = this;

        // Update selector to match your button
        $("#uploadButton").click(function (e) {
            e.preventDefault();
            myDropzone.processQueue();
        });

    }
};

Dropzone.options.ibDropzone = {
  //paramName: 'file', // The name that will be used to transfer the file
  maxFilesize: 2, // MB
  maxFiles: 1,
  //uploadMultiple: true,
  autoProcessQueue: false,
  init: function () {

        var myDropzone = this;

          //-Update selector to match your button
        $("#uploadButton").click(function (e) {
            e.preventDefault();
            myDropzone.processQueue();
        });
        myDropzone.on("queuecomplete", function() {
        //Redirect URL
          window.location.href = 'results';
        //setTimeout(function(){window.location.href = 'results';},32000)

    });
  }
};



// Dropzone.options.ibDropzone = {
//   paramName: "ibPic", // The name that will be used to transfer the file
//   maxFilesize: 2, // MB
//   maxFiles: 1,
//   autoProcessQueue: false,
//   accept: function(file, done) {
//     if (file.name == "justinbieber.jpg") {
//       done("Naha, you don't.");
//     }
//     else { done(); }
//   }
// };


// var submitButton = document.getElementById("#uploadButton")
//     //myDropzone = this; // closure
//
// submitButton.addEventListener("click", function() {
//   Dropzone.processQueue(); // Tell Dropzone to process all queued files.
// });

// $('#uploadButton').on('click', function (e) {
//   //document.getElementById("text").style.color = "red";
//   console.log("button pressed");
//   Dropzone.processQueue();
//   // passportDropzone.processQueue();
//   // ibDropzone.processQueue();
//   //    //your awesome code here
//
// })


// function confirmUpload(){
//   console.log("button pressed")
//   passportDropzone.processQueue();
//   ibDropzone.processQueue();
//
// }
