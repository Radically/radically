// https://stackoverflow.com/questions/62210286/declare-type-with-react-useimperativehandle

import React, { useEffect, useRef, useImperativeHandle, useState } from "react";
import styled, { StyledComponent } from "styled-components";
import { Button, Icon, Form, TextArea } from 'semantic-ui-react'

const OutputContainer = styled.div`
  /* @media (min-width: 480px) {
    width: 400px;
  }

  @media (max-width: 479px) {
    width: 100%;
  } */

  text-align: center;
  padding-top: 1.5rem;
`;

const MobileOutputContainer = styled(OutputContainer)`
  @media (min-width: 992px) {
    display: none;
  }
`;

const DesktopOutputContainer = styled(OutputContainer)`
  @media (max-width: 991px) {
    display: none;
  }
`;

type OutputHandle = {
  appendOutput: (text: string) => void
}

type PublicOutputProps = {

}

type OutputProps = {
  ContainerComponent: StyledComponent<"div", any, {}, never>;
}

const _Output: React.RefForwardingComponent<OutputHandle, OutputProps> = (props: OutputProps, ref) => {

  const { ContainerComponent } = props;
  const [output, setOutput] = useState("");
  const [showCopied, setShowCopied] = useState(false);

  useImperativeHandle(ref, () => ({
    appendOutput: (text: string) => {
      setOutput(output + text);
    }
  }));

  return <ContainerComponent>
    <Form style={{ width: '100%' }}>
      <TextArea value={output} onChange={(evt) => {
        setOutput(evt.target.value);
      }} placeholder='Output' />
    </Form>

    <Button.Group style={{ padding: '15px' }}>
      <Button onClick={() => {
        setOutput("");
      }}>
        <Icon name='close' />
        Clear
      </Button>
      <Button color="blue" onClick={() => {
        navigator.clipboard.writeText(output);
        setShowCopied(true);
        setTimeout(() => {
          setShowCopied(false);
        }, 1000);
      }}>
        <Icon name='copy' />
        Copy
      </Button>
    </Button.Group>

    <div style={{ height: "1.5rem", color: "grey" }}>
      {showCopied ? "Copied to clipboard" : ""}
    </div>
  </ContainerComponent>
};

export const Output = React.forwardRef(_Output);

// export default React.forwardRef(Output);
export const DesktopOutput = React.forwardRef((props: PublicOutputProps, ref) => {
  // const _Output = React.forwardRef(Output);
  return <Output {...props} ref={ref!! as React.RefObject<OutputHandle>} ContainerComponent={DesktopOutputContainer} />
});

export const MobileOutput = React.forwardRef((props: PublicOutputProps, ref) => {
  // const _Output = React.forwardRef(Output);
  return <Output {...props} ref={ref!! as React.RefObject<OutputHandle>} ContainerComponent={MobileOutputContainer} />
})
