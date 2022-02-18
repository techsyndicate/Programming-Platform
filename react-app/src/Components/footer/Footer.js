import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const instagram = "https://www.instagram.com/techsyndicate46/";
const linkedin = "https://www.linkedin.com/company/tech-syndicate";
const Facebook = "https://www.facebook.com/syndicateofamity46";
const github = 'https://github.com/techsyndicate'
const mail = 'mailto:contact@techsyndicate.club?subject=Hi%20There,%20Wanted%20To%20Contact%20You&body=message%20goes%20here'

const openInNewTab = (url) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
}

function Footer() {
  return (
    <div className='footer-container'>
      <section className='social-media'>
        <div className='social-media-wrap'>
          <div className='footer-logo'>
            <Link to='/' className='social-logo'>
              Tech Syndicate
            </Link>
          </div>
          <small className='website-rights'>Amity International School, Sector 46, Gurgaon</small>
          <div className='social-icons'>
            <p
              className='social-icon-link facebook'
              onClick={() => { openInNewTab(Facebook) }}
              aria-label='Facebook'
            >
              <i className='fab fa-facebook-f' />
            </p>
            <p
              className='social-icon-link instagram'
              onClick={() => { openInNewTab(instagram) }}
              aria-label='Instagram'>
              <i className='fab fa-instagram' />
            </p>
            <p
              className='social-icon-link linkedin'
              onClick={() => { openInNewTab(linkedin) }}
              aria-label='LinkedIn'
            >
              <i className='fab fa-linkedin' />
            </p>
            <p
              className='social-icon-link github'
              onClick={() => { openInNewTab(github) }}
              aria-label='github'>
              <i className='fab fa-github' />
            </p>
            <p
              className='social-icon-link email'
              onClick={() => { openInNewTab(mail) }}
              aria-label='email'>
              <i className='fas fa-envelope' />
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;