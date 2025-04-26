// Game state variables
let score = 0;
let currentQuestionIndex = 0;
let questions = [];
let timerInterval;
let timeRemaining = 15;
let maxTime = 15;
let streakCount = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let gameSettings = {
  amount: 10,
  category: 'any',
  difficulty: 'mixed'
};

// Additional game state variables
let soundEnabled = true;
let darkModeEnabled = false;
let highScores = {};
let questionStartTime = 0;
let answerTimes = [];
let bestStreak = 0;

// Sound elements
let correctSound, wrongSound, victorySound, clickSound;

// Particles for visual enhancement
function createParticles() {
  const particles = document.createElement('div');
  particles.className = 'particles';
  
  for (let i = 0; i < 25; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 25 + 5;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const opacity = Math.random() * 0.3 + 0.1;
    const animationDelay = Math.random() * 10;
    const animationDuration = Math.random() * 15 + 10;
    const rotation = Math.random() * 360;
    
    // Apply styles
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.opacity = opacity;
    particle.style.animationDelay = `${animationDelay}s`;
    particle.style.animationDuration = `${animationDuration}s`;
    particle.style.transform = `rotate(${rotation}deg)`;
    
    // Random color with modern palette
    const colors = [
      'rgba(108, 92, 231, 0.2)', 
      'rgba(253, 121, 168, 0.2)', 
      'rgba(0, 184, 148, 0.2)',
      'rgba(162, 155, 254, 0.2)',
      'rgba(85, 239, 196, 0.2)',
      'rgba(250, 177, 160, 0.2)',
      'rgba(116, 185, 255, 0.2)'
    ];
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Random shape
    if (Math.random() > 0.7) {
      particle.style.borderRadius = '50%';
    } else if (Math.random() > 0.5) {
      particle.style.borderRadius = '30% 70% 70% 30% / 30% 30% 70% 70%';
    } else {
      particle.style.borderRadius = `${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}%`;
    }
    
    particles.appendChild(particle);
  }
  
  document.body.appendChild(particles);
}

