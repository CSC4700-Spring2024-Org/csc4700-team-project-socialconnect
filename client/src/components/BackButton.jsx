import React from 'react'
import '../Styles/BackButton.css'

const BackButton = ({show, onClick}) => {
  return (
    <button className={`back-cta ${show ? 'show' : ''}`} onClick={onClick}>
    <span className="back-second">
        <svg
        width="50px"
        height="20px"
        viewBox="0 0 66 43"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        >
        <g
            id="arrow"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
        >
        <path
        className="back-one"
        d="M25.85,3.9 L22.02,0.14 C21.83,-0.05 21.52,-0.05 21.32,0.14 L0.31,20.78 C-0.09,21.17 -0.09,21.81 0.3,22.2 L21.32,42.86 C21.52,43.05 21.83,43.05 22.02,42.86 L25.85,39.1 C26.04,38.91 26.04,38.6 25.85,38.4 L9.01,21.86 C8.81,21.66 8.81,21.35 9.01,21.15 L25.85,4.61 C26.04,4.41 26.04,4.1 25.85,3.9 Z"
        fill="#FFFFFF"
        ></path>
        <path
        className="back-two"
        d="M45.85,3.9 L42.02,0.14 C41.83,-0.05 41.52,-0.05 41.32,0.14 L20.31,20.78 C19.91,21.17 19.91,21.81 20.3,22.2 L41.32,42.86 C41.52,43.05 41.83,43.05 42.02,42.86 L45.85,39.1 C46.04,38.91 46.04,38.6 45.85,38.4 L29.01,21.86 C28.81,21.66 28.81,21.35 29.01,21.15 L45.85,4.61 C46.04,4.41 46.04,4.1 45.85,3.9 Z"
        fill="#FFFFFF"
        ></path>
        <path
        className="back-three"
        d="M65.85,3.9 L62.02,0.14 C61.83,-0.05 61.52,-0.05 61.32,0.14 L40.31,20.78 C39.91,21.17 39.91,21.81 40.3,22.2 L61.32,42.86 C61.52,43.05 61.83,43.05 62.02,42.86 L65.85,39.1 C66.04,38.91 66.04,38.6 65.85,38.4 L49.01,21.86 C48.81,21.66 48.81,21.35 49.01,21.15 L65.85,4.61 C66.04,4.41 66.04,4.1 65.85,3.9 Z"
        fill="#FFFFFF"
        ></path>
        </g>
        </svg>
    </span>
    <span className="back-span">BACK</span>
    </button>

  )
}

export default BackButton