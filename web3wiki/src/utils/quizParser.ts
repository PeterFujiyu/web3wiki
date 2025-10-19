export interface QuizData {
  question: string;
  options: { text: string; isCorrect: boolean }[];
  explanation?: string;
}

export interface ParsedContent {
  markdown: string;
  quizzes: QuizData[];
}

/**
 * Parse markdown content to extract quiz blocks
 *
 * Quiz format:
 * [QUIZ]
 * Q: Question text?
 * A) Option 1 *
 * B) Option 2
 * C) Option 3
 * D) Option 4
 * Explanation: Optional explanation text
 * [/QUIZ]
 *
 * The * indicates the correct answer
 */
export function parseQuizzes(markdown: string): ParsedContent {
  const quizzes: QuizData[] = [];
  const quizRegex = /\[QUIZ\]([\s\S]*?)\[\/QUIZ\]/g;

  let cleanMarkdown = markdown;
  let match;

  while ((match = quizRegex.exec(markdown)) !== null) {
    const quizContent = match[1].trim();
    const quiz = parseQuizBlock(quizContent);

    if (quiz) {
      quizzes.push(quiz);
      // Replace quiz block with a placeholder
      cleanMarkdown = cleanMarkdown.replace(match[0], `\n\n---QUIZ-${quizzes.length - 1}---\n\n`);
    }
  }

  return {
    markdown: cleanMarkdown,
    quizzes,
  };
}

function parseQuizBlock(content: string): QuizData | null {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);

  let question = '';
  const options: { text: string; isCorrect: boolean }[] = [];
  let explanation = '';

  for (const line of lines) {
    // Parse question
    if (line.startsWith('Q:')) {
      question = line.substring(2).trim();
    }
    // Parse options (A), B), C), D), etc.)
    else if (/^[A-Z]\)/.test(line)) {
      const optionText = line.substring(2).trim();
      const isCorrect = optionText.endsWith('*');
      const text = isCorrect ? optionText.slice(0, -1).trim() : optionText;
      options.push({ text, isCorrect });
    }
    // Parse explanation
    else if (line.startsWith('Explanation:')) {
      explanation = line.substring('Explanation:'.length).trim();
    }
  }

  // Validate parsed data
  if (!question || options.length === 0) {
    return null;
  }

  return {
    question,
    options,
    explanation: explanation || undefined,
  };
}
