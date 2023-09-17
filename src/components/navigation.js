import * as React from "react"
import { Link } from "gatsby"

import { AppBar, Container, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Tabs, Tab } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"

import "katex/dist/katex.min.css"

const NavigationPanel = ({ navigationLinks, children }) => {

    const [anchorElNav, setAnchorElNav] = React.useState(
        null
    );
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const [category, setCategory] = React.useState(navigationLinks[0].link)
    const handleCategoryChange = (event, newValue) => {
        setCategory(newValue)
    }

    return (
        <AppBar position="static"
            sx={{
                bgcolor: "text.primary"
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* When small */}
                    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="menu bar"
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
                            sx={{
                                display: { xs: "block", md: "none" }
                            }}
                        >
                            {navigationLinks.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center"><Link to={page.link}>{page.title}</Link></Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    {/* When big screen */}
                    <Typography
                        variant="h6"
                        noWrap
                        // component="h1"
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            fontFamily: "MontserratVariable",
                            fontWeight: 700,
                            letterSpacing: "0.2rem",
                            color: "inherit",
                            textDecoration: "none"
                        }}
                    >
                        {children}
                    </Typography>
                    <Box
                        sx={{
                            flexGrow: 1,
                            borderBottom: 1,
                            display: { xs: "none", md: "flex" },
                            borderColor: "divider",
                        }}
                    >
                        <Tabs value={category} onChange={handleCategoryChange} aria-label="category tabs"
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            {navigationLinks.map((page) => (
                                <Tab label={page.title}
                                    value={page.link}
                                    component={Link}
                                    to={page.link}
                                    sx={{
                                        color: "white",
                                        '&.Mui-selected': {
                                        },
                                    }}
                                />
                            ))}
                        </Tabs>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default NavigationPanel
