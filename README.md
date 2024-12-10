# OSS STIG Report Generator with Charts (oss-stig-reports-with-charts)

Our app provides real-time data visualization and analytics to help users generate and display data from STIG Manager.

The features include:
- Interactive data visualization (e.g. bar charts, line charts, tables, etc)
- Updates in real-time from Stig Manager API
- Filter and search functionality
- Responsive design for different devices

 ## Generate Build for Server
- Edit **_.env_** File
  - Change REACT_APP_REDIRECT_URI='http://localhost:3000' To #REACT_APP_REDIRECT_URI='http://localhost:3000'

    - __#REACT_APP_REDIRECT_URI='http://localhost:3000'__
    - __REACT_APP_REDIRECT_URI='https://npc2ismsdev01.nren.navy.mil/stigmanossreports/'__

- Run the build command: 

  ```bash
  npm run build
  ```
  - A new folder called 'build' should be in the repository.

-  Open the file explorer and map a local drive to **\\\npc2ismsdev01.nren.navy.mil\wwwSTIGMANOSSREPORTS$**
   - Go to the shared drive. Remove all content except web.config.
   - Copy everything from the build folder to the shared drive.
- Edit the index.html file in the shared drive.
   - Search for all occurrences of  href="/static/…  to href="./static/… (Add a period before /static.) **(This must be adjusted for the specific server.)**
   - Test the build by going to [npc2ismsdev01.nren.navy.mil/stigmanossreports/](npc2ismsdev01.nren.navy.mil/stigmanossreports).
- Edit the index.html in the shared drive.


## Installation
Clone the repository with the following command:

```bash
git clone https://github.com/smehlmann/oss-stig-reports-with-charts.git
```

Run in terminal this command:

```bash
npm install
```

Then run this command to start your local server

```bash
npm start
```

## Technologies Used
- **Frontend Framework**: React
- **Styling**: Material UI (MUI), Styled-components, Bootstrap
- **Data Visualization**:
  - ApexCharts, React Table, MUI X Data Grid
- **Data Management and State Management**: 
  - Redux, React-Redux, Redux-persist, Redux-state-sync



<!---
## Dashboard Components and Features 

### Dashboard Layouts
If a user selects report option 2, 3, 4, 5, 6 or 8, data from the selected report will be passed into the component to display the data in the chosen report. The data will then be passed to other components to render the visualizations.

For *Report 8. Historical Data*, all of the visualizations except for the line chart use data from the latest `pullDate`.

### Bar Chart Components
<details>
  <summary><strong> BarChartBuilder.js</strong></summary>
  <strong>Purpose:</strong> renders a dynamic bar chart using the ApexCharts library with customized styling, tooltips, and user interactivity. It includes the following:

  - **Component Props:**
    - Receives props like `dataLabels`, `dataValues`, `isHorizontal`, `xAxisHeader`, `yAxisHeader`, `onClick`, and `formatLabelToPercentage`, which configure the chart's data, orientation, axis titles, click handling, and label formatting.
  
  - **Color Assignment:** 
    - `getColorForLabel` assigns colors to the bars based on a given label.
  
  - **Series Data:** 
    - Combines `dataValues` with `dataLabels` to format the series data.
  
  - **Chart Options:** 
    - Sets up chart configuration (`options`) for things like events, toolbar options, etc.
  
  - **Effects:**
    - First `useEffect` hook dynamically updates chart's `series` data when `dataValues`, `dataLabels`, or `getColorForLabel` change.
    - Second `useEffect` hook updates the `options` configuration if axis titles change.
</details>

<details>
  <summary><strong> HorizontalBarChartBuilder </strong></summary>
  <strong>Purpose:</strong> renders a dynamic bar chart using the ApexCharts library. Basically the same as the <code>ApexBarChartBuilder</code> but with additional styling that is unique to horizontal bar charts. It includes the following:

  - **Component Props:**
    - Receives props like `dataLabels`, `dataValues`, `isHorizontal`, `xAxisHeader`, `yAxisHeader`, `onClick`, and `formatLabelToPercentage`, which configure the chart's data, orientation, axis titles, click handling, and label formatting.
  
  - **Additional Styling for y-axis Labels:**
    - Slightly offsets the y-axis labels to account for names and sets `grid.labels.left` to widen the y-axis label space.
    - `chartHeight`: ensures that there is enough space (24px) between rows to improve readability when there is a lot of data.
</details>

