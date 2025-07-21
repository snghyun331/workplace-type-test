import React, { useState } from "react";
import "./App.css";
import data from "./data.json";

function App() {
  const [currentPage, setCurrentPage] = useState("initial-start");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // [{ questionId, selectedType }]
  const [resultType, setResultType] = useState(null);

  const handleInitialStart = () => {
    setCurrentPage("start");
  };

  const handleStartQuiz = () => {
    setCurrentPage("question");
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResultType(null);
  };

  // 답변 선택 핸들러 (선택만, 이동은 안함)
  const handleSelectAnswer = (selectedType) => {
    const qid = data.questions[currentQuestionIndex].id;
    const newAnswers = [...answers];
    const idx = newAnswers.findIndex((a) => a.questionId === qid);
    if (idx !== -1) {
      newAnswers[idx] = { questionId: qid, selectedType };
    } else {
      newAnswers.push({ questionId: qid, selectedType });
    }
    setAnswers(newAnswers);
  };

  // 다음 버튼 클릭 시
  const handleNext = () => {
    if (currentQuestionIndex < data.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 결과 계산
      let extrovertCount = 0;
      let introvertCount = 0;
      let feelingCount = 0;
      let thinkingCount = 0;
      answers.forEach((answer) => {
        if (answer.questionId >= 1 && answer.questionId <= 5) {
          if (answer.selectedType === "A") extrovertCount++;
          else introvertCount++;
        } else if (answer.questionId >= 6 && answer.questionId <= 10) {
          if (answer.selectedType === "A") feelingCount++;
          else thinkingCount++;
        }
      });
      let interactionStyle = extrovertCount >= introvertCount ? "E" : "I";
      let decisionStyle = feelingCount >= thinkingCount ? "F" : "T";
      let finalResultKey = "";
      if (interactionStyle === "E" && decisionStyle === "F") finalResultKey = "정사교";
      else if (interactionStyle === "E" && decisionStyle === "T") finalResultKey = "박진취";
      else if (interactionStyle === "I" && decisionStyle === "F") finalResultKey = "김평화";
      else if (interactionStyle === "I" && decisionStyle === "T") finalResultKey = "윤신뢰";
      setResultType(finalResultKey);
      setCurrentPage("end-quiz");
    }
  };

  // 이전 버튼 클릭 시
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRestart = () => {
    setCurrentPage("initial-start");
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResultType(null);
  };

  // 현재 질문에 대한 선택된 답변
  const qid = data.questions[currentQuestionIndex]?.id;
  const selected = answers.find((a) => a.questionId === qid)?.selectedType;

  return (
    <div className="App">
      {currentPage === "initial-start" && (
        <div className="start-page">
          <h1>{data.mainTitle}</h1>
          <p>{data.subTitle}</p>
          <button onClick={handleInitialStart}>{data.initialButtonText}</button>
        </div>
      )}

      {currentPage === "start" && (
        <div className="start-page">
          <h1>{data.mainTitle}</h1>
          <p>{data.subTitle}</p>
          {/* 테스트 소요시간 안내 */}
          <div
            style={{
              background: "rgba(67,206,162,0.08)",
              borderRadius: "12px",
              padding: "16px 0",
              margin: "18px 0 24px 0",
              fontWeight: 600,
              color: "#185a9d",
              fontSize: "1.08em",
              letterSpacing: "0.2px",
            }}
          >
            ⏱️ 예상 소요시간: <span style={{ color: "#43cea2", fontWeight: 700 }}>약 1~2분</span>
          </div>
          {/* 직장인 유형 종류 안내 */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "18px",
            }}
          >
            {Object.values(data.results).map((result, idx) => (
              <span
                key={result.type}
                style={{
                  display: "inline-block",
                  background: "linear-gradient(90deg, #43cea2 0%, #fed6e3 100%)",
                  color: "#3a1c71",
                  borderRadius: "20px",
                  padding: "8px 22px",
                  fontWeight: 700,
                  fontSize: "1.05em",
                  boxShadow: "0 2px 8px rgba(67,206,162,0.10)",
                  margin: "2px 0",
                }}
              >
                {result.type}
              </span>
            ))}
          </div>
          <p style={{ whiteSpace: "pre-wrap" }}>{data.introDescription}</p>
          <button onClick={handleStartQuiz}>{data.startButtonText}</button>
        </div>
      )}

      {currentPage === "question" && (
        <div className="question-page">
          <h2>
            질문 {currentQuestionIndex + 1} / {data.questions.length}
          </h2>
          <p>{data.questions[currentQuestionIndex].question}</p>
          <div className="answers">
            {data.questions[currentQuestionIndex].answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(answer.type)}
                className={selected === answer.type ? "selected" : ""}
                style={
                  selected === answer.type
                    ? {
                        borderColor: "#43cea2",
                        background: "linear-gradient(90deg, #f8ffae 0%, #43cea2 100%)",
                        color: "#185a9d",
                        fontWeight: 700,
                      }
                    : {}
                }
              >
                {answer.text}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              style={{ opacity: currentQuestionIndex === 0 ? 0.4 : 1, minWidth: 100 }}
            >
              이전
            </button>
            <button onClick={handleNext} disabled={!selected} style={{ opacity: !selected ? 0.4 : 1, minWidth: 100 }}>
              {currentQuestionIndex === data.questions.length - 1 ? "제출" : "다음"}
            </button>
          </div>
          <div
            className="progress-bar"
            style={{ width: `${((currentQuestionIndex + 1) / data.questions.length) * 100}%` }}
          ></div>
        </div>
      )}

      {currentPage === "end-quiz" && (
        <div className="end-quiz-page">
          <p style={{ whiteSpace: "pre-wrap" }}>{data.endMessage}</p>
          <button onClick={() => setCurrentPage("result")}>결과 보기</button>
        </div>
      )}

      {currentPage === "result" && resultType && (
        <div className="result-page">
          <h1>당신의 직장인 유형은?</h1>
          <h2>{data.results[resultType].type}</h2>
          <p>{data.results[resultType].description}</p>
          <h3>주요 특징</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{data.results[resultType].characteristics}</p>
          <h3>나에게 필요한 것은</h3>
          <p>{data.results[resultType].needs}</p>
          <h3>내가 삐뚤어지면</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{data.results[resultType].angry}</p>
          <button onClick={handleRestart}>다시하기</button>
        </div>
      )}
    </div>
  );
}

export default App;
