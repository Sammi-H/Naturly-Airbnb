"use client";
import { useState } from "react";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({isOpen, onClose}: LoginModalProps){
    if(!isOpen) return null;

    return(
        <div className="modal">
            <div className="modal-content">
                <h2>Du måste logga in först</h2>
                <button className="modal-btn" onClick={onClose}>Stäng</button>
            </div>
        </div>
    )
}
