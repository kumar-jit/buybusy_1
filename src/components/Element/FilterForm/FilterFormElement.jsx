import { useState } from "react"


export const FilterForm = ({data,filterInput,updateFilter}) =>{
    // const {filterInput,updateFilter} = useCategoryCheckboxForm();
    return (
        <div>
            {/* <h3>Category</h3> */}
            <form>
                {
                    data?.map( item => <div key={item.id}>
                        {/* <input type="checkbox" id={item.id}  onChange={(event) => checkBoxValueChange(event)}></input> */}
                        <label ><input type="checkbox" id={item.id} defaultChecked={filterInput[item.id]? true : false}  onClick={(event) => updateFilter(event, item.id)}></input> {item.name}</label>
                    </div>)
                }
            </form>
        </div>
    )
}