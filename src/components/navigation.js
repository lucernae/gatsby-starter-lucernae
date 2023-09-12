import * as React from "react"
import { Link } from "gatsby"

import { AppBar, Container, Toolbar, Typography, Box, IconButton, Menu, MenuItem } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import AdbIcon from "@mui/icons-material/Adb"

import "katex/dist/katex.min.css"

const NavigationPanel = ({ navigationLinks }) => {
    const pages = ["Main", "Second"]
    
    const [anchorElNav, setAnchorElNav] = React.useState(
        null
      );
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
      };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "flex" } }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                        >
                        <MenuIcon />
                    </IconButton>

                    <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left"
                    }}
                    // keepMounted
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left"
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    // sx={{
                    //     display: { xs: "block", md: "none" }
                    // }}
                    >
                    {pages.map((page) => (
                        <MenuItem key={page} onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">{page}</Typography>
                        </MenuItem>
                    ))}
                    </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default NavigationPanel
