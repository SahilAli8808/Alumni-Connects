import React from 'react';
import './style.css';
import { Link} from "react-router-dom";


export default class Home extends React.Component {
  render() {
    return (
      <div className="landing-page container">
        <header className="text-center my-5">
          <h1>Welcome to Alumnite</h1>
          <p>Your platform for alumni engagement and collaboration</p>
        </header>
        <section className="row features mb-5">
          <div className="col-md-4 mb-4">
            <div className="feature p-4">
              <i className="bi bi-calendar2-check h1 text-success mb-3"></i>
              <h2>Create Events</h2>
              <p>Organize and manage alumni events seamlessly.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="feature p-4">
              <i className="bi bi-camera-video h1 text-primary mb-3"></i>
              <h2>Host Virtual Online Meetings</h2>
              <p>Connect with alumni worldwide through virtual meetings.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="feature p-4">
              <i className="bi bi-briefcase h1 text-warning mb-3"></i>
              <h2>Post Jobs for Alumni</h2>
              <p>Help alumni discover job opportunities within the community.</p>
            </div>
          </div>
          {/* Add more features as needed */}
        </section>
        <section className="cta text-center mb-5">
          <h2>Get Started Today!</h2>
          <p>Join our community and explore the benefits of Alumnite.</p>
          <button className="btn btn-success btn-lg"><Link id='button-link' to='/register'>Sign Up for Alumni</Link></button>
        </section>
        <footer className="text-center">
          <p>&copy; 2023 Alumnite. All rights reserved.</p>
        </footer>
      </div>
    );
  }
}