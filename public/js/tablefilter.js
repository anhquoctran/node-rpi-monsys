$(document).ready(function() {
    $("#textFinder").keyup(filtering)
    $("#btnFinder").click(filtering)

    function filtering() {
        var that = $("#textFinder")
        var tableBody = $(".table-list-search tbody")
        var tableRowClass = $(".table-list-search tbody tr")

        $(".search-sf").remove()
        tableRowClass.each(function(i, val) {
            var rowText = $(val).text().toLowerCase()
            var inputText = $(that).val().toLowerCase();

            if (inputText !== '') {
                $('.search-query-sf').remove();
                tableBody.prepend('<tr class="search-query-sf"><td colspan="6"><strong>Searching for: "' +
                    $(that).val() +
                    '"</strong></td></tr>');
            } else {
                $('.search-query-sf').remove();
            }

            if (rowText.indexOf(inputText) == -1) {
                //hide rows
                tableRowsClass.eq(i).hide();

            } else {
                $('.search-sf').remove();
                tableRowsClass.eq(i).show();
            }
        })

        if (tableRowsClass.children(':visible').length === 0) {
            tableBody.append('<tr class="search-sf"><td class="text-muted" colspan="6">No entries found.</td></tr>');
        }
    }
})