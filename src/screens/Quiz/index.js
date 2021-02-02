import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { Lottie } from '@crello/react-lottie';
import Widget from '../../components/Widget';
import QuizLogo from '../../components/Quiz/QuizLogo';
import QuizBackground from '../../components/Quiz/QuizBackground';
import QuizContainer from '../../components/Quiz/QuizContainer';
import Button from '../../components/Button';
import AlternativeForm from '../../components/AlternativeForm'
import BackLinkArrow from '../../components/BackLinkArrow'
import styled from 'styled-components'
import loadingAnimation from './animation/loading.json';

function LoadingWidget({ loading, bgLoading }) {
    return (
        <Widget style={{ border: 0 }}>
            <Widget.Header style={{ backgroundColor: bgLoading }}>
                Carregando...
      </Widget.Header>
            <Widget.Content style={{ padding: 0 }}>

                {loading ? (
                    <img alt="luffy menor correndo"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                        src={loading} />) : (
                        <Lottie
                            width="100%"
                            height="100%"
                            className="lottie-container basic"
                            config={{ animationData: loadingAnimation, loop: true, autoplay: true }}
                        />)
                }

            </Widget.Content>
        </Widget>
    );
}

function QuestionWidget({
    question,
    questionIndex,
    totalQuestions,
    onSubmit,
    addResult,
    bgButton
}) {
    const questionId = `question__${questionIndex}`;
    const [selectedAlternative, setAlternative] = useState(undefined)
    const [isQuestionSubmited, setQuestionSubmited] = useState(false)
    const isCorrect = selectedAlternative === question.answer
    const hasAlternativeSelected = selectedAlternative !== undefined

    return (
        <Widget>
            <Widget.Header>
                <BackLinkArrow href="/" />
                <h3>
                    {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
                </h3>
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

                    <Button style={{ backgroundImage: bgButton }} type="submit" disabled={!hasAlternativeSelected}>
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
            <Widget.Header>
                <NamePlayer style={{color: props.fontResult}}>
                    {router.query.name}
                </NamePlayer>
            </Widget.Header>
            <Widget.Content>
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

export default function QuizPage({ questions, background, loading, bgButton, bgLoading , fontResult}) {
    const [screenState, setScreenState] = useState(screenStates.LOADING);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const questionIndex = currentQuestion;
    const totalQuestions = questions.length;
    const question = questions[questionIndex];
    const [results, setResult] = useState([])
    const bg = background;

    useEffect(() => {
        setTimeout(() => {
            setScreenState(screenStates.QUIZ);
        }, 2 * 1000);
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
        <QuizBackground backgroundImage={bg}>
            <QuizContainer>
                <QuizLogo />
                {screenState === screenStates.QUIZ && (
                    <QuestionWidget
                        question={question}
                        questionIndex={questionIndex}
                        totalQuestions={totalQuestions}
                        onSubmit={handleSubmitQuiz}
                        addResult={addResult}
                        bgButton={bgButton}
                    />
                )}

                {screenState === screenStates.LOADING && <LoadingWidget bgLoading={bgLoading} loading={loading} />}
                {screenState === screenStates.RESULT && <Result  fontResult={fontResult} result={results} totalQuestions={totalQuestions} />}
            </QuizContainer>
        </QuizBackground>
    );
}