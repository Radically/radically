import {
  createUltimatePagination,
  ITEM_TYPES,
} from "react-ultimate-pagination";
import { Button, Icon } from "semantic-ui-react";

const flatButtonStyle = {
  minWidth: 0,
};

const Page = ({
  value,
  isActive,
  onClick,
  isDisabled,
}: {
  value: any;
  isActive: boolean;
  onClick: any;
  isDisabled: boolean;
}) => (
  <Button
    compact
    size="mini"
    style={flatButtonStyle}
    primary={isActive}
    onClick={onClick}
    disabled={isDisabled}
  >
    {value.toString()}
  </Button>
);

const Ellipsis = ({
  onClick,
  isDisabled,
}: {
  onClick: any;
  isDisabled: boolean;
}) => (
  <Button
    compact
    size="mini"
    style={{ backgroundColor: "lightgrey" }}
    onClick={onClick}
    disabled={isDisabled}
  >
    ...
  </Button>
);

const FirstPageLink = ({
  isActive,
  onClick,
  isDisabled,
}: {
  isActive: boolean;
  onClick: any;
  isDisabled: boolean;
}) => (
  <Button
    compact
    size="mini"
    style={{ backgroundColor: "darkgrey" }}
    icon={<Icon name="angle double left" />}
    onClick={onClick}
    disabled={isDisabled}
  />
);

const PreviousPageLink = ({
  isActive,
  onClick,
  isDisabled,
}: {
  isActive: boolean;
  onClick: any;
  isDisabled: boolean;
}) => (
  <Button
    compact
    size="mini"
    style={{ backgroundColor: "lightgrey" }}
    icon={<Icon name="chevron left" />}
    onClick={onClick}
    disabled={isDisabled}
  />
);

const NextPageLink = ({
  isActive,
  onClick,
  isDisabled,
}: {
  isActive: boolean;
  onClick: any;
  isDisabled: boolean;
}) => (
  <Button
    compact
    size="mini"
    style={{ backgroundColor: "lightgrey" }}
    icon={<Icon name="chevron right" />}
    onClick={onClick}
    disabled={isDisabled}
  />
);

const LastPageLink = ({
  isActive,
  onClick,
  isDisabled,
}: {
  isActive: boolean;
  onClick: any;
  isDisabled: boolean;
}) => (
  <Button
    compact
    size="mini"
    style={{ backgroundColor: "darkgrey" }}
    icon={<Icon name="angle double right" />}
    onClick={onClick}
    disabled={isDisabled}
  />
);

const itemTypeToComponent = {
  [ITEM_TYPES.PAGE]: Page,
  [ITEM_TYPES.ELLIPSIS]: Ellipsis,
  [ITEM_TYPES.FIRST_PAGE_LINK]: FirstPageLink,
  [ITEM_TYPES.PREVIOUS_PAGE_LINK]: PreviousPageLink,
  [ITEM_TYPES.NEXT_PAGE_LINK]: NextPageLink,
  [ITEM_TYPES.LAST_PAGE_LINK]: LastPageLink,
};

function Wrapper(props: any) {
  return <Button.Group>{props.children}</Button.Group>;
}

const UltimatePaginationMaterialUi = createUltimatePagination({
  itemTypeToComponent,
  WrapperComponent: Wrapper,
});

export default UltimatePaginationMaterialUi;
