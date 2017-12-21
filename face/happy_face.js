var happyval =[];
var smileval =[];
var sadval =[];

function processImage() {
    // **********************************************
    // *** Update or verify the following values. ***
    // **********************************************

    // Replace the subscriptionKey string value with your valid subscription key.
    var subscriptionKey = 

    // Replace or verify the region.
    //
    // You must use the same region in your REST API call as you used to obtain your subscription keys.
    // For example, if you obtained your subscription keys from the westus region, replace
    // "westcentralus" in the URI below with "westus".
    //
    // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
    // a free trial subscription key, you should not need to change this region.
    var uriBase = 
    // Request parameters.
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "smile,emotion",
    };

    // Display the image.
    var sourceImageUrl = document.getElementById("inputImage").value;
    document.querySelector("#sourceImage").src = sourceImageUrl;

    // Perform the REST API call.
    $.ajax({
        url: uriBase + "?" + $.param(params),

        // Request headers.
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },

        type: "POST",

        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })

    .done(function(data) {
        // Show formatted JSON on webpage.
        document.getElementById('output').innerHTML ="";
        for (i =0; i<data.length;i++){
        $("#responseTextArea").val(JSON.stringify(data, null, 2));
        $("#responseTextArea").val(data[i]["faceAttributes"]["emotion"]["happiness"]);
        $("#responseTextArea").val(data[i]["faceAttributes"]["smile"]);
        happyval[i] =data[i]["faceAttributes"]["emotion"]["happiness"];
        smileval[i] =data[i]["faceAttributes"]["smile"];
        sadval[i] =data[i]["faceAttributes"]["emotion"]["sadness"];
        console.log(data[i]["faceAttributes"]["emotion"]);
        var inputhappy =data[i]["faceAttributes"]["emotion"]["happiness"];
        var inputsmile =data[i]["faceAttributes"]["smile"];
        var outputtxt =document.getElementById('output').innerHTML;
        outputtxt =outputtxt+"<p>左から"+(i+1)+"人目の幸福度は"+inputhappy+"です</p><p>左から"+(i+1)+"人目の笑顔度は"+inputsmile+"です</p>";
        document.getElementById('output').innerHTML =outputtxt;
      }
      happycal();
    })

    .fail(function(jqXHR, textStatus, errorThrown) {
        // Display error message.
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
            jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
        alert(errorString);
    });
};

var flag =1;
function happycal(){
  for(i =0;i<happyval.length;i++){
    if (happyval[i]<0.95 || smileval[i]<0.98 ||sadval[i]>0) {
      flag =0;
      break;
    }
  }
  if (flag ==1) {
    alert("幸せ検知");
  }
}
