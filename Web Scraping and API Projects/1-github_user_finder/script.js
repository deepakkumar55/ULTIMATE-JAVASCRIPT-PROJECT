document.getElementById('search-btn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    if (username) {
        fetch(`https://api.github.com/users/${username}`)
            .then(response => response.json())
            .then(data => {
                if (data.message === "Not Found") {
                    alert("User not found");
                } else {
                    displayProfile(data);
                }
            })
            .catch(error => console.error('Error fetching user:', error));
    } else {
        alert("Please enter a GitHub username");
    }
});

function displayProfile(user) {
    const profileContainer = document.getElementById('profile-container');
    profileContainer.innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login}">
        <h2>${user.name ? user.name : user.login}</h2>
        <p><strong>Bio:</strong> ${user.bio ? user.bio : 'N/A'}</p>
        <p><strong>Public Repos:</strong> ${user.public_repos}</p>
        <p><strong>Followers:</strong> ${user.followers}</p>
        <p><strong>Following:</strong> ${user.following}</p>
        <p><a href="${user.html_url}" target="_blank">View Profile on GitHub</a></p>
    `;
}
