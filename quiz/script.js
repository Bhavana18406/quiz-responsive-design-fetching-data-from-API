document.addEventListener('DOMContentLoaded', function() {
  // Quiz data
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      answer: 1
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      answer: 1
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      answer: 1
    }
  ];

  // DOM elements
  const quizContainer = document.querySelector('.quiz-container');
  const questionElements = document.querySelectorAll('.question');
  const optionElements = document.querySelectorAll('.options');
  const questionContainers = document.querySelectorAll('.question-container');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const questionCounter = document.querySelector('.question-counter span');
  const progressBar = document.querySelector('.progress-bar');
  const scoreElement = document.querySelector('.score span');
  const resultsContainer = document.querySelector('.results-container');
  const finalScoreElement = document.querySelector('.final-score span');
  const restartBtn = document.querySelector('.restart-btn');

  // Quiz state
  let currentQuestion = 0;
  let score = 0;
  let selectedOption = null;
  let userAnswers = new Array(questions.length).fill(null);

  // Initialize quiz
  function initQuiz() {
    showQuestion();
    updateProgress();
    updateQuestionCounter();
  }

  // Display current question
  function showQuestion() {
    questionContainers.forEach((container, index) => {
      container.classList.toggle('active', index === currentQuestion);
    });

    const question = questions[currentQuestion];
    questionElements[currentQuestion].textContent = question.question;

    const options = optionElements[currentQuestion].querySelectorAll('.option');
    options.forEach((option, index) => {
      option.textContent = question.options[index];
      option.classList.remove('selected', 'correct', 'incorrect');
      
      // Restore previously selected answer if exists
      if (userAnswers[currentQuestion] === index) {
        option.classList.add('selected');
        selectedOption = index;
      }
      
      option.onclick = () => selectOption(option, index);
    });

    // Update navigation buttons
    prevBtn.disabled = currentQuestion === 0;
    nextBtn.textContent = currentQuestion === questions.length - 1 ? 'Finish' : 'Next';
  }

  // Handle option selection
  function selectOption(option, index) {
    const options = optionElements[currentQuestion].querySelectorAll('.option');
    
    // Remove selection from all options
    options.forEach(opt => {
      opt.classList.remove('selected');
    });
    
    // Add selection to clicked option
    option.classList.add('selected');
    selectedOption = index;
    userAnswers[currentQuestion] = index;
    
    // Check if answer is correct
    if (index === questions[currentQuestion].answer) {
      option.classList.add('correct');
    }
  }

  // Navigate to next question
  function nextQuestion() {
    if (selectedOption !== null) {
      // Check answer and update score
      if (selectedOption === questions[currentQuestion].answer && userAnswers[currentQuestion] === selectedOption) {
        score++;
        scoreElement.textContent = score;
      }
      
      if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        selectedOption = userAnswers[currentQuestion];
        showQuestion();
        updateProgress();
        updateQuestionCounter();
      } else {
        showResults();
      }
    } else {
      alert('Please select an option before proceeding.');
    }
  }

  // Navigate to previous question
  function prevQuestion() {
    if (currentQuestion > 0) {
      currentQuestion--;
      selectedOption = userAnswers[currentQuestion];
      showQuestion();
      updateProgress();
      updateQuestionCounter();
    }
  }

  // Show quiz results
  function showResults() {
    quizContainer.querySelector('.quiz-body').style.display = 'none';
    resultsContainer.style.display = 'block';
    finalScoreElement.textContent = `${score} out of ${questions.length}`;
  }

  // Restart quiz
  function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedOption = null;
    userAnswers.fill(null);
    
    scoreElement.textContent = '0';
    quizContainer.querySelector('.quiz-body').style.display = 'block';
    resultsContainer.style.display = 'none';
    
    // Reset all options
    document.querySelectorAll('.option').forEach(option => {
      option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    initQuiz();
  }

  // Update progress bar
  function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
  }

  // Update question counter
  function updateQuestionCounter() {
    questionCounter.textContent = currentQuestion + 1;
  }

  // Event listeners
  nextBtn.addEventListener('click', nextQuestion);
  prevBtn.addEventListener('click', prevQuestion);
  restartBtn.addEventListener('click', restartQuiz);

  // Initialize the quiz
  initQuiz();
});