// Expanded trivia dummy data
const triviaDummyData = {
  general: [
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "easy",
      question: "What is the largest organ in the human body?",
      correct_answer: "Skin",
      incorrect_answers: ["Heart", "Liver", "Brain"]
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "medium",
      question: "In what year was the first iPhone released?",
      correct_answer: "2007",
      incorrect_answers: ["2005", "2008", "2010"]
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "hard",
      question: "What is the most abundant element in the universe?",
      correct_answer: "Hydrogen",
      incorrect_answers: ["Helium", "Oxygen", "Carbon"]
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "easy",
      question: "What is the capital of Australia?",
      correct_answer: "Canberra",
      incorrect_answers: ["Sydney", "Melbourne", "Perth"]
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "medium",
      question: "What is the name of the longest river in Africa?",
      correct_answer: "Nile",
      incorrect_answers: ["Congo", "Niger", "Zambezi"]
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "hard",
      question: "In which year did the Chernobyl disaster occur?",
      correct_answer: "1986",
      incorrect_answers: ["1984", "1992", "1979"]
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "easy",
      question: "How many continents are there on Earth?",
      correct_answer: "7",
      incorrect_answers: ["5", "6", "8"]
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "medium",
      question: "What is the main ingredient in guacamole?",
      correct_answer: "Avocado",
      incorrect_answers: ["Tomato", "Onion", "Lime"]
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "hard",
      question: "Which of these characters was NOT a part of the original Mario Bros arcade game?",
      correct_answer: "Bowser",
      incorrect_answers: ["Mario", "Luigi", "Shellcreeper"]
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "easy",
      question: "What is the primary language spoken in Brazil?",
      correct_answer: "Portuguese",
      incorrect_answers: ["Spanish", "English", "French"]
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "medium",
      question: "Which country has the most islands in the world?",
      correct_answer: "Sweden",
      incorrect_answers: ["Indonesia", "Philippines", "Japan"]
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "hard",
      question: "What is the smallest bone in the human body?",
      correct_answer: "Stapes",
      incorrect_answers: ["Femur", "Coccyx", "Hyoid"]
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "easy",
      question: "What is the fastest land animal?",
      correct_answer: "Cheetah",
      incorrect_answers: ["Lion", "Gazelle", "Leopard"]
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "medium",
      question: "What is the tallest building in the world?",
      correct_answer: "Burj Khalifa",
      incorrect_answers: ["Shanghai Tower", "One World Trade Center", "Taipei 101"]
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "hard",
      question: "Who invented the World Wide Web?",
      correct_answer: "Tim Berners-Lee",
      incorrect_answers: ["Bill Gates", "Steve Jobs", "Alan Turing"]
    }
  ],
  science: [
    {
      category: "Science",
      type: "multiple",
      difficulty: "easy",
      question: "Which planet is known as the Red Planet?",
      correct_answer: "Mars",
      incorrect_answers: ["Venus", "Jupiter", "Mercury"]
    },
    {
      category: "Science",
      type: "multiple",
      difficulty: "medium",
      question: "What is the chemical symbol for gold?",
      correct_answer: "Au",
      incorrect_answers: ["Ag", "Fe", "Go"]
    },
    {
      category: "Science",
      type: "multiple",
      difficulty: "hard",
      question: "What is the strongest known force in physics?",
      correct_answer: "Strong nuclear force",
      incorrect_answers: ["Gravitational force", "Electromagnetic force", "Weak nuclear force"]
    },
    {
      category: "Science",
      type: "multiple",
      difficulty: "easy",
      question: "What is the hardest natural substance on Earth?",
      correct_answer: "Diamond",
      incorrect_answers: ["Titanium", "Platinum", "Tungsten"]
    },
    {
      category: "Science",
      type: "multiple",
      difficulty: "medium",
      question: "What is the pH of pure water?",
      correct_answer: "7",
      incorrect_answers: ["0", "14", "5"]
    },
    {
      category: "Science",
      type: "multiple",
      difficulty: "hard",
      question: "What is the half-life of Carbon-14?",
      correct_answer: "5,730 years",
      incorrect_answers: ["1,000 years", "10,000 years", "2,500 years"]
    },
    {
      category: "Science",
      type: "multiple",
      difficulty: "easy",
      question: "Which of these is NOT a state of matter?",
      correct_answer: "Ionic",
      incorrect_answers: ["Solid", "Liquid", "Gas"]
    },
    {
      category: "Science",
      type: "multiple",
      difficulty: "medium",
      question: "What is the Earth's primary atmosphere composed of?",
      correct_answer: "Nitrogen",
      incorrect_answers: ["Oxygen", "Carbon Dioxide", "Hydrogen"]
    },
    {
      category: "Science",
      type: "multiple",
      difficulty: "hard",
      question: "What is the name of the galaxy we live in?",
      correct_answer: "Milky Way",
      incorrect_answers: ["Andromeda", "Triangulum", "Whirlpool"]
    },
    {
      category: "Science",
      type: "multiple",
      difficulty: "easy",
      question: "Which element has the chemical symbol 'O'?",
      correct_answer: "Oxygen",
      incorrect_answers: ["Gold", "Osmium", "Oganesson"]
    },
    {
      category: "Science",
      type: "multiple",
      difficulty: "medium",
      question: "What is the largest organ in the human body?",
      correct_answer: "Skin",
      incorrect_answers: ["Liver", "Brain", "Heart"]
    },
    {
      category: "Science",
      type: "multiple",
      difficulty: "hard",
      question: "What is the speed of light in vacuum?",
      correct_answer: "299,792,458 meters per second",
      incorrect_answers: ["300,000,000 meters per second", "186,000 miles per second", "3 × 10^8 meters per second"]
    },
    {
      category: "Science",
      type: "multiple",
      difficulty: "easy",
      question: "What is the chemical symbol for water?",
      correct_answer: "H₂O",
      incorrect_answers: ["CO₂", "NaCl", "O₂"]
    },
    {
      category: "Science",
      type: "multiple",
      difficulty: "medium",
      question: "Which scientist proposed the three laws of motion?",
      correct_answer: "Isaac Newton",
      incorrect_answers: ["Albert Einstein", "Galileo Galilei", "Nikola Tesla"]
    },
    {
      category: "Science",
      type: "multiple",
      difficulty: "hard",
      question: "What is the atomic number of uranium?",
      correct_answer: "92",
      incorrect_answers: ["86", "94", "88"]
    }
  ],
  history: [
    {
      category: "History",
      type: "multiple",
      difficulty: "easy",
      question: "Who was the first president of the United States?",
      correct_answer: "George Washington",
      incorrect_answers: ["Thomas Jefferson", "Abraham Lincoln", "John Adams"]
    },
    {
      category: "History",
      type: "multiple",
      difficulty: "medium",
      question: "In which year did World War I begin?",
      correct_answer: "1914",
      incorrect_answers: ["1918", "1939", "1912"]
    },
    {
      category: "History",
      type: "multiple",
      difficulty: "hard",
      question: "Which empire was ruled by Genghis Khan?",
      correct_answer: "Mongol Empire",
      incorrect_answers: ["Ottoman Empire", "Roman Empire", "Byzantine Empire"]
    },
    {
      category: "History",
      type: "multiple",
      difficulty: "easy",
      question: "In which year did Columbus reach the Americas?",
      correct_answer: "1492",
      incorrect_answers: ["1500", "1392", "1592"]
    },
    {
      category: "History",
      type: "multiple",
      difficulty: "medium",
      question: "What was the name of the first artificial satellite launched into space?",
      correct_answer: "Sputnik 1",
      incorrect_answers: ["Explorer 1", "Vostok 1", "Apollo 1"]
    },
    {
      category: "History",
      type: "multiple",
      difficulty: "hard",
      question: "Who was the last emperor of China?",
      correct_answer: "Puyi",
      incorrect_answers: ["Guangxu", "Hongwu", "Kangxi"]
    },
    {
      category: "History",
      type: "multiple",
      difficulty: "easy",
      question: "Which ancient civilization built the pyramids at Giza?",
      correct_answer: "Egyptians",
      incorrect_answers: ["Greeks", "Romans", "Mesopotamians"]
    },
    {
      category: "History",
      type: "multiple",
      difficulty: "medium",
      question: "Who wrote 'The Communist Manifesto'?",
      correct_answer: "Karl Marx and Friedrich Engels",
      incorrect_answers: ["Vladimir Lenin", "Joseph Stalin", "Mao Zedong"]
    },
    {
      category: "History",
      type: "multiple",
      difficulty: "hard",
      question: "In which year did the Chernobyl disaster occur?",
      correct_answer: "1986",
      incorrect_answers: ["1984", "1979", "1991"]
    },
    {
      category: "History",
      type: "multiple",
      difficulty: "easy",
      question: "Which US President was assassinated in Dallas, Texas?",
      correct_answer: "John F. Kennedy",
      incorrect_answers: ["Abraham Lincoln", "William McKinley", "James Garfield"]
    },
    {
      category: "History",
      type: "multiple",
      difficulty: "medium",
      question: "Who painted the Mona Lisa?",
      correct_answer: "Leonardo da Vinci",
      incorrect_answers: ["Michelangelo", "Pablo Picasso", "Vincent van Gogh"]
    },
    {
      category: "History",
      type: "multiple",
      difficulty: "hard",
      question: "Which treaty ended World War I?",
      correct_answer: "Treaty of Versailles",
      incorrect_answers: ["Treaty of Paris", "Treaty of Westphalia", "Treaty of Tordesillas"]
    },
    {
      category: "History",
      type: "multiple",
      difficulty: "easy",
      question: "What year did the Berlin Wall fall?",
      correct_answer: "1989",
      incorrect_answers: ["1991", "1987", "1979"]
    },
    {
      category: "History",
      type: "multiple",
      difficulty: "medium",
      question: "Which country was the first to send a human to space?",
      correct_answer: "Soviet Union",
      incorrect_answers: ["United States", "China", "United Kingdom"]
    },
    {
      category: "History",
      type: "multiple",
      difficulty: "hard",
      question: "Who was the first female Prime Minister of the United Kingdom?",
      correct_answer: "Margaret Thatcher",
      incorrect_answers: ["Theresa May", "Elizabeth II", "Victoria Woodhull"]
    }
  ],
  geography: [
    {
      category: "Geography",
      type: "multiple",
      difficulty: "easy",
      question: "What is the capital of France?",
      correct_answer: "Paris",
      incorrect_answers: ["London", "Berlin", "Rome"]
    },
    {
      category: "Geography",
      type: "multiple",
      difficulty: "medium",
      question: "Which river is the longest in the world?",
      correct_answer: "Nile",
      incorrect_answers: ["Amazon", "Mississippi", "Yangtze"]
    },
    {
      category: "Geography",
      type: "multiple",
      difficulty: "hard",
      question: "What is the smallest country in the world by land area?",
      correct_answer: "Vatican City",
      incorrect_answers: ["Monaco", "Nauru", "San Marino"]
    },
    {
      category: "Geography",
      type: "multiple",
      difficulty: "easy",
      question: "Which continent is the largest by land area?",
      correct_answer: "Asia",
      incorrect_answers: ["Africa", "North America", "Europe"]
    },
    {
      category: "Geography",
      type: "multiple",
      difficulty: "medium",
      question: "What is the largest desert in the world?",
      correct_answer: "Antarctic Desert",
      incorrect_answers: ["Sahara Desert", "Arabian Desert", "Gobi Desert"]
    },
    {
      category: "Geography",
      type: "multiple",
      difficulty: "hard",
      question: "Which of these countries is NOT in Africa?",
      correct_answer: "Suriname",
      incorrect_answers: ["Tanzania", "Cameroon", "Namibia"]
    },
    {
      category: "Geography",
      type: "multiple",
      difficulty: "easy",
      question: "What is the capital of Japan?",
      correct_answer: "Tokyo",
      incorrect_answers: ["Kyoto", "Osaka", "Beijing"]
    },
    {
      category: "Geography",
      type: "multiple",
      difficulty: "medium",
      question: "Which country has the most natural lakes?",
      correct_answer: "Canada",
      incorrect_answers: ["United States", "Russia", "Finland"]
    },
    {
      category: "Geography",
      type: "multiple",
      difficulty: "hard",
      question: "Which country is bordered by 14 other countries?",
      correct_answer: "China",
      incorrect_answers: ["Russia", "Brazil", "Germany"]
    },
    {
      category: "Geography",
      type: "multiple",
      difficulty: "easy",
      question: "Which of these is NOT an ocean?",
      correct_answer: "Mediterranean",
      incorrect_answers: ["Atlantic", "Pacific", "Indian"]
    },
    {
      category: "Geography",
      type: "multiple",
      difficulty: "medium",
      question: "What is the highest mountain in Africa?",
      correct_answer: "Mount Kilimanjaro",
      incorrect_answers: ["Mount Kenya", "Atlas Mountains", "Mount Elgon"]
    },
    {
      category: "Geography",
      type: "multiple",
      difficulty: "hard",
      question: "In which country would you find the city of Marrakesh?",
      correct_answer: "Morocco",
      incorrect_answers: ["Tunisia", "Egypt", "Algeria"]
    },
    {
      category: "Geography",
      type: "multiple",
      difficulty: "easy",
      question: "Which of these countries is an island nation?",
      correct_answer: "Japan",
      incorrect_answers: ["China", "Brazil", "Germany"]
    },
    {
      category: "Geography",
      type: "multiple",
      difficulty: "medium",
      question: "Which US state has the nickname 'The Grand Canyon State'?",
      correct_answer: "Arizona",
      incorrect_answers: ["Nevada", "Colorado", "New Mexico"]
    },
    {
      category: "Geography",
      type: "multiple",
      difficulty: "hard",
      question: "What is the capital of Montenegro?",
      correct_answer: "Podgorica",
      incorrect_answers: ["Pristina", "Tirana", "Skopje"]
    }
  ],
  entertainment: [
    {
      category: "Entertainment",
      type: "multiple",
      difficulty: "easy",
      question: "Who played Iron Man in the Marvel Cinematic Universe?",
      correct_answer: "Robert Downey Jr.",
      incorrect_answers: ["Chris Evans", "Chris Hemsworth", "Mark Ruffalo"]
    },
    {
      category: "Entertainment",
      type: "multiple",
      difficulty: "medium",
      question: "Which film won the Academy Award for Best Picture in 2020?",
      correct_answer: "Parasite",
      incorrect_answers: ["1917", "Joker", "Once Upon a Time in Hollywood"]
    },
    {
      category: "Entertainment",
      type: "multiple",
      difficulty: "hard",
      question: "Who directed the 1982 science fiction film 'Blade Runner'?",
      correct_answer: "Ridley Scott",
      incorrect_answers: ["Steven Spielberg", "George Lucas", "Stanley Kubrick"]
    },
    {
      category: "Entertainment",
      type: "multiple",
      difficulty: "easy",
      question: "What was the first feature-length animated movie ever released?",
      correct_answer: "Snow White and the Seven Dwarfs",
      incorrect_answers: ["Pinocchio", "Fantasia", "Dumbo"]
    },
    {
      category: "Entertainment",
      type: "multiple",
      difficulty: "medium",
      question: "Which band released the album 'Dark Side of the Moon'?",
      correct_answer: "Pink Floyd",
      incorrect_answers: ["The Beatles", "Led Zeppelin", "The Rolling Stones"]
    },
    {
      category: "Entertainment",
      type: "multiple",
      difficulty: "hard",
      question: "Which actor has won the most Academy Awards for Best Actor?",
      correct_answer: "Daniel Day-Lewis",
      incorrect_answers: ["Jack Nicholson", "Marlon Brando", "Tom Hanks"]
    },
    {
      category: "Entertainment",
      type: "multiple",
      difficulty: "easy",
      question: "Which Disney princess has red hair?",
      correct_answer: "Ariel",
      incorrect_answers: ["Belle", "Cinderella", "Jasmine"]
    },
    {
      category: "Entertainment",
      type: "multiple",
      difficulty: "medium",
      question: "Who wrote the novel 'Pride and Prejudice'?",
      correct_answer: "Jane Austen",
      incorrect_answers: ["Charlotte Brontë", "Emily Brontë", "Virginia Woolf"]
    },
    {
      category: "Entertainment",
      type: "multiple",
      difficulty: "hard",
      question: "In what year was the first episode of Doctor Who aired?",
      correct_answer: "1963",
      incorrect_answers: ["1973", "1983", "1953"]
    },
    {
      category: "Entertainment",
      type: "multiple",
      difficulty: "easy",
      question: "Who is the main protagonist in the Legend of Zelda series?",
      correct_answer: "Link",
      incorrect_answers: ["Zelda", "Ganon", "Mario"]
    },
    {
      category: "Entertainment",
      type: "multiple",
      difficulty: "medium",
      question: "Which TV show features the character Walter White?",
      correct_answer: "Breaking Bad",
      incorrect_answers: ["The Walking Dead", "Game of Thrones", "The Sopranos"]
    },
    {
      category: "Entertainment",
      type: "multiple",
      difficulty: "hard",
      question: "Who composed the music for the film 'The Good, the Bad and the Ugly'?",
      correct_answer: "Ennio Morricone",
      incorrect_answers: ["John Williams", "Hans Zimmer", "Howard Shore"]
    },
    {
      category: "Entertainment",
      type: "multiple",
      difficulty: "easy",
      question: "Which actor played Jack Dawson in the movie 'Titanic'?",
      correct_answer: "Leonardo DiCaprio",
      incorrect_answers: ["Brad Pitt", "Johnny Depp", "Tom Cruise"]
    },
    {
      category: "Entertainment",
      type: "multiple",
      difficulty: "medium",
      question: "Which country has won the most Eurovision Song Contests?",
      correct_answer: "Ireland",
      incorrect_answers: ["Sweden", "United Kingdom", "France"]
    },
    {
      category: "Entertainment",
      type: "multiple",
      difficulty: "hard",
      question: "Who was the first rapper to win a Pulitzer Prize?",
      correct_answer: "Kendrick Lamar",
      incorrect_answers: ["Jay-Z", "Eminem", "Kanye West"]
    }
  ],
  sports: [
    {
      category: "Sports",
      type: "multiple",
      difficulty: "easy",
      question: "Which sport uses a shuttlecock?",
      correct_answer: "Badminton",
      incorrect_answers: ["Table Tennis", "Tennis", "Squash"]
    },
    {
      category: "Sports",
      type: "multiple",
      difficulty: "medium",
      question: "How many players are there in a standard basketball team on court?",
      correct_answer: "5",
      incorrect_answers: ["6", "7", "4"]
    },
    {
      category: "Sports",
      type: "multiple",
      difficulty: "hard",
      question: "In which year were the first modern Olympic Games held?",
      correct_answer: "1896",
      incorrect_answers: ["1900", "1924", "1856"]
    },
    {
      category: "Sports",
      type: "multiple",
      difficulty: "easy",
      question: "Which country won the FIFA World Cup in 2018?",
      correct_answer: "France",
      incorrect_answers: ["Croatia", "Brazil", "Germany"]
    },
    {
      category: "Sports",
      type: "multiple",
      difficulty: "medium",
      question: "In which sport would you perform a 'slam dunk'?",
      correct_answer: "Basketball",
      incorrect_answers: ["Volleyball", "Tennis", "Rugby"]
    },
    {
      category: "Sports",
      type: "multiple",
      difficulty: "hard",
      question: "Who is the all-time leading goal scorer in the FIFA World Cup?",
      correct_answer: "Miroslav Klose",
      incorrect_answers: ["Ronaldo", "Pelé", "Lionel Messi"]
    },
    {
      category: "Sports",
      type: "multiple",
      difficulty: "easy",
      question: "How many holes are played in a standard round of golf?",
      correct_answer: "18",
      incorrect_answers: ["9", "12", "24"]
    },
    {
      category: "Sports",
      type: "multiple",
      difficulty: "medium",
      question: "Which country won the most gold medals in the 2020 Tokyo Olympics?",
      correct_answer: "United States",
      incorrect_answers: ["China", "Japan", "Great Britain"]
    },
    {
      category: "Sports",
      type: "multiple",
      difficulty: "hard",
      question: "How many Formula 1 World Championships did Ayrton Senna win?",
      correct_answer: "3",
      incorrect_answers: ["2", "4", "5"]
    },
    {
      category: "Sports",
      type: "multiple",
      difficulty: "easy",
      question: "Which sport is played at Wimbledon?",
      correct_answer: "Tennis",
      incorrect_answers: ["Badminton", "Cricket", "Golf"]
    },
    {
      category: "Sports",
      type: "multiple",
      difficulty: "medium",
      question: "What is the diameter of a basketball hoop in inches?",
      correct_answer: "18 inches",
      incorrect_answers: ["16 inches", "20 inches", "24 inches"]
    },
    {
      category: "Sports",
      type: "multiple",
      difficulty: "hard",
      question: "Which team has won the most Stanley Cups in NHL history?",
      correct_answer: "Montreal Canadiens",
      incorrect_answers: ["Toronto Maple Leafs", "Detroit Red Wings", "Boston Bruins"]
    },
    {
      category: "Sports",
      type: "multiple",
      difficulty: "easy",
      question: "In which sport would you use a 'punching bag'?",
      correct_answer: "Boxing",
      incorrect_answers: ["Karate", "Fencing", "Wrestling"]
    },
    {
      category: "Sports",
      type: "multiple",
      difficulty: "medium",
      question: "How long is a marathon in kilometers?",
      correct_answer: "42.195 km",
      incorrect_answers: ["40 km", "45 km", "50 km"]
    },
    {
      category: "Sports",
      type: "multiple",
      difficulty: "hard",
      question: "Who was the first gymnast to score a perfect 10 in Olympic competition?",
      correct_answer: "Nadia Comăneci",
      incorrect_answers: ["Olga Korbut", "Simone Biles", "Mary Lou Retton"]
    }
  ],
  technology: [
    {
      category: "Technology",
      type: "multiple",
      difficulty: "easy",
      question: "What does 'HTTP' stand for?",
      correct_answer: "Hypertext Transfer Protocol",
      incorrect_answers: ["Hypertext Text Process", "Hyperlink Transfer Protocol", "Hyperlink Text Process"]
    },
    {
      category: "Technology",
      type: "multiple",
      difficulty: "medium",
      question: "Who is the co-founder of Microsoft Corporation alongside Bill Gates?",
      correct_answer: "Paul Allen",
      incorrect_answers: ["Steve Jobs", "Steve Wozniak", "Mark Zuckerberg"]
    },
    {
      category: "Technology",
      type: "multiple",
      difficulty: "hard",
      question: "What was the name of the first general-purpose electronic computer?",
      correct_answer: "ENIAC",
      incorrect_answers: ["UNIVAC", "EDVAC", "EDSAC"]
    },
    {
      category: "Technology",
      type: "multiple",
      difficulty: "easy",
      question: "What does 'CPU' stand for?",
      correct_answer: "Central Processing Unit",
      incorrect_answers: ["Central Processor Unit", "Computer Processing Unit", "Central Process Unit"]
    },
    {
      category: "Technology",
      type: "multiple",
      difficulty: "medium",
      question: "Which programming language was developed by James Gosling at Sun Microsystems?",
      correct_answer: "Java",
      incorrect_answers: ["Python", "C++", "Ruby"]
    },
    {
      category: "Technology",
      type: "multiple",
      difficulty: "hard",
      question: "Which protocol is used to send email over the internet?",
      correct_answer: "SMTP",
      incorrect_answers: ["POP3", "IMAP", "FTP"]
    },
    {
      category: "Technology",
      type: "multiple",
      difficulty: "easy",
      question: "Which company developed the first iPhone?",
      correct_answer: "Apple",
      incorrect_answers: ["Samsung", "Google", "Microsoft"]
    },
    {
      category: "Technology",
      type: "multiple",
      difficulty: "medium",
      question: "What year was the World Wide Web invented?",
      correct_answer: "1989",
      incorrect_answers: ["1991", "1985", "1993"]
    },
    {
      category: "Technology",
      type: "multiple",
      difficulty: "hard",
      question: "What was the first commercially available programming language?",
      correct_answer: "FORTRAN",
      incorrect_answers: ["COBOL", "LISP", "BASIC"]
    },
    {
      category: "Technology",
      type: "multiple",
      difficulty: "easy",
      question: "What does 'URL' stand for?",
      correct_answer: "Uniform Resource Locator",
      incorrect_answers: ["Universal Resource Link", "Uniform Reference Link", "United Resource Location"]
    },
    {
      category: "Technology",
      type: "multiple",
      difficulty: "medium",
      question: "Which of these is NOT a JavaScript framework?",
      correct_answer: "Django",
      incorrect_answers: ["React", "Angular", "Vue"]
    },
    {
      category: "Technology",
      type: "multiple",
      difficulty: "hard",
      question: "What is the maximum data transfer rate of USB 3.0?",
      correct_answer: "5 Gbps",
      incorrect_answers: ["480 Mbps", "10 Gbps", "3 Gbps"]
    },
    {
      category: "Technology",
      type: "multiple",
      difficulty: "easy",
      question: "What does 'PDF' stand for?",
      correct_answer: "Portable Document Format",
      incorrect_answers: ["Personal Document Format", "Printed Document Format", "Published Document Format"]
    },
    {
      category: "Technology",
      type: "multiple",
      difficulty: "medium",
      question: "Which company owns Android?",
      correct_answer: "Google",
      incorrect_answers: ["Apple", "Microsoft", "Samsung"]
    },
    {
      category: "Technology",
      type: "multiple",
      difficulty: "hard",
      question: "In computing, what does RAID stand for?",
      correct_answer: "Redundant Array of Independent Disks",
      incorrect_answers: ["Random Access Interior Drive", "Rapid Application for Internet Development", "Remote Access for Internal Drives"]
    }
  ],
  movies: [
    {
      category: "Movies",
      type: "multiple",
      difficulty: "easy",
      question: "Who directed Jurassic Park?",
      correct_answer: "Steven Spielberg",
      incorrect_answers: ["James Cameron", "Christopher Nolan", "Ridley Scott"]
    },
    {
      category: "Movies",
      type: "multiple",
      difficulty: "medium",
      question: "Which actor plays Neo in The Matrix?",
      correct_answer: "Keanu Reeves",
      incorrect_answers: ["Tom Cruise", "Will Smith", "Brad Pitt"]
    },
    {
      category: "Movies",
      type: "multiple",
      difficulty: "hard",
      question: "Which film won the first Academy Award for Best Picture?",
      correct_answer: "Wings",
      incorrect_answers: ["Sunrise", "The Jazz Singer", "The Broadway Melody"]
    },
    {
      category: "Movies",
      type: "multiple",
      difficulty: "easy",
      question: "In Finding Nemo, what kind of fish is Nemo?",
      correct_answer: "Clownfish",
      incorrect_answers: ["Angelfish", "Surgeonfish", "Zebrafish"]
    },
    {
      category: "Movies",
      type: "multiple",
      difficulty: "medium",
      question: "What is the highest-grossing film of all time (not adjusted for inflation)?",
      correct_answer: "Avatar",
      incorrect_answers: ["Avengers: Endgame", "Titanic", "Star Wars: The Force Awakens"]
    },
    {
      category: "Movies",
      type: "multiple",
      difficulty: "hard",
      question: "Who was the first African American to win an Academy Award for Best Actor?",
      correct_answer: "Sidney Poitier",
      incorrect_answers: ["Denzel Washington", "Morgan Freeman", "James Earl Jones"]
    },
    {
      category: "Movies",
      type: "multiple",
      difficulty: "easy",
      question: "Which animated movie features a character named Woody?",
      correct_answer: "Toy Story",
      incorrect_answers: ["Shrek", "Finding Nemo", "Monsters, Inc."]
    },
    {
      category: "Movies",
      type: "multiple",
      difficulty: "medium",
      question: "Which actor has played James Bond in the most films?",
      correct_answer: "Roger Moore",
      incorrect_answers: ["Sean Connery", "Daniel Craig", "Pierce Brosnan"]
    },
    {
      category: "Movies",
      type: "multiple",
      difficulty: "hard",
      question: "In which year was the first color feature film in Hollywood released?",
      correct_answer: "1917",
      incorrect_answers: ["1922", "1930", "1939"]
    },
    {
      category: "Movies",
      type: "multiple",
      difficulty: "easy",
      question: "Who is the voice of Elsa in Disney's Frozen?",
      correct_answer: "Idina Menzel",
      incorrect_answers: ["Kristen Bell", "Mandy Moore", "Emma Stone"]
    }
  ]
};

