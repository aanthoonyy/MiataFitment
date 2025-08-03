import { styled } from "@mui/material";

export const StyledInput = styled("input")(({ theme }) => ({
  width: "100%",
  padding: "8px",
  marginBottom: "8px",
  borderRadius: "4px",
  border: `1px solid ${theme.palette.divider}`,
  fontSize: "0.875rem",
  "&:focus": {
    outline: "none",
    borderColor: theme.palette.primary.main,
  },
  "&[type=range]": {
    padding: 0,
    marginBottom: "16px",
    WebkitAppearance: "none",
    height: "4px",
    borderRadius: "2px",
    backgroundColor: theme.palette.divider,
    "&::-webkit-slider-thumb": {
      WebkitAppearance: "none",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      backgroundColor: theme.palette.primary.main,
      cursor: "pointer",
    },
    "&::-moz-range-thumb": {
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      backgroundColor: theme.palette.primary.main,
      cursor: "pointer",
    },
  },
}));


export const StyledLabel = styled("label")(({ theme }) => ({
  display: "block",
  marginBottom: "4px",
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
}));

export const StyledDiv = styled("div")(({ theme }) => ({
  marginBottom: "16px",
  padding: "16px",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "4px",
  border: `1px solid ${theme.palette.divider}`,
}));

export const SliderContainer = styled("div")(({}) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "8px",
}));

export const SliderValue = styled("span")(({ theme }) => ({
  minWidth: "60px",
  textAlign: "right",
  color: theme.palette.text.secondary,
}));