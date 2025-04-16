import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './NewPasswordForm.css'; 

const NewPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validationSchema = Yup.object({
    password: Yup.string().min(6, 'Minimum 6 characters').required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/new-password`, {
        token,
        password: values.password,
      });

      if (res.data.msg) {
        setSuccess(true);
        setTimeout(() => navigate('/'), 2500); 
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || 'Something went wrong');
    }
    setSubmitting(false);
  };

  return (
    <div className="container mt-5 col-md-6">
      <div className="card shadow p-4">
        {!success ? (
          <>
            <h4 className="text-center mb-3">Set New Password</h4>

            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <Formik
              initialValues={{ password: '', confirmPassword: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-3">
                    <label>New Password</label>
                    <Field name="password" type="password" className="form-control" />
                    <ErrorMessage name="password" component="div" className="text-danger" />
                  </div>

                  <div className="mb-3">
                    <label>Confirm Password</label>
                    <Field name="confirmPassword" type="password" className="form-control" />
                    <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                  </div>

                  <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                    {isSubmitting ? 'Please wait...' : 'Reset Password'}
                  </button>
                </Form>
              )}
            </Formik>
          </>
        ) : (
          <div className="text-center success-animation">
            <div className="checkmark-circle">
              <div className="background"></div>
              <div className="checkmark">&#10003;</div>
            </div>
            <h5 className="mt-3">Password reset successful!</h5>
            <p>Redirecting to login...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPasswordForm;
