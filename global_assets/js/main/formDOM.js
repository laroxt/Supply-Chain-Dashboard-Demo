function fxBumiputera() {
  var checkBox = document.getElementById("boxBumiputera");
  var text = document.getElementById("bumiputeraForm");
  if (checkBox.checked == true) {
    bumiputeraForm.style.display = "block";
  } else {
    bumiputeraForm.style.display = "none";
  }
}
function fxNonBumiputera() {
  var checkBox = document.getElementById("boxNonBumiputera");
  var text = document.getElementById("nonBumiputeraForm");
  if (checkBox.checked == true) {
    nonBumiputeraForm.style.display = "block";
  } else {
    nonBumiputeraForm.style.display = "none";
  }
}
function fxForeigner() {
  var checkBox = document.getElementById("boxForeigner");
  var text = document.getElementById("foreignerForm");
  if (checkBox.checked == true) {
    foreignerForm.style.display = "block";
  } else {
    foreignerForm.style.display = "none";
  }
}

$(document).ready(function () {
  $("select")
    .change(function () {
      $("select option:selected").each(function () {
        if ($(this).attr("value") == "1") {
          $(".formHide").hide();
          $(".ssmFormShow").show();
        }
        if ($(this).attr("value") == "0") {
          $(".formHide").hide();
          $(".ssmForeignFormShow").show();
        }
      });
    })
    .change();
});
