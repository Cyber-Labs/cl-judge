import React from "react";
import Head from "next/head";
import { Tab, Tabs } from "react-bootstrap";
import Link from "next/link";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Footer from "../components/common/Footer";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Online Judge IIT-ISM</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="container">
          <div className="row pb-5 align-items-center">
            <div className="col-md-6 mt-4">
              <h1>ONLINE JUDGE</h1>
            </div>

            <div className=" col-lg-6 sm-12 mt-4">
              <br />
              <br />
              <br />
              <br />

              <Tabs defaultActiveKey="login" id="uncontrolled-tab-example">
                <Tab eventKey="login" title="Log In ">
                  <div>
                    <Login />
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
      <Footer />
      <style jsx>{`
        main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
