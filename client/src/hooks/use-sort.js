import { useState } from "react";

function useSort(data, config) {
  const [sortOrder, setSortOrder] = useState(null);
  const [sortBy, setSortBy] = useState(null);

  const setSortColumn = (label) => {
    if (sortBy && label !== sortBy) {
      setSortOrder("asc");
      setSortBy(label);
      return;
    }

    setSortBy(label);
    setSortOrder((current) => {
      if (current === null) {
        return "asc";
      } else if (current === "asc") {
        return "desc";
      } else if (current === "desc") {
        setSortBy(null);
        return null;
      }
    });
  };

  let sortedData = data;

  if (sortOrder && sortBy) {
    const { sortValue } = config.find((col) => col.label === sortBy);
    sortedData = [...data].sort((a, b) => {
      const valueA = sortValue(a);
      const valueB = sortValue(b);

      const reverseOrder = sortOrder === "asc" ? 1 : -1;

      if (typeof valueA === "string") {
        return valueA.localeCompare(valueB) * reverseOrder;
      } else {
        return (valueA - valueB) * reverseOrder;
      }
    });
  }
  return {
    sortBy,
    sortOrder,
    setSortColumn,
    sortedData,
  };
}

export default useSort;
