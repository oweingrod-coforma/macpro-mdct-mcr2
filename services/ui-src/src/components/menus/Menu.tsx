// components
import {
  Box,
  Button,
  Menu as MenuRoot,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Icon, MenuOption, RouterLink } from "../index";
// utils
import {
  makeMediaQueryClasses,
  useBreakpoint,
} from "../../utils/useBreakpoint";

export const Menu = ({ handleLogout }: Props) => {
  const { isMobile } = useBreakpoint();
  const mqClasses = makeMediaQueryClasses();
  return (
    <MenuRoot offset={[8, 20]}>
      <Box role="group">
        <MenuButton
          as={Button}
          rightIcon={<Icon icon="chevronDown" color="palette.white" />}
          sx={sx.menuButton}
          className={mqClasses}
          data-testid="menu-button"
        >
          <MenuOption icon="personCircle" text="Profile" hideText={isMobile} />
        </MenuButton>
      </Box>
      <MenuList sx={sx.menuList} data-testid="menu-list">
        <MenuItem sx={sx.menuItem} data-testid="menu-option-manage-account">
          <RouterLink to="/profile" alt="link to account page" tabindex={0}>
            <MenuOption icon="pencilSquare" text="Manage Account" />
          </RouterLink>
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={sx.menuItem}
          tabIndex={0}
          data-testid="menu-option-log-out"
        >
          <MenuOption icon="arrowRightSquare" text="Log Out" />
        </MenuItem>
      </MenuList>
    </MenuRoot>
  );
};

interface Props {
  handleLogout: () => void;
}

const sx = {
  menuButton: {
    padding: 0,
    paddingRight: ".5rem",
    marginLeft: ".5rem",
    borderRadius: 0,
    background: "none",
    color: "palette.white",
    fontWeight: "bold",
    _hover: { color: "palette.alt_light" },
    _active: { background: "none" },
    _focus: {
      boxShadow: "none",
      outline: "0px solid transparent !important",
    },
    "&.mobile": {
      marginLeft: 0,
    },
    "& .chakra-button__icon": {
      marginInlineStart: "0rem",
    },
  },
  menuList: {
    padding: "0",
    border: "none",
    background: "palette.main_darkest",
    boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.14)",
  },
  menuItem: {
    borderRadius: ".375rem",
    _focus: { background: "palette.main_darker" },
  },
};