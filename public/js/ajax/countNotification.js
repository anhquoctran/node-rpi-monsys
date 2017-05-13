$(document).ready(function() {
    var id = $("#id")
    $.ajax({
        type: "GET",
        url: "/secret/notifications",
        data: "userid=" + id,
        dataType: "application/json",
        success: function(response) {
            if (response.count > 0) {
                document.title = "(" + response.count + ") " + document.title;
            }
        },
        error: function() {
            console.log("Error")
        }
    })
})