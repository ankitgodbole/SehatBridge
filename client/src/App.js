import { BrowserRouter as Router } from 'react-router-dom'; // Import Routes instead of Switch
import { UserProvider } from './store/userContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import { useState, useEffect } from 'react';
import Preloader from './components/PreLoader';


function App() {
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPreloaderVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {isPreloaderVisible ? (
        <Preloader />
      ) : (
        <Router>
          <UserProvider>
            <Layout />
            
          </UserProvider>
          <ToastContainer />
        </Router>
      )}
    </div>
  );
}

export default App;