<details>
  <summary><strong> GroupedOrStackedBarBuilder </strong></summary>
  <strong>Purpose:</strong> renders a dynamic bar chart using the ApexCharts library to specifically display stacked or grouped bar charts. Mostly the same as <code>HorizontalBarChartBuilder</code>.

  - **Component Props:**
    - `series`: formatted beforehand and passed in
    - `dataLabels`: labels for the values
    - `dataLabelsArePercentages`: boolean that determines whether the `dataLabels` need to be formatted as percentages
    - `showLabelsOnBars`: boolean that specifies whether to show the labels on the bars in the chart
    - `isHorizontal`: boolean that specifies orientation
    - `isStackedBarChart`: boolean that specifies whether to stack or group series
    - `xAxisHeader`, `yAxisHeader`: text in headers
    - `onClick`: specifies behavior when series is clicked
    - `formatLabelToPercentage`: formats the labels as percentages instead of decimals
</details>

<details>
 <summary><strong>ApexCountByValueBarChart </strong></summary>
 <strong>Purpose:</strong> creates a bar chart that displays the counts of unique values within a specified column (<code>targetColumn</code>). It uses helper functions and hooks to arrange and specify the data to pass to rendering components. 

  - **Props:**
    - `targetColumn`: specifies the column to count unique values
    - `isHorizontal`: selects the bar orientation
    - `xAxisTitle` and `yAxisTitle`: the labels for the x and y axes
    - `data`: data to analyze

  - **Filter Hooks:**
    - `useFilter` is a custom hook that provides filtering functionality for:
      - `filter`: the global `filter` object
      - `updateFilter`: add/update a property-value pair in the `filter` object
      - `removeFilterKey`: remove a property-value pair from the `filter` object
  
  - **Filtering Data:**
    - `filteredData`: re-calculates the data based on the property-value pair in the `filter` object.

  - **Counting Unique Values:**
    - `countMap`: calls `ValueCountMap` component to count occurrences of each unique value in the `targetColumn`.
    - `barLabels`: an array of unique values in the target column (keys in `countMap`).
    - `barValues`: an array of counts for each unique value (values in `countMap`).
  
  - **Handling Bar Click Events:**
    - `handleBarClick` updates the `filter` when a bar is clicked:
      - Retrieves the selected bar's label
      - Adds/removes the label from the `filter` object by calling `updateFilter` or `removeFilterKey` to ensure toggling functionality.

  - **Rendering the Chart:**
    - Renders the bar chart based on `isHorizontal`. If `isHorizontal` is true, it will select `HorizontalBarChartBuilder`; otherwise, it will select and render `ApexBarChartBuilder`.
</details>

<details>
  <summary><strong> TwoPropsCountByValues </strong></summary>
  <strong>Purpose:</strong> aggregates the data is based on two specified columns(<code>categoryField</code> and <code>metricField</code>) so it can be represented in a bar chart. 
  
  - **Props:**
    - `categoryField`: specifies the column that defines each group; values in this column will be passed as labels in the bar chart
    - `metricField`: specifies the column in the dataset with numeric values to be aggregated 
    - `showLabelsOnBars`: boolean that specifies whether to show the labels on the bars in the chart
    - `isHorizontal`: boolean that specifies orientation
    - `isStackedBarChart`: boolean that specifies whether to stack or group series
    - `xAxisTitle`, `yAxisTitle`: text in headers
    - `data`: data to analyze
  - **Filtering Data:**
    - `filteredData`: updates the data based on the property-value pair in the `filter` object.

  - **Aggregating Values For Each Category in `categoryField`** 
    - The `ValueSumMap` function maps each unique value in the `categoryField` to the sum of the corresponding values in the `metricField`.
    - The variable `sumMap` is created from `ValueSumMap` and is an object wherein each key is a unique category, and the value is the sum of a specific metric for that category.

  - **Chart Data Preparation**
    - `barLabels` is an array of labels for each of the keys in the `sumMap` object. 
    - `barValues` is an array of the summed values in the `sumMap` object. 

  - **Handle Bar Click**
    - `handleBarClick` retrieves the label of the selected bar and either adds it to or removes it from the `filter`
</details>

