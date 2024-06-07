import { useTranslation } from "next-i18next"
import React, { FC, useState } from "react"
import { SignInWithButton, signOutAndRedirectToHome, useAuth } from "./auth"
import { Container, Nav, Navbar, NavDropdown } from "./bootstrap"
import { useProfile } from "./db"
import {
  Avatar,
  NavbarLinkBills,
  NavbarLinkEditProfile,
  NavbarLinkEffective,
  NavbarLinkFAQ,
  NavbarLinkGoals,
  NavbarLinkLogo,
  NavbarLinkProcess,
  NavbarLinkSignOut,
  NavbarLinkSupport,
  NavbarLinkTeam,
  NavbarLinkTestimony,
  NavbarLinkViewProfile,
  NavbarLinkWhyUse
} from "./NavbarComponents"

import { Col, Row } from "./bootstrap"
import Image from "react-bootstrap/Image"
import styled from "styled-components"

const NavBarBoxContainer: FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => {
  return (
    <div
      className={`d-flex flex-row align-items-start justify-content-between w-100`}
    >
      {children}
    </div>
  )
}

const NavBarBox: FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className
}) => {
  return (
    <div
      className={`col d-flex justify-content-start align-items-center ${className}`}
    >
      {children}
    </div>
  )
}

export const MobileNavV2: React.FC<React.PropsWithChildren<unknown>> = () => {
  const BlackCollapse = styled(() => {
    return (
      <Navbar.Collapse id="basic-navbar-nav" className="bg-black mt-2 ps-4">
        {whichMenu == "site" ? <SiteLinks /> : <ProfileLinks />}
      </Navbar.Collapse>
    )
  })`
    .bg-black {
      background-color: black;
      height: 100vh;
    }
  `

  const ProfileLinks = () => {
    return (
      <Nav className="my-4 d-flex align-items-start">
        <NavbarLinkViewProfile />
        <NavbarLinkEditProfile
          handleClick={() => {
            closeNav()
          }}
        />
        <NavbarLinkSignOut
          handleClick={() => {
            closeNav()
            void signOutAndRedirectToHome()
          }}
        />
      </Nav>
    )
  }

  const SiteLinks = () => {
    return (
      <Nav className="my-4">
        <NavbarLinkBills handleClick={closeNav} />
        <NavbarLinkTestimony handleClick={closeNav} />
        <NavDropdown className={"navLink-primary"} title={t("about")}>
          <NavbarLinkGoals handleClick={closeNav} />
          <NavbarLinkTeam handleClick={closeNav} />
          <NavbarLinkSupport handleClick={closeNav} />
          <NavbarLinkFAQ handleClick={closeNav} />
        </NavDropdown>

        <NavDropdown className={"navLink-primary"} title={t("learn")}>
          <NavbarLinkEffective handleClick={closeNav} />
          <NavbarLinkProcess handleClick={closeNav} />
          <NavbarLinkWhyUse handleClick={closeNav} />
        </NavDropdown>
      </Nav>
    )
  }

  const { authenticated } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const [whichMenu, setWhichMenu] = useState("site")
  const { t } = useTranslation(["common", "auth"])

  const toggleSite = () => {
    if (isExpanded && whichMenu == "profile") {
      setWhichMenu("site")
    } else {
      setWhichMenu("site")
      setIsExpanded(!isExpanded)
    }
  }

  const toggleAvatar = () => {
    if (isExpanded && whichMenu == "site") {
      setWhichMenu("profile")
    } else {
      setWhichMenu("profile")
      setIsExpanded(!isExpanded)
    }
  }

  const closeNav = () => setIsExpanded(false)

  const result = useProfile()
  let isOrg = result?.profile?.role === "organization"

  return (
    <Navbar
      bg="secondary"
      className={`w-100 ${isExpanded ? "pb-0" : ""}`}
      data-bs-theme="dark"
      expand="lg"
      expanded={isExpanded}
    >
      <Col className="ms-3 ps-2">
        <Navbar.Brand onClick={toggleSite}>
          {isExpanded && whichMenu == "site" ? (
            <Image
              src="/Union.svg"
              alt="x"
              width="35"
              height="35"
              className="ms-2"
            />
          ) : (
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
          )}
        </Navbar.Brand>
      </Col>
      <Col>
        <div className="d-flex justify-content-center">
          <NavbarLinkLogo />
        </div>
      </Col>
      <Col className="d-flex justify-content-end me-3 pe-2">
        {authenticated ? (
          <>
            <Navbar.Brand onClick={toggleAvatar}>
              <Nav.Link className="p-0 text-white">
                {isExpanded && whichMenu == "profile" ? (
                  <Image src="/Union.svg" alt="x" width="35" height="35" />
                ) : (
                  <Avatar isOrg={isOrg} />
                )}
              </Nav.Link>
            </Navbar.Brand>
          </>
        ) : (
          <SignInWithButton />
        )}
      </Col>

      <BlackCollapse />
    </Navbar>
  )
}
