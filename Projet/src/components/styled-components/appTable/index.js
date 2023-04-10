import styled from "styled-components";

const AppTable = styled.table`
    border-collapse: collapse;
    width: 100%;
    font-size: 12px;
`;

const AppTableHeader = styled.th`
    padding: 5px;
    text-align: left;
    background-color: #191919;
    color: white;
`;

const AppTableData = styled.td`
    padding: 8px;
    text-align: left;
    display: flex;
    flex-direction: row;
    align-items: center;
    /* justify-content: flex-start; */

`;

const AppTableRow = styled.tr`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #292a2d;
    color: white;
    &:nth-child(even) {
        background-color: #2c2f33;
    }
    &:active {
        background-color: #4c4f56;
    }
`;

const AppIcon = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 5px;
`;


export { AppTable, AppTableHeader, AppTableData, AppTableRow, AppIcon };


