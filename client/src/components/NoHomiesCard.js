import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import Person2Icon from "@mui/icons-material/Person2";
import Person3Icon from "@mui/icons-material/Person3";
import Person4Icon from "@mui/icons-material/Person4";
import { Stack, Typography, Card, CardContent } from "@mui/material";
import ConnectionIcon from "./ConnectionIcon";

const getIcons = () => {
  const icons = [PersonIcon, Person2Icon, Person3Icon, Person4Icon];

  return [
    icons[Math.floor(Math.random() * icons.length)],
    icons[Math.floor(Math.random() * icons.length)],
  ];
};

const NoHomiesCard = ({ title = "No Users Found.", body, status }) => {
  const [FirstIcon, SecondIcon] = getIcons();

  return (
    <Card elevation={4}>
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack direction="column" alignItems="center">
          <Stack direction="row" alignItems="center">
            <FirstIcon color="action" sx={{ fontSize: 100 }} />
            <ConnectionIcon status={status} />
            <SecondIcon color="action" sx={{ fontSize: 100 }} />
          </Stack>
          <Typography variant="h3-esque" color="primary">
            {title}
          </Typography>
          {body ? (
            <Typography variant="body1" color="primary">
              {body}
            </Typography>
          ) : (
            <></>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default React.memo(NoHomiesCard);
