import React from 'react'

function Footer () {
  return (
    <div>
      <footer>
        <p>
          © Copyright 2020{' '}
          <a
            href="https://cyberlabs.club/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            &nbsp; Cyberlabs
          </a>
        </p>
      </footer>
      <style jsx>{`
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer p {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  )
}

export default Footer
