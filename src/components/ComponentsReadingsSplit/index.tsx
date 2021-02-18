import useMediaQuery from "@material-ui/core/useMediaQuery";
import { FunctionComponent } from "react";
import Split from "react-split";

const ComponentsReadingSplit: FunctionComponent<{ id?: string }> = (props) => {
  const { children, id } = props;

  const isLandscape = useMediaQuery("(orientation: landscape)");
  const isSafari = navigator.vendor.includes("Apple");

  return (
    <Split
      style={{ flex: 1 }}
      id={id || "components-split-container"}
      sizes={[60, 40]}
      minSize={isLandscape || isSafari ? 10 : 60} // 56px + 4
      expandToMin={true}
      gutterSize={10}
      gutterAlign="center"
      snapOffset={0}
      dragInterval={1}
      direction={"vertical"}
      cursor="col-resize"
    >
      {children}
    </Split>
  );
};

export default ComponentsReadingSplit;
