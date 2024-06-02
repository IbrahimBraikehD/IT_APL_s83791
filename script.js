const quizDB = {
    allgemeineFragen: [
      { q: "2 + 2", a: ["4", "3", "5", "6"] },
      { q: "3 * 5", a: ["15", "12", "25", "18"] },
      { q: "7 - 3", a: ["4", "3", "2", "5"] },
      { q: "8 / 2", a: ["4", "3", "2", "5"] },
    ],
    mathematik: [
      { q: "x^2 + x^2", a: ["2x^2", "x^4", "x^8", "2x^4"] },
      { q: "x^2 * x^2", a: ["x^4", "x^2", "2x^2", "4x"] },
      { q: "2x + 3x", a: ["5x", "6x", "7x", "8x"] },
      { q: "4x / 2", a: ["2x", "3x", "4x", "5x"] },
      { q: "(a+b)^2", a: ["a^2 + 2* a* b +b^2", "a^2 + a * b + 2 * b^2", "2 * a + 2 * b"] },
      { q: "(a-b)^2", a: ["a^2 - 2 * a * b +b^2", "a^2 + 2* a* b +b^2", "a^2 - 2 * a * b - b^2"] },
    ],
    internettechnologien: [
      { q: "What does HTML stand for?", a: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink and Text Markup Language", "Home Tool Markup Language"] },
      { q: "What is CSS used for?", a: ["Styling web pages", "Creating interactive elements", "Server-side scripting", "Database management"] },
      { q: "What does HTTP stand for?", a: ["Hypertext Transfer Protocol", "High Tech Transfer Protocol", "Hyperlink and Text Transfer Protocol", "Home Tool Transfer Protocol"] },
      { q: "What is the role of JavaScript?", a: ["Adding interactivity to websites", "Styling web pages", "Database management", "Server-side scripting"] },
      { q: "What does TCP?", a: ["helps in the exchange of messages between different devices", "", "helps with styling of the website", "is impornant for the Database Management"] },
    ],
    geschichte: [
      { q: "In welchem Jahr endete der Zweite Weltkrieg?", a: ["1945", "1939", "1918", "1941"] },
      { q: "Wer war der erste Präsident der USA?", a: ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "John Adams"] },
      { q: "In welchem Jahr fiel die Berliner Mauer?", a: ["1989", "1985", "1990", "1982"] },
      { q: "Wer war der Führer des Römischen Reiches?", a: ["Julius Caesar", "Augustus", "Nero", "Caligula"] },
      { q: "Wer war der erste Bundeskanzler der Bundesrepublik Deutschland?", a: ["Konrad Adenauer", "Willy Brandt", "Ludwig Erhard", "Helmut Schmidt"] },
      { q: "In welchem Jahr wurde das World Trade Center zerstört?", a: ["2001", "2005", "1998", "2000"] },
    ],
    externeFragen: []
  };
  
  let selectedCategory;
  let currentQuestionIndex = 0;
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let correctAnswer;
  
  async function startQuiz(category) {
    selectedCategory = category;
    currentQuestionIndex = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
  
    if (category === 'externeFragen' && quizDB.externeFragen.length === 0) {
      await fetchExternalQuestions();
    }
  
    document.getElementById('quiz').style.display = 'block';
    document.getElementById('result').style.display = 'none';
  
    shuffleArray(quizDB[selectedCategory]);
    nextQuestion();
  }
  
  async function fetchExternalQuestions() {
    const response = await fetch('https://opentdb.com/api.php?amount=10&category=9&type=multiple');
    const data = await response.json();
    quizDB.externeFragen = data.results.map(item => ({
      q: item.question,
      a: [item.correct_answer, ...item.incorrect_answers]
    }));
  }
  
  function nextQuestion() {
    const questionContainer = document.getElementById('questionContainer');
    const answersContainer = document.getElementById('answersContainer');
    
    if (currentQuestionIndex < quizDB[selectedCategory].length) {
      const currentQuestion = quizDB[selectedCategory][currentQuestionIndex];
      questionContainer.innerHTML = '';
      answersContainer.innerHTML = '';
      
      if (selectedCategory === 'mathematik') {
        katex.render(currentQuestion.q, questionContainer);
      } else {
        questionContainer.textContent = currentQuestion.q;
      }
  
      correctAnswer = currentQuestion.a[0];
      shuffleArray(currentQuestion.a);
      currentQuestion.a.forEach((answer, index) => {
        const answerButton = document.createElement('button');
        if (selectedCategory === 'mathematik') {
          const answerSpan = document.createElement('span');
          katex.render(answer, answerSpan);
          answerButton.appendChild(answerSpan);
        } else {
          answerButton.textContent = answer;
        }
        answerButton.onclick = () => checkAnswer(answer);
        answersContainer.appendChild(answerButton);
      });
    } else {
      endQuiz();
    }
  }
  
  function checkAnswer(selectedAnswer) {
    if (selectedAnswer === correctAnswer) {
      correctAnswers++;
      updateProgress('correct');
    } else {
      incorrectAnswers++;
      updateProgress('incorrect');
    }
  
    currentQuestionIndex++;
    nextQuestion();
  }
  
  function updateProgress(type) {
    const correctProgress = document.getElementById('correctProgress');
    const incorrectProgress = document.getElementById('incorrectProgress');
    const totalQuestions = quizDB[selectedCategory].length;
  
    if (type === 'correct') {
      correctProgress.style.width = `${(correctAnswers / totalQuestions) * 100}%`;
    } else {
      incorrectProgress.style.width = `${(incorrectAnswers / totalQuestions) * 100}%`;
    }
  }
  
  function endQuiz() {
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result').style.display = 'block';
  
    const totalQuestions = quizDB[selectedCategory].length;
    const score = correctAnswers / totalQuestions * 100;
    let grade;
  
    if (score >= 90) {
      grade = 'A';
    } else if (score >= 80) {
      grade = 'B';
    } else if (score >= 70) {
      grade = 'C';
    } else if (score >= 60) {
      grade = 'D';
    } else {
      grade = 'F';
    }
  
    document.getElementById('resultMessage').textContent = `Du hast ${correctAnswers} von ${totalQuestions} Fragen richtig beantwortet. Dein Score ist ${score.toFixed(2)}%. Deine Note ist ${grade}.`;
  }
  
  function restartQuiz() {
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result').style.display = 'none';
  
    document.getElementById('correctProgress').style.width = '0';
    document.getElementById('incorrectProgress').style.width = '0';
  }
  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  