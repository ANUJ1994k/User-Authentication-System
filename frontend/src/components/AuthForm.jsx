import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import ResetPasswordForm from './ResetPasswordForm';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [serverMsg, setServerMsg] = useState('');

  // Toggle between Login and Register forms
  const toggleForm = () => {
    setShowReset(false);
    setIsLogin(!isLogin);
    setServerMsg('');
  };

  // Initial form values
  const initialValues = {
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
  };

  // Validation schemas
  const loginSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });

  const registerSchema = Yup.object({
    name: Yup.string().min(2).required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Min 6 characters').required('Required'),
    age: Yup.number().min(0).required('Required'),
    gender: Yup.string().oneOf(['male', 'female', 'other']).required('Required'),
  });

  // Handle Login/Register form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setServerMsg('');
    const endpoint = isLogin ? 'login' : 'register';

    try {
      const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, values);
      setServerMsg(`✅ ${isLogin ? 'Login' : 'Registration'} successful!`);
      console.log('Response:', res.data);
    } catch (err) {
      setServerMsg(`❌ ${err.response?.data?.msg || 'Something went wrong'}`);
    }

    setSubmitting(false);
  };

  return (
    <div className="container mt-5 col-md-6 bg-light">
      {showReset ? (
        <ResetPasswordForm onBack={() => { setShowReset(false); setServerMsg(''); }} />
      ) : (
        <div className="card shadow p-4 rounded bg-light">
          <h3 className="text-center mb-4">{isLogin ? 'Login' : 'Register'}</h3>

          {serverMsg && (
            <div className={`alert ${serverMsg.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}>
              {serverMsg}
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={isLogin ? loginSchema : registerSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                {/* Register fields */}
                {!isLogin && (
                  <>
                    <div className="mb-3">
                      <label>Name</label>
                      <Field name="name" type="text" className="form-control" />
                      <ErrorMessage name="name" component="div" className="text-danger" />
                    </div>

                    <div className="mb-3">
                      <label>Age</label>
                      <Field name="age" type="number" className="form-control" />
                      <ErrorMessage name="age" component="div" className="text-danger" />
                    </div>

                    <div className="mb-3">
                      <label>Gender</label>
                      <Field as="select" name="gender" className="form-control">
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Field>
                      <ErrorMessage name="gender" component="div" className="text-danger" />
                    </div>
                  </>
                )}

                {/* Email field */}
                <div className="mb-3">
                  <label>Email</label>
                  <Field name="email" type="email" className="form-control" />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </div>

                {/* Password field */}
                <div className="mb-3">
                  <label>Password</label>
                  <Field name="password" type="password" className="form-control" />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </div>

                {/* Forgot Password link on login form */}
                {isLogin && (
                  <div className="text-end mb-3">
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      onClick={() => { setShowReset(true); setServerMsg(''); }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Submit button */}
                <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                  {isSubmitting ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
                </button>
              </Form>
            )}
          </Formik>

          {/* Toggle between Login/Register */}
          <div className="text-center mt-3">
            <button className="btn btn-link" onClick={toggleForm}>
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
