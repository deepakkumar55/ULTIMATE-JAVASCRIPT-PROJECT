# News App using News API

## Description

This project is a simple web application that fetches and displays news articles from the News API. Users can browse news articles by category and search for specific topics of interest.

## Features

- Browse news articles by category (e.g., business, technology, entertainment).
- Search for news articles based on keywords.
- Responsive design for desktop and mobile devices.

## Technologies Used

- JavaScript
- HTML
- CSS

## Setup

To set up your News App using News API project from your GitHub repository, follow these steps:

### Cloning the Repository

1. Open your terminal or command prompt.

2. Clone the repository using the following command:
   ```bash
   git clone https://github.com/thegeek36/ULTIMATE-JAVASCRIPT-PROJECT.git
   ```

3. Navigate to the specific project directory:
   ```bash
   cd ULTIMATE-JAVASCRIPT-PROJECT/Web Scraping and API Projects/3-news_app_using_news_api
   ```

### Setting Up and Running the Project

1. Once you're in the project directory (`3-news_app_using_news_api`), open the `index.html` file in your preferred web browser.

2. If you haven't already, obtain your News API key by following the steps mentioned earlier in the README file (`config.js` setup).

3. Create a `config.js` file in the project directory (`3-news_app_using_news_api`).

4. Add your News API key to `config.js` as shown:
   ```javascript
   const apiKey = 'YOUR_API_KEY_HERE';
   export default apiKey;
   ```

   Replace `'YOUR_API_KEY_HERE'` with your actual News API key.

5. Save `config.js`.

6. Ensure that `config.js` is added to your `.gitignore` file to avoid committing your API key to GitHub.

### Using the News App

- Open `index.html` in your browser.
- Select a category from the navigation menu to view category-specific news.
- Use the search bar to search for news articles by keywords.

### Additional Notes

- Make sure your browser supports JavaScript and that you have an active internet connection to fetch news articles from the News API.
- Customize and enhance the project as needed, considering the features and technologies already listed in the project description.


## Contributing

Contributions are welcome! Fork the repository and submit a pull request with your enhancements.