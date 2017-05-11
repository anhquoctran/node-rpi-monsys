
jQuery(document).ready(function() {
	
    /*
        Fullscreen background
    */
    $.backstretch("../public/vendor/login/images/1.png");
    
    $('#top-navbar-1').on('shown.bs.collapse', function(){
    	$.backstretch("resize");
    });
    $('#top-navbar-1').on('hidden.bs.collapse', function(){
    	$.backstretch("resize");
    });
    
    /*
        Form
    */
    $('.registration-form fieldset:first-child').fadeIn('slow');
    
    $('.registration-form input[type="text"], .registration-form input[type="password"], .registration-form textarea').on('focus', function() {
    	$(this).removeClass('input-error');
    });
    
    // next step
    $('.registration-form .btn-next').on('click', function() {
    	var parent_fieldset = $(this).parents('fieldset');
    	var next_step = true;
    	
    	parent_fieldset.find('input[type="text"], input[type="password"], textarea').each(function() {
    		if( $(this).val() == "" ) {
    			$(this).addClass('input-error');
    			next_step = false;
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});

		var formPassword = $("#form-password").val();
		var formPasswordRepeat = $("#form-repeat-password").val();

		parent_fieldset.find('input[type="password"]').each(function() {
    		if( formPassword != formPasswordRepeat ) {
    			$(this).addClass('input-error');
    			next_step = false;
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});
    	
    	if( next_step ) {
    		parent_fieldset.fadeOut(400, function() {
	    		$(this).next().fadeIn();
	    	});
    	}
    	
    });
    
    // previous step
    $('.registration-form .btn-previous').on('click', function() {
    	$(this).parents('fieldset').fadeOut(400, function() {
    		$(this).prev().fadeIn();
    	});
    });
    
    // submit
    $('.registration-form').on('submit', function(e) {

		
    	
    	$(this).find('input[type="text"], input[type="password"], textarea').each(function() {
    		if( $(this).val() == "" ) {
    			e.preventDefault();
    			$(this).addClass('input-error');
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});

		var emailAddress = $("#form-email").val();

		$(this).find('input[name="form-email"]').each(function() {

			function validateEmail($email) {
				var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
				return emailReg.test( $email );
			}

    		if( !validateEmail(emailAddress) ) {
				e.preventDefault();
    			$(this).addClass('input-error');
			}
			else {
    			$(this).removeClass('input-error');
    		}
    	});

		var userName = $("#form-username").val();

		$(this).find('input[name="form-username"]').each(function() {

    		if( userName.length < 6 && userName.length < 24 ) {
				e.preventDefault();
    			$(this).addClass('input-error');
				alert(userName.length);
			}
			else {
    			$(this).removeClass('input-error');
				alert(userName.length + "Pass");
			}
    	});
    	
    });
    
    
});
