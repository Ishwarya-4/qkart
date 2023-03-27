import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();


  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
   const [person, setPerson] = useState({
    username: '',
    password: '',
  });
  const [validation, checkValidation] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  let history = useHistory();

  function handleusername(e) {
    setPerson({
      ...person,
      username: e.target.value
    });
    checkValidation({
      ...validation,
      username:e.target.value
    });
  }

  function checkpassword(e) {
    
    checkValidation({
      ...validation,
      password:e.target.value
    });
  }

  function handlepassword(e) {
    setPerson({
      ...person,
      password: e.target.value
    });
    checkValidation({
      ...validation,
      confirmPassword:e.target.value
    });
  }

  const register = async (formData) => {
    if(validateInput(validation)){
    setIsLoading(true);
    let api=`${config.endpoint}/auth/register`;
    axios.post(api,formData)
    .then(response => {
      console.log(response);
      let msg="Registered successfully";
      enqueueSnackbar(msg, {variant: 'success'});
      setIsLoading(false);
      history.push("/login");
    })
        .catch(error => {
            //console.error('There was an error!', error);
            if(error.response.status>=400){
              enqueueSnackbar(error.response.data.message, {variant: 'error'});
              setIsLoading(false);
            }
            else
            {
              let msg="Something went wrong. Check that the backend is running, reachable and returns valid JSON.";
              enqueueSnackbar(msg, {variant: 'error'});
            }

        });
          
      }
    // if(status >= 400 && message=== "Username already exists"){
    //   console.log("Username already exists");
    //   let msg="Username already exists";
    //   enqueueSnackbar(msg, {variant: 'error'});
    // }
    // else if(status === 201){
    //   console.log("Registered successfully");
    //   let msg="Registered successfully";
    //   enqueueSnackbar(msg, {variant: 'success'});
    // }
    // else
    // {
    //   console.log("Something went wrong. Check that the backend is running, reachable and returns valid JSON.");
    //   let msg="Something went wrong. Check that the backend is running, reachable and returns valid JSON.";
    //   enqueueSnackbar(msg, {variant: 'error'});
    // }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    if(data.username===""){
      enqueueSnackbar("Username is a required field", {variant: 'warning'});
      return false;
    }
    else if(data.username.length<6){
      enqueueSnackbar("Username must be at least 6 characters", {variant: 'warning'});
      return false;
    }
    else if(data.password===''){
      enqueueSnackbar("Password is a required field", {variant: 'warning'});
      return false;
    }
    else if(data.password.length<6){
      enqueueSnackbar("Password must be at least 6 characters", {variant: 'warning'});
      return false;
    }
    else if(data.password !== data.confirmPassword){
      enqueueSnackbar("Passwords do not match", {variant: 'warning'});
      return false;
    }
    else{
      return true;
    }
  };
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons/>
      <Box className="content">
        <Stack spacing={1} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            
            size="small"
            margin="normal"
            sx= {{ width: '41ch' }}
            onChange={handleusername}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            
            placeholder="Enter a password with minimum 6 characters"
            size="small"
            margin="normal"
            sx= {{ width: '41ch' }}
            onChange={checkpassword}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            
            size="small"
            margin="normal"
            sx= {{ width: '41ch' }}
            onChange={handlepassword}
          />
          {!isLoading &&
           (<Button className="button" variant="contained" sx= {{ width: '49ch' }} onClick={()=>register(person)}>
            Register Now
           </Button>
           )}
           <Box display="flex" justifyContent="center" alignItems="center">
            {isLoading && <CircularProgress />}</Box>
          <p className="secondary-action">
            Already have an account?{" "}
             <Link to ="/login" className="link"> Login here </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
