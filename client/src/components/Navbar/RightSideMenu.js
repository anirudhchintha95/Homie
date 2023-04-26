import React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

import useAuth from "../../useAuth";
import { Link, useNavigate } from "react-router-dom";

const RightSideMenu = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const signOut = () => {
    handleCloseUserMenu();
    auth.signOut(() => navigate("/"));
  };

  const settings = [
    {
      name: "Account",
      path: "/account",
      Icon: () => <Avatar sx={{ height: "20px", width: "20px" }} />,
    },
    {
      name: "My preferences",
      path: "/preferences",
      Icon: Settings,
    },
    {
      name: "Logout",
      onClick: signOut,
      Icon: Logout,
    },
  ];

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="Remy Sharp" src="" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem disabled key="Hi" sx={{ opacity: "1!important" }}>
          <Typography textAlign="center" sx={{ width: "100%" }}>
            Hi{" "}
            {auth?.user
              ? `${auth?.user?.firstName} ${auth?.user?.lastName}`
              : "Homie"}
          </Typography>
        </MenuItem>
        <Divider />
        {settings.map((setting) => (
          <MenuItem
            key={setting.name}
            {...(setting.path
              ? {
                  component: Link,
                  to: setting.path,
                  onClick: handleCloseUserMenu,
                }
              : { onClick: setting.onClick })}
          >
            <ListItemIcon>
              <setting.Icon fontSize="small" />
            </ListItemIcon>
            {setting.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default RightSideMenu;
