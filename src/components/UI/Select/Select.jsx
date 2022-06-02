import React, { useState } from "react";
import s from './Select.module.scss';
console.log(s)

function Select(props) {
  const {
    selectId,
    options,
    label,
    placeholder,
    disabled,
    selected,
    className,
    ...extraProps
  } = props

  const [value, setValue] = useState(0)

  const handleOnChange = (event) => {
    const { value } = event.target
    setValue(value)
    if(typeof props.onChange === 'function'){
      props.onChange(value)
    }
  }


  return (
    <div className={`${selectId}-wrapper ${s.selectWrapper} ${className}`}>
      <label htmlFor={selectId}>{label}</label>
      <select id={selectId} selected={selected ?? value} onChange={handleOnChange} disabled={disabled} {...extraProps} >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((el) => {
          return <option key={`key-${el}`} value={el}>{el}</option>
        })
        };
      </select>
    </div>)
}

export default Select;