// No need to duplicate questions as we now have a comprehensive dataset

// DOM Elements
const startContainer = document.getElementById('start-container');
const gameContainer = document.getElementById('game-container');
const gameOverContainer = document.getElementById('game-over-container');
const loadingIndicator = document.getElementById('loading');

const startButton = document.getElementById('start-button');
const categorySelect = document.getElementById('category-select');
const difficultySelect = document.getElementById('difficulty-select');
const amountSelect = document.getElementById('amount-select');
const nextButtonContainer = document.getElementById('next-button-container');
const nextButton = document.getElementById('next-button');
const restartButton = document.getElementById('restart-button');

const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const categoryElement = document.getElementById('category');
const difficultyElement = document.getElementById('difficulty');
const answerButtonsContainer = document.getElementById('answer-buttons');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackElement = document.getElementById('feedback');
const scoreElement = document.getElementById('score');
const questionNumberElement = document.getElementById('question-number');
const timerBar = document.getElementById('timer-bar');
const timerText = document.getElementById('timer-text');

const finalScoreElement = document.getElementById('final-score');
const scoreMessageElement = document.getElementById('score-message');
const totalQuestionsElement = document.getElementById('total-questions');
const accuracyElement = document.getElementById('accuracy');
const correctAnswersElement = document.getElementById('correct-answers');

