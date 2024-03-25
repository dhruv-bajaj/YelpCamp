let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentYearElement = document.getElementById("currentYear");
currentYearElement.textContent = currentYear;

(() => {
  "use strict";
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".validated-form");
  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

const slider = document.getElementById("rating");
if (slider) {
  const ratingInput = document.getElementById("ratingInput");
  slider.addEventListener("input",()=>{
    const elements = slider.getElementsByTagName("input");
    let maxRating = 0;
    for (const ele of elements) {
      if (ele.checked) {
        maxRating = Math.max(maxRating, ele.value);
      }
    }
    ratingInput.innerHTML = `${maxRating}/5`;
  })
}
 