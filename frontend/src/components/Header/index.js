import React from 'react'
import { PrimaryNav, MenuLink, Menu, Hamburger } from './NavElement'
const Navbar = () => {
  return (
    <>
      <PrimaryNav>
        <Hamburger />
        <Menu>
          <MenuLink to="/home" activeStyle>
            Home
          </MenuLink>
          <MenuLink to="/home/registration" activeStyle>
            Registration
          </MenuLink>
          <MenuLink to="/course/running" activeStyle>
            Running Courses
          </MenuLink>
          <MenuLink to="/logout" activeStyle>
            Logout
          </MenuLink>
        </Menu>
      </PrimaryNav>
    </>
  )
}
export default Navbar