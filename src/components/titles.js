import React from "react";

export const H2Title = (props) => {
    return (
        <h2 id={props.id} className={props.className}>{props.title}</h2>
    )
}

export const H3Title = (props) => {
    return (
        <h3 id={props.id} className={props.className}>{props.title}</h3>
    )
}

H2Title.defaultProps = {
    "id": "",
    "className": "",
    "title": "Empty Title",
}

H3Title.defaultProps = H2Title.defaultProps