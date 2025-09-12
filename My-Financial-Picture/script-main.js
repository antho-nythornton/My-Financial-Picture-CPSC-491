function changeButtonColor() {
  document.getElementById('submitButton');
  document.getElementById('submitButton').addEventListener('mousedown', function() {
    document.getElementById('submitButton').style.background = 'rgba(131, 191, 255, 1)';
  });
  document.getElementById('submitButton').addEventListener('mouseup', function() {
    document.getElementById('submitButton').style.background = 'white';
  });
}
