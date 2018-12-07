function validateform() {
    var name = document.reg_form.name.value;
    var reg = document.reg_form.reg.value;

    if (name == null || name == "") {
        alert("Name can't be blank");
        return false;
    }
    if (reg.length != 9) {
        alert("Please re-type Registration number");
        return false;
    }
}