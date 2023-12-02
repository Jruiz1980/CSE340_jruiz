const form = document.querySelector("#add-class-form")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#updateSbmt")
      updateBtn.removeAttribute("disabled")
    })