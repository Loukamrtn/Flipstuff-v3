/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { useMemo } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// uuid is a library for generating unique id
import { v4 as uuidv4 } from "uuid";

// @mui material components
import { Table as MuiTable } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiAvatar from "components/VuiAvatar";
import VuiTypography from "components/VuiTypography";

// Vision UI Dashboard React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import borders from "assets/theme/base/borders";

function Table({ columns, rows, selectedItems = [], toggleSelectItem, selectAll, handleSort, sortConfig }) {
  const { grey, light } = colors;
  const { size, fontWeightBold } = typography;
  const { borderWidth } = borders;

  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeRows = Array.isArray(rows) ? rows : [];

  // Ajoute la colonne de sélection en début de tableau
  const renderColumns = [
    <VuiBox key="select-header" component="th" pt={1.5} pb={1.25} pl={3} pr={1} textAlign="center" fontSize={size.xxs} fontWeight={fontWeightBold} color="text" opacity={0.7} borderBottom={`${borderWidth[1]} solid ${grey[700]}`}> 
      <input type="checkbox" checked={selectedItems.length === rows.length && rows.length > 0} onChange={selectAll} style={{ accentColor: '#ff4fa3' }} />
    </VuiBox>,
    ...safeColumns.map(({ name, align, width }, key) => {
      let pl;
      let pr;
      if (key === 0) { pl = 3; pr = 3; }
      else if (safeColumns.length > 0 && key === safeColumns.length - 1) { pl = 3; pr = 3; }
      else { pl = 1; pr = 1; }
      const isSorted = sortConfig && sortConfig.key === name;
      return (
        <VuiBox
          key={name}
          component="th"
          width={width || "auto"}
          pt={1.5}
          pb={1.25}
          pl={align === "left" ? pl : 3}
          pr={align === "right" ? pr : 3}
          textAlign={align}
          fontSize={size.xxs}
          fontWeight={fontWeightBold}
          color="text"
          opacity={0.7}
          borderBottom={`${borderWidth[1]} solid ${grey[700]}`}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={() => handleSort && handleSort(name)}
        >
          {typeof name === "string" ? name.toUpperCase() : ""}
          {isSorted && (
            <span style={{ marginLeft: 6, fontSize: 13, color: '#ff4fa3' }}>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
          )}
        </VuiBox>
      );
    })
  ];

  const renderRows = safeRows.map((row, key) => {
    const rowKey = `row-${key}`;
    const id = row.id || row.nom || key;
    const checked = selectedItems.includes(id);

    const tableRow = safeColumns.map(({ name, align }) => {
      let template;
      const cellValue = row && name in row ? row[name] : undefined;

      if (Array.isArray(cellValue)) {
        template = (
          <VuiBox
            key={uuidv4()}
            component="td"
            p={1}
            borderBottom={row && row.hasBorder ? `${borderWidth[1]} solid ${light.main}` : null}
          >
            <VuiBox display="flex" alignItems="center" py={0.5} px={1}>
              <VuiBox mr={2}>
                <VuiAvatar src={cellValue[0]} name={cellValue[1]} variant="rounded" size="sm" />
              </VuiBox>
              <VuiTypography
                color="white"
                variant="button"
                fontWeight="medium"
                sx={{ width: "max-content" }}
              >
                {cellValue[1]}
              </VuiTypography>
            </VuiBox>
          </VuiBox>
        );
      } else {
        template = (
          <VuiBox
            key={uuidv4()}
            component="td"
            p={1}
            textAlign={align}
            borderBottom={row && row.hasBorder ? `${borderWidth[1]} solid ${grey[700]}` : null}
          >
            <VuiTypography
              variant="button"
              fontWeight="regular"
              color="text"
              sx={{ display: "inline-block", width: "max-content" }}
            >
              {cellValue !== undefined && cellValue !== null ? cellValue : ""}
            </VuiTypography>
          </VuiBox>
        );
      }

      return template;
    });

    return (
      <TableRow key={rowKey}>
        <VuiBox component="td" p={1} textAlign="center">
          <input type="checkbox" checked={checked} onChange={() => toggleSelectItem(id)} style={{ accentColor: checked ? '#ff4fa3' : '#ff8cce' }} />
        </VuiBox>
        {tableRow}
      </TableRow>
    );
  });

  return useMemo(
    () => (
      <TableContainer>
        <MuiTable>
          <VuiBox component="thead">
            <TableRow>{renderColumns}</TableRow>
          </VuiBox>
          <TableBody>{renderRows}</TableBody>
        </MuiTable>
      </TableContainer>
    ),
    [columns, rows, selectedItems, toggleSelectItem, selectAll, handleSort, sortConfig]
  );
}

// Setting default values for the props of Table
Table.defaultProps = {
  columns: [],
  rows: [{}],
  selectedItems: [],
  toggleSelectItem: () => {},
  selectAll: () => {},
  handleSort: () => {},
  sortConfig: {},
};

// Typechecking props for the Table
Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  rows: PropTypes.arrayOf(PropTypes.object),
  selectedItems: PropTypes.arrayOf(PropTypes.string),
  toggleSelectItem: PropTypes.func,
  selectAll: PropTypes.func,
  handleSort: PropTypes.func,
  sortConfig: PropTypes.object,
};

export default Table;
