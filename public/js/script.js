var isValidNumber = false;

document.getElementById("phoneNumber").addEventListener("keyup", function (event) {
    $.ajax({
        url: "/filter/phoneNumberFormat",
        type: "post",
        async: true,
        data: {
            countryRegionCode: $("#countryCode option:selected").attr('data-region'),
            phoneNumber: event.target.value,
            countryCode: $("#countryCode").val(),

        },
        success: function (data) {
            console.log(data);
            if (data == "not valid") {
                $("#phoneNumber").parent().addClass('err');
            } else {
                isValidNumber = true;
                $("#phoneNumber").parent().removeClass('err');
                $("#phoneNumber").val(data);
            }
        },
        error: function (xhr) {
            if (xhr.status == 500) {
                $("#phoneNumber").parent().addClass('err');
            }
        }
    });
});

function filterInputs() {
    var firstname = $("#firstName").val();
    var lastname = $("#lastName").val();
    var email = $("#email").val();
    var tel = $("#phoneNumber").val();
    var job = $("#job option:selected").val();
    var password = $("#password").val();
    var repassword = $("#passwordConfirmation").val();

    var specialChars = /[!#$%^&*()+\=\[\]{};':"\\|,<>\/?]+/;
    var htmlChars = /<[^>]*>/;

    if (firstname.match(specialChars) || firstname.match(htmlChars) || firstname == "") {
        alert("Invalid first name");
        return false;
    }

    if (lastname.match(specialChars) || lastname.match(htmlChars) || lastname == "") {
        alert("Invalid last name");
        return false;
    }

    if (email.match(specialChars) || email.match(htmlChars) || email == "") {
        alert("Invalid email");
        return false;
    }

    if (tel.match(specialChars) || tel.match(htmlChars) || tel == "" || !isValidNumber) {
        alert("Invalid phone number");
        return false;
    }

    if (job == "") {
        alert("Please select a job");
        return false;
    }

    if (password.match(specialChars) || password.match(htmlChars) || password == "") {
        alert("Invalid password");
        return false;
    }

    if (password != repassword) {
        alert("Passwords do not match");
        return false;
    }

    return true;
}