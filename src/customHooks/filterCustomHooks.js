import { useEffect, useState } from "react";

export const useCategoryCheckboxForm = () => {
    let filterObj = sessionStorage.getItem("filterData")
        ? JSON.parse(sessionStorage.getItem("filterData"))
        : {};
    const [filterInput, setFilterInput] = useState(filterObj);

    const updateFilter = (event, key) => {
        let newFiterInput = { ...filterInput };
        if (event.target.checked) {
            newFiterInput[key] = true;
        } else if (newFiterInput[key]) {
            delete newFiterInput[key];
        }
        sessionStorage.setItem("filterData", JSON.stringify(newFiterInput));
        setFilterInput(newFiterInput);
    };
    return { filterInput, updateFilter };
};
