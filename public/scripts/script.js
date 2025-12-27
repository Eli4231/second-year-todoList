async function loadUserGreeting() {
    try {
        let response = await fetch('/users/me', {
            credentials: 'include' // Important: include cookies for JWT
        });
        
        if (response.status === 200) {
            let data = await response.json();
            let userName = data.user.name || data.user.useName || 'User';
            let title = document.getElementById('title');
            title.innerHTML = `שלום ${userName}`;
        } else {
            // If not logged in, redirect to login
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error loading user:', error);
        window.location.href = '/';
    }
}

// Call the function when page loads
loadUserGreeting();
