import React, { useEffect, useState} from 'react';
import config from '../config.json';
import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/Quiz/QuizLogo';
import QuizBackground from '../src/components/Quiz/QuizBackground';
import QuizContainer from '../src/components/Quiz/QuizContainer';
import Button from '../src/components/Button';

function LoadingWidget() {
  return (
    <Widget style={{border: 0}}>
      <Widget.Header style={{backgroundColor: '#0288d1'}}>
        Carregando...
      </Widget.Header>
      <Widget.Content style={{padding: 0}}>
        <img  alt="luffy menor correndo"     
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        src={config.gifLoading}  /> 
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
  time
}) {
  const questionId = `question__${questionIndex}`;
  return (
    <Widget>
      <Widget.Header>
        {/* <BackLinkArrow href="/" /> */}
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
        <h3 style={{marginLeft: '45%'}}>{`00:${time}`}</h3>
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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            return (
              <Widget.Topic
                as="label"
                htmlFor={alternativeId}
              >
                <input
                  // style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          <Button type="submit">
            Confirmar
          </Button>
        </form>
      </Widget.Content>
    </Widget>
  );
}

function Congratulations(props){
  return (
    <Widget>
      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
         src={config.imageCongratulations}
      />
      <Widget.Content>
        <h2>
         {`Você acertou ${props.acertos} de ${props.totalQuestions}`}
        </h2>
        <br />
          <Button type="submit">
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
  const totalQuestions = config.questions.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questionIndex = currentQuestion;
  const question = config.questions[questionIndex];
  const [time, setTime] = useState(30)
  const [answers, setAnswer] = useState([])

  useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 1000);
  }, []);

  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={config.bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmitQuiz}
            time={time}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}
        {screenState === screenStates.RESULT && <Congratulations  acertos={10}  totalQuestions={totalQuestions} />}
      </QuizContainer>
    </QuizBackground>
  );
}