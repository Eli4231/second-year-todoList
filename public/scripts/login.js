async function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    try {
        let response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ userName: username, pass: password })
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