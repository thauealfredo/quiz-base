import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import db from '../db.json';
import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/Quiz/QuizLogo';
import QuizBackground from '../src/components/Quiz/QuizBackground';
import QuizContainer from '../src/components/Quiz/QuizContainer';
import Button from '../src/components/Button';
import AlternativeForm from '../src/components/AlternativeForm'
import styled from 'styled-components'

function LoadingWidget() {
  return (
    <Widget style={{ border: 0 }}>
      <Widget.Header style={{ backgroundColor: '#0288d1' }}>
        Carregando...
      </Widget.Header>
      <Widget.Content style={{ padding: 0 }}>
        <img alt="luffy menor correndo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          src={db.gifLoading} />
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
  time,
  addResult
}) {
  const questionId = `question__${questionIndex}`;
  const [selectedAlternative, setAlternative] = useState(undefined)
  const [isQuestionSubmited, setQuestionSubmited] = useState(false)
  const isCorrect = selectedAlternative === question.answer
  const hasAlternativeSelected = selectedAlternative !== undefined

  return (
    <Widget>
      <Widget.Header>
        {/* <BackLinkArrow href="/" /> */}
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
        <h3 style={{ marginLeft: '45%' }}>{`00:${time}`}</h3>
      </Widget.Header>

      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>

        <AlternativeForm
          onSubmit={(e) => {
            e.preventDefault();
            setQuestionSubmited(true)
            setTimeout(() => {
              addResult(isCorrect)
              setAlternative(undefined)
              setQuestionSubmited(false)
              onSubmit()
            }, 3000)
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;
            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmited && alternativeStatus}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  onChange={() => setAlternative(alternativeIndex)}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          <Button style={{ backgroundImage: 'linear-gradient(#0086c3,#fafafa)' }} type="submit" disabled={!hasAlternativeSelected}>
            {!isQuestionSubmited && 'Confirmar'}
            {isQuestionSubmited && isCorrect && 'Acertou'}
            {isQuestionSubmited && !isCorrect && 'Errou'}
          </Button>
        </AlternativeForm>
      </Widget.Content>
    </Widget>
  );
}

const NamePlayer = styled.h1`
 font-size: 20px !important;
 text-align: center;
 color: #ffb74d;
`;

function Result(props) {
  const { result, totalQuestions } = props
  const router = useRouter()

  function tryAgain() {
    router.push(`/`);
  }


  const acertos = result.reduce((countPoint, result) => {
    if (result === true) {
      return countPoint + 1
    }
    return countPoint
  }, 0)


  return (
    <Widget>
      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={db.imageCongratulations}
      />
      <Widget.Content>
        <NamePlayer>
          {router.query.name}
        </NamePlayer>
        <h1 style={{ fontSize: 18, textAlign: 'center' }}>
          {`Você acertou ${acertos} de ${totalQuestions}`}
        </h1>
        <br />
        <Button style={{ backgroundImage: 'linear-gradient(#0086c3,#fafafa)' }} onClick={() => tryAgain()} type="submit">
          Jogar novamente
          </Button>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

export default function QuizPage() {
  const [screenState, setScreenState] = useState(screenStates.LOADING);
  const totalQuestions = db.questions.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];
  const [time, setTime] = useState(30)
  const [results, setResult] = useState([])

  useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 1000);
  }, []);

  function addResult(result) {
    setResult([...results, result])
  }

  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmitQuiz}
            time={time}
            addResult={addResult}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}
        {screenState === screenStates.RESULT && <Result result={results} totalQuestions={totalQuestions} />}
      </QuizContainer>
    </QuizBackground>
  );
}