// DOM Elements for new features
const themeToggle = document.getElementById('theme-toggle');
const soundToggle = document.getElementById('sound-toggle');
const shareButton = document.getElementById('share-button');
const highScoreValue = document.getElementById('high-score-value');
const highScoreCategory = document.getElementById('high-score-category');
const averageTimeElement = document.getElementById('average-time');
const longestStreakElement = document.getElementById('longest-streak');
const highScoreBadge = document.getElementById('high-score-badge');

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
  // Create background particles
  createParticles();
  
  // Fill category dropdown
  populateCategories();
  
  // Set up event listeners
  startButton.addEventListener('click', startGame);
  nextButton.addEventListener('click', nextQuestion);
  restartButton.addEventListener('click', restartGame);
  
  // Set up new feature listeners
  themeToggle.addEventListener('click', toggleDarkMode);
  soundToggle.addEventListener('click', toggleSound);
  shareButton.addEventListener('click', shareResults);
  
  // Initialize sound elements
  initializeSounds();
  
  // Load high scores from localStorage
  loadHighScores();
  
  // Check system preference for dark mode
  checkPreferredColorScheme();
});

// Initialize sounds
function initializeSounds() {
  correctSound = document.getElementById('correct-sound');
  wrongSound = document.getElementById('wrong-sound');
  victorySound = document.getElementById('victory-sound');
  clickSound = document.getElementById('click-sound');
  
  // Set volumes
  correctSound.volume = 0.5;
  wrongSound.volume = 0.4;
  victorySound.volume = 0.6;
  clickSound.volume = 0.3;
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  darkModeEnabled = document.body.classList.contains('dark-mode');
  
  // Save preference
  localStorage.setItem('darkMode', darkModeEnabled);
  
  // Play click sound
  playSound(clickSound);
}

