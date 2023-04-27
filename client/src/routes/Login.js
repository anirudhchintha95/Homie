import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button, Grid, TextField, Box, Paper, Typography } from "@mui/material";

import useAuth from "../useAuth";
import { loginApi } from "../api/auth";

const Login = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const login = async (e) => {
        e.preventDefault();
        const emailInput = e.target.email.value.trim();
        const passwordInput = e.target.password.value.trim();

        var hasError = false;
        setEmailError("");
        setPasswordError("");

        if (!emailInput) {
            hasError = true;
            setEmailError("Email is required.");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
            hasError = true;
            setEmailError("Invalid email format.");
        }

        if (!passwordInput) {
            hasError = true;
            setPasswordError("Password is required.");
        } else if (
            !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$/.test(
                passwordInput
            )
        ) {
            hasError = true;
            setPasswordError(
                "Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character."
            );
        }

        if (!hasError) {
            try {
                // DevLog | Apoorv
                alert("Logging In");
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
                <Typography variant="h4" align="center" mb={4}>
                    Login
                </Typography>
                <Paper component="form" onSubmit={login} sx={{ p: 2 }}>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                type="email"
                                id="email"
                                name="email"
                                label="Email"
                                variant="outlined"
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
                                variant="outlined"
                                onChange={handlePasswordChange}
                                error={Boolean(passwordError)}
                                helperText={passwordError}
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" variant="contained" fullWidth>
                        Login
                    </Button>
                    <Box mt={2} textAlign="center">
                        <Button
                            variant="text"
                            component={Link}
                            to="/signup"
                            sx={{ mt: 2 }}
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
