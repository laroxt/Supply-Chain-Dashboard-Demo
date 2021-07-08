var _componentSelect2 = function (s, d) {
  if (!$().select2) {
    console.warn("Warning - select2.min.js is not loaded.");
    return;
  }
  s.select2({
    dropdownParent: d,
  });
};

_componentSelect2($("select.select-modal-form"), $(".add-new-subscription"));
