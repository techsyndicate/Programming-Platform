import React from 'react';
import './Button.css';
import { HashLink } from 'react-router-hash-link';

const STYLES = ['btn--primary', 'btn--primary--black', 'btn--outline', 'btn--test'];

const SIZES = ['btn--medium', 'btn--large'];

export const Button = ({
    children,
    type,
    onClick,
    buttonStyle,
    buttonSize,
    path,
    offset
}) => {
    const checkButtonStyle = STYLES.includes(buttonStyle)
        ? buttonStyle
        : STYLES[0];

    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

    return (
        <HashLink to={path||''} className='btn-mobile' smooth scroll={el => { el.scrollIntoView(true); window.scrollBy(0, -offset) }}>
            <button
                className={`btn ${checkButtonStyle} ${checkButtonSize}`}
                onClick={onClick}
                type={type}
            >
                {children}
            </button>
        </HashLink>
    );
};