<details>
  <summary><strong> GroupedOrStackedBar </strong></summary>
  <strong>Purpose:</strong> renders a stacked or grouped bar chart based on the provided data and configurations.

  - **Props:**
    - `groupByColumn`: the main category or group in the data, where each unique value in this column corresponds to a different grouping or stack in the bar chart. 
    - `breakdownColumn`: determines how the bars for each group (based on `groupByColumn`) are broken down into subcategories
    - `showLabelsOnBars`: boolean that specifies whether to show the labels on the bars in the chart
    - `isHorizontal`: boolean that specifies orientation
    - `isStackedBarChart`: boolean that specifies whether to stack or group series
    - `xAxisTitle`, `yAxisTitle`: text in headers
    - `data`: data to analyze

  - **Filtering Data:**
    - `filteredData`: updates the data based on the property-value pair in the `filter` object.

  - **Extracting Unique Values from `groupByColumn`** 
    - The `getUniqueValuesInColumn` function extracts unique values form the specified `breakdownColumn` in the filtered data.
    - the `countMap` variable is then used to compute the frequency of each unique value in the `groupByColumn`, categorized by `breakdownColumn`. It initializes a mapping of counts for each combination and populates it based on the data.

  - **Preparing Series Data**
    - The `updatedSeries` variable transforms the `coutnMap` into the format required for the chart. It builds an array of objects where each object represents a series (or breakdown) and its associated counts for each grouping.
</details>

<details>
  <summary><strong> GroupedAveragesBar </strong></summary>
  <strong>Purpose:</strong> creates a grouped bar chart that displays the averages of columns that are specified in the array <code>breakdownColumns</code> for each category (<code>groupByColumn</code>).

  - **Props:**
    - `groupByColumn`: the main category or grouping in the data, where each unique value in this column corresponds to a different grouping or stack in the bar chart. 
    - `breakdownColumns`: an array that specifies which column should be used to create multiple series in the chart. 
    - `showLabelsOnBars`: boolean that specifies whether to show the labels on the bars in the chart
    - `isHorizontal`: boolean that specifies orientation
    - `isStackedBarChart`: boolean that specifies whether to stack or group series
    - `xAxisTitle`, `yAxisTitle`: text in headers
    - `data`: data to analyze
  - **Filtering Data:**
    - `filteredData`: updates the data based on the property-value pair in the `filter` object.
  - **Grouping and Averaging Data** 
    - The `useEffect` hook groups data specified by `groupByColumn` and calculates the averages of the columns in the `breakdownColumns` array.
      - `dataGroupdByBenchmarks` groups the data by `groupByColumn`, creating an object wherein each key is a unique value in that column, and each value is an array of data entries within that category.
      - The `groupedAverages` is then calculated as an array of objects containing the category (`groupingColumn`) and the averages of the columns in the `breakdownColumns` for each category. 
        - The averages for each value in `groupByColumn` (or category) are calculated by taking the sum of one of the columns in the `breakdownColumns` array and dividing it by the total of values in the `checks` column for each category.
  - **Chart Data Preparation**
    - `averagesPerBenchmark` is a state variable that stores an array of objects, wherein each object represents the average values calculated for each group based on the selected `groupByColumn`.
    - `dataLabels` extracts the category labels from the `averagesPerBenchmark` variable. 
    - The `seriesData` variable structures the average values for the series to be passed to the chart.
</details>

### MUI Data Grid Components
<details>
  <summary><strong> DataGridBuilder </strong></summary>
  <strong>Purpose:</strong> renders a dynamic MUI Data Grid component with customized styling and formatting. 
  
  - **Props:**
    - `data`: an array of objects wherein each object contains statistical information grouped by a specific column, such as counts and averages.
    - `columns`: an array that defines the structure and properties for each column in the data grid by specifying various attributes like the `field` and `headerName`. 
    - `onRowClick`: determines behavior when use clicks on a row in the data grid
  - **Customized Styling**
    - `StyledDataGrid` is a customized `DataGrid` component with styles applied to headers and cells from the theme
    - `BoldHeader` is a styled component for column headers with responsive font size.

  - **State and Filtering** 
    - `page` and `rowsPerPage` are states used for managing pagination
    - `filterModel` variable is used to hold the active filters applied to only the grid (not the global `filter` object).

  - **Synchronize the `DataGrid` filter Model with Global Filter Object**
    - The `useEffect` hook runs a side effect every time the `filter` from `useFilter()` changes. 
      - If the `filter` object is not empty, then it maps over the keys of the global `filter` object, looking for specific keys and then transforms them to match the expected `field` names in the `DataGrid` (e.ge, transforming `accepted` to `avgAccepted`).
      - It then updates the local `filterModel` state with the transformed filters. If therer are no filters, then it clears the `filterModel`.
  - **Event Handlers**
    - `handleChangePage` and `handleChangeRowsPerPage` manage pagination state
    - `handleFilterModelChange` handles user-defined filter criteria in both the global filter context and `DataGrid`.
      - Updating Global Filter:
        - For each item in the new filter model, the `field` attribute is transformed to remove the `avg` prefix and obtain the original key (e.g., transforming `avgAccepted` to `accepted`).
        - For each item, if the value is defined, it calls `updateFiler` to update the global filter context with the new filter criteria.
      - Updating Local Filter State in `DataGrid`:
        - Updates the local `filterModel` state with the new filter model, allowing the `DataGrid` to reflect the changes. 
  - **Defining Columns For the `DataGrid`**'
    - The `useMemo` hook creates an updated version of the original `columns` array by mapping over each column.
    - For the fields calculating the averages (`avgAssessed`, `avgSubmitted`, `avgAccepted`, and `AvgRejected`), custom filtering logic is included by:
      - Fetching default numeric filter operators using `getGridNumericOperators()`
      - Filtering out specific operators
      - Assigning a custom input component (`DropdownInputValue`) to be used for filtering the averages columns.
    - Returns any unchanged/unspecified columns.
