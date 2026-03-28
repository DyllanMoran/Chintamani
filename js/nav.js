document.querySelectorAll('.nav-group').forEach(function (group) {
  var label = group.querySelector('.nav-group-label');

  label.addEventListener('click', function () {
    var isOpen = group.classList.toggle('open');
    label.setAttribute('aria-expanded', isOpen);
  });

  document.addEventListener('mousedown', function (e) {
    if (!group.contains(e.target)) {
      group.classList.remove('open');
      label.setAttribute('aria-expanded', 'false');
    }
  });
});
