// https://stackoverflow.com/questions/62210286/declare-type-with-react-useimperativehandle

import React, { useEffect, useRef, useImperativeHandle, useState } from "react";
import styled from "styled-components";
import { Button, Icon, Form, TextArea } from 'semantic-ui-react'
import useClippy from "use-clippy";

const OutputContainer1 = styled.div`
  width: 100%;
  justify-content: center;
  align-items: center;

  flex-direction: column;

  @media (max-width: 991px) {
    display: none;
  }

  @media (min-width: 992px) {
    display: flex;
  }
`;

const OutputContainer = styled.div`
  @media (min-width: 480px) {
    width: 400px;
  }

  @media (max-width: 479px) {
    width: 100%;
  }

  text-align: center;
`;

type OutputHandle = {
  appendOutput: (text: string) => void
}

type OutputProps = {

}

const Output: React.RefForwardingComponent<OutputHandle, OutputProps> = (props: OutputProps, ref) => {

  const [output, setOutput] = useState("");
  const [clipboard, setClipboard] = useClippy();
  const [showCopied, setShowCopied] = useState(false);

  useImperativeHandle(ref, () => ({
    appendOutput: (text: string) => {
      setOutput(output + text);
    }
  }));

  return <OutputContainer>
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
        setClipboard(output);
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
  </OutputContainer>
};

export default React.forwardRef(Output);