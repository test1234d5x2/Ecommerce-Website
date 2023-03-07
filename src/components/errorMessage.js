import React from "react";

export const ErrorMessage = (props) => {
    return (
        <section className="error-box">
            <span className="close-error-box material-icons icons" onClick={props.toggleErrorMessageBox}>close</span>
            <span className="error-text">{props.message}</span>
        </section>
    )
}