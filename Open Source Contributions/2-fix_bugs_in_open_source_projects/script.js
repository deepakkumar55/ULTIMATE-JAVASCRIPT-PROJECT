document.getElementById('repoSearchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const repoUrl = document.getElementById('repoUrl').value.trim();
  
    // Reset the state
    document.getElementById('error-message').classList.add('hidden');
    document.getElementById('issuesList').innerHTML = '';
    document.getElementById('loading-indicator').classList.remove('hidden');
    document.getElementById('no-issues').classList.add('hidden');
  
    if (repoUrl) {
      fetchIssuesFromRepo(repoUrl);
    }
  });
  
  function fetchIssuesFromRepo(repoUrl) {
    const [owner, repo] = repoUrl.split('/');
  
    if (!owner || !repo) {
      showError('Please enter a valid GitHub repository (e.g., owner/repo).');
      return;
    }
  
    const issuesUrl = `https://api.github.com/repos/${owner}/${repo}/issues`;
  
    fetch(issuesUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Unable to fetch issues. Please check the repository URL.');
        }
        return response.json();
      })
      .then(data => {
        if (data.length === 0) {
          showNoIssuesMessage();
        } else {
          displayIssues(data);
        }
      })
      .catch(error => {
        showError(error.message);
      });
  }
  
  function showError(message) {
    document.getElementById('loading-indicator').classList.add('hidden');
    document.getElementById('error-message').textContent = message;
    document.getElementById('error-message').classList.remove('hidden');
  }
  
  function showNoIssuesMessage() {
    document.getElementById('loading-indicator').classList.add('hidden');
    document.getElementById('no-issues').classList.remove('hidden');
  }
  
  function displayIssues(issues) {
    const issuesList = document.getElementById('issuesList');
    document.getElementById('loading-indicator').classList.add('hidden');
  
    issues.forEach(issue => {
      const listItem = document.createElement('li');
      const statusClass = issue.state.toLowerCase();
  
      // Add state-based class for color coding
      listItem.classList.add(statusClass);
  
      listItem.innerHTML = `
        <div class="issue-status">${issue.state.charAt(0).toUpperCase() + issue.state.slice(1)}</div>
        <strong>${issue.title}</strong>
        <p>${issue.body ? issue.body.substring(0, 150) + '...' : 'No description available'}</p>
        <a href="${issue.html_url}" target="_blank">View on GitHub</a>
        <button class="fix-button" onclick="fixIssue('${issue.html_url}')">Fix Issue</button>
      `;
      
      issuesList.appendChild(listItem);
    });
  }
  
  function fixIssue(issueUrl) {
    window.open(issueUrl, '_blank');
  }
  