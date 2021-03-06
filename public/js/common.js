$(document).ready(function() {


    $(".data").each(function(val, text) {
        var text = $(this).text()
        $(this).text(convertSizeData(parseFloat(text)))
    })

    $("#exporText").click(function(e) {
        (".export").each(function(val, id) {

        })
    })

    function convertSizeData(filesize, options) {
        if (0 == filesize) return "0 Bytes"
        var c = 1e3,
            d = options || 2,
            e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
            f = Math.floor(Math.log(filesize) / Math.log(c));
        return parseFloat((filesize / Math.pow(c, f)).toFixed(d)) + " " + e[f]
    }

    $(".dt").each(function(val, text) {
        var text = $(this).text()
        $(this).text(new Date(text).toLocaleDateString())
    })

    $("input[type='checkbox']").change(function() {
        if ($(this).is(":checked")) {
            $('.end').each(function() {
                $(this).attr('disabled', false)
            })
            $('.priority').each(function() {
                $(this).attr('disabled', false)
            })
            $("input[type='checkbox']").prop("checked", false);
            $(this).prop("checked", true);
        } else {
            $('.end').each(function() {
                $(this).attr('disabled', true)
            })
            $('.priority').each(function() {
                $(this).attr('disabled', true)
            });
        }
    })

    $('.btn-toggle-fullwidth').on('click', function() {
        if (!$('body').hasClass('layout-fullwidth')) {
            $('body').addClass('layout-fullwidth');

        } else {
            $('body').removeClass('layout-fullwidth');
            $('body').removeClass('layout-default'); // also remove default behaviour if set
        }

        $(this).find('.lnr').toggleClass('lnr-menu lnr-menu');

        if ($(window).innerWidth() < 1025) {
            if (!$('body').hasClass('offcanvas-active')) {
                $('body').addClass('offcanvas-active');
            } else {
                $('body').removeClass('offcanvas-active');
            }
        }
    });

    $(window).on('load', function() {
        if ($(window).innerWidth() < 1025) {
            $('.btn-toggle-fullwidth').find('.icon-arrows')
                .removeClass('icon-arrows-move-left')
                .addClass('icon-arrows-move-right');
        }

        // adjust right sidebar top position
        $('.right-sidebar').css('top', $('.navbar').innerHeight());

        // if page has content-menu, set top padding of main-content
        if ($('.has-content-menu').length > 0) {
            $('.navbar + .main-content').css('padding-top', $('.navbar').innerHeight());
        }

        // for shorter main content
        if ($('.main').height() < $('#sidebar-nav').height()) {
            $('.main').css('min-height', $('#sidebar-nav').height());
        }
    });

    $('.sidebar a[data-toggle="collapse"]').on('click', function() {
        if ($(this).hasClass('collapsed')) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });

    if ($('.sidebar-scroll').length > 0) {
        $('.sidebar-scroll').slimScroll({
            height: '95%',
            wheelStep: 2,
        });
    }

    // panel remove
    $('.panel .btn-remove').click(function(e) {

        e.preventDefault();
        $(this).parents('.panel').fadeOut(300, function() {
            $(this).remove();
        });
    });

    // panel collapse/expand
    var affectedElement = $('.panel-body');

    $('.panel .btn-toggle-collapse').clickToggle(
        function(e) {
            e.preventDefault();

            // if has scroll
            if ($(this).parents('.panel').find('.slimScrollDiv').length > 0) {
                affectedElement = $('.slimScrollDiv');
            }

            $(this).parents('.panel').find(affectedElement).slideUp(300);
            $(this).find('i.lnr-chevron-up').toggleClass('lnr-chevron-down');
        },
        function(e) {
            e.preventDefault();

            // if has scroll
            if ($(this).parents('.panel').find('.slimScrollDiv').length > 0) {
                affectedElement = $('.slimScrollDiv');
            }

            $(this).parents('.panel').find(affectedElement).slideDown(300);
            $(this).find('i.lnr-chevron-up').toggleClass('lnr-chevron-down');
        }
    );

    if ($('.panel-scrolling').length > 0) {
        $('.panel-scrolling .panel-body').slimScroll({
            height: '430px',
            wheelStep: 2,
        });
    }

    if ($('#panel-scrolling-demo').length > 0) {
        $('#panel-scrolling-demo .panel-body').slimScroll({
            height: '175px',
            wheelStep: 2,
        });
    }

    $('.todo-list input').change(function() {
        if ($(this).prop('checked')) {
            $(this).parents('li').addClass('completed');
        } else {
            $(this).parents('li').removeClass('completed');
        }
    });

});

// toggle function
$.fn.clickToggle = function(f1, f2) {
    return this.each(function() {
        var clicked = false;
        $(this).bind('click', function() {
            if (clicked) {
                clicked = false;
                return f2.apply(this, arguments);
            }

            clicked = true;
            return f1.apply(this, arguments);
        });
    });

}