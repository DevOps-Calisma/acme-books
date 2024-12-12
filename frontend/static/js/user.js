$(document).ready(function () {
    // Login form submission
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();

        $.post('/user/login', { email, password }, function (response) {
            if (response.success) {
                alert('Login successful');
                window.location.href = '/dashboard'; // Başarılı girişten sonra yönlendirme
            } else {
                alert(response.message || 'Login failed');
            }
        }).fail(function() {
            alert('Server error. Please try again later.');
        });
    });

    // Signup form submission
    $('#signupForm').on('submit', function (e) {
        e.preventDefault();
        const userData = {
            first_name: $('#first_name').val(),
            last_name: $('#last_name').val(),
            city: $('#city').val(),
            phone_number: $('#phone_number').val(),
            email: $('#email').val(),
            password: $('#password').val()
        };

        $.post('/user/signup', userData, function (response) {
            if (response.success) {
                alert('Signup successful');
                window.location.href = '/login'; // Kayıt sonrası giriş sayfasına yönlendirme
            } else {
                alert(response.message || 'Signup failed');
            }
        }).fail(function() {
            alert('Server error. Please try again later.');
        });
    });
<<<<<<< HEAD
});
=======
});
>>>>>>> aeb3de2 (uploads eureka and api gateway)