</details>

<details>
  <summary><strong> DropdownInputValue </strong></summary>
  <strong>Purpose:</strong> styles and creates a customized dropdown input for filtering values in a data grid. The user selects a value from the dropdown list, and this value as well as the operator will be added to the global <code>filter</code> object. 
  
  - **Props:**
    - `item`: current filter item, including properties `field` and `operator`
    - `applyValue`: a function used to apply the selected value to the item
    - `focusElementRef`: a reference to manage or focus for accessibility
  - **Event Handling:**
    - `handleChange` function is the main event handler that triggers when a user selects a value from the dropdown.
      - It parses the selected value from the dropdown as a float (`filterValue`).
      - Extract the `field` and `operator` from the `item`.
      - Calls `applyValue` to update the item with the new value (selected by the user).
      - Transforms the `field` by removing the "avg" prefix and making the first character lowercase.
      - calls `updateFilter`, passing an object that represents the updated filter context.
</details>

<details>
  <summary><strong> AveragesGroupedByColumn </strong></summary>
  <strong>Purpose:</strong> aggregates data to calculate and display the averages for the <code>assessed</code>, <code>submitted</code>, <code>accepted</code> and <code>rejected</code> columns, as well as the <code>asset</code> and <code>delinquent</code> counts grouped by a specified column (<code>groupingColumn</code>).

  - **Props:**
    - `groupingColumn`: column used to group all of the data
    - `data`: dataset containing entries
    - `source`: specifies the parent component 
  - **Filter Hooks:**
    - `useFilter` is a custom hook that provides filtering functionality for:
      - `filter`: the global `filter` object
      - `updateFilter`: add/update a property-value pair in the `filter` object and by specifying the source
      - `removeFilterKey`: remove a property-value pair from the `filter` object
  - **Filtering Data:**
    - `filteredData`: re-calculates the data based on the property-value pair in the `filter` object.
  - **Data Processing Logic:**
    - Inside the `useEffect` hook: 
      - Grouping: the filtered data is grouped by the `groupingColumn`. Creates an object where the keys are the unique values in the `groupingColumn`, and the values are arrays of data entries associated with each key.
      - Calculating the counts and averages of columns:
        - Obtains the averages for `assessed`, `submitted`, `accepted`, `rejected` by calculating the sums of the these values per group, then dividing them by the total `checks` per group.
        - Obtains the counts for each `asset`, as well as  `delinquent` columns by checking if `item.delinquent` = "Yes".
      - Converts the results into an array and sets it to the `averages` state.
  - **Row Click Handling:**
    - Defines `handleRowClick` function to update the filter based on the selected row in the DataGrid.
  - **Implement Custom Dropdown Input in Filter:**
    - `operatorsForFiltering` customizes filter operators for only numeric fields and uses `DropdownInputValue` component for filtering.
  - **Table Column Definitions:**
    - Specifies the columns to be displayed in the DataGrid including the grouping column and columns to display metrics and progress bars using `renderProgressBarCell`. 
</details>