// Check system preference for dark mode
function checkPreferredColorScheme() {
  // First check saved preference
  const savedDarkMode = localStorage.getItem('darkMode');
  
  if (savedDarkMode !== null) {
    // If we have a saved preference, use it
    darkModeEnabled = savedDarkMode === 'true';
  } else {
    // Otherwise, check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    darkModeEnabled = prefersDark;
  }
  
  // Apply dark mode if needed
  if (darkModeEnabled) {
    document.body.classList.add('dark-mode');
  }
}

// Toggle sound
function toggleSound() {
  document.body.classList.toggle('sound-muted');
  soundEnabled = !document.body.classList.contains('sound-muted');
  
  // Save preference
  localStorage.setItem('soundEnabled', soundEnabled);
}

// Play sound helper function
function playSound(soundElement) {
  if (soundEnabled && soundElement) {
    // Reset sound to start
    try {
      soundElement.currentTime = 0;
      const playPromise = soundElement.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Sound play error:", error);
        });
      }
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  }
}

// Load high scores from localStorage
function loadHighScores() {
  const savedScores = localStorage.getItem('triviaHighScores');
  
  if (savedScores) {
    highScores = JSON.parse(savedScores);
    
    // Update display in start screen
    updateHighScoreDisplay();
  }
}

// Update high score display in start screen
function updateHighScoreDisplay() {
  // Get the highest score across all categories
  let highest = 0;
  let category = 'any';
  
  for (const [cat, score] of Object.entries(highScores)) {
    if (score > highest) {
      highest = score;
      category = cat;
    }
  }
  
  // Update display
  highScoreValue.textContent = highest;
  highScoreCategory.textContent = category !== 'any' ? `in ${category}` : 'points';
}

