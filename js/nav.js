document.querySelectorAll('.nav-group').forEach(function (group) {
  var label = group.querySelector(':scope > .nav-group-label');

  label.addEventListener('click', function (e) {
    e.stopPropagation();
    var isOpen = group.classList.toggle('open');
    label.setAttribute('aria-expanded', isOpen);

    // When closing, also close any nested groups
    if (!isOpen) {
      group.querySelectorAll('.nav-group').forEach(function (nested) {
        nested.classList.remove('open');
        var nestedLabel = nested.querySelector('.nav-group-label');
        if (nestedLabel) nestedLabel.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Use pointerdown to cover both mouse and touch on iOS
  document.addEventListener('pointerdown', function (e) {
    if (!group.contains(e.target)) {
      group.classList.remove('open');
      label.setAttribute('aria-expanded', 'false');
    }
  });
});