<details>
  <summary><strong> HistoricalDataGrid </strong></summary>
  <strong>Purpose:</strong> aggregates data to calculate and display the averages for the <code>assessed</code>, <code>submitted</code>, <code>accepted</code> and <code>rejected</code> columns, the <code>asset</code> and <code>delinquent</code> counts, and the <code>datePulled</code> grouped by a specified column (<code>groupingColumn</code>). 

  - **Props:**
    - `groupingColumn`: column used to group all of the data
    - `targetColumns`: columns in the Data Grid to organize data 
    - `data`: dataset containing entries 
  - **Filter Hooks:**
    - `useFilter` is a custom hook that provides filtering functionality for:
      - `filter`: the global `filter` object
      - `updateFilter`: add/update a property-value pair in the `filter` object and by specifying the source
      - `removeFilterKey`: remove a property-value pair from the `filter` object
  - **Filtering Data:**
    - `filteredData`: re-calculates the data based on the property-value pair in the `filter` object.
  - **Data Processing Logic:**
    - Inside the `useEffect` hook: 
      - Grouping: the filtered data is grouped by the `groupingColumn`. Creates an object where the keys are hte unique values in the `groupingColumn`, and the values are arrays of data entries associated with each key.
      - Calculating the counts and averages of columns:
        - Obtains the averages for `assessed`, `submitted`, `accepted`, `rejected` by calculating the sums of the these values per group, then dividing them by the total `checks` per group.
        - Obtains the counts for each `asset`, as well as  `delinquent` columns by checking if `item.delinquent` = "Yes".
      - Converts the results into an array and sets it to the `averages` state.
  - **Row Click Handling:**
    - Defines `handleRowClick` function to update the filter based on the selected row in the DataGrid.
  - **Implement Custom Dropdown Input in Filter:**
    - `operatorsForFiltering` customizes filter operators for only numeric fields and uses `DropdownInputValue` component for filtering.
  - **Table Column Definitions:**
    - Specifies the columns to be displayed in the DataGrid including the grouping column and columns to display metrics and progress bars using `renderProgressBarCell`. 
</details>


### Expandable Table 