// Save high score
function saveHighScore(score, category) {
  const categoryKey = category || 'any';
  
  // Check if this is a new high score for this category
  let isNewHighScore = false;
  
  if (!highScores[categoryKey] || score > highScores[categoryKey]) {
    highScores[categoryKey] = score;
    isNewHighScore = true;
  }
  
  // Save to localStorage
  localStorage.setItem('triviaHighScores', JSON.stringify(highScores));
  
  return isNewHighScore;
}

// Share results
function shareResults() {
  // Create share text
  const percentage = Math.round((correctAnswers / questions.length) * 100);
  const shareText = `I scored ${score} points (${percentage}% accuracy) in BrainWave Trivia! Can you beat my score?`;
  
  // Check if Web Share API is available
  if (navigator.share) {
    navigator.share({
      title: 'My BrainWave Trivia Score',
      text: shareText,
      url: window.location.href
    }).catch(err => {
      console.log('Error sharing:', err);
      fallbackShare(shareText);
    });
  } else {
    fallbackShare(shareText);
  }
  
  // Play click sound
  playSound(clickSound);
}

// Fallback share method (copy to clipboard)
function fallbackShare(text) {
  // Create temporary input
  const input = document.createElement('textarea');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  
  // Show copied notification
  alert('Results copied to clipboard!');
}

// Populate category dropdown from dummy data
function populateCategories() {
  // Add "Any Category" option
  const anyOption = document.createElement('option');
  anyOption.value = 'any';
  anyOption.textContent = 'Any Category';
  categorySelect.appendChild(anyOption);
  
  // Add all categories
  Object.keys(triviaDummyData).forEach(categoryKey => {
    const option = document.createElement('option');
    option.value = categoryKey;
    option.textContent = triviaDummyData[categoryKey][0].category;
    categorySelect.appendChild(option);
  });
}

// Start the game with enhanced tracking
function startGame() {
  // Play click sound
  playSound(clickSound);
  
  // Show loading animation
  startContainer.classList.add('hidden');
  loadingIndicator.classList.remove('hidden');
  
  // Get selected settings
  gameSettings.category = categorySelect.value;
  gameSettings.difficulty = difficultySelect.value;
  gameSettings.amount = parseInt(amountSelect.value) || 10;
  
  // Reset game state
  score = 0;
  currentQuestionIndex = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;
  streakCount = 0;
  bestStreak = 0;
  answerTimes = [];
  
  // Get questions based on settings
  questions = getFilteredQuestions();
  
  // Simulate loading delay for better UX
  setTimeout(() => {
    loadingIndicator.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    displayQuestion();
    updateScoreDisplay();
  }, 1000);
}

// Get questions based on selected filters
function getFilteredQuestions() {
  let allQuestions = [];
  
  // Filter by category
  if (gameSettings.category === 'any') {
    // Get questions from all categories
    Object.values(triviaDummyData).forEach(categoryQuestions => {
      allQuestions = [...allQuestions, ...categoryQuestions];
    });
  } else {
    // Get questions from selected category
    allQuestions = [...triviaDummyData[gameSettings.category]];
  }
  
  // Filter by difficulty
  if (gameSettings.difficulty !== '') {
    allQuestions = allQuestions.filter(q => q.difficulty === gameSettings.difficulty);
  }
  
  // If not enough questions, just use all available
  if (allQuestions.length < gameSettings.amount) {
    console.warn('Not enough questions matching criteria, using all available');
  }
  
  // Shuffle and limit to requested amount
  allQuestions.sort(() => Math.random() - 0.5);
  return allQuestions.slice(0, Math.min(gameSettings.amount, allQuestions.length));
}

// Display the current question with time tracking
function displayQuestion() {
  // First mark the container as transitioning
  const questionContainer = document.getElementById('question-container');
  questionContainer.classList.add('transitioning');
  
  // Fade out previous content
  const answerArea = document.getElementById('answer-buttons');
  if (answerArea.children.length > 0) {
    // Add fade-out to existing elements
    questionContainer.classList.add('fade-out');
    answerArea.classList.add('fade-out');
    
    // Short delay before updating content
    setTimeout(() => {
      // Reset UI state
      feedbackContainer.classList.add('hidden');
      nextButtonContainer.classList.add('hidden');
      answerButtonsContainer.innerHTML = '';
      
      // Get and display current question
      displayCurrentQuestion();
      
      // Remove transition classes after a slight delay
      setTimeout(() => {
        questionContainer.classList.remove('transitioning', 'fade-out');
        answerArea.classList.remove('fade-out');
      }, 50);
    }, 300);
  } else {
    // First question, no need for fade out
    displayCurrentQuestion();
    questionContainer.classList.remove('transitioning');
  }
}

// Helper function to display the current question (separated for cleaner code)
function displayCurrentQuestion() {
  // Get current question
  const currentQuestion = questions[currentQuestionIndex];
  
  // Update display
  questionElement.innerHTML = decodeHTML(currentQuestion.question);
  categoryElement.textContent = currentQuestion.category;
  
  // Set difficulty styling
  difficultyElement.textContent = currentQuestion.difficulty.toUpperCase();
  difficultyElement.className = '';
  
  // Add difficulty-specific styles
  switch(currentQuestion.difficulty) {
    case 'easy':
      difficultyElement.style.backgroundColor = '#00b894';
      break;
    case 'medium':
      difficultyElement.style.backgroundColor = '#fdcb6e';
      break;
    case 'hard':
      difficultyElement.style.backgroundColor = '#ff7675';
      break;
  }
  
  // Update question counter
  questionNumberElement.textContent = `${currentQuestionIndex + 1}/${questions.length}`;
  
  // Prepare answers
  const correctAnswer = currentQuestion.correct_answer;
  const allAnswers = [...currentQuestion.incorrect_answers, correctAnswer];
  allAnswers.sort(() => Math.random() - 0.5);
  
  // Create answer buttons
  allAnswers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.innerHTML = decodeHTML(answer);
    button.classList.add('answer-option');
    button.dataset.answer = answer;
    
    // Add animation delay for staggered appearance
    button.style.opacity = '0';
    button.style.animationDelay = `${index * 0.1 + 0.1}s`;
    button.classList.add('fade-in');
    
    // Set opacity after a slight delay to let animation work
    setTimeout(() => {
      button.style.opacity = '1';
    }, 50);
    
    button.addEventListener('click', () => handleAnswer(answer, correctAnswer));
    answerButtonsContainer.appendChild(button);
  });
  
  // Start timer
  startTimer();
  
  // Record start time for answer time tracking
  questionStartTime = Date.now();
}

