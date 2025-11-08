// Add these imports at the top of App.js
import Chatbot from './components/Chatbot';
import './components/Chatbot.css';

// ... (keep the rest of your imports and the function definition)

function App() {
  return (
    <div className='App'>
      <Header />
      <Routes>
        {/* ... your other routes ... */}
        <Route path='/' element={<Chart />} />
        <Route path='/settings' element={<Settings />} />
      </Routes>
      
      {/* ADD THE CHATBOT COMPONENT HERE */}
      <Chatbot />

    </div>
  );
}

export default App;