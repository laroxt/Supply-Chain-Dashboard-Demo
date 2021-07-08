$(document).ready(function () {
  $("#chkParent").click(function () {
    var isChecked = $(this).prop("checked");
    $("#tblData tr:has(td)").find('input[type="checkbox"]').prop("checked", isChecked);
  });

  $("#tblData tr:has(td)")
    .find('input[type="checkbox"]')
    .click(function () {
      var isChecked = $(this).prop("checked");
      var isHeaderChecked = $("#chkParent").prop("checked");
      if (isChecked == false && isHeaderChecked) $("#chkParent").prop("checked", isChecked);
      else {
        $("#tblData tr:has(td)")
          .find('input[type="checkbox"]')
          .each(function () {
            if ($(this).prop("checked") == false) isChecked = false;
          });
        console.log(isChecked);
        $("#chkParent").prop("checked", isChecked);
      }
    });
});
