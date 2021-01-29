import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import config from '../config.json';
import QuizBackground from '../src/components/Quiz/QuizBackground';
import QuizLogo from '../src/components/Quiz/QuizLogo';
import Widget from '../src/components/Widget';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import Input from '../src/components/Input'
import Button from '../src/components/Button'
import QuizContainer from '../src/components/Quiz/QuizContainer'


export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');

  const sendName = (e) => {
    e.preventDefault();
    router.push(`/quiz?name=${name}`);
  };

  return (
    <QuizBackground backgroundImage={config.bg}>
      <QuizContainer>
        <QuizLogo />
        <Widget>
          <Widget.Header>
            <h1>{config.title}</h1>
          </Widget.Header>
          <Widget.Content>
            <p>{config.description}</p>
            <form onSubmit={(e) => sendName(e)}>
              <Input
                onChange={(e) => setName(e.target.value)}
                placeholder="Diz ai seu nome"
                value={name}
                name='nome usuario'
              />
              <Button  style={{ backgroundImage: 'linear-gradient(#0086c3,#fafafa)' }} type="submit" disabled={name.length === 0}>
                {`Jogar ${name}`}
              </Button>
            </form>
          </Widget.Content>
        </Widget>

        <Widget>
          <Widget.Header>
            <h1>Quizes da Galera</h1>
          </Widget.Header>
          <Widget.Content>
            <p>lorem ipsum dolor sit amet...</p>
          </Widget.Content>
        </Widget>
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/thauealfredo" />
    </QuizBackground>
  );
}