// Handle user selecting an answer with enhanced feedback
function handleAnswer(selectedAnswer, correctAnswer) {
  // Prevent multiple clicks
  if (answerButtonsContainer.classList.contains('answering')) return;
  answerButtonsContainer.classList.add('answering');
  
  // Stop timer
  clearInterval(timerInterval);
  
  // Record answer time
  const answerTime = (Date.now() - questionStartTime) / 1000;
  answerTimes.push(answerTime);
  
  // Update buttons
  const buttons = answerButtonsContainer.querySelectorAll('button');
  buttons.forEach(button => {
    button.disabled = true;
    
    if (button.dataset.answer === correctAnswer) {
      button.classList.add('correct');
    } else if (button.dataset.answer === selectedAnswer && selectedAnswer !== correctAnswer) {
      button.classList.add('incorrect');
    }
  });
  
  // Small delay for better user experience
  setTimeout(() => {
    // Update feedback
    feedbackContainer.classList.remove('correct', 'incorrect', 'hidden');
    
    if (selectedAnswer === correctAnswer) {
      // Correct answer
      correctAnswers++;
      streakCount++;
      
      // Update best streak
      if (streakCount > bestStreak) {
        bestStreak = streakCount;
      }
      
      // Calculate score with visual feedback
      const points = calculateScore();
      score += points;
      
      feedbackContainer.classList.add('correct');
      feedbackElement.innerHTML = `
        Correct! <span class="points-added">+${points}</span>
        ${streakCount > 1 ? `<span class="streak-bonus">🔥 ${streakCount} streak bonus (+${streakCount * 2} points)</span>` : ''}
      `;
      
      // Add sparkle effect after a small delay
      setTimeout(() => {
        const correctButton = Array.from(buttons).find(btn => btn.classList.contains('correct'));
        addSparkleEffect(correctButton);
      }, 200);
      
      // Play correct sound
      playSound(correctSound);
    } else {
      // Incorrect answer
      incorrectAnswers++;
      streakCount = 0;
      
      feedbackContainer.classList.add('incorrect');
      feedbackElement.innerHTML = `
        Incorrect! The correct answer was: <br><strong>${decodeHTML(correctAnswer)}</strong>
      `;
      
      // Play wrong sound
      playSound(wrongSound);
    }
    
    // Update score
    updateScoreDisplay();
    
    // Show next button with slight delay
    setTimeout(() => {
      nextButtonContainer.classList.remove('hidden');
      nextButtonContainer.classList.add('fade-in');
      answerButtonsContainer.classList.remove('answering');
    }, 500);
  }, 200);
}

// Add sparkle effect to correct answer
function addSparkleEffect(element) {
  if (!element) return;
  
  // Remove any existing sparkles from previous questions
  const existingSparkles = document.querySelectorAll('.sparkle');
  existingSparkles.forEach(sparkle => {
    if (sparkle.parentElement) {
      sparkle.parentElement.removeChild(sparkle);
    }
  });
  
  // Position the element for relative positioning of sparkles
  element.style.position = 'relative';
  element.style.overflow = 'visible';
  
  for (let i = 0; i < 12; i++) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    
    // Set consistent base styles
    const size = Math.random() * 10 + 5;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.position = 'absolute';
    sparkle.style.zIndex = '10';
    sparkle.style.pointerEvents = 'none';
    
    // Use simpler gradient for better performance
    sparkle.style.background = 'radial-gradient(circle, #FFD700 0%, rgba(255,215,0,0.2) 70%, transparent 100%)';
    sparkle.style.borderRadius = '50%';
    
    // Position randomly around the element
    const angle = (i / 12) * Math.PI * 2;
    const distance = 30 + Math.random() * 20;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    sparkle.style.left = `calc(50% + ${x}px)`;
    sparkle.style.top = `calc(50% + ${y}px)`;
    
    // Animation with custom delay for each sparkle
    const delay = Math.random() * 0.2;
    sparkle.style.animation = `sparkle 0.8s ${delay}s ease-out forwards`;
    
    element.appendChild(sparkle);
    
    // Set timeout for cleanup with a reference to avoid memory leaks
    setTimeout(() => {
      try {
        if (element && element.contains(sparkle)) {
          element.removeChild(sparkle);
        }
      } catch (error) {
        console.log("Error removing sparkle:", error);
      }
    }, 2000);
  }
}

// Calculate score based on difficulty, time and streak
function calculateScore() {
  // Base score
  let baseScore = 10;
  
  // Difficulty multiplier
  const difficulty = questions[currentQuestionIndex].difficulty;
  let difficultyMultiplier = 1;
  
  if (difficulty === 'medium') {
    difficultyMultiplier = 1.5;
  } else if (difficulty === 'hard') {
    difficultyMultiplier = 2;
  }
  
  // Time bonus (up to 5 points)
  const timePercentage = timeRemaining / maxTime;
  const timeBonus = Math.round(timePercentage * 5);
  
  // Enhanced streak bonus (increasing with consecutive correct answers)
  const streakBonus = Math.min(streakCount * 2, 20); // Cap at 20 points for streak
  
  // Calculate final score
  return Math.round((baseScore + timeBonus + streakBonus) * difficultyMultiplier);
}

// Start the timer
function startTimer() {
  // Set time based on difficulty
  const difficulty = questions[currentQuestionIndex].difficulty;
  
  if (difficulty === 'easy') {
    maxTime = 15;
  } else if (difficulty === 'medium') {
    maxTime = 20;
  } else if (difficulty === 'hard') {
    maxTime = 30;
  }
  
  timeRemaining = maxTime;
  updateTimerDisplay();
  
  // Start countdown
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();
    
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      handleAnswer('', questions[currentQuestionIndex].correct_answer);
    }
  }, 1000);
}

// Update timer display
function updateTimerDisplay() {
  // Make sure timeRemaining doesn't go below zero
  timeRemaining = Math.max(0, timeRemaining);
  
  timerText.textContent = `${timeRemaining}s`;
  
  // Update progress bar
  const progressPercent = (timeRemaining / maxTime) * 100;
  timerBar.style.width = `${progressPercent}%`;
  
  // Change color based on time remaining
  if (timeRemaining <= 5) {
    timerBar.style.background = 'linear-gradient(to right, #ff7675, #d63031)';
  } else if (timeRemaining <= 10) {
    timerBar.style.background = 'linear-gradient(to right, #fdcb6e, #e17055)';
  } else {
    timerBar.style.background = 'linear-gradient(to right, #a29bfe, #6c5ce7)';
  }
}

