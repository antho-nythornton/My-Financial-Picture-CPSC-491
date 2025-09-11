document.addEventListener('DOMContentLoaded', function() {
  const submitButton = document.getElementById('submitButton');

  if (submitButton) {
    submitButton.addEventListener('click', function(event) {
      console.log('Button was clicked!');
    });
  }
});