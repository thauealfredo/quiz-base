import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion'

import db from '../db.json';
import QuizBackground from '../src/components/Quiz/QuizBackground';
import QuizLogo from '../src/components/Quiz/QuizLogo';
import Widget from '../src/components/Widget';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import Input from '../src/components/Input'
import Button from '../src/components/Button'
import Link from '../src/components/Link';
import QuizContainer from '../src/components/Quiz/QuizContainer'


export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');

  const sendName = (e) => {
    e.preventDefault();
    router.push(`/quiz?name=${name}`);
  };

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        <Widget 
          as={motion.section}
          transition={{ delay: 0, duration: 0.5 }}
          variants={{
            show: { opacity: 1, y: '0' },
            hidden: { opacity: 0, y: '100%' },
          }}
          initial="hidden"
          animate="show"
        >
          <Widget.Header>
            <h1>{db.title}</h1>
          </Widget.Header>
          <Widget.Content>
            <p>{db.description}</p>
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

        <Widget 
          as={motion.section}
          transition={{ delay: 0.5, duration: 0.5 }}
          variants={{
            show: { opacity: 1, x: '0' },
            hidden: { opacity: 0, x: '100%' },
          }}
          initial="hidden"
          animate="show">
          <Widget.Header>
            <h1>Quizes da Galera</h1>
          </Widget.Header>
          <Widget.Content>
          <ul>
              {db.external.map((linkExterno) => {
                const [projectName, githubUser] = linkExterno
                  .replace(/\//g, '')
                  .replace('https:', '')
                  .replace('.vercel.app', '')
                  .split('.');

                return (
                  <li key={linkExterno}>
                    <Widget.Topic
                     as={Link}
                     href={`/quiz/${projectName}___${githubUser}`}
                   >
                      {`${githubUser}/${projectName}`}
                    </Widget.Topic>
                  </li>
                );
              })}
            </ul>
          </Widget.Content>
        </Widget>
        <Footer 
         as={motion.section}
         transition={{ delay: 0.6, duration: 0.5 }}
         variants={{
           show: { opacity: 1, x: '0' },
           hidden: { opacity: 0, x: '-100%' },
         }}
         initial="hidden"
         animate="show" />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/thauealfredo" />
    </QuizBackground>
  );
}