// Update score display
function updateScoreDisplay() {
  scoreElement.textContent = score;
}

// Next question
function nextQuestion() {
  currentQuestionIndex++;
  
  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    endGame();
  }
}

// Enhanced confetti effect for celebrations
function showConfetti() {
  // Clear any existing confetti
  const existingConfetti = document.querySelectorAll('.confetti');
  existingConfetti.forEach(c => {
    if (c.parentElement) {
      c.parentElement.removeChild(c);
    }
  });

  // Create confetti container if it doesn't exist
  let confettiContainer = document.querySelector('.confetti-container');
  if (confettiContainer) {
    document.body.removeChild(confettiContainer);
  }
  
  confettiContainer = document.createElement('div');
  confettiContainer.className = 'confetti-container';
  document.body.appendChild(confettiContainer);
  
  // Create confetti pieces
  for (let i = 0; i < 150; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    
    // Random properties
    const colors = ['#6c5ce7', '#fd79a8', '#00b894', '#fdcb6e', '#74b9ff', '#ff7675', '#55efc4', '#a29bfe'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 5;
    const positionX = Math.random() * 100;
    
    // Set base styles with inline styles for better reliability
    confetti.style.position = 'absolute';
    confetti.style.left = `${positionX}vw`;
    confetti.style.top = '-20px';
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.backgroundColor = color;
    confetti.style.opacity = Math.random() * 0.8 + 0.2;
    
    // Use simple shapes (circles or squares) for better performance
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    
    // Animation properties
    const fallDuration = Math.random() * 3 + 2;
    const fallDelay = Math.random() * 2;
    
    // Use CSS variables for animation control
    confetti.style.setProperty('--fall-duration', `${fallDuration}s`);
    confetti.style.setProperty('--fall-delay', `${fallDelay}s`);
    confetti.style.setProperty('--spin-speed', `${Math.random() * 360}deg`);
    
    confetti.style.animation = `
      confetti-fall ${fallDuration}s ${fallDelay}s linear forwards,
      confetti-shake 3s ${fallDelay}s ease-in-out infinite,
      confetti-rotate 1s linear infinite
    `;
    
    confettiContainer.appendChild(confetti);
    
    // Clean up after animation
    setTimeout(() => {
      try {
        if (confettiContainer && confettiContainer.contains(confetti)) {
          confettiContainer.removeChild(confetti);
        }
      } catch (error) {
        console.log("Error removing confetti:", error);
      }
    }, (fallDuration + fallDelay) * 1000 + 500);
  }
  
  // Remove container after all animations complete
  setTimeout(() => {
    try {
      if (document.body.contains(confettiContainer)) {
        document.body.removeChild(confettiContainer);
      }
    } catch (error) {
      console.log("Error removing confetti container:", error);
    }
  }, 10000);
}

// End game with enhanced stats
function endGame() {
  // Clear timers
  clearInterval(timerInterval);
  
  // Hide game screen, show results with animation
  gameContainer.classList.add('hidden');
  gameOverContainer.classList.remove('hidden');
  
  // Add entrance animation
  gameOverContainer.classList.add('scale-in');
  
  // Update score display
  finalScoreElement.textContent = score;
  
  // Update stats
  const totalQuestions = questions.length;
  totalQuestionsElement.textContent = totalQuestions;
  correctAnswersElement.textContent = correctAnswers;
  
  // Calculate percentage
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  accuracyElement.textContent = `${percentage}%`;
  
  // Calculate average time
  const avgTime = answerTimes.length > 0 
    ? Math.round(answerTimes.reduce((sum, time) => sum + time, 0) / answerTimes.length * 10) / 10
    : 0;
  averageTimeElement.textContent = `${avgTime}s`;
  
  // Update longest streak
  longestStreakElement.textContent = bestStreak;
  
  // Check for high score
  const isNewHighScore = saveHighScore(score, gameSettings.category);
  highScoreBadge.textContent = isNewHighScore ? 'NEW!' : '✓';
  highScoreBadge.className = isNewHighScore ? 'new' : '';
  
  // Update high score display in start screen for next game
  updateHighScoreDisplay();
  
  // Play victory sound for good scores
  if (percentage >= 70) {
    playSound(victorySound);
  }
  
  // Set message based on score with better grading
  if (percentage === 100) {
    scoreMessageElement.textContent = 'Perfect! You are a trivia master!';
    showConfetti(); // Show celebration confetti
    addMedal('gold');
    playSound(victorySound);
  } else if (percentage >= 85) {
    scoreMessageElement.textContent = 'Excellent! You really know your stuff!';
    addMedal('gold');
  } else if (percentage >= 70) {
    scoreMessageElement.textContent = 'Great job! You have impressive knowledge!';
    addMedal('silver');
  } else if (percentage >= 50) {
    scoreMessageElement.textContent = 'Good job! You have solid knowledge!';
    addMedal('bronze');
  } else if (percentage >= 30) {
    scoreMessageElement.textContent = 'Not bad! Keep practicing to improve!';
  } else {
    scoreMessageElement.textContent = 'Keep learning! Trivia is all about discovery!';
  }
  
  // Add stats animation
  const statItems = document.querySelectorAll('.stat-item');
  statItems.forEach((item, index) => {
    item.style.animation = `fadeInUp 0.5s ${0.1 * index}s both`;
  });
}

// Improved medal display that properly cleans up
function addMedal(type) {
  try {
    // Remove any existing medals first
    const existingMedals = document.querySelectorAll('.medal');
    existingMedals.forEach(medal => {
      if (medal.parentElement) {
        medal.parentElement.removeChild(medal);
      }
    });
    
    const medalContainer = document.createElement('div');
    medalContainer.className = 'medal';
    
    const medalIcon = document.createElement('div');
    medalIcon.className = `medal-icon ${type}-medal`;
    
    // Add different emoji based on medal type
    if (type === 'gold') {
      medalIcon.textContent = '🏆';
    } else if (type === 'silver') {
      medalIcon.textContent = '🥈';
    } else if (type === 'bronze') {
      medalIcon.textContent = '🥉';
    }
    
    medalIcon.style.fontSize = '3rem';
    medalContainer.appendChild(medalIcon);
    
    const resultsContainer = document.querySelector('.results-container');
    if (resultsContainer) {
      resultsContainer.prepend(medalContainer);
    }
  } catch (error) {
    console.log("Error adding medal:", error);
  }
}

// Restart game
function restartGame() {
  gameOverContainer.classList.add('hidden');
  startContainer.classList.remove('hidden');
}

// Helper function to decode HTML entities
function decodeHTML(html) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}

// CSS keyframes animation for sparkles
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
@keyframes sparkle {
  0% { transform: scale(0); opacity: 1; }
  50% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0); opacity: 0; }
}
`;
document.head.appendChild(styleSheet);
