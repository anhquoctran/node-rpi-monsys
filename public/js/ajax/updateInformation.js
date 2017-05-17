$("#changePassword").click(function(e) {
    e.preventDefault()
    var password = $("#edit-password").text()
    var newpassword = $("#edit-newpassword").text()
    $.ajax({
        type: "POST",
        url: "/account/edit/credential",
        data: JSON.stringify({
            password: password,
            newpassword: newpassword
        }),
        dataType: "application/json",
        success: function(response) {
            if (response.status == true) {
                toastr.remove();
                toastr["success"](response.message, '', { positionClass: "toast-bottom-right" });
            } else {
                toastr.remove();
                toastr["error"](response.message, '', { positionClass: "toast-bottom-right" });
            }
        }
    });
})

$("#updateInfo").click(function(e) {
    e.preventDefault()
    var fullname = $("#edit-fullname").text()
    var email = $("#edit-email").text()
    var birthdate = $("#edit-birthdate").val()
    var hometown = $("#edit-hometown").text() || ""
    var currentcity = $("#edit-current-city").text() || ""
    var phone = $("#edit-mobile").text() || ""

    $.ajax({
        type: "POST",
        url: "/account/edit/info",
        data: JSON.stringify({
            fullname = fullname,
            email = email,
            birthdate = birthdate,
            hometown = hometown,
            currentcity = currentcity,
            phone: phone
        }),
        dataType: "application/json",
        success: function(response) {
            if (response.status === true) {
                toastr.remove();
                toastr["success"](response.message, '', { positionClass: "toast-bottom-right" });
            } else {
                toastr.remove();
                toastr["error"](response.message, '', { positionClass: "toast-bottom-right" });
            }
        }
    });
})