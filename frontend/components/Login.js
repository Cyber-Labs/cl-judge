import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import baseUrl from "../shared/baseUrl";

const loginSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

function Login() {
  const [loginError, setLoginError] = useState("");
  return (
    <Formik
      validationSchema={loginSchema}
      onSubmit={(data) => {
        const { username, password } = data;
        var urlencoded = new URLSearchParams();
        urlencoded.append("username", username);
        urlencoded.append("password", password);

        var requestOptions = {
          method: "POST",
          body: urlencoded,
        };

        fetch(`${baseUrl}/auth/login`, requestOptions)
          .then((res) => res.json())
          .then((res) => {
            const { success, error } = res;
            if (!success) {
              if (error.sqlMessage) setLoginError(error.sqlMessage);
              else setLoginError(error);
            }
          })
          .catch((error) => {
            setLoginError(error.message);
          });
      }}
      initialValues={{
        username: "",
        password: "",
      }}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form onSubmit={handleSubmit}>
          <br />
          <h4>Login to (IIT-ISM Online Judge)</h4>
          <br />
          <Form.Group controlId="loginUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your OJ username"
              name="username"
              value={values.username}
              onChange={handleChange}
              isValid={touched.username && !errors.username}
              isInvalid={!touched.username || !!errors.username}
            />
            <Form.Control.Feedback type="invalid">
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="loginPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={values.password}
              onChange={handleChange}
              isValid={touched.password && !errors.password}
              isInvalid={!touched.password || !!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          {loginError && <Alert variant="danger">{loginError}</Alert>}
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default Login;
