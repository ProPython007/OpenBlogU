import Home from './components/Home';
import Navbar from './components/Navbar';
import BlogDetails from './components/BlogDetails';
import Create from './components/Create';
import NotFound from './components/NotFound'
import SearchResults from './components/SearchResults';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import Account from './components/Account';
import AuthorBlogs from './components/AuthorBlogs';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {

  return (
    <Router>
      <div className="App">
        <Navbar />
        <ToastContainer />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/account" element={<Account />} />
            <Route path="/author-blogs/:id" element={<AuthorBlogs />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
