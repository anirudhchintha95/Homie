import React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const SearchInputForm = ({ searchText, setSearchText, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(searchText);
  };

  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: { xs: "100%", sm: 400 },
      }}
      onSubmit={handleSubmit}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search"
        inputProps={{ "aria-label": "search" }}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onBlur={(e) => setSearchText(e.target.value.trim())}
      />
      <IconButton
        type="button"
        sx={{ p: "5px" }}
        aria-label="clear"
        onClick={() => {
          setSearchText("");
          onSubmit("");
        }}
      >
        <CloseIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton type="submit" sx={{ p: "5px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchInputForm;
