import { Typography } from "@mui/material";
import React from "react";
import {
  StyledDiv,
  SliderContainer,
  StyledLabel,
  StyledInput,
  SliderValue,
} from "./FitmentSettingsStyles";

interface SuspensionSettingsProps {
  title: string;
  rideHeight: number;
  setRideHeight: (value: number) => void;
  camber: number;
  setCamber: (value: number) => void;
  caster?: number; // Optional for rear settings
  setCaster?: (value: number) => void; // Optional for rear settings
  toe?: number;
  setToe?: (value: number) => void;
  stockRideHeight: number;
  mmToInches: number;
}

const SuspensionSettings: React.FC<SuspensionSettingsProps> = ({
  title,
  rideHeight,
  setRideHeight,
  camber,
  setCamber,
  caster,
  setCaster,
  toe,
  setToe,
  stockRideHeight,
  mmToInches,
}) => {
  return (
    <StyledDiv>
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>
      <SliderContainer>
        <StyledLabel>Ride Height:</StyledLabel>
        <StyledInput
          type="range"
          min="-3"
          max="-2"
          step="0.01"
          value={rideHeight}
          onChange={(e) => setRideHeight(parseFloat(e.target.value))}
        />
        <SliderValue>
          {rideHeight === stockRideHeight
            ? 'Stock (0.00")'
            : `${(-(rideHeight - stockRideHeight) * mmToInches).toFixed(
                2
              )}\u2033`}
        </SliderValue>
      </SliderContainer>

      <SliderContainer>
        <StyledLabel>Camber:</StyledLabel>
        <StyledInput
          type="range"
          min="-20"
          max="1"
          step="0.1"
          value={camber}
          onChange={(e) => setCamber(parseFloat(e.target.value))}
        />
        <SliderValue>{camber}°</SliderValue>
      </SliderContainer>

      {caster !== undefined && setCaster && (
        <SliderContainer>
          <StyledLabel>Caster:</StyledLabel>
          <StyledInput
            type="range"
            min="5"
            max="8"
            step="0.1"
            value={caster}
            onChange={(e) => setCaster(parseFloat(e.target.value))}
          />
          <SliderValue>{caster}°</SliderValue>
        </SliderContainer>
      )}
      {toe !== undefined && setToe && (
        <SliderContainer>
          <StyledLabel>Toe:</StyledLabel>
          <StyledInput
            type="range"
            min="-0.05"
            max="0.05"
            step="0.01"
            value={toe}
            onChange={(e) => setToe(parseFloat(e.target.value))}
          />
          <SliderValue>{toe}°</SliderValue>
        </SliderContainer>
      )}
    </StyledDiv>
  );
};

export default SuspensionSettings;
