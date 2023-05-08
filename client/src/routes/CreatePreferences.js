import React from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import Typography from "@mui/material/Typography";
import { Button, Paper, StepButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";

import useAuth from "../useAuth";

import { CreatePreferencesForm } from "../components";
import CreatePreferencesImageUploadForm from "../components/CreatePreferences/ImageUploadForm";
import BioForm from "../components/BioForm";

const steps = ["Add your bio", "Add your image", "Create Preferences"];

const getCurrentIndex = (user) => {
  if (!user) return 0;
  if (!user.bio) return 0;
  if (!user.images?.length) return 1;
  return 2;
};

export default function HorizontalLinearStepper() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(
    getCurrentIndex(auth.user)
  );
  const [loading, setLoading] = React.useState(false);

  const stepsCompletedCheck = (index) => {
    if (index === 0) {
      return !!auth.user.bio;
    } else if (index === 1) {
      return !!auth.user.images?.length;
    } else if (index === 2) {
      return !!auth.user.preferences?._id;
    }
  };

  const refreshCurrentUser = async () => {
    try {
      await auth.refreshCurrentUser();
      return true;
    } catch {
      return false;
    }
  };

  const handleNext = async () => {
    const refreshed = await refreshCurrentUser();
    if (refreshed) {
      activeStep === steps.length - 1
        ? navigate("/")
        : setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleStep = (step) => () => {
    if (loading) return;

    setActiveStep(step);
  };

  return (
    <Paper
      sx={{
        maxWidth: { xs: "100%", sm: "80%" },
        mx: "auto",
        mt: { xs: 2, sm: 4 },
        p: 2,
      }}
    >
      <Typography variant="h1" gutterBottom color="primary">
        Before you get started...
      </Typography>
      <Typography variant="body1" mb={2} color="primary">
        Please take a little bit of time for the other users to get to know you.
        This will help our algorithm in fetching you the best matches.
      </Typography>
      <Button
        onClick={refreshCurrentUser}
        sx={{ mb: 2 }}
        variant="text"
        startIcon={<RefreshIcon />}
        disabled={loading}
      >
        Refresh My Data
      </Button>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => {
          return (
            <Step key={label} completed={stepsCompletedCheck(index)}>
              <StepButton onClick={handleStep(index)}>{label}</StepButton>
            </Step>
          );
        })}
      </Stepper>

      <Box
        display="flex"
        justifyContent="center"
        flexDirection={"column"}
        alignItems={"center"}
      >
        <Typography sx={{ mt: 2, mb: 1 }} variant="h2" color="primary">
          {steps[activeStep]}
        </Typography>
        {activeStep === 0 ? (
          <BioForm
            loading={loading}
            setLoading={setLoading}
            onBioUpdate={handleNext}
          />
        ) : activeStep === 1 ? (
          <CreatePreferencesImageUploadForm
            loading={loading}
            setLoading={setLoading}
            onImageUpload={handleNext}
          />
        ) : (
          <CreatePreferencesForm
            loading={loading}
            setLoading={setLoading}
            onCreatePreferences={handleNext}
          />
        )}
      </Box>
    </Paper>
  );
}
