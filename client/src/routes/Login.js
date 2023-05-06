import { validateEmail, validatePassword } from "../helpers";
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button, Grid, TextField, Box, Paper, Typography, Alert } from "@mui/material";
import { SubmitButton } from "../components";

import useAuth from "../useAuth";
import { loginApi } from "../api/auth";

const Login = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const login = async (e) => {
        e.preventDefault();
        const emailInput = e.target.email.value.trim().toLowerCase();
        const passwordInput = e.target.password.value.trim();

        var hasError = false;
        setEmailError("");
        setPasswordError("");

        const emailValidation = validateEmail(emailInput);
        const passwordValidation = validatePassword(passwordInput);

        if (!emailValidation.isValid) {
            hasError = true;
            setEmailError(emailValidation.error);
            return;
        }

        if (!passwordValidation.isValid) {
            hasError = true;
            setPasswordError(passwordValidation.error);
            return;
        }

        if (!hasError) {
            try {
                setLoading(true);
                // DevLog | Apoorv
                // alert("Logging In");
                // Login API call
                const res = await loginApi(emailInput, passwordInput);
                await auth.signIn(res?.accesstoken, () => {
                    // Send them back to the page they tried to visit when they were
                    // redirected to the login page. Use { replace: true } so we don't create
                    // another entry in the history stack for the login page.  This means that
                    // when they get to the protected page and click the back button, they
                    // won't end up back on the login page, which is also really nice for the
                    // user experience.
                    navigate(from || "/", {
                        replace: true,
                    });
                });
            } catch (e) {
                console.error(e);
                // setError(e.message);
                setError("Invalid Credentials");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEmailChange = (e) => {
        setEmailError("");
    };

    const handlePasswordChange = (e) => {
        setPasswordError("");
    };

    return (
        <div>
            <Box sx={{ maxWidth: 400, mx: "auto", mt: 10, p: 2 }}>
                <Typography variant="h1" align="center" mb={4} color="primary">
                    Login
                </Typography>
                <Paper component="form" onSubmit={login} sx={{ p: 2 }}>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12}>
                            {error ? <Alert severity="error">{error}</Alert> : <></>}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                type="email"
                                id="email"
                                name="email"
                                label="Email"
                                onChange={handleEmailChange}
                                error={Boolean(emailError)}
                                helperText={emailError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                type="password"
                                id="password"
                                name="password"
                                label="Password"
                                onChange={handlePasswordChange}
                                error={Boolean(passwordError)}
                                helperText={passwordError}
                            />
                        </Grid>
                    </Grid>
                    <SubmitButton loading={loading} fullWidth>Login</SubmitButton>
                    <Box textAlign="center">
                        <Button
                            variant="contained"
                            component={Link}
                            to="/signup"
                            sx={{ mt: 2 }}
                            color="secondary"
                            fullWidth
                            disabled={loading}
                        >
                            Signup
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </div>
    );
};

export default Login;
