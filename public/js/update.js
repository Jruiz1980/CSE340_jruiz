const form = document.querySelector("#addInvForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#invSubmit")
      updateBtn.removeAttribute("disabled")
    })