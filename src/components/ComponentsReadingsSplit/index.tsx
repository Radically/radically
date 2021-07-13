import useMediaQuery from "@material-ui/core/useMediaQuery";
import { FunctionComponent } from "react";
import Split from "react-split";
import styled from "styled-components";

const StyledSplit = styled(Split)<{ negativepx?: number }>`
  flex: 1;
  max-height: calc(100% - ${(props) => props.negativepx}px);
`;

const ComponentsReadingSplit: FunctionComponent<{
  id?: string;
  negativepx?: number;
}> = (props) => {
  const { children, id, negativepx } = props;

  const isLandscape = useMediaQuery("(orientation: landscape)");
  const isSafari = navigator.vendor.includes("Apple");

  return (
    <StyledSplit
      id={id || "components-split-container"}
      negativepx={negativepx || 0}
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
