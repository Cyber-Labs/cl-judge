import React from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Login from '../components/Login'
import Signup from '../components/Signup'
import PropTypes from 'prop-types'

function Home (props) {
  const { isLoggedIn, setIsLoggedIn, setUser } = props
  const router = useRouter()
  if (isLoggedIn) {
    router.push('/user/edit-profile')
  }
  return (
    <div>
      <main>
        <div className="container">
          <div className="row pb-5 align-items-center">
            <div className="col-md-6 left-heading">
              <br />
              <br />
              <h1>CL JUDGE</h1>
            </div>

            <div className="col-lg-6 sm-12 right-content">
              <br />
              <br />
              <br />

              <Tabs defaultActiveKey="login" id="uncontrolled-tab-example">
                <Tab eventKey="login" title="Log In ">
                  <div>
                    <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
                    <br />
                    <Link href="/auth/forgot-password">
                      <a>Forgot Password?</a>
                    </Link>
                  </div>
                </Tab>
                <Tab eventKey="signup" title="Sign Up">
                  <div>
                    <Signup />
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <style jsx>{`
        main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        @media (max-width: 768px) {
          .left-heading {
            text-align: center;
          }
        }
        @media (min-width: 768px) {
          .left-heading {
            position: fixed;
            top: 40%;
          }
          .right-content {
            margin-left: 50%;
          }
        }
      `}</style>
    </div>
  )
}

Home.propTypes = {
  isLoggedIn: PropTypes.bool,
  setIsLoggedIn: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired
}

export default Home
