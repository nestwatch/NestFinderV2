import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    // ... other nav items ...
    <Link to="/chat">Chat with GPT</Link>
  );
}

export default Navbar