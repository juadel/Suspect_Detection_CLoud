import React, { Component } from "react";
import styled from "styled-components";

const SidebarContainer = styled.div`
    display: flex;
    flex-direction: column;    
    height: 100vh;
    width: 270px;
    background-color: #00003b;
    color: #fff;
    font-family: 'Open Sans', sans-serif;
`;
const SidebarMenu = styled.ul`
    display: flex;
    align-items: left;
    flex-direction: column;
    list-style: none;
    width: 100%;
    padding: 0px 30px;
`;
const SidebarMenuItem = styled.li`
    display: flex;
    height: 60px;
    width: 100%;
    align-items: center;
    padding-left: 30px;
    &:hover{
        background: rgba(255,255,255, 0.05);
        box-shadow: inset 3px 0 0 0 #ffffff;
        cursor: pointer;
    }
`;
const Icon = styled.svg`
    width: 20px;
    height: 20px;
    display: flex;
`;
const SidebarMenuItemLabel = styled.p`
    font-family: "Open Sans", sans-serif;
    color: #fff;
    font-size: 20px;
    line-height: 1.5;
    font-weight: 500;
    text-align: left;
    color: #ffffff;
    margin-left: 30px;
`;
const MenuLogo = styled.div`
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 16px;
        font-size: 18px;
        line-height: 1.5;
        font-weight: 600;
        height: 45px;
        color: #fff;
        margin: 0px 30px 30px 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #2e2e33;
`;
const MenuSignOut = styled.div`
        font-size: 14px;
        line-height: 1.5;
        font-weight: 500;
        height: 45px;
        color: #fff;
        margin: 200px 30px 60px 30px;
        padding: 20px 0px 0px 30px;
        border-top: 1px solid #2e2e33;
`;


class Sidebar extends Component {
    render() {
    return (
    <SidebarContainer>
        <SidebarMenu>
            <MenuLogo>

            </MenuLogo>
            <SidebarMenuItem>
                <Icon viewBox="0 0 20 20"> <path
                width="20px"
                height="20px"
                fill="white"
                d="M18,17 C18,17.552 17.552,18 17,18 L14,18 C13.448,18 13,17.552 13,17 L13,14 C13,13.448 13.448,13 14,13 L17,13 C17.552,13 18,13.448 18,14 L18,17 Z M18,11 L13,11 C11.895,11 11,11.895 11,13 L11,18 C11,19.105 11.895,20 13,20 L18,20 C19.105,20 20,19.105 20,18 L20,13 C20,11.895 19.105,11 18,11 L18,11 Z M18,6 C18,6.552 17.552,7 17,7 L14,7 C13.448,7 13,6.552 13,6 L13,3 C13,2.448 13.448,2 14,2 L17,2 C17.552,2 18,2.448 18,3 L18,6 Z M18,0 L13,0 C11.895,0 11,0.895 11,2 L11,7 C11,8.105 11.895,9 13,9 L18,9 C19.105,9 20,8.105 20,7 L20,2 C20,0.895 19.105,0 18,0 L18,0 Z M7,17 C7,17.552 6.552,18 6,18 L3,18 C2.448,18 2,17.552 2,17 L2,3 C2,2.448 2.448,2 3,2 L6,2 C6.552,2 7,2.448 7,3 L7,17 Z M7,0 L2,0 C0.895,0 0,0.895 0,2 L0,18 C0,19.105 0.895,20 2,20 L7,20 C8.105,20 9,19.105 9,18 L9,2 C9,0.895 8.105,0 7,0 L7,0 Z"
                /></Icon>
                <SidebarMenuItemLabel>
                    Cameras
                </SidebarMenuItemLabel>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Icon></Icon>
                <SidebarMenuItemLabel>
                    Suspects
                </SidebarMenuItemLabel>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Icon></Icon>
                <SidebarMenuItemLabel>
                    Settings
                </SidebarMenuItemLabel>
            </SidebarMenuItem>
            <MenuSignOut>Sign out</MenuSignOut>
        </SidebarMenu>
    </SidebarContainer>
    )}
    }

export default Sidebar;