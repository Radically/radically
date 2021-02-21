import useMediaQuery from "@material-ui/core/useMediaQuery";
import { FunctionComponent } from "react";
import Split from "react-split";
import styled from "styled-components";

const StyledSplit = styled(Split)`
  flex: 1;
`;
const ComponentsReadingSplit: FunctionComponent<{ id?: string }> = (props) => {
  const { children, id } = props;

  const isLandscape = useMediaQuery("(orientation: landscape)");
  const isSafari = navigator.vendor.includes("Apple");

  return (
    <StyledSplit
      id={id || "components-split-container"}
      sizes={[60, 40]}
      minSize={isLandscape || isSafari ? 10 : 60} // 56px + 4
      expandToMin={true}
      gutterSize={10}
      gutterAlign="center"
      gutterStyle={(dimension: any, gutterSize: any, index: any) => ({
        height: `${gutterSize}px`,
        position: "relative",
        "z-index": 9999,
        "box-sizing": "border-box",
        "background-clip": "padding-box",
      })}
      snapOffset={0}
      dragInterval={1}
      direction={"vertical"}
      cursor="col-resize"
    >
      {children}
    </StyledSplit>
  );
};

export default ComponentsReadingSplit;