<details>
  <summary><strong> Multi-Level Table </strong></summary>
  The multi-level table starts with parent rows at the top level. Each parent row can be expanded to show one or more first-level child rows. Each first-level child row can also be expanded to reveal second-level child rows. This pattern can be extended to include additional levels as needed.
 
  ```
  parent
  └── first-level-child
      ├── second-level-child
  ```
  - <details>
    <summary><strong> MultiLevelTableDataFormatter </strong></summary>
      <strong>Purpose:</strong> organizes the data and constructs a multi-level table with expandable child rows, implementing custom filtering, sorting, and search logic that updates dynamically as the user interacts with the table.

    - **Component Props:**
      - `parentRowColumn`: column used to group all of the data
      - `firstLevelChildRows`: an array that specifies which columns will be displayed the first-level child rows in the expanded section
      - `secondLevelChildRows`: an array that specifies which columns will be displayed the second-level child rows in the expanded section
      - `firstLevelChildRowHeaders`: array of strings for the headers of the first-level child rows
      - `secondLevelChildRowHeaders`: array of strings for the headers of the second-level child rows
      - `data`:  data being displayed
    - **Data Filtering:**
      - `filteredData`: uses `GetFilteredData` function with `useMemo` to derive the filtered data based on the `filter` context.
    - **Grouping Data Based on `parentRowColumn`:**
      - Concatenate `firstLevelChildRows` and `secondLevelChildRows` into one array called `allChildRows`.
      - The `filteredData` is grouped by the `parentRowColumn` value. Creates an object where the keys are the unique values in the `parentRowColumn`.
        - If the the `accumulator` does not contain the `parentRowColumn` value as a key, the key will be added to the `accumulator` and an empty array will be assigned as the value for the given key.
        - For each specified row name in the `allChildRows`, the values for an an associated property will be added to an object or `entry` as we progress through the data.
        - This object will then be pushed to the empty array with a specified key to the accumulator
    - **Set `ParentRows` State with Updated `aggregatedData`:**
      - The `parentRows` is an array of objects where each object has two properties (or keys): `groupingValue` and `childRows`.
        - `groupingValue`:  what all the data is grouped by
        - `childRows`: array of objects associated with a given `groupingValue` value. 
        - ie. `parentRows` = [ shortName: 'B3COI', childRows: [{sysAdmin: __, primOwner: __}, {sysAdmin: __, primOwner: __}, ...]
        ]
    - **Get `Average` Columns:**
      - `averageColumns` is assigned to only contain the columns that display averages: `assessed`, `submitted`, `accepted`, and `rejected`.
    - **`checkForMatchFromSearchBar` Function:**
      - Determines if the child rows will contain the `searchText`, formatted differently depending on whether the column is in `averageColumns`. 
      - If a match is found, it returns `true`; otherwise, `false`.
    - **Child Row Rendering:**
      - `renderChildRow` function:
        - Filters child rows based on `searchText`, only displaying rows with values that match the search input.
        - Sets `filteredChildRowsCount` to the number of matched rows, useful for pagination and UI updates.
        - Sorts the filtered child rows and paginates them based on the `page` and `rowsPerPage` values.
        - Renders a `StyledChildTableContainer` containing `StyledTable` headers and rows.
    - **Table Rendering:**:
      - the component defines `mainColumnHeader` as the main header of the table.
      - The `MultiLevelTableRenderer component is passed.
    </details>


  - <details>
      <summary><strong> SecondLevelChildRenderer </strong></summary>
      <strong>Purpose:</strong> Renders each first-level child row and allows further expansion to display the second-level-child rows with their own pagination

      - **Component Props:**
        - `childRow`: supplies data for both the first-level and second-level rows. `childRow` object is used to access data for the first-level cells and to get the second-level child data. 
        - `key`: uniquely identifies the component instance
        - `firstLevelChildRows`: an array containing the keys for the first-level child rows. Ensures that each column in the first-level child rows is properly rendered and defined. 
        - `secondLevelChildRows`: an array containing the key(s) for the second-level child rows  Ensures that each column in the second-level child rows is properly rendered and defined.
        - `secondLevelChildRowHeaders`: defines the headers for the second-level child row table
      - **State and Handlers:**
        - Uses `open` to toggle the display of the second-level child rows.
        - Handles the pagination within the second-level child table with `page` and `rowsPerPage` states, which are controlled by `handleChangePage` and `handleChangeRowsPerPage`. 
      - **Rendering the First-Level Child Row:**
        - displays the row data from `firstLevelChildRows`, formatting each cell's content using `percentageFormatterObject` to ensure that decimals/floats are properly formatted as needed.
        - Adds an expandable button (`IconButton`) to the cell in the first column, which toggles the visibility of the second-level child rows when clicked.
      - **Rendering the Second-Level Child Rows:**
        - When `open` is `true`, it renders a `Collapse` component that contains another table for the second-level child rows (or third level depth).
        - This nested table (`StyledTable`) displays headers from `secondLevelChildRowHeaders` and shows each second-level child row, paginating the data using `filteredBenchmarks`.
        - `TablePagination` is used to control pagination for this nested level, allowing the user to switch pages and adjust the number of rows per page. 
    </details>
</details>



<details>
  <summary><strong> Two-Level Table </strong></summary>
  The standard expandable table starts with parent rows at the top level. Each parent row can be expanded to show a child row to obtain a depth of 2.

  ```
  parent
  └── child row
  ```
  - <details>
    <summary><strong> TwoLevelTableDataFormatter </strong></summary>
    <strong>Purpose:</strong> organizes the data and constructs a table with expandable child rows, implementing custom filtering, sorting, and search logic that updates dynamically as the user interacts with the table.

    - **Component Props:**
      - `parentRowColumn`: column used to group all of the data
      - `childRows`: an array that specifies which columns will be used to display the child rows in the expanded section
      - `expandedSectionHeaders`: array of strings for the headers for each column in the child rows
      - `data`:  data being displayed and configured
    - **Data Filtering:**
      - `filteredData`: uses `GetFilteredData` function with `useMemo` to derive the filtered data based on the `filter` context.
    - **Grouping Data Based on `parentRowColumn`:**
      - The `filteredData` is grouped by the `parentRowColumn` value. Creates an object where the keys are the unique values in the `parentRowColumn`.
        - If the the `accumulator` does not contain the `parentRowColumn` value as a key, the key will be added to the `accumulator` and an empty array will be assigned as the value for the given key.
        - For each specified row name in the `childRows`, the values for an an associated property will be added to an object or `entry` as we progress through the data.
        - This object will then be pushed to a new array with a specified key to the accumulator
    - **Set `ParentRows` State with Updated `aggregatedData`:**
      - The `parentRows` is an array of objects where each object has two properties (or keys): `groupingValue` and `childRows`.
        - `groupingValue`:  what all the data is grouped by
        - `childRows`: array of objects associated with a given `groupingValue` value. 
        - ie. `parentRows` = [ shortName: 'B3COI', childRows: [{sysAdmin: __, primOwner: __}, {sysAdmin: __, primOwner: __}, ...]
        ]
    - **Child Row Rendering:**
      - `renderChildRow` function:
        - Filters child rows based on `searchText`, only displaying rows with values that match the search input.
        - Sets `filteredChildRowsCount` to the number of matched rows, useful for pagination and UI updates.
        - Sorts the filtered child rows and paginates them based on the `page` and `rowsPerPage` values.
        - Renders a `StyledChildTableContainer` containing `StyledTable` headers and rows.
    - **Table Rendering:**:
    </details>


</details>

<details>
<summary><strong>Sorting</strong></summary>
 <code>useSortableData</code> is a custom hook that provides allows a user to sort the values in the columns within the expandable tables.

  - **Props:**
    - `initialSortField`:  set initial state upon mounting that specifies the field/column that is being sorted
    - `initialSortDirection`: set initial state upon mounting that specifies the direction that is being sorted
  - **sortField and sortDirection:**
    - `sortField`: column table is sorted by
    - `sortDirection`: either 'asc' (ascending) or 'desc (descending)
  - **`handleSort` function:**
    - set the `sortDirection` by checking previous state
    - set the `sortField` only if `sortField` changes
  - **`sortData` function:**
  - takes array of objects (data) and returns sorted array based on sortField and sortDirection
    - will return unsorted `data` if no `sortField` set
    - map the header name to specified property and sort based on type:
      - if values in columns are strings, sort values alphabetically
      - if values in columns are numbers, sort numerically
      - if values in column is a date, then sort by date in ascending order
</details>


<details>
  <summary><strong> Rendering Logic</strong></summary>
  This file contains the logic to style and render re-usable components within the expandable tables. 

 -  <details>
    <summary><strong> StyledTableComponents</strong></summary>
    <strong> Purpose:</strong> contains custom styling to control the appearance of various components like <code>TableRow</code>, <code>TableBody</code>, <code>TextField</code> and other components used in the expandable tables. 
    </details>
    
  - <details>
    <summary><strong> FlexibleTableRenderer </strong></summary>
    <strong>Purpose:</strong> renders the base structure of the table, including the expand/collapse functionality for each row level.

    - **Component Props:**
      - `rows`: data for each parentRow
      - `columns`: the `mainColumnHeader` that is the ID and and label for the top-level header (header above the `parentRows`)
      - `renderChildRow`: contains logic to render and display the childRows
      - `filterProperty`: property that is being filtered (also known as the parentRowColumn)
      - `childRowCount`: total count of child rows, needed for pagination
    - **Sorting:**
      - Uses custom sort `useSortableData` hook to sort `rows` based on a selected column (`sortFild`), direction (`sortDirection`), and `handleSort` function.
      - `sortChildRows`: a function that sorts child rows based on the specified criteria and returns `sortedChidlRows`, which is then used to render the rows in a sorted order
    - **Rendering:**
      - Table Headers: maps through `columns` to render each column header. If the header is sortable, it displays an icon indicating the current sort direction and calls `handleSort` when header is clicked.
      - Table Body: maps through `sortedChildRows`, rendering each row using the `ParentRowRenderer` component. 
    </details>


 -  <details>
    <summary><strong> ParentRowRenderer </strong></summary>
      <strong>Purpose:</strong> responsible for rendering each parent row in the table, managing its expanded (open) or collapsed state, and handling the display of child rows (mini-table) when expanded.

      - **Component Props:**
        - `parentRow`: data for each parentRow
        - `columns`: the `mainColumnHeader` that is the ID and and label for the top-level header (header above the `parentRows`)
        - `filterProperty`: specifies the property that is being filtered by (required for `TwoLevelTableRenderer`)
        - `renderChildRow`: function that contains rendering logic for child rows in expanded section
        - `childRowCount`: total count of child rows, needed for pagination
      - **State Variables:**
        - `open`: manages whether a parent row is expanded or collapsed
        - `page`, `rowsPerPage`: used for pagination within the child rows
        - `searchText`: stores the search text input (that user enters in search bar) to filter `childRows`
        - `filter`, `updateFilter`, `removeFilterKey`: accesses context values and functions from `useFilter` hoook to manage filtering across other visuals based on the selected parent row.
      - **Event Handles:**
        - `handleChangePage`, `handleChangeRowsPerPage`: manage pagination by updating the current page and number of rows per page in table in expanded section.
        - `handleSearchChange`: updates `searchText` and resets the page when a search is performed.
        - `handleToggleOpen`: toggles the `open` state, which expands or collapses the parent row. When a parent row is expanded, it updates the filter context within the `parentRow`'s data, allowing other components/visualizations to filter based on this selection. When parent row is collapsed, it is removed from the global filter object. 
      - **Rendering:**
      - Parent Row: renders a row with a button (`IconButton`) that toggles the expansion of the child rows. It displays the first cell in the row as the main identifier and iterates over the `columns` array to display additional data in other cells. 
      - Expanded Content (first-level-child row): when `open` is `true`, it renders a collapsible section containing:
        - a search bar to filter `childRows` within the expanded section. Users can enter text or number and child rows matching the contents will be returned. 
        - the `renderChildRow` function that displays the child rows (mini-table) based on the parent row, `page`, `rowsPerPage`, and `searchText`.
        - `TablePagination` controls the pagination for child rows, including `handleChangePage` and `handleChangeRowsPerPage` to manage the page and rows per page. 
    </details>


</details>

### Filtering 
  The <code>filter</code> object is used to control the data displayed across various components like tables and charts based on specific criteria. In doing so, the user is able to refine and update the data presented based on the user's selection across all visualizations. 

<details>
  <summary><strong> FilterContext </strong></summary>
    <strong>Purpose:</strong> the <code>filter</code> is assible through a custom context (<code>FilterContext</code>) and a <code>FilterProvider</code> component that providees access to the filter-related state and functions for all child components. 

  - **ContextFilter**
    - The custom `FilterContext` shares the state (data and functions) across the entire component tree without having to pass props down manually from the parent component to the child component throughout the application. 
  - **FilterProvider:**
    - The `FilterProvider`is a context provider that is used to wrap the component tree, making the `filter` object available to any descendent component within the context. 
    - Within the `FilterProvider` the following states are managed:
      - `filter`: an object that holds the current filter criteria (initially an empty object)
      - `isWebOrDBIncluded`: a boolean state to track whether a filter for whether to include Web or DB assets is applied (initialized to `true`).
      - `isDelinquent`: a boolean state to track whether to only show the delinquent assets. 
    - These states control the filtering logic for the application and can be toggled by the user through switches. 
      
  - **`updateFilter` Function:**
    - Updates the `filter` state based on the new filter ctieria passed as an argument (`newFilter`) dynamically. It also handles different cases based on the source of the filter update. 
    - General Logic:
      - The function checks whether the previous filter state (`prevFilter`) is valid and, if not, initializes the new filter object.
      - It then iterates over the keys of the `newFilter` object to decide how to update the filter state.
      - If the `source` is `dataGrid`, it adds or updates the filter using an `operator` to ensure that the correct operator is applied to each key.
      - If the `source` is `expandableTable`, it directly merges the `newFilter` with the existing filters.
      - Handling Arrays and Duplicates:
        - Otherwise, it compares iterates through the keys in the `newFilter` and checks the corresponding value and compares it with the existing value. It also handles multi-selection options as well as single-selection. 
        - If the `filter` value already exists in `prevFilters`, then it will be removed to prevent duplicates. 
        - It then returns the updated filter. 
  -**`removeFilterKey` Function:**
    - Removes a specific key from the `filter` state, with the specified key as the argument, and updates the state
  -**`clearFilter` Function:**
    - clears all the existing filter criteria by setting `filter` to an empty object.
  - **`toggleWebOrDBFilter` and `toggleDelinquentFilter` Functions:**
    - These functions update the sate of the respective filters (`isWebOrDBIncluded` and `isDelinquent`) when the corresponding switches are toggled. 
  - **`useFilter` Hook:**
    - The `useFilter` hook allows components to access the `FilterContext`, making it easy for any component inside the `FilterProvider` to access and update the current filter.
</details>

<details>
  <summary><strong> GetFilteredData </strong></summary>
  <strong>Purpose:</strong> This function works by looking at the contents in the array in the <code>FilterContext</code>, and only displays the data that matches the contents in the global <code>filter</code> object.

  - **Component Props:**
    - `data`: an array of objects containing the information to filter
    - `filter`: the object that contains key-value pairs that define what data entries to display
  - **Data Validation:**
    - Checks if `data` is a valid array and returns an empty array if it's invalid.
  - **Filter Processing**:
    - When `filter` is an objects with keys to filter by, it evaluates each item in `data` to see if each value (`filterValue`) meets every filter condition for all keys in `filter`. 
      - Operator-based Filtering:
        - If `filterValue` is an object, it expects `{operator, value}`, allowing conditional filters based on operators like `=` or `>=` based on the specified value. This system handles numeric and string comparisons and checks for emptiness. 
      - Array-based Filtering:
        - If `filterValue` is an array, it enables filtering with multiple possible values like multi-selection options.
        - If `itemValue` is also an array, it checks for any common values between `itemValue` and `filterValue` (an intersection).
        - If `itemValue` is a single value, it checks if it matches any of the objects in the `filterValue` array.
      - Direct Value Comparison:
        - If `filterValue` is neither an object nor an array, it assumes a single-value filter to compare `filterValue` directly with `itemValue`.
  - If matches are found, the updated `filteredData` is returned. Otherwise, it returns an empty array for `filteredData`.
</details>
--->