import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Entry from './pages/Entry';
import History from './pages/History';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Router>
      <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/entry" element={<Entry />} />
          <Route path='/history' element={<History/>}/>
          <Route path="*" element={<Home/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;