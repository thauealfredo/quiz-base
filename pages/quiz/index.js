import { ThemeProvider } from 'styled-components';
import QuizScreen from '../../src/screens/Quiz';
import db from '../../db.json';

export default function QuizPage() {
 return (
    <ThemeProvider theme={db.theme}>
      <QuizScreen
        questions={db.questions}
        background={db.bg}
        loading={db.gifLoading}
        bgLoading={'#0288d1'}
        fontResult='#ffb74d'
        bgButton={'linear-gradient(#0086c3,#fafafa)'}
      />
    </ThemeProvider>

  )
}