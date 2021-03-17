import { blue, green, purple, red } from "@material-ui/core/colors";
import { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContextProvider";

export const useU6EEBExampleColors = () => {
  const { darkMode } = useContext(SettingsContext);

  const waterRadicalColor = darkMode ? blue[300] : blue[800];
  const personRadicalColor = darkMode ? purple[300] : purple[800];
  const strikeRadicalColor = darkMode ? green[300] : green[800];
  const moonRadicalColor = darkMode ? red[300] : red[800];
  const textColor = darkMode ? "white" : "black";

  return {
    waterRadicalColor,
    personRadicalColor,
    strikeRadicalColor,
    moonRadicalColor,
    textColor,
  };
};

const U6EEBExample = () => {
  const {
    waterRadicalColor,
    personRadicalColor,
    strikeRadicalColor,
    moonRadicalColor,
    textColor,
  } = useU6EEBExampleColors();

  return (
    <div
      style={{ float: "left", display: "inline", paddingRight: "10px" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 174.54 188.93"
        width="47px"
        height="47px"
      >
        <polygon
          fill={personRadicalColor}
          stroke={personRadicalColor}
          points="79.44 15.29 82.9 14.3 80.5 11.6 69.3 6.9 68.6 9.6 68.66 9.61 66.3 19.7 63.6 30.6 60.7 41.3 57.8 51.7 54.7 62 51.5 72.1 44.9 91.7 41.5 101.3 38.2 110.8 39.9 111.5 45 102.8 49.8 93.8 54.3 84.4 55 82.82 55 182.9 66 177.4 66 71.92 68.7 70.2 66 68.2 61.62 67.4 62.7 64.8 66.6 54.6 70.3 44.2 73.9 33.6 77.3 22.7 79.44 15.29"
        />
        <polygon
          fill={textColor}
          stroke={textColor}
          points="75 47.2 75 153.9 86 148.4 86 52.92 88.7 51.2 86 49.2 75 47.2"
        />
        <polygon
          fill={waterRadicalColor}
          stroke={waterRadicalColor}
          points="43.4 75.4 47.6 61.5 45.9 60.8 39.9 74.1 34.5 86.3 29.8 97.3 25.6 107.2 22 116 18.9 123.6 16.3 130.1 14.96 133.47 14.9 133.4 11 130.2 6.7 127.9 2 126.7 1.3 128.4 4.7 131.2 7.5 134.2 9.8 137.5 11.7 141.2 11.89 141.72 11.5 142.9 12.39 143.09 13.2 145.3 14.3 150 15.1 155.3 15.4 161.2 15.3 167.7 14.7 174.8 16.3 179.1 20.4 181.1 24.7 179.6 26.7 175.5 26.7 167.7 26.1 160.4 25 153.7 23.3 147.6 22.33 145.21 23.2 145.4 23.6 142.7 24.5 138.6 25.8 133.2 27.7 126.6 30 118.8 32.7 109.8 35.9 99.6 39.5 88.1 43.4 75.4"
        />
        <polygon
          fill={waterRadicalColor}
          stroke={waterRadicalColor}
          points="5.5 65.1 7.8 67.2 9.8 69.2 11.5 71.2 13 73.2 14.2 75.2 15.2 77.1 15.9 79 16.4 80.9 19.8 84 24.4 83.9 27.4 80.5 27.3 75.9 25.6 73.4 23.6 71.1 21.3 69 18.9 67.1 16.3 65.4 13.5 63.9 10.6 62.7 7.4 61.6 4 60.8 0.7 59.7 0 61.4 3 63 5.5 65.1"
        />
        <polygon
          fill={waterRadicalColor}
          stroke={waterRadicalColor}
          points="17.2 19.1 19.3 21.1 21.1 23.2 22.8 25.2 24.2 27.2 25.5 29.2 26.5 31.2 27.3 33.2 27.9 35.2 31.4 38.1 36 37.8 38.9 34.3 38.6 29.8 36.8 27.3 34.8 25.1 32.6 23 30.2 21.2 27.7 19.5 25 18 22.2 16.7 19.2 15.6 16 14.8 12.9 13.7 12.1 15.4 14.9 17 17.2 19.1"
        />
        <path
          fill={moonRadicalColor}
          stroke={moonRadicalColor}
          d="M169.69,97.28l-4,6.13H122.07l-8.7-7.94v99.27l9.92-9.07V157.92h41.45v16.86l0,1-.08.68-11.73,0v6.23l9.88,2.7v6.2l3.52-.51,1.76-.5,1.63-1,1.31-1.35,1.21-1.71,1-2.13.72-2.29.45-2.39.23-2.53.1-2.34V113.25l2.88-4.22Zm-46.4,29.58V111h41.45v15.84Zm41.45,7.61v15.85H123.29V134.47Z"
          transform="translate(-12.2 -5.8)"
        />
        <path
          fill={strikeRadicalColor}
          stroke={strikeRadicalColor}
          d="M149.39,67.59c5.58-8.21,11.18-19.82,14.85-29h17.51V33.05l-7.14-11.77L169.2,32H130.41c1.31-3.44,3.2-9.3,4.14-12.87l2.45-.58L135.55,14l-7-8.19a180.29,180.29,0,0,1-25.72,64l1.35,4.42c9.41-8.84,17-20.67,22.15-32.37A99.24,99.24,0,0,0,138.3,67.67c-9.39,13.62-23.12,25.54-37.16,34.3l.65,4.38c16.4-5.78,31.5-17.35,42-31,9,11.66,22.48,21.16,36.06,26.85l6.9-12.83C173.33,84.69,159.23,78,149.39,67.59Zm4.64-29a145.17,145.17,0,0,1-10.94,21.8L140,56.27A126.49,126.49,0,0,1,130,38.58Z"
          transform="translate(-12.2 -5.8)"
        />
      </svg>
    </div>
  );
};

export default U6EEBExample;
