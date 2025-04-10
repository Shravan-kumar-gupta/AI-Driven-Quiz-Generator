import React, { useRef, useState, useEffect } from "react";
import './Quiz.css';

const Quiz = () => {
    const [quizData, setQuizData] = useState([]);
    const [index, setIndex] = useState(0);
    const [question, setQuestion] = useState(null);
    const [lock, setLock] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const option1 = useRef(null);
    const option2 = useRef(null);
    const option3 = useRef(null);
    const option4 = useRef(null);
    const option_array = [option1, option2, option3, option4];

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/generate-quiz");
                if (!res.ok) throw new Error("Failed to load quiz");
                const data = await res.json();

                const formatted = data.map((q) => ({
                    question: q.question,
                    option1: q.options[0],
                    option2: q.options[1],
                    option3: q.options[2],
                    option4: q.options[3],
                    ans: typeof q.ans === "string"
                        ? q.options.findIndex(opt => opt === q.ans) + 1
                        : q.ans + 1
                }));

                setQuizData(formatted);
                setQuestion(formatted[0]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, []);

    const checkAnswer = (e, ans) => {
        if (!lock) {
            if (question.ans === ans) {
                e.target.classList.add("correct");
                setScore((prev) => prev + 1);
            } else {
                e.target.classList.add("wrong");
                option_array[question.ans - 1].current.classList.add("correct");
            }
            setLock(true);
        }
    };

    const next = () => {
        if (lock) {
            option_array.forEach((ref) => ref.current.classList.remove("correct", "wrong"));
            const nextIndex = index + 1;
            if (nextIndex < quizData.length) {
                setIndex(nextIndex);
                setQuestion(quizData[nextIndex]);
                setLock(false);
            }
        }
    };

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>Error: {error}</h2>;
    if (!question) return <h2>No question found.</h2>;

    return (
        <div className="container">
            <h1>Quiz App</h1>
            <hr />
            <h2>{index + 1}. {question.question}</h2>
            <ul>
                <li ref={option1} onClick={(e) => checkAnswer(e, 1)}>{question.option1}</li>
                <li ref={option2} onClick={(e) => checkAnswer(e, 2)}>{question.option2}</li>
                <li ref={option3} onClick={(e) => checkAnswer(e, 3)}>{question.option3}</li>
                <li ref={option4} onClick={(e) => checkAnswer(e, 4)}>{question.option4}</li>
            </ul>
            <button onClick={next}>Next</button>
            <div className="index">
                {index + 1} of {quizData.length} questions
                <br />
                Score: {score}
            </div>
        </div>
    );
};

export default Quiz;
