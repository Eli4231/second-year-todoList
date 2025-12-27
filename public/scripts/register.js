async function register() {
    let fullname = document.getElementById('fullname').value;
    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    try {
        if(fullname === '' || username === '' || email === '' || password === '') {
            alert('Please fill in all fields');
            return;
        }
        let response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ name: fullname, userName: username, email: email, pass: password })
        });
        let data = await response.json();
        alert(data.message);
        if(response.status === 200) {
            window.location.href = '/home';   
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred: ' + error.message);
    }
}