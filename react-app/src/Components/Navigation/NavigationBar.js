import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HashLink, NavHashLink } from 'react-router-hash-link';

import { Button } from '../button/Button';
import './NavigationBar.css'

function NavigationBar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    const [logged, setlogged] = useState(false);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        if (window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    };
    window.addEventListener('resize', showButton);

    const listenStorage = () => {
        localStorage.getItem('User') ? setlogged(true) : setlogged(false);
    }
    window.onstorage = () => { listenStorage()};
    useEffect(() => {
        showButton();
        listenStorage();
    }, []);


    return (
        <nav className="navbar">
            <div className="navbar-container">

                <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                    TS Prog
                </Link>

                <div className='menu-icon' onClick={handleClick}>
                    <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                </div>

                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className='nav-item'>
                        <NavHashLink smooth
                            to='/Events' className='nav-links' scroll={el => { el.scrollIntoView(true); window.scrollBy(0, -80) }} onClick={() => { closeMobileMenu() }}>
                            Events
                        </NavHashLink>
                    </li >

                    <li className='nav-item'>
                        <NavHashLink smooth scroll={el => { el.scrollIntoView(true); window.scrollBy(0, -80) }}
                            to='/Practice' className='nav-links' onClick={closeMobileMenu}>
                            Practice
                        </NavHashLink>
                    </li>

                    {logged ? (
                        <li>
                            <HashLink to='/Profile'
                                className='nav-links-mobile' onClick={closeMobileMenu}>
                                Profile
                            </HashLink>
                        </li>
                    ) : (
                        <li>
                            <HashLink to='/login'
                                className='nav-links-mobile' onClick={closeMobileMenu}>
                                SingIn/SingUp
                            </HashLink>
                        </li>
                    )}
                </ul>
                {logged ?
                    button && <Button buttonStyle='btn--outline' offset='80' path='/Profile'>Profile</Button>
                    :
                    button && <Button buttonStyle='btn--outline' offset='80' path='/login'>SignIn/SignUp</Button>
                }
            </div>
        </nav>
    )
}

export default NavigationBar;
