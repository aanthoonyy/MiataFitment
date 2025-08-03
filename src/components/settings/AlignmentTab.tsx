import { Typography } from "@mui/material"
import { StyledDiv, SliderContainer, StyledLabel, StyledInput, SliderValue } from "./StyledComponents"
import { STOCK_RIDE_HEIGHT, MM_TO_INCHES } from "../../constants/constants"


type AlignmentTabProps = {
  alignment: {
    frontCamber: number;
    setFrontCamber: (v: number) => void;
    rearCamber: number;
    setRearCamber: (v: number) => void;
    frontCaster: number;
    setFrontCaster: (v: number) => void;
    frontToe: number;
    setFrontToe: (v: number) => void;
    rearToe: number;
    setRearToe: (v: number) => void;
    rideHeightFront: number;
    setRideHeightFront: (v: number) => void;
    rideHeightRear: number;
    setRideHeightRear: (v: number) => void;
  };
};

export const AlignmentTab = ({ alignment }: AlignmentTabProps) => {
  const {
    frontCamber,
    setFrontCamber,
    rearCamber,
    setRearCamber,
    frontCaster,
    setFrontCaster,
    frontToe,
    setFrontToe,
    rearToe,
    setRearToe,
    rideHeightFront,
    setRideHeightFront,
    rideHeightRear,
    setRideHeightRear,
  } = alignment;
  
    return (
    <>
          <StyledDiv>
            <Typography variant="subtitle1" gutterBottom>
              Front Settings
            </Typography>
            <SliderContainer>
              <StyledLabel>Ride Height:</StyledLabel>
              <StyledInput
                type="range"
                min="-3"
                max="-2"
                step="0.01"
                value={Math.abs(rideHeightFront)}
                onChange={(e) => setRideHeightFront(parseFloat(e.target.value))}
              />
              <SliderValue>
                {rideHeightFront === STOCK_RIDE_HEIGHT
                  ? 'Stock (0.00")'
                  : `${(
                      -(rideHeightFront - STOCK_RIDE_HEIGHT) * MM_TO_INCHES
                    ).toFixed(2)}\u2033`}
              </SliderValue>
            </SliderContainer>

            <SliderContainer>
              <StyledLabel>Camber:</StyledLabel>
              <StyledInput
                type="range"
                min="-20"
                max="1"
                step="0.1"
                value={frontCamber}
                onChange={(e) => setFrontCamber(parseFloat(e.target.value))}
              />
              <SliderValue>{frontCamber}°</SliderValue>
            </SliderContainer>

            <SliderContainer>
              <StyledLabel>Caster:</StyledLabel>
              <StyledInput
                type="range"
                min="5"
                max="8"
                step="0.1"
                value={frontCaster}
                onChange={(e) => setFrontCaster(parseFloat(e.target.value))}
              />
              <SliderValue>{frontCaster}°</SliderValue>
            </SliderContainer>

            <SliderContainer>
              <StyledLabel>Toe:</StyledLabel>
              <StyledInput
                type="range"
                min="-0.05"
                max="0.05"
                step="0.01"
                value={frontToe}
                onChange={(e) => setFrontToe(parseFloat(e.target.value))}
              />
              <SliderValue>{frontToe}°</SliderValue>
            </SliderContainer>
          </StyledDiv>

          <StyledDiv>
            <Typography variant="subtitle1" gutterBottom>
              Rear Settings
            </Typography>
            <SliderContainer>
              <StyledLabel>Ride Height:</StyledLabel>
              <StyledInput
                type="range"
                min="-3"
                max="-2"
                step="0.01"
                value={rideHeightRear}
                onChange={(e) => setRideHeightRear(parseFloat(e.target.value))}
              />
              <SliderValue>
                {rideHeightRear === STOCK_RIDE_HEIGHT
                  ? 'Stock (0.00")'
                  : `${(
                      -(rideHeightRear - STOCK_RIDE_HEIGHT) * MM_TO_INCHES
                    ).toFixed(2)}\u2033`}
              </SliderValue>
            </SliderContainer>

            <SliderContainer>
              <StyledLabel>Camber:</StyledLabel>
              <StyledInput
                type="range"
                min="-20"
                max="1"
                step="0.1"
                value={rearCamber}
                onChange={(e) => setRearCamber(parseFloat(e.target.value))}
              />
              <SliderValue>{rearCamber}°</SliderValue>
            </SliderContainer>

            <SliderContainer>
              <StyledLabel>Toe:</StyledLabel>
              <StyledInput
                type="range"
                min="-0.05"
                max="0.05"
                step="0.01"
                value={rearToe}
                onChange={(e) => setRearToe(parseFloat(e.target.value))}
              />
              <SliderValue>{rearToe}°</SliderValue>
            </SliderContainer>
          </StyledDiv>
          
        </>
    )
}