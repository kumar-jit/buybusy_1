import React, { useEffect, useState } from "react";
import styles from "./ModalElement.module.css"; // Assuming you have a separate CSS file for styling

export const Modal = ({ open, onClose, title, children }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && open) {
                if (onClose) {
                    onClose();
                }
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open]);

    if (!open) return null;

    return (
        <div className={styles.modal_overlay}>
            <div className={styles.modal}>
                {/* <button className={styles.close_button} >X</button> */}
                <h3>{title}</h3>
                <div className={styles.modal_content}>
                    <button
                        className={styles.close_button}
                        onClick={(event) => onClose(event)}
                    >
                        X
                    </button>
                    {children}
                </div>
            </div>
        </div>
    );
};
