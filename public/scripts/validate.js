import swal from 'sweetalert';

function validateform() {
    // 
    var name = document.reg_form.name.value;
    var reg = document.reg_form.reg.value;
    var email = document.reg_form.email.value;
    var phone = document.reg_form.phone.value;

    //
    var rx_name = new RegExp('/^[a-zA-Z][a-zA-Z ]+$/')

    //
    if (/^[a-zA-Z][a-zA-Z ]+$/.test(name)){
        console.log("NameCheck");
        swal("Name can only have alphbets and space following it");
    }
    if (name == null || name == "") {
        alert("Name can't be blank");
        return false;
    }
    if (reg.length != 9) {
        alert("Please re-type Registration number");
        return false;
    